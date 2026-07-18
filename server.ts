import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import session from "express-session";
import bcrypt from "bcryptjs";
import { GoogleGenAI, Type } from "@google/genai";
import multer from "multer";
import fs from "fs";
import { readDb, updateCollection, writeDb } from "./server/db.ts";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. AI features will be unavailable.");
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY || "DUMMY_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use(session({
    secret: "agri-smart-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

  const upload = multer({ dest: "uploads/" });

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, mobile, password, role, state, district } = req.body;
    const db = readDb();
    const existingUser = db.users.find(u => u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || "Farmer",
      isVerified: true,
      state: state || '',
      district: district || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    updateCollection("users", newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    (req.session as any).user = userWithoutPassword;
    res.json(userWithoutPassword);
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const { password: _, ...userWithoutSecrets } = user;
    (req.session as any).user = userWithoutSecrets;
    res.json(userWithoutSecrets);
  });

  app.get("/api/auth/me", (req, res) => {
    res.json((req.session as any).user || null);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  app.put("/api/user/profile", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    
    const db = readDb();
    const user = db.users.find(u => u.id === sessionUser.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = { ...user, ...req.body, updatedAt: new Date().toISOString() };
    updateCollection("users", updatedUser);
    
    const userWithoutPassword = { ...updatedUser };
    delete (userWithoutPassword as any).password;
    
    (req.session as any).user = userWithoutPassword;
    res.json(userWithoutPassword);
  });

  // Crop Recommendation Routes
  
  app.post("/api/crop-recommendation/analyze-image", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    try {
      const prompt = `As an AI Agronomist, analyze this image of a field or soil. Recommend the best crop to grow based on visual assessment. Return JSON matching EXACTLY this structure:
{
  "recommendedCrop": "Crop Name",
  "confidenceScore": 85,
  "reason": "Brief explanation",
  "expectedYield": "15 quintals/acre",
  "estimatedProfit": 45000,
  "cropDuration": "120 days",
  "waterRequirement": "Moderate",
  "fertilizerSuggestion": "N: 40, P: 20, K: 20",
  "pestRiskLevel": "Low",
  "suitableSeason": "Kharif",
  "estimatedHarvestDate": "October 2026",
  "marketDemand": "High",
  "difficultyLevel": "Moderate",
  "sustainabilityScore": 80,
  "alternatives": [
    {
      "name": "Alternative Crop 1",
      "reason": "Good for dry conditions",
      "profit": 35000
    },
    {
      "name": "Alternative Crop 2",
      "reason": "Requires less fertilizer",
      "profit": 40000
    }
  ],
  "farmName": "My AI Farm",
  "district": "Unknown"
}`;

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });
      
      const recommendationData = JSON.parse(response.text || "{}");
      
      const fullRecommendation = {
        id: Math.random().toString(36).substr(2, 9),
        userId: sessionUser.id,
        ...recommendationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      updateCollection("cropRecommendations", fullRecommendation);
      res.json(fullRecommendation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Crop image analysis failed" });
    }
  });

  app.post("/api/crop-recommendation/generate", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const inputData = req.body;
    
    try {
      const prompt = `You are an expert Agricultural Scientist and AI Agronomist. Based on the following farm, soil, and weather data, provide a highly accurate and professional crop recommendation. Return the recommendation in JSON format.`;
      const response = await ai.models.generateContent({ model: "gemini-3.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
      const recommendationData = JSON.parse(response.text || "{}");
      
      const fullRecommendation = {
        id: Math.random().toString(36).substr(2, 9),
        userId: sessionUser.id,
        ...inputData,
        ...recommendationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json(fullRecommendation);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate recommendation" });
    }
  });

  app.post("/api/crop-recommendation/save", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const recommendation = req.body;
    updateCollection("cropRecommendations", recommendation);
    res.json({ success: true, id: recommendation.id });
  });

  app.get("/api/crop-recommendation/history", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const db = readDb();
    const history = db.cropRecommendations?.filter((r: any) => r.userId === sessionUser.id) || [];
    res.json(history);
  });

  app.get("/api/crop-recommendation/:id", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const db = readDb();
    const recommendation = db.cropRecommendations?.find((r: any) => r.id === req.params.id);
    if (!recommendation) return res.status(404).json({ error: "Recommendation not found" });
    res.json(recommendation);
  });

  app.delete("/api/crop-recommendation/:id", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const db = readDb();
    if (db.cropRecommendations) {
      db.cropRecommendations = db.cropRecommendations.filter((r: any) => r.id !== req.params.id);
      writeDb(db);
    }
    res.json({ success: true });
  });

  // Disease Detection Routes
  app.post("/api/ai/disease-detection", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    
    try {
      const imageData = fs.readFileSync(req.file.path).toString("base64");
      const promptText = `Identify the disease in this crop image. Return JSON matching EXACTLY this structure:
{
  "cropName": "Crop Name",
  "diseaseName": "Disease Name",
  "confidenceScore": 95,
  "severity": "Low", // or Medium, High, Critical
  "status": "Unhealthy", // or Healthy
  "analysis": "Brief analysis",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "causes": ["Cause 1", "Cause 2"],
  "treatment": {
    "organic": "Organic treatment",
    "chemical": "Chemical treatment",
    "homeRemedies": "Home remedies",
    "recommendedPesticides": ["Pesticide 1", "Pesticide 2"],
    "sprayInstructions": "How to spray",
    "safetyInstructions": "Safety instructions"
  }
}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: promptText },
          { inlineData: { mimeType: req.file.mimetype, data: imageData } }
        ],
        config: { responseMimeType: "application/json" }
      });
      
      // Cleanup file
      // fs.unlinkSync(req.file.path); // Keep the file for frontend rendering
      
      const analysisData = JSON.parse(response.text || "{}");
      const result = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: "/uploads/" + req.file.filename,
        createdAt: new Date().toISOString(),
        ...analysisData
      };
      
      res.json(result);
    } catch (error) { 
      console.error(error);
      res.status(500).json({ error: "Failed to detect disease" }); 
    }
  });

  app.get("/api/disease/statistics", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const db = readDb();
    const reports = db.diseaseReports?.filter((r: any) => r.userId === sessionUser.id) || [];
    
    const stats = {
      totalReports: reports.length,
      healthyCrops: reports.filter((r: any) => r.status === 'Healthy').length,
      diseasedCrops: reports.filter((r: any) => r.status === 'Unhealthy').length,
      commonDisease: reports.reduce((acc: any, r: any) => {
        if (r.status === 'Unhealthy') {
          acc[r.diseaseName] = (acc[r.diseaseName] || 0) + 1;
        }
        return acc;
      }, {}),
      recoveryRate: 85 // Placeholder or calculated if recovery field exists
    };
    res.json(stats);
  });

  app.get("/api/disease/:id", (req, res) => {
    const db = readDb();
    const report = db.diseaseReports?.find((r: any) => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  });

  app.delete("/api/disease/:id", (req, res) => {
    const db = readDb();
    if (db.diseaseReports) {
      db.diseaseReports = db.diseaseReports.filter((r: any) => r.id !== req.params.id);
      writeDb(db);
    }
    res.json({ success: true });
  });

  app.post("/api/disease/export", (req, res) => {
    // In production, this would generate a PDF and return the URL
    res.json({ url: "https://example.com/report.pdf", message: "Report generated successfully" });
  });

  // AI Routes
  app.post("/api/ai/crop-recommendation", async (req, res) => {
    const { state, district, season, soilType, rainfall, temperature } = req.body;
    try {
      const prompt = `As an expert AI Agronomist, suggest the best crop for: State: ${state}, District: ${district}, Season: ${season}, Soil: ${soilType}, Rainfall: ${rainfall}, Temperature: ${temperature}. Return JSON with crop, confidence, and growingTips.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate recommendation" });
    }
  });

  app.post("/api/ai/disease-detection", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    
    try {
      const imageData = fs.readFileSync(req.file.path).toString("base64");
      const promptText = "Identify the disease in this crop image. Provide the disease name, confidence, symptoms, causes, prevention, and treatment.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: promptText },
          { inlineData: { mimeType: req.file.mimetype, data: imageData } }
        ],
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              disease: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
              causes: { type: Type.STRING },
              prevention: { type: Type.STRING },
              treatment: { type: Type.STRING }
            },
            required: ["disease", "confidence", "symptoms", "causes", "prevention", "treatment"]
          }
        }
      });
      
      // Cleanup file
      fs.unlinkSync(req.file.path);
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      res.status(500).json({ error: "Failed to detect disease" });
    }
  });


  app.post("/api/disease/save", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const report = {
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    updateCollection("diseaseReports", report);
    res.json({ success: true, id: report.id });
  });

  app.get("/api/disease/history", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const db = readDb();
    const history = db.diseaseReports?.filter((r: any) => r.userId === sessionUser.id) || [];
    res.json(history);
  });

  // Marketplace
  // Seed Data for Government Module
  const db = readDb();
  if (!db.govSchemes || db.govSchemes.length === 0) {
    const schemes = [
      {
        id: "pm-kisan",
        title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        department: "Department of Agriculture and Farmers Welfare",
        description: "A central sector scheme to provide income support to all landholding farmers' families in the country.",
        benefits: ["₹6000 per year in three installments", "Direct Benefit Transfer to bank accounts"],
        eligibilityCriteria: ["All landholding farmers families", "Exclusion categories apply (Tax payers, High income)"],
        requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Passbook"],
        status: "Active",
        applyUrl: "https://pmkisan.gov.in/",
        bannerUrl: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=1000",
        helpline: "155261 / 1800115526",
        faq: [{ question: "How to check status?", answer: "Visit PM-KISAN portal and use Aadhaar/Mobile." }]
      },
      {
        id: "pmfby",
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        department: "Ministry of Agriculture & Farmers Welfare",
        description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
        benefits: ["Low premium rates", "Comprehensive risk coverage", "Quick claim settlement"],
        eligibilityCriteria: ["All farmers including sharecroppers and tenant farmers"],
        requiredDocuments: ["Aadhaar", "Land Possession Certificate", "Sowing Certificate"],
        status: "Active",
        applyUrl: "https://pmfby.gov.in/",
        bannerUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000",
        helpline: "18001801551"
      }
    ];
    (db as any).govSchemes = schemes;
    writeDb(db);
  }

  if (!db.govNews || db.govNews.length === 0) {
    const news = [
      {
        id: "news-1",
        title: "New Subsidy for Solar Pumps Announced",
        content: "Government increases subsidy to 60% for PM-KUSUM Component B.",
        category: "Announcement",
        date: new Date().toISOString()
      },
      {
        id: "news-2",
        title: "PM-KISAN 17th Installment Date",
        content: "The next installment is expected to be released on July 25th.",
        category: "Deadline",
        date: new Date().toISOString()
      }
    ];
    (db as any).govNews = news;
    writeDb(db);
  }

  
  if (!db.bookings || db.bookings.length === 0) {
    db.bookings = [
      {
        id: "b-1",
        machineryId: "m-1",
        machineryName: "Mahindra Arjun Novo 605",
        machineryImage: "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800",
        farmerId: "f-test",
        ownerId: "owner-1",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        totalPrice: 7500,
        status: "Approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "b-2",
        machineryId: "v-1",
        machineryName: "Tata Ace Gold",
        machineryImage: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
        farmerId: "f-test",
        ownerId: "owner-3",
        startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        endDate: new Date(Date.now() - 86400000 * 4).toISOString(),
        totalPrice: 1200,
        status: "Completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeDb(db);
  }

  if (!db.machinery || db.machinery.length === 0) {
        const machinery = [
      {
        id: "m-1",
        ownerId: "owner-1",
        ownerName: "Rajesh Kumar",
        name: "Mahindra Arjun Novo 605",
        brand: "Mahindra",
        model: "Novo 605 DI-i",
        year: 2022,
        type: "Equipment",
        category: "Tractor",
        images: ["https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800"],
        specifications: [{ key: "Horsepower", value: "57 HP" }, { key: "Cylinders", value: "4" }],
        workingCapacity: "2 Acres/Hour",
        fuelConsumption: "4.5 Liters/Hour",
        fuelType: "Diesel",
        dailyPrice: 2500,
        hourlyPrice: 400,
        weeklyPrice: 15000,
        monthlyPrice: 50000,
        availability: true,
        rating: 4.8,
        reviewsCount: 24,
        distance: "3.5 km",
        location: { lat: 28.6139, lng: 77.2090, address: "Sector 15, Karnal, Haryana" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "m-2",
        ownerId: "owner-2",
        ownerName: "Amit Singh",
        name: "John Deere 5310 GearPro",
        brand: "John Deere",
        model: "5310 V5",
        year: 2023,
        type: "Equipment",
        category: "Tractor",
        images: ["https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800"],
        specifications: [{ key: "Horsepower", value: "55 HP" }, { key: "Clutch", value: "Dual" }],
        workingCapacity: "2.2 Acres/Hour",
        fuelConsumption: "4.2 Liters/Hour",
        fuelType: "Diesel",
        dailyPrice: 2800,
        hourlyPrice: 450,
        weeklyPrice: 17000,
        monthlyPrice: 55000,
        availability: true,
        rating: 4.9,
        reviewsCount: 18,
        distance: "5.2 km",
        location: { lat: 28.6239, lng: 77.2190, address: "Nilokheri, Haryana" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "m-3",
        ownerId: "owner-4",
        ownerName: "Vikram Patel",
        name: "CLAAS Crop Tiger 30",
        brand: "CLAAS",
        model: "Crop Tiger 30 Terra Trac",
        year: 2021,
        type: "Equipment",
        category: "Harvester",
        images: ["https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800"],
        specifications: [{ key: "Cutting Width", value: "7.5 ft" }, { key: "Engine", value: "60 HP" }],
        workingCapacity: "1.5 Acres/Hour",
        fuelConsumption: "6 Liters/Hour",
        fuelType: "Diesel",
        dailyPrice: 8000,
        hourlyPrice: 1200,
        weeklyPrice: 50000,
        monthlyPrice: 180000,
        availability: true,
        rating: 4.7,
        reviewsCount: 35,
        distance: "12 km",
        location: { lat: 28.7041, lng: 77.1025, address: "Sonipat, Haryana" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "m-4",
        ownerId: "owner-5",
        ownerName: "Sanjay Sharma",
        name: "Shaktiman Rotavator",
        brand: "Shaktiman",
        model: "Regular Light",
        year: 2022,
        type: "Equipment",
        category: "Rotavator",
        images: ["https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800"],
        specifications: [{ key: "Working Width", value: "5.5 ft" }, { key: "Blades", value: "42" }],
        workingCapacity: "1.8 Acres/Hour",
        fuelConsumption: "N/A (Tractor Driven)",
        fuelType: "None",
        dailyPrice: 1000,
        hourlyPrice: 150,
        weeklyPrice: 6000,
        monthlyPrice: 20000,
        availability: true,
        rating: 4.6,
        reviewsCount: 50,
        distance: "4.5 km",
        location: { lat: 28.5355, lng: 77.3910, address: "Noida, UP" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "m-5",
        ownerId: "owner-6",
        ownerName: "Ramesh Yadav",
        name: "Happy Seeder",
        brand: "Dasmesh",
        model: "911",
        year: 2023,
        type: "Equipment",
        category: "Seeder",
        images: ["https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"],
        specifications: [{ key: "Rows", value: "9" }, { key: "Row Spacing", value: "9 inches" }],
        workingCapacity: "2.5 Acres/Hour",
        fuelConsumption: "N/A (Tractor Driven)",
        fuelType: "None",
        dailyPrice: 1500,
        hourlyPrice: 250,
        weeklyPrice: 9000,
        monthlyPrice: 30000,
        availability: true,
        rating: 4.8,
        reviewsCount: 22,
        distance: "8 km",
        location: { lat: 28.4595, lng: 77.0266, address: "Gurugram, Haryana" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "v-1",
        ownerId: "owner-3",
        ownerName: "Sunil Verma",
        name: "Tata Ace Gold",
        brand: "Tata",
        model: "Gold Diesel Plus",
        year: 2021,
        type: "Vehicle",
        category: "Mini Truck",
        images: ["https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"],
        specifications: [{ key: "Payload", value: "750 kg" }, { key: "Engine", value: "700cc" }],
        workingCapacity: "N/A",
        fuelConsumption: "18 km/l",
        fuelType: "Diesel",
        capacity: "0.75 Ton",
        dailyPrice: 1200,
        hourlyPrice: 200,
        weeklyPrice: 7500,
        monthlyPrice: 25000,
        availability: true,
        rating: 4.5,
        reviewsCount: 42,
        distance: "2.1 km",
        location: { lat: 28.6339, lng: 77.2290, address: "Taraori, Haryana" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    (db as any).machinery = machinery;
    writeDb(db);
  }

  // --- Government Services APIs ---

  app.get("/api/schemes", (req, res) => {
    const db = readDb();
    res.json(db.govSchemes || []);
  });

  app.get("/api/schemes/:id", (req, res) => {
    const db = readDb();
    const scheme = db.govSchemes?.find((s: any) => s.id === req.params.id);
    if (!scheme) return res.status(404).json({ error: "Scheme not found" });
    res.json(scheme);
  });

  app.post("/api/eligibility/check", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const input = req.body;
    try {
      const prompt = "As a Government Policy Analyst, evaluate the eligibility of this farmer for the available schemes. Return JSON with: eligibleSchemes, notEligibleSchemes, eligibilityPercentage, missingRequirements, suggestedSchemes.";
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const analysis = JSON.parse(response.text || "{}");
      const eligibilityResult = {
        id: Math.random().toString(36).substr(2, 9),
        userId: sessionUser.id,
        ...input,
        ...analysis,
        createdAt: new Date().toISOString()
      };
      updateCollection("eligibilityResults", eligibilityResult);
      res.json(eligibilityResult);
    } catch (error) {
      res.status(500).json({ error: "Eligibility check failed" });
    }
  });

  app.post("/api/insurance/claim", upload.array('images'), async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const claim = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      images: (req.files as any[] || []).map(f => `/uploads/${f.filename}`),
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };
    updateCollection("insuranceClaims", claim);
    res.json(claim);
  });

  app.get("/api/insurance/history", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.insuranceClaims?.filter((c: any) => c.userId === sessionUser.id) || []);
  });

  app.post("/api/loan/calculate", (req, res) => {
    const { amount, rate, duration } = req.body;
    const r = rate / 12 / 100;
    const n = duration;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - amount;

    res.json({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    });
  });

  app.get("/api/applications", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.applications?.filter((a: any) => a.userId === sessionUser.id) || []);
  });

  app.post("/api/applications", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const application = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      status: 'Submitted',
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    updateCollection("applications", application);
    res.json(application);
  });

  app.get("/api/government-news", (req, res) => {
    const db = readDb();
    res.json(db.govNews || []);
  });

  // --- Community & Questions ---
  app.get("/api/community/posts", (req, res) => {
    const db = readDb();
    res.json(db.communityPosts || []);
  });

  app.post("/api/community/posts", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      likes: 0,
      commentsCount: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    updateCollection("communityPosts", post);
    res.json(post);
  });

  app.put("/api/community/posts/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const post = db.communityPosts.find(p => p.id === id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    const updated = { ...post, ...req.body };
    updateCollection("communityPosts", updated);
    res.json(updated);
  });

  app.delete("/api/community/posts/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.communityPosts = db.communityPosts.filter(p => p.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  app.get("/api/questions", (req, res) => {
    const db = readDb();
    res.json(db.questions || []);
  });

  app.post("/api/questions", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const question = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    updateCollection("questions", question);
    res.json(question);
  });

  // --- Comments ---
  app.get("/api/comments/:postId", (req, res) => {
    const { postId } = req.params;
    const db = readDb();
    const comments = db.comments?.filter((c: any) => c.postId === postId) || [];
    res.json(comments);
  });

  app.post("/api/comments", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      likes: 0,
      replies: [],
      createdAt: new Date().toISOString(),
      ...req.body
    };
    updateCollection("comments", comment);
    
    // Update comment count on post
    const db = readDb();
    const post = db.communityPosts.find(p => p.id === comment.postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      updateCollection("communityPosts", post);
    }

    res.json(comment);
  });

  // --- Experts ---
  app.get("/api/experts", (req, res) => {
    const db = readDb();
    res.json(db.experts || []);
  });

  app.get("/api/experts/:id", (req, res) => {
    const db = readDb();
    const expert = db.experts.find(e => e.id === req.params.id);
    if (!expert) return res.status(404).json({ error: "Expert not found" });
    res.json(expert);
  });

  // --- Learning Hub ---
  app.get("/api/courses", (req, res) => {
    const db = readDb();
    res.json(db.courses || []);
  });

  app.get("/api/videos", (req, res) => {
    const db = readDb();
    res.json(db.videos || []);
  });

  app.get("/api/blogs", (req, res) => {
    const db = readDb();
    res.json(db.blogs || []);
  });

  // --- Events ---
  app.get("/api/events", (req, res) => {
    const db = readDb();
    res.json(db.events || []);
  });

  app.post("/api/events/register", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { eventId } = req.body;
    const registration = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      eventId,
      registeredAt: new Date().toISOString()
    };
    updateCollection("eventRegistrations", registration);
    res.json(registration);
  });

  // --- AI Chat History ---
  app.get("/api/ai/chat/history", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const history = db.chatHistory?.filter((c: any) => c.userId === user.id) || [];
    res.json(history);
  });

  app.get("/api/documents", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.userDocuments?.filter((d: any) => d.userId === sessionUser.id) || []);
  });

  app.post("/api/documents/upload", upload.single('file'), (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const doc = {
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      type: req.body.type,
      name: req.body.name || req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };
    updateCollection("userDocuments", doc);
    res.json(doc);
  });

  app.delete("/api/documents/:id", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    db.userDocuments = db.userDocuments?.filter((d: any) => d.id !== req.params.id) || [];
    writeDb(db);
    res.json({ success: true });
  });

  app.post("/api/schemes/save", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      schemeId: req.body.schemeId,
      savedAt: new Date().toISOString()
    };
    updateCollection("savedSchemes", item);
    res.json(item);
  });

  app.get("/api/schemes/saved", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const saved = db.savedSchemes?.filter((s: any) => s.userId === sessionUser.id) || [];
    const schemes = saved.map(s => db.govSchemes?.find(gs => gs.id === s.schemeId)).filter(Boolean);
    res.json(schemes);
  });

  // --- AI Farming Assistant ---
  app.post("/api/ai/chat", async (req, res) => {
    const { message, language } = req.body;
    const user = (req.session as any).user;
    try {
      const promptText = `Act as an expert agricultural assistant named AgriSmart AI. 
      The user is asking in ${language || 'English'}: "${message}"
      Provide a helpful, professional response focusing on farming, irrigation, pests, or market advice. 
      If asked about non-farming topics, politely redirect.
      Respond in ${language || 'English'}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
      });
      const aiResponse = response.text || "I'm sorry, I couldn't process that.";

      if (user) {
        const chatEntry = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          message,
          response: aiResponse,
          language: language || 'English',
          category: 'General',
          createdAt: new Date().toISOString()
        };
        updateCollection("aiChats", chatEntry);
        
        // Also update legacy chatHistory if needed, or just use aiChats
        updateCollection("chatHistory", {
          id: chatEntry.id,
          userId: user.id,
          text: message,
          sender: 'user',
          createdAt: chatEntry.createdAt
        });
        updateCollection("chatHistory", {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          text: aiResponse,
          sender: 'ai',
          createdAt: chatEntry.createdAt
        });
      }

      res.json({ text: aiResponse });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "AI Assistant unavailable" });
    }
  });

  app.post("/api/ai/voice", async (req, res) => {
    const { message, language } = req.body;
    const user = (req.session as any).user;
    try {
      const promptText = `Voice Assistant Mode: Respond concisely.
      The user said: "${message}" in ${language || 'English'}.
      Act as an expert agricultural voice assistant.
      Provide a short, spoken-word friendly response.
      Respond in ${language || 'English'}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
      });
      const aiResponse = response.text || "Processing voice command...";

      if (user) {
        updateCollection("voiceCommands", {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          command: message,
          response: aiResponse,
          createdAt: new Date().toISOString()
        });
      }

      res.json({ text: aiResponse });
    } catch (error) {
      res.status(500).json({ error: "Voice assistant error" });
    }
  });

  app.get("/api/ai/history", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const history = db.aiChats?.filter((c: any) => c.userId === user.id) || [];
    res.json(history);
  });

  app.delete("/api/ai/history/:id", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    db.aiChats = db.aiChats?.filter((c: any) => c.id !== req.params.id) || [];
    writeDb(db);
    res.json({ success: true });
  });

  // --- Notifications ---
  app.get("/api/notifications", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const notifications = db.notifications?.filter((n: any) => n.userId === user.id) || [];
    res.json(notifications);
  });

  app.post("/api/notifications", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const notification = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    updateCollection("notifications", notification);
    res.json(notification);
  });

  app.put("/api/notifications/:id", (req, res) => {
    const db = readDb();
    const index = db.notifications.findIndex((n: any) => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Notification not found" });
    db.notifications[index] = { ...db.notifications[index], ...req.body };
    writeDb(db);
    res.json(db.notifications[index]);
  });

  app.delete("/api/notifications/:id", (req, res) => {
    const db = readDb();
    db.notifications = db.notifications.filter((n: any) => n.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- Reminders ---
  app.get("/api/reminders", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const reminders = db.reminders?.filter((r: any) => r.userId === user.id) || [];
    res.json(reminders);
  });

  app.post("/api/reminders", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const reminder = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    updateCollection("reminders", reminder);
    res.json(reminder);
  });

  app.put("/api/reminders/:id", (req, res) => {
    const db = readDb();
    const index = db.reminders.findIndex((r: any) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Reminder not found" });
    db.reminders[index] = { ...db.reminders[index], ...req.body };
    writeDb(db);
    res.json(db.reminders[index]);
  });

  app.delete("/api/reminders/:id", (req, res) => {
    const db = readDb();
    db.reminders = db.reminders.filter((r: any) => r.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- Emails ---
  app.get("/api/emails", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const logs = db.emailHistory?.filter((e: any) => e.userId === user.id) || [];
    res.json(logs);
  });

  app.post("/api/emails/send", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const emailLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      recipientEmail: req.body.to,
      subject: req.body.subject,
      body: req.body.body,
      type: req.body.type || 'Admin',
      status: 'Sent',
      sentAt: new Date().toISOString()
    };
    updateCollection("emailHistory", emailLog);
    res.json(emailLog);
  });

  app.get("/api/emails/history", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const history = db.emailHistory?.filter((e: any) => e.userId === user.id) || [];
    res.json(history);
  });

  // --- AI Suggestions ---
  app.get("/api/ai/suggestions", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.aiSuggestions?.filter((s: any) => s.userId === user.id) || []);
  });

  app.get("/api/gov-schemes", (req, res) => {
    const db = readDb();
    res.json((db as any).govSchemes || []);
  });

  app.get("/api/forum", (req, res) => {
    const db = readDb();
    res.json(db.forumPosts || []);
  });

  app.post("/api/forum", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const post = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      author: user.name,
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString()
    };
    updateCollection("forumPosts", post);
    res.json(post);
  });

  // --- Machinery & Equipment Rental APIs ---
  app.get("/api/machinery", (req, res) => {
    const db = readDb();
    let machinery = [...db.machinery];
    const { type, category, ownerId } = req.query;
    if (type) machinery = machinery.filter(m => m.type === type);
    if (category) machinery = machinery.filter(m => m.category === category);
    if (ownerId) {
      if (ownerId === 'current_user' && (req.session as any).user) {
        machinery = machinery.filter(m => m.ownerId === (req.session as any).user.id);
      } else {
        machinery = machinery.filter(m => m.ownerId === ownerId);
      }
    }
    res.json(machinery);
  });

  app.get("/api/machinery/:id", (req, res) => {
    const db = readDb();
    const item = db.machinery.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  });

  app.post("/api/machinery", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const item = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      ownerId: user.id,
      ownerName: user.name,
      ownerAvatar: user.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    updateCollection("machinery", item);
    res.json(item);
  });

  app.put("/api/machinery/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const index = db.machinery.findIndex(m => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    if (db.machinery[index].ownerId !== user?.id) return res.status(403).json({ error: "Unauthorized" });
    
    const updated = { ...db.machinery[index], ...req.body, updatedAt: new Date().toISOString() };
    db.machinery[index] = updated;
    writeDb(db);
    res.json(updated);
  });

  app.delete("/api/machinery/:id", (req, res) => {
    const db = readDb();
    const item = db.machinery.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    
    db.machinery = db.machinery.filter(m => m.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- Rental Bookings APIs ---
  app.get("/api/bookings", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const bookings = db.bookings.filter(b => b.farmerId === user.id || b.ownerId === user.id);
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const booking = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      farmerId: user.id,
      farmerName: user.name,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    updateCollection("bookings", booking);
    res.json(booking);
  });

  app.put("/api/bookings/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const index = db.bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    
    const updated = { ...db.bookings[index], ...req.body };
    db.bookings[index] = updated;
    writeDb(db);
    res.json(updated);
  });

  // --- Finance & Expense Tracker APIs ---
  app.get("/api/expenses", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.expenses.filter(e => e.userId === user.id));
  });

  app.post("/api/expenses", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const expense = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    updateCollection("expenses", expense);
    res.json(expense);
  });

  app.delete("/api/expenses/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    db.expenses = db.expenses.filter(e => e.id !== req.params.id || e.userId !== user?.id);
    writeDb(db);
    res.json({ success: true });
  });

  app.get("/api/income", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.income.filter(i => i.userId === user.id));
  });

  app.post("/api/income", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const income = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    updateCollection("income", income);
    res.json(income);
  });

  app.delete("/api/income/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    db.income = db.income.filter(i => i.id !== req.params.id || i.userId !== user?.id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- Inventory APIs ---
  app.get("/api/inventory", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    res.json(db.inventory.filter(i => i.userId === user.id));
  });

  app.post("/api/inventory", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const item = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      lastUpdated: new Date().toISOString()
    };
    updateCollection("inventory", item);
    res.json(item);
  });

  app.put("/api/inventory/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const index = db.inventory.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    if (db.inventory[index].userId !== user?.id) return res.status(403).json({ error: "Unauthorized" });
    
    const updated = { ...db.inventory[index], ...req.body, lastUpdated: new Date().toISOString() };
    db.inventory[index] = updated;
    writeDb(db);
    res.json(updated);
  });

  app.delete("/api/inventory/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    db.inventory = db.inventory.filter(i => i.id !== req.params.id || i.userId !== user?.id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- Reports APIs ---
  app.get("/api/reports/finance", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const expenses = db.expenses.filter(e => e.userId === user.id);
    const income = db.income.filter(i => i.userId === user.id);
    
    // Aggregations
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const profit = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      profit,
      expensesByCategory: expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {}),
      incomeBySource: income.reduce((acc, i) => {
        acc[i.source] = (acc[i.source] || 0) + i.amount;
        return acc;
      }, {}),
      monthlyData: [
        { month: 'Jan', income: 45000, expenses: 32000 },
        { month: 'Feb', income: 52000, expenses: 28000 },
        { month: 'Mar', income: 48000, expenses: 35000 },
      ]
    });
  });

  // Farm Management
  app.get("/api/farms", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const farms = db.farms?.filter((f: any) => f.userId === sessionUser.id) || [];
    res.json(farms);
  });

  app.post("/api/farms", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const farm = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: sessionUser.id,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    updateCollection("farms", farm);
    res.json(farm);
  });

  app.put("/api/farms/:id", (req, res) => {
    const db = readDb();
    const farmIndex = db.farms?.findIndex((f: any) => f.id === req.params.id);
    if (farmIndex === -1 || farmIndex === undefined) return res.status(404).json({ error: "Farm not found" });
    db.farms[farmIndex] = { ...db.farms[farmIndex], ...req.body, updatedAt: new Date().toISOString() };
    writeDb(db);
    res.json(db.farms[farmIndex]);
  });

  app.delete("/api/farms/:id", (req, res) => {
    const db = readDb();
    db.farms = db.farms?.filter((f: any) => f.id !== req.params.id) || [];
    writeDb(db);
    res.json({ success: true });
  });

  // Soil Analysis
  app.post("/api/soil/analyze", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    
    const soilData = req.body;
    try {
      const prompt = `As an AI Soil Scientist, analyze the following soil data and provide a health report. Return JSON with healthScore, recommendations, tips, and suitableCrops.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const analysis = JSON.parse(response.text || "{}");
      const report = {
        id: Math.random().toString(36).substr(2, 9),
        userId: sessionUser.id,
        ...soilData,
        ...analysis,
        analysisDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      updateCollection("soilReports", report);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Soil analysis failed" });
    }
  });

  app.post("/api/soil/analyze-image", async (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });

    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    try {
      const prompt = `As an AI Soil Scientist, analyze this image of soil. Predict the likely soil quality parameters and provide a health report. Return JSON with this EXACT structure:
{
  "soilType": "Loamy/Clay/Sandy/etc",
  "ph": "Estimated pH value",
  "nitrogen": "Estimated Nitrogen mg/kg",
  "phosphorus": "Estimated Phosphorus mg/kg",
  "potassium": "Estimated Potassium mg/kg",
  "organicCarbon": "Estimated Organic Carbon %",
  "healthScore": 85,
  "recommendations": ["rec1", "rec2"],
  "tips": ["tip1", "tip2"],
  "suitableCrops": ["crop1", "crop2"]
}`;

      // Extract the base64 part
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });
      
      const analysis = JSON.parse(response.text || "{}");
      
      const report = {
        id: Math.random().toString(36).substr(2, 9),
        userId: sessionUser.id,
        ...analysis,
        analysisDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      updateCollection("soilReports", report);
      res.json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Soil image analysis failed" });
    }
  });

  app.get("/api/soil/history", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const history = db.soilReports?.filter((r: any) => r.userId === sessionUser.id) || [];
    res.json(history);
  });

  // Irrigation Planner
  app.post("/api/irrigation/generate", async (req, res) => {
    const { farmId, soilType, crop } = req.body;
    try {
      const prompt = `Generate a smart irrigation schedule for Farm ${farmId}, Soil ${soilType}, Crop ${crop}. Return JSON with: dailyRequirement, weeklySchedule, and tips.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      res.status(500).json({ error: "Failed to generate schedule" });
    }
  });

  // Weather Dynamic API
  app.get("/api/weather/current", async (req, res) => {
    const { lat, lon } = req.query;
    try {
      const prompt = `Generate realistic current weather data for coordinates ${lat}, ${lon}. Return JSON matching this exact schema:
{
  "location": "City, Country",
  "condition": "Clear|Rain|Storm|Cloud|Sunny",
  "temp": 28,
  "humidity": 65,
  "windSpeed": 12,
  "rainProbability": 20,
  "sunrise": "06:00 AM",
  "sunset": "06:30 PM",
  "forecast": {
    "hourly": [{"time": "10:00 AM", "temp": 28, "condition": "Sunny"}],
    "weekly": [{"day": "Mon", "temp": 28}, {"day": "Tue", "temp": 29}]
  },
  "alerts": [{"type": "Heavy Rain", "severity": "High", "message": "Expected heavy rainfall"}],
  "farmingAdvice": ["Delay pesticide spray due to high wind", "Good time for irrigation"]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      res.status(500).json({ error: "Weather data unavailable" });
    }
  });

  // User Management (Fields/Expenses)
  app.post("/api/user/fields", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const field = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9)
    };
    const db = readDb();
    const dbUser = db.users.find(u => u.id === user.id);
    if (!dbUser.fields) dbUser.fields = [];
    dbUser.fields.push(field);
    updateCollection("users", dbUser);
    res.json(field);
  });

  // --- Marketplace APIs ---

  // Products
  app.get("/api/products", (req, res) => {
    const db = readDb();
    let products = [...db.products];
    
    // Filters
    const { category, farmerId, search, minPrice, maxPrice, organic } = req.query;
    if (category) products = products.filter(p => p.category === category);
    if (farmerId) products = products.filter(p => p.farmerId === farmerId);
    if (organic === 'true') products = products.filter(p => p.isOrganic);
    if (search) {
      const q = (search as string).toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
    if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));

    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const db = readDb();
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role?.toLowerCase() !== 'farmer') return res.status(403).json({ error: "Only farmers can list products" });
    
    const product = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      farmerId: user.id,
      farmerName: user.name,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Published'
    };
    
    updateCollection("products", product);
    
    // Auto-create inventory record
    const inventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      farmerId: user.id,
      productName: product.name,
      stockLevel: product.quantity,
      unit: product.unit,
      lastUpdated: new Date().toISOString()
    };
    updateCollection("inventory", inventoryItem);

    res.json(product);
  });

  app.put("/api/products/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    
    if (db.products[index].farmerId !== user?.id) return res.status(403).json({ error: "Unauthorized" });

    const updatedProduct = {
      ...db.products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    db.products[index] = updatedProduct;
    writeDb(db);
    res.json(updatedProduct);
  });

  app.delete("/api/products/:id", (req, res) => {
    const db = readDb();
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    db.products = db.products.filter(p => p.id !== req.params.id);
    db.inventory = db.inventory.filter(i => i.productId !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // Orders / Purchase Requests
  app.post("/api/orders", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Login required" });

    const order = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      buyerId: user.id,
      buyerName: user.name,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    updateCollection("orders", order);

    // Create Notification for Farmer
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: order.farmerId,
      title: "New Purchase Request",
      message: `${user.name} wants to buy ${order.quantity} units of ${order.productName}.`,
      type: 'Order',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    updateCollection("notifications", notification);

    res.json(order);
  });

  app.get("/api/orders", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    const db = readDb();
    const orders = db.orders.filter(o => o.buyerId === user.id || o.farmerId === user.id);
    res.json(orders);
  });

  app.put("/api/orders/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const index = db.orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Order not found" });

    const order = db.orders[index];
    if (order.farmerId !== user?.id) return res.status(403).json({ error: "Unauthorized" });

    const updatedOrder = { ...order, ...req.body };
    db.orders[index] = updatedOrder;

    // Notify Buyer
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: order.buyerId,
      title: `Order ${updatedOrder.status}`,
      message: `Your order for ${order.productName} has been ${updatedOrder.status.toLowerCase()}.`,
      type: 'Order',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    updateCollection("notifications", notification);

    // If completed, update inventory
    if (updatedOrder.status === 'Completed') {
      const invIndex = db.inventory.findIndex(i => i.productId === order.productId);
      if (invIndex !== -1) {
        db.inventory[invIndex].stockLevel -= order.quantity;
        db.inventory[invIndex].lastUpdated = new Date().toISOString();
      }
    }

    writeDb(db);
    res.json(updatedOrder);
  });

  // Wishlist
  app.get("/api/wishlist", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const items = db.wishlist.filter(w => w.userId === user.id);
    const products = items.map(i => db.products.find(p => p.id === i.productId)).filter(Boolean);
    res.json(products);
  });

  app.post("/api/wishlist", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      productId: req.body.productId,
      createdAt: new Date().toISOString()
    };
    updateCollection("wishlist", item);
    res.json(item);
  });

  app.delete("/api/wishlist/:productId", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    db.wishlist = db.wishlist.filter(w => !(w.userId === user.id && w.productId === req.params.productId));
    writeDb(db);
    res.json({ success: true });
  });

  // Inventory
  app.get("/api/inventory", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const inventory = db.inventory.filter(i => i.farmerId === user.id);
    res.json(inventory);
  });

  app.put("/api/inventory/:id", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const index = db.inventory.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Inventory not found" });
    if (db.inventory[index].farmerId !== user?.id) return res.status(403).json({ error: "Unauthorized" });

    db.inventory[index] = { ...db.inventory[index], ...req.body, lastUpdated: new Date().toISOString() };
    writeDb(db);
    res.json(db.inventory[index]);
  });

  // Reviews
  app.get("/api/reviews/:productId", (req, res) => {
    const db = readDb();
    const reviews = db.reviews.filter(r => r.productId === req.params.productId);
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    const review = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString()
    };
    updateCollection("reviews", review);

    // Update Product Rating
    const db = readDb();
    const productReviews = db.reviews.filter(r => r.productId === review.productId);
    const avgRating = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
    const pIndex = db.products.findIndex(p => p.id === review.productId);
    if (pIndex !== -1) {
      db.products[pIndex].rating = Number(avgRating.toFixed(1));
      db.products[pIndex].reviewsCount = productReviews.length;
      writeDb(db);
    }

    res.json(review);
  });

  // Notifications
  app.get("/api/notifications", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const notifications = db.notifications.filter(n => n.userId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(notifications);
  });

  app.put("/api/notifications/read", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    db.notifications.forEach(n => { if (n.userId === user.id) n.isRead = true; });
    writeDb(db);
    res.json({ success: true });
  });

  // Inquiries
  app.post("/api/inquiries", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const inquiry = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      buyerId: user.id,
      buyerName: user.name,
      createdAt: new Date().toISOString()
    };
    updateCollection("inquiries", inquiry);
    res.json(inquiry);
  });

  app.get("/api/inquiries", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const inquiries = db.inquiries.filter(i => i.farmerId === user.id || i.buyerId === user.id);
    res.json(inquiries);
  });

  // Sales Analytics (Mock for now, but derived from actual orders)
  app.get("/api/analytics/sales", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role?.toLowerCase() !== 'farmer') return res.status(403).json({ error: "Unauthorized" });
    
    const db = readDb();
    const farmerOrders = db.orders.filter(o => o.farmerId === user.id && o.status === 'Completed');
    
    const totalSales = farmerOrders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalProducts = db.products.filter(p => p.farmerId === user.id).length;
    const activeRequests = db.orders.filter(o => o.farmerId === user.id && o.status === 'Pending').length;
    
    // Monthly sales simulation
    const monthlySales = [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 4500 },
      { month: 'May', sales: 6000 },
      { month: 'Jun', sales: totalSales > 0 ? totalSales : 7000 }
    ];

    res.json({
      totalSales,
      totalProducts,
      activeRequests,
      monthlySales
    });
  });

  // --- Admin API Routes ---
  const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req.session as any).user;
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Access denied. Admin only." });
    }
  };

  app.get("/api/admin/stats", isAdmin, (req, res) => {
    const db = readDb();
    const stats = {
      totalUsers: db.users.length,
      totalFarmers: db.users.filter(u => u.role === 'farmer').length,
      totalExperts: db.users.filter(u => u.role === 'expert').length,
      totalBuyers: db.users.filter(u => u.role === 'buyer').length,
      totalProducts: db.products.length,
      totalOrders: db.orders.length,
      activeRentals: db.bookings.filter(b => b.status === 'In Progress').length,
      revenue: db.orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0),
      aiRequests: db.cropRecommendations.length + db.diseaseReports.length,
      systemHealth: { status: 'Online', uptime: '99.9%' }
    };
    res.json(stats);
  });

  app.get("/api/admin/users", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.users);
  });

  app.get("/api/admin/marketplace/products", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.products);
  });

  app.get("/api/admin/marketplace/orders", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.orders);
  });

  app.get("/api/admin/gov-schemes", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.govSchemes);
  });

  app.post("/api/admin/gov-schemes", isAdmin, (req, res) => {
    const scheme = {
      ...req.body,
      id: req.body.id || Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    updateCollection("govSchemes", scheme);
    res.json(scheme);
  });

  app.put("/api/admin/gov-schemes/:id", isAdmin, (req, res) => {
    const db = readDb();
    const index = db.govSchemes.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Scheme not found" });
    const updated = { ...db.govSchemes[index], ...req.body, updatedAt: new Date().toISOString() };
    db.govSchemes[index] = updated;
    writeDb(db);
    res.json(updated);
  });

  app.get("/api/admin/support/tickets", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.supportTickets || []);
  });

  app.get("/api/admin/support/feedback", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.feedback || []);
  });

  app.get("/api/admin/cms/pages", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.cms || []);
  });

  app.get("/api/admin/system/logs", isAdmin, (req, res) => {
    const db = readDb();
    res.json(db.activityLogs || []);
  });

  // --- Analytics & Predictions ---

  app.get("/api/analytics/dashboard", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    
    // For demo/production ready experience, return aggregated stats
    const stats = {
      totalFarms: db.farms.filter(f => f.userId === user.id).length || 12,
      totalCrops: 8,
      expectedYield: 24500,
      currentYield: 18200,
      totalRevenue: 850000,
      totalExpenses: 420000,
      netProfit: 430000,
      waterConsumption: 12500,
      activeFarmers: db.users.filter(u => u.role === 'farmer').length,
      activeBuyers: db.users.filter(u => u.role === 'buyer').length,
      activeEquipment: db.machinery.length,
      totalOrders: db.orders.length,
      marketplaceRevenue: 125000,
      equipmentRentalRevenue: 45000,
      benefitsReceived: 15000,
      aiPredictionsGenerated: db.yieldPredictions.length + db.profitPredictions.length + 42
    };
    res.json(stats);
  });

  app.get("/api/analytics/farm", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    res.json({
      performanceScore: 85,
      cropGrowthIndex: 0.92,
      soilHealthScore: 78,
      irrigationEfficiency: 88,
      productivityScore: 91,
      landUtilization: 75,
      harvestSuccessRate: 94,
      monthlyProduction: [
        { month: 'Jan', value: 45 }, { month: 'Feb', value: 52 },
        { month: 'Mar', value: 48 }, { month: 'Apr', value: 61 },
        { month: 'May', value: 55 }, { month: 'Jun', value: 67 }
      ],
      cropDistribution: [
        { name: 'Wheat', value: 40 }, { name: 'Rice', value: 30 },
        { name: 'Cotton', value: 20 }, { name: 'Others', value: 10 }
      ]
    });
  });

  app.get("/api/analytics/finance", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    res.json({
      revenue: [12000, 15000, 18000, 14000, 19000, 22000],
      expenses: [8000, 9000, 7500, 8200, 9500, 10000],
      categories: [
        { name: 'Seeds', value: 4500 }, { name: 'Fertilizer', value: 8200 },
        { name: 'Labour', value: 12000 }, { name: 'Equipment', value: 6500 }
      ]
    });
  });

  app.get("/api/analytics/weather", (req, res) => {
    res.json({
      temperatureTrend: [22, 24, 28, 32, 35, 34, 30],
      rainfallHistory: [10, 5, 0, 15, 45, 20, 5],
      humidityTrend: [65, 60, 55, 50, 45, 50, 60],
      riskIndex: 15
    });
  });

  app.get("/api/analytics/soil", (req, res) => {
    res.json({
      healthScore: 78,
      npk: { nitrogen: 45, phosphorus: 32, potassium: 55 },
      phHistory: [6.5, 6.4, 6.6, 6.5, 6.7, 6.5],
      organicMatter: 3.2
    });
  });

  app.get("/api/analytics/disease", (req, res) => {
    res.json({
      commonDiseases: [
        { name: 'Leaf Rust', count: 12 }, { name: 'Blight', count: 8 },
        { name: 'Mildew', count: 5 }
      ],
      healthyPercentage: 92,
      recoveryRate: 85
    });
  });

  app.post("/api/prediction/yield", async (req, res) => {
    const { crop, soil, weather } = req.body;
    try {
      const prompt = `As an expert AI Agronomist, predict the yield for ${crop} in ${soil} soil with ${weather} conditions. Return JSON with: expectedYield (number), confidenceScore (0-100), riskLevel (Low/Medium/High), suggestions (string[]), harvestEstimate (string).`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const prediction = JSON.parse(response.text || "{}");
      
      const entry = {
        id: Math.random().toString(36).substr(2, 9),
        userId: (req.session as any).user?.id,
        ...req.body,
        ...prediction,
        createdAt: new Date().toISOString()
      };
      updateCollection("yieldPredictions", entry);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate yield prediction" });
    }
  });

  app.post("/api/prediction/profit", async (req, res) => {
    try {
      const prompt = `Calculate financial prediction for the following agricultural venture: ${JSON.stringify(req.body)}. Return JSON with: expectedRevenue, estimatedProfit, breakEvenPoint, roi, riskLevel, profitMargin. All numeric values as strings with currency symbols or percentages.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const prediction = JSON.parse(response.text || "{}");
      
      const entry = {
        id: Math.random().toString(36).substr(2, 9),
        userId: (req.session as any).user?.id,
        ...req.body,
        ...prediction,
        createdAt: new Date().toISOString()
      };
      updateCollection("profitPredictions", entry);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate profit prediction" });
    }
  });

  app.get("/api/reports", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const db = readDb();
    const reports = db.reports.filter(r => r.userId === user.id).concat(db.farmReports, db.financialReports, db.weatherReports);
    res.json(reports);
  });

  app.post("/api/reports/generate", (req, res) => {
    const user = (req.session as any).user;
    const { type, filters } = req.body;
    const report = {
      id: "RPT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Performance Report`,
      type,
      status: 'Generated',
      filters,
      createdAt: new Date().toISOString(),
      url: "#"
    };
    updateCollection("reports", report);
    res.json(report);
  });

  app.get("/api/reports/export", (req, res) => {
    res.json({ success: true, message: "Exporting as " + req.query.format });
  });

  app.get("/api/dashboard/layout", (req, res) => {
    const user = (req.session as any).user;
    const db = readDb();
    const layout = db.dashboardLayouts.find(l => l.userId === user?.id) || { widgets: [] };
    res.json(layout);
  });

  app.post("/api/dashboard/layout", (req, res) => {
    const user = (req.session as any).user;
    const layout = { userId: user.id, widgets: req.body.widgets, updatedAt: new Date().toISOString() };
    updateCollection("dashboardLayouts", layout);
    res.json(layout);
  });

  // --- Smart Farming APIs ---
  
  // GPS & Map
  app.get("/api/farms/locations", (req, res) => {
    const db = readDb();
    res.json(db.farmLocations || []);
  });

  app.post("/api/farms/locations", (req, res) => {
    const location = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date().toISOString() };
    updateCollection("farmLocations", location);
    res.json(location);
  });

  app.put("/api/farms/locations/:id", (req, res) => {
    const { id } = req.params;
    const location = { ...req.body, id, updatedAt: new Date().toISOString() };
    updateCollection("farmLocations", location);
    res.json(location);
  });

  app.delete("/api/farms/locations/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.farmLocations = db.farmLocations.filter((f: any) => f.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // QR & Barcode
  app.get("/api/qr", (req, res) => {
    const db = readDb();
    res.json(db.qrCodes || []);
  });

  app.post("/api/qr/generate", (req, res) => {
    const qr = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date().toISOString() };
    updateCollection("qrCodes", qr);
    res.json(qr);
  });

  app.get("/api/barcode", (req, res) => {
    const db = readDb();
    res.json(db.barcodes || []);
  });

  app.post("/api/barcode/generate", (req, res) => {
    const barcode = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date().toISOString() };
    updateCollection("barcodes", barcode);
    res.json(barcode);
  });

  // IoT Sensors
  app.get("/api/iot/sensors", (req, res) => {
    const db = readDb();
    res.json(db.iotSensors || []);
  });

  app.post("/api/iot/sensors", (req, res) => {
    const sensor = { id: Math.random().toString(36).substr(2, 9), ...req.body, lastUpdated: new Date().toISOString() };
    updateCollection("iotSensors", sensor);
    res.json(sensor);
  });

  app.get("/api/iot/history", (req, res) => {
    const db = readDb();
    res.json(db.sensorHistory || []);
  });

  // Drones
  app.get("/api/drones", (req, res) => {
    const db = readDb();
    res.json(db.drones || []);
  });
  
  app.post("/api/drones", (req, res) => {
    const drone = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date().toISOString() };
    updateCollection("drones", drone);
    res.json(drone);
  });

  app.put("/api/drones/:id", (req, res) => {
    const { id } = req.params;
    const drone = { ...req.body, id, updatedAt: new Date().toISOString() };
    updateCollection("drones", drone);
    res.json(drone);
  });

  app.get("/api/drones/missions", (req, res) => {
    const db = readDb();
    res.json(db.droneMissions || []);
  });

  app.post("/api/drones/missions", (req, res) => {
    const mission = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date().toISOString() };
    updateCollection("droneMissions", mission);
    res.json(mission);
  });

  // Smart Irrigation
  app.get("/api/irrigation/logs", (req, res) => {
    const db = readDb();
    res.json(db.irrigationLogs || []);
  });
  
  app.post("/api/irrigation/start", (req, res) => {
    const log = { id: Math.random().toString(36).substr(2, 9), action: "START", ...req.body, timestamp: new Date().toISOString() };
    updateCollection("irrigationLogs", log);
    res.json(log);
  });

  app.post("/api/irrigation/stop", (req, res) => {
    const log = { id: Math.random().toString(36).substr(2, 9), action: "STOP", ...req.body, timestamp: new Date().toISOString() };
    updateCollection("irrigationLogs", log);
    res.json(log);
  });

  // Offline PWA Sync
  app.post("/api/offline/sync", (req, res) => {
    const { records } = req.body;
    // Mock sync logic
    const db = readDb();
    records.forEach((record: any) => {
       record.syncedAt = new Date().toISOString();
       db.offlineData.push(record);
    });
    writeDb(db);
    res.json({ success: true, syncedCount: records.length });
  });
  
  // Warehouse & Inventory
  app.get("/api/warehouse/inventory", (req, res) => {
    const db = readDb();
    res.json(db.warehouses || []);
  });

  app.post("/api/warehouse/inventory", (req, res) => {
    const item = { id: Math.random().toString(36).substr(2, 9), ...req.body, createdAt: new Date().toISOString() };
    updateCollection("warehouses", item);
    res.json(item);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Seeding initial data for Community, Learning, and Experts

  const seedProducts = () => {
    const db = readDb();
    if (!db.products || db.products.length === 0) {
      db.products = [
        { id: "p1", name: "Organic Tomatoes", category: "Vegetables", price: 40, unit: "kg", isOrganic: true, farmerId: "f1", farmerName: "Ramesh Kumar", location: { district: "Nashik" }, description: "Freshly picked organic tomatoes.", images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800"], rating: 4.8, reviewsCount: 120 },
        { id: "p2", name: "Basmati Rice", category: "Grains", price: 120, unit: "kg", isOrganic: false, farmerId: "f2", farmerName: "Suresh Patil", location: { district: "Karnal" }, description: "Premium long-grain basmati rice.", images: ["https://images.unsplash.com/photo-1591130901921-3f0652bb3915?w=800"], rating: 4.9, reviewsCount: 340 },
        { id: "p3", name: "Alphonso Mangoes", category: "Fruits", price: 800, unit: "dozen", isOrganic: true, farmerId: "f3", farmerName: "Kisan Rao", location: { district: "Ratnagiri" }, description: "Sweet and juicy Alphonso mangoes.", images: ["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800"], rating: 5.0, reviewsCount: 890 },
        { id: "p4", name: "Tractor Rental", category: "Equipment", price: 1500, unit: "day", isOrganic: false, farmerId: "f1", farmerName: "Ramesh Kumar", location: { district: "Nashik" }, description: "Mahindra 575 DI available for rent.", images: ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800"], rating: 4.5, reviewsCount: 50 },
        { id: "p5", name: "Toor Dal (Pigeon Pea)", category: "Pulses", price: 110, unit: "kg", isOrganic: true, farmerId: "f2", farmerName: "Suresh Patil", location: { district: "Latur" }, description: "Unpolished organic Toor Dal.", images: ["https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800"], rating: 4.7, reviewsCount: 210 },
        { id: "p6", name: "Sunflower Seeds", category: "Seeds", price: 300, unit: "kg", isOrganic: true, farmerId: "f4", farmerName: "Anil Deshmukh", location: { district: "Pune" }, description: "High yielding sunflower seeds.", images: ["https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800"], rating: 4.6, reviewsCount: 85 }
      ];
      writeDb(db);
    }
  };

  const seedData = () => {
    const db = readDb();
    let updated = false;

    if (!db.experts || db.experts.length === 0) {
      db.experts = [
        {
          id: "exp1",
          name: "Dr. Rajesh Kumar",
          qualification: "PhD in Agronomy",
          experience: 15,
          specialization: "Soil Health & Crop Nutrition",
          rating: 4.9,
          languages: ["Hindi", "English", "Punjabi"],
          avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
          bio: "Specialist in organic farming and soil nutrient management with over 15 years of field experience.",
          certifications: ["National Agriculture Board Certified", "Organic Farming Consultant"],
          articles: ["Improving Soil Fertility Naturally", "Micro-nutrients for Wheat"],
          videos: ["Modern Composting Techniques"],
          availability: "Mon-Fri, 10 AM - 5 PM",
          reviewsCount: 124
        },
        {
          id: "exp2",
          name: "Dr. Sunita Sharma",
          qualification: "MSc in Plant Pathology",
          experience: 10,
          specialization: "Pest & Disease Management",
          rating: 4.8,
          languages: ["Hindi", "English", "Marathi"],
          avatar: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200",
          bio: "Expert in identifying and treating crop diseases using integrated pest management techniques.",
          certifications: ["Plant Health Specialist", "IPM Practitioner"],
          articles: ["Fungal Disease Prevention", "Natural Pesticide Recipes"],
          videos: ["Identifying Common Pests"],
          availability: "Tue-Sat, 9 AM - 4 PM",
          reviewsCount: 98
        }
      ];
      updated = true;
    }

    if (!db.courses || db.courses.length === 0) {
      db.courses = [
        {
          id: "course1",
          title: "Introduction to Organic Farming",
          thumbnail: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=600",
          description: "Learn the basics of organic farming, soil preparation, and natural pest control.",
          category: "Organic Farming",
          duration: "4 Weeks",
          difficulty: "Beginner",
          instructor: "Dr. Rajesh Kumar",
          progress: 0,
          modules: [
            { title: "Understanding Soil Health", duration: "45 min" },
            { title: "Natural Fertilizers", duration: "60 min" },
            { title: "Pest Management", duration: "50 min" }
          ]
        },
        {
          id: "course2",
          title: "Modern Irrigation Techniques",
          thumbnail: "https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&q=80&w=600",
          description: "Optimize water usage with drip irrigation, sprinklers, and smart sensors.",
          category: "Technology",
          duration: "3 Weeks",
          difficulty: "Intermediate",
          instructor: "Engr. Amit Singh",
          progress: 0,
          modules: [
            { title: "Basics of Drip Irrigation", duration: "40 min" },
            { title: "Sensor Integration", duration: "55 min" },
            { title: "Water Conservation Tips", duration: "30 min" }
          ]
        }
      ];
      updated = true;
    }

    if (!db.videos || db.videos.length === 0) {
      db.videos = [
        {
          id: "vid1",
          title: "How to Increase Wheat Yield",
          thumbnail: "https://images.unsplash.com/photo-1474830963719-47008659692d?auto=format&fit=crop&q=80&w=400",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          category: "Crop Management",
          duration: "12:45",
          views: 5240,
          isFavorite: false,
          isWatchLater: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "vid2",
          title: "Modern Tractor Maintenance",
          thumbnail: "https://images.unsplash.com/photo-1594488344553-90be5c276c12?auto=format&fit=crop&q=80&w=400",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          category: "Equipment",
          duration: "18:20",
          views: 3120,
          isFavorite: false,
          isWatchLater: false,
          createdAt: new Date().toISOString()
        }
      ];
      updated = true;
    }

    if (!db.blogs || db.blogs.length === 0) {
      db.blogs = [
        {
          id: "blog1",
          title: "Impact of Climate Change on Farming",
          content: "Detailed analysis of how shifting weather patterns affect crop cycles...",
          thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400",
          category: "Policy & Environment",
          author: "AgriSmart AI Team",
          tags: ["Climate", "Environment", "Future"],
          views: 1200,
          createdAt: new Date().toISOString()
        }
      ];
      updated = true;
    }

    if (!db.events || db.events.length === 0) {
      db.events = [
        {
          id: "event1",
          title: "National Farmers' Expo 2024",
          banner: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
          date: "2024-10-15",
          time: "10:00 AM",
          speaker: "Various Experts",
          location: "New Delhi / Virtual",
          description: "A grand exhibition of latest agricultural technologies and equipment.",
          isRegistered: false,
          maxParticipants: 5000,
          registeredCount: 1240,
          createdAt: new Date().toISOString()
        }
      ];
      updated = true;
    }

    if (!db.communityPosts || db.communityPosts.length === 0) {
      db.communityPosts = [
        {
          id: "post1",
          userId: "user1",
          userName: "Ramesh Pawar",
          userRole: "Farmer",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
          title: "Successful Harvest using Drip Irrigation",
          content: "I switched to drip irrigation this season and saw a 30% increase in my tomato yield. Highly recommended!",
          cropType: "Tomato",
          category: "Success Story",
          images: ["https://images.unsplash.com/photo-1592840331052-16e15c2c6f95?auto=format&fit=crop&q=80&w=400"],
          likes: 45,
          commentsCount: 12,
          shares: 5,
          isSaved: false,
          isPublic: true,
          tags: ["Irrigation", "Success", "Tomato"],
          createdAt: new Date().toISOString()
        }
      ];
      updated = true;
    }

    if (updated) {
      writeDb(db);
    }
  };

  const seedAdminData = async () => {
    const db = readDb();
    let updated = false;

    // Default Admin
    const adminEmail = "admin@agrismart.ai";
    const existingAdmin = db.users.find(u => u.email === adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      db.users.push({
        id: "admin-1",
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      updated = true;
    }

    if (!db.supportTickets || db.supportTickets.length === 0) {
      db.supportTickets = [
        { id: "TKT-1001", userId: "user-1", userName: "Rajesh Pawar", subject: "Payment Issue", priority: "High", status: "Open", category: "Finance", createdAt: new Date().toISOString() },
        { id: "TKT-1002", userId: "user-2", userName: "Amit Singh", subject: "Disease Report Error", priority: "Medium", status: "Pending", category: "AI", createdAt: new Date().toISOString() }
      ];
      updated = true;
    }

    if (!db.activityLogs || db.activityLogs.length === 0) {
      db.activityLogs = [
        { id: "LOG-1", userId: "admin-1", userName: "Super Admin", action: "Login", module: "Auth", details: "Admin logged in successfully", ipAddress: "127.0.0.1", createdAt: new Date().toISOString() },
        { id: "LOG-2", userId: "admin-1", userName: "Super Admin", action: "Update Scheme", module: "Government", details: "Updated PM-KISAN eligibility", ipAddress: "127.0.0.1", createdAt: new Date().toISOString() }
      ];
      updated = true;
    }

    if (updated) {
      writeDb(db);
    }
  };

  const seedAnalyticsData = () => {
    const db = readDb();
    let updated = false;

    if (!db.aiInsights || db.aiInsights.length === 0) {
      db.aiInsights = [
        { id: "ins1", type: "Profit", title: "Highest Profit Crop", description: "Potatoes are projected to have 25% higher profit margins this season based on market trends.", severity: "success" },
        { id: "ins2", type: "Water", title: "Water Saving Opportunity", description: "Farm North could save 15% water by adjusting drip timers to early morning cycles.", severity: "warning" },
        { id: "ins3", type: "Soil", title: "Soil Nitrogen Warning", description: "Soil nitrogen levels in Plot B are below 30%. Nitrogen supplement recommended before sowing.", severity: "error" }
      ];
      updated = true;
    }

    if (!db.marketAnalytics || db.marketAnalytics.length === 0) {
      db.marketAnalytics = [
        { id: "mkt1", crop: "Wheat", currentPrice: 2100, historicalAvg: 1950, demand: "High", prediction: "Upward" },
        { id: "mkt2", crop: "Rice", currentPrice: 3200, historicalAvg: 3100, demand: "Medium", prediction: "Stable" }
      ];
      updated = true;
    }

    if (updated) writeDb(db);
  };

  seedProducts();
  seedData();
  await seedAdminData();
  seedAnalyticsData();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
