import React, { useState } from 'react';
import { 
  CreditCard, 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  Info,
  DollarSign,
  Calendar,
  Percent,
  ArrowRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const LoanModulePage: React.FC = () => {
  const [calculator, setCalculator] = useState({
    amount: 100000,
    rate: 7.5,
    duration: 12
  });
  const [emiResult, setEmiResult] = useState<any>(null);

  const calculateEMI = async () => {
    try {
      const res = await fetch('/api/loan/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculator)
      });
      const data = await res.json();
      setEmiResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loanTypes = [
    {
      title: 'Kisan Credit Card (KCC)',
      rate: '4% - 7%',
      limit: 'Up to ₹3 Lakh',
      benefits: ['Instant credit for seeds/fertilizers', 'Interest subvention for timely repayment']
    },
    {
      title: 'Agriculture Term Loan',
      rate: '8.5% - 12%',
      limit: 'Based on Project Cost',
      benefits: ['Long term (3-7 years)', 'For machinery, tractors, irrigation systems']
    },
    {
      title: 'Gold Loan for Agriculture',
      rate: '7%',
      limit: 'Based on Gold Value',
      benefits: ['Fastest processing', 'Minimal documentation']
    }
  ];

  const chartData = emiResult ? [
    { name: 'Principal', value: calculator.amount, color: '#2E7D32' },
    { name: 'Interest', value: emiResult.totalInterest, color: '#FF9800' }
  ] : [];

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic italic">Loans & Credit</h1>
          <p className="text-gray-500 font-medium text-lg">Hassle-free agricultural credit to fuel your growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* EMI Calculator */}
        <div className="bg-white rounded-[50px] p-10 border-2 border-gray-100 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 italic">Loan EMI Calculator</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Loan Amount (₹)</label>
                  <span className="text-xl font-black text-purple-600">₹{(calculator.amount || 0).toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={calculator.amount}
                  onChange={(e) => setCalculator({...calculator, amount: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Interest Rate (%)</label>
                    <span className="text-xl font-black text-purple-600">{calculator.rate}%</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={calculator.rate}
                    onChange={(e) => setCalculator({...calculator, rate: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Duration (Months)</label>
                    <span className="text-xl font-black text-purple-600">{calculator.duration}m</span>
                  </div>
                  <input 
                    type="range"
                    min="3"
                    max="60"
                    step="3"
                    value={calculator.duration}
                    onChange={(e) => setCalculator({...calculator, duration: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>

              <Button 
                onClick={calculateEMI}
                className="w-full h-16 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-50"
              >
                Calculate EMI
              </Button>

              {emiResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic italic">Monthly EMI</p>
                      <h4 className="text-4xl font-black text-gray-900 tracking-tighter italic italic">₹{(emiResult.emi || 0).toLocaleString()}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic italic">Total Interest</p>
                        <p className="text-lg font-black text-orange-500 italic italic">₹{(emiResult.totalInterest || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic italic">Total Payable</p>
                        <p className="text-lg font-black text-gray-900 italic italic">₹{(emiResult.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Loan Types */}
        <div className="space-y-6">
          {loanTypes.map((loan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] p-8 border-2 border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shadow-inner group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight italic">{loan.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Int. Rate</p>
                  <p className="text-xl font-black text-purple-600">{loan.rate}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-bold text-gray-700">{loan.limit}</p>
                </div>
                <div className="space-y-2">
                  {loan.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-center gap-3 text-xs font-medium text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {benefit}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                Check Eligibility <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
