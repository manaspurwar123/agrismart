const fs = require('fs');
let content = fs.readFileSync('src/pages/CropRecommendationPage.tsx', 'utf8');

const target = `</div>
          </div>
        </div>

        <div className="flex justify-center gap-8 py-8">`;

const replacement = `</div>
          </div>
        </div>
        ) : null}

        <div className="flex justify-center gap-8 py-8">`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/CropRecommendationPage.tsx', content);
