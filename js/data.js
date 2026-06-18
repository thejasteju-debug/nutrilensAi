/* 
   NutriLens AI - Data Structures & Algorithms
   Contains presets, custom meal generators, AI Health Coach logic, and AI Insights templates.
*/

// Preset Bodybuilding Meals Database
const presetMeals = [
    {
        id: "preset-chicken-rice",
        name: "Chicken Breast, Jasmine Rice & Broccoli",
        image: "assets/chicken_rice_broccoli.png",
        category: "Lunch",
        calories: 620,
        macros: {
            protein: 52,
            carbs: 70,
            fat: 8,
            saturatedFat: 1.5,
            fiber: 6,
            sugar: 2
        },
        micros: {
            vitA: 12,
            vitC: 90,
            vitD: 0,
            vitE: 6,
            vitK: 85,
            vitB: 35,
            iron: 15,
            zinc: 20,
            magnesium: 25,
            potassium: 18,
            calcium: 6,
            sodium: 350
        },
        metrics: {
            glycemicIndex: 55,
            glycemicIndexLabel: "Low GI",
            glycemicLoad: 38,
            glycemicLoadLabel: "High GL",
            cholesterol: 95,
            omega3: 0.2,
            omega6: 1.1,
            proteinQuality: 98,
            confidence: {
                overall: 94,
                calories: 96,
                protein: 94,
                carbs: 91,
                fat: 89
            }
        },
        scorecard: {
            overall: 94,
            proteinQuality: 98,
            microDensity: 88,
            satiety: 92,
            muscleBuilding: 96,
            weightLoss: 70,
            heartHealth: 85,
            gradeTitle: "Excellent Muscle Food",
            gradeDesc: "Outstanding protein density, low fat, and substantial clean carbs. Perfect post-workout recovery fuel."
        },
        eaaProfile: {
            leucine: 4.2,
            isoleucine: 2.8,
            valine: 2.9,
            lysine: 3.8,
            methionine: 1.2,
            phenylalanine: 2.1,
            threonine: 2.1,
            tryptophan: 0.6,
            histidine: 1.5
        },
        items: [
            { name: "Grilled Chicken Breast", description: "160g • Grilled, skinless", protein: 48, carbs: 0, fat: 4, calories: 260, confidence: 95 },
            { name: "Steamed Jasmine Rice", description: "200g • Plain white, cooked", protein: 4, carbs: 58, fat: 0.5, calories: 260, confidence: 92 },
            { name: "Steamed Broccoli Florets", description: "100g • No butter added", protein: 3, carbs: 7, fat: 0.4, calories: 35, confidence: 96 },
            { name: "Olive Oil Spray (cooking)", description: "5g • Applied during grilling", protein: 0, carbs: 0, fat: 7, calories: 65, confidence: 85 }
        ],
        pins: [
            { label: "Chicken (160g)", top: 45, left: 35 },
            { label: "Jasmine Rice (200g)", top: 60, left: 65 },
            { label: "Broccoli (100g)", top: 30, left: 55 }
        ]
    },
    {
        id: "preset-steak-sweetpotato",
        name: "Ribeye Steak, Sweet Potato & Asparagus",
        image: "assets/hero_food_bowl.png", // Using hero image as fallback seared steak bowl
        category: "Dinner",
        calories: 820,
        macros: {
            protein: 58,
            carbs: 52,
            fat: 36,
            saturatedFat: 14,
            fiber: 7,
            sugar: 9
        },
        micros: {
            vitA: 240,
            vitC: 35,
            vitD: 8,
            vitE: 15,
            vitK: 45,
            vitB: 60,
            iron: 35,
            zinc: 65,
            magnesium: 30,
            potassium: 28,
            calcium: 8,
            sodium: 480
        },
        metrics: {
            glycemicIndex: 48,
            glycemicIndexLabel: "Low GI",
            glycemicLoad: 25,
            glycemicLoadLabel: "Medium GL",
            cholesterol: 150,
            omega3: 0.5,
            omega6: 2.8,
            proteinQuality: 96,
            confidence: {
                overall: 92,
                calories: 94,
                protein: 92,
                carbs: 89,
                fat: 87
            }
        },
        scorecard: {
            overall: 88,
            proteinQuality: 96,
            microDensity: 92,
            satiety: 95,
            muscleBuilding: 98,
            weightLoss: 40,
            heartHealth: 60,
            gradeTitle: "High-Calorie Bulk Meal",
            gradeDesc: "Extremely rich in zinc, iron, and muscle-building calories. Higher saturated fat, best for heavy leg/back training days."
        },
        eaaProfile: {
            leucine: 4.8,
            isoleucine: 3.1,
            valine: 3.2,
            lysine: 4.4,
            methionine: 1.5,
            phenylalanine: 2.5,
            threonine: 2.4,
            tryptophan: 0.7,
            histidine: 1.8
        },
        items: [
            { name: "Seared Ribeye Steak", description: "220g • Cooked medium-rare", protein: 54, carbs: 0, fat: 32, calories: 570, confidence: 94 },
            { name: "Roasted Sweet Potato", description: "200g • Baked with olive oil", protein: 3, carbs: 46, fat: 2, calories: 210, confidence: 93 },
            { name: "Grilled Asparagus Spears", description: "80g • Seasoned with sea salt", protein: 1, carbs: 6, fat: 2, calories: 40, confidence: 95 }
        ],
        pins: [
            { label: "Ribeye Steak (220g)", top: 40, left: 40 },
            { label: "Sweet Potato (200g)", top: 65, left: 30 },
            { label: "Asparagus (80g)", top: 55, left: 70 }
        ]
    },
    {
        id: "preset-salmon-quinoa",
        name: "Atlantic Salmon, Quinoa & Avocado Salad",
        image: "assets/hero_food_bowl.png",
        category: "Dinner",
        calories: 710,
        macros: {
            protein: 42,
            carbs: 45,
            fat: 38,
            saturatedFat: 5,
            fiber: 11,
            sugar: 4
        },
        micros: {
            vitA: 15,
            vitC: 25,
            vitD: 85,
            vitE: 30,
            vitK: 95,
            vitB: 50,
            iron: 22,
            zinc: 18,
            magnesium: 45,
            potassium: 24,
            calcium: 10,
            sodium: 290
        },
        metrics: {
            glycemicIndex: 35,
            glycemicIndexLabel: "Low GI",
            glycemicLoad: 15,
            glycemicLoadLabel: "Low GL",
            cholesterol: 75,
            omega3: 3.2,
            omega6: 1.4,
            proteinQuality: 94,
            confidence: {
                overall: 93,
                calories: 95,
                protein: 93,
                carbs: 90,
                fat: 88
            }
        },
        scorecard: {
            overall: 95,
            proteinQuality: 94,
            microDensity: 95,
            satiety: 90,
            muscleBuilding: 90,
            weightLoss: 65,
            heartHealth: 98,
            gradeTitle: "Anabolic Omega Booster",
            gradeDesc: "Incredible healthy fat profile with massive Omega-3s. Ideal for joint support, reducing training inflammation, and sustained energy."
        },
        eaaProfile: {
            leucine: 3.5,
            isoleucine: 2.2,
            valine: 2.3,
            lysine: 3.2,
            methionine: 1.1,
            phenylalanine: 1.8,
            threonine: 1.8,
            tryptophan: 0.5,
            histidine: 1.2
        },
        items: [
            { name: "Grilled Atlantic Salmon", description: "150g • Skin-on, pan-seared", protein: 34, carbs: 0, fat: 18, calories: 310, confidence: 96 },
            { name: "Organic Quinoa (Cooked)", description: "150g • Steamed, tri-color", protein: 6, carbs: 32, fat: 3, calories: 180, confidence: 93 },
            { name: "Hass Avocado Slices", description: "80g • Raw, fresh", protein: 1, carbs: 7, fat: 12, calories: 130, confidence: 97 },
            { name: "Mixed Green Salad", description: "100g • Dressed in lemon juice", protein: 1, carbs: 6, fat: 5, calories: 90, confidence: 88 }
        ],
        pins: [
            { label: "Salmon (150g)", top: 35, left: 45 },
            { label: "Quinoa (150g)", top: 60, left: 35 },
            { label: "Avocado (80g)", top: 55, left: 65 }
        ]
    },
    {
        id: "preset-scrambled-eggs",
        name: "Scrambled Eggs, Whole Wheat Toast & Avocado",
        image: "assets/hero_food_bowl.png",
        category: "Breakfast",
        calories: 480,
        macros: {
            protein: 24,
            carbs: 30,
            fat: 28,
            saturatedFat: 6,
            fiber: 8,
            sugar: 3
        },
        micros: {
            vitA: 25,
            vitC: 4,
            vitD: 40,
            vitE: 18,
            vitK: 12,
            vitB: 50,
            iron: 18,
            zinc: 15,
            magnesium: 15,
            potassium: 12,
            calcium: 12,
            sodium: 490
        },
        metrics: {
            glycemicIndex: 40,
            glycemicIndexLabel: "Low GI",
            glycemicLoad: 12,
            glycemicLoadLabel: "Low GL",
            cholesterol: 370,
            omega3: 0.4,
            omega6: 2.2,
            proteinQuality: 99,
            confidence: {
                overall: 96,
                calories: 98,
                protein: 96,
                carbs: 93,
                fat: 91
            }
        },
        scorecard: {
            overall: 90,
            proteinQuality: 99,
            microDensity: 80,
            satiety: 85,
            muscleBuilding: 86,
            weightLoss: 72,
            heartHealth: 78,
            gradeTitle: "Bioavailable Protein Start",
            gradeDesc: "Eggs represent the reference standard for protein bioavailability. Whole grains supply slow carbohydrates to keep energy steady."
        },
        eaaProfile: {
            leucine: 2.1,
            isoleucine: 1.4,
            valine: 1.5,
            lysine: 1.8,
            methionine: 0.7,
            phenylalanine: 1.2,
            threonine: 1.1,
            tryptophan: 0.3,
            histidine: 0.7
        },
        items: [
            { name: "Whole Cage-Free Eggs", description: "3 large • Scrambled", protein: 18, carbs: 1.5, fat: 15, calories: 210, confidence: 98 },
            { name: "Whole Wheat Sourdough", description: "2 slices • Toasted, plain", protein: 5, carbs: 25, fat: 2, calories: 150, confidence: 95 },
            { name: "Avocado Mash", description: "60g • Seasoned with pepper", protein: 1, carbs: 3.5, fat: 9, calories: 100, confidence: 94 },
            { name: "Unsalted Butter (pan)", description: "3g • Used for eggs", protein: 0, carbs: 0, fat: 2, calories: 20, confidence: 80 }
        ],
        pins: [
            { label: "Scrambled Eggs (3x)", top: 40, left: 50 },
            { label: "Whole Wheat Toast", top: 60, left: 35 },
            { label: "Avocado Slices (60g)", top: 55, left: 65 }
        ]
    },
    {
        id: "preset-whey-oats",
        name: "Whey Protein Oats, Banana & Peanut Butter",
        image: "assets/hero_food_bowl.png",
        category: "Snacks",
        calories: 650,
        macros: {
            protein: 42,
            carbs: 78,
            fat: 18,
            saturatedFat: 3,
            fiber: 12,
            sugar: 22
        },
        micros: {
            vitA: 4,
            vitC: 15,
            vitD: 0,
            vitE: 12,
            vitK: 8,
            vitB: 30,
            iron: 20,
            zinc: 15,
            magnesium: 35,
            potassium: 22,
            calcium: 25,
            sodium: 210
        },
        metrics: {
            glycemicIndex: 58,
            glycemicIndexLabel: "Medium GI",
            glycemicLoad: 45,
            glycemicLoadLabel: "High GL",
            cholesterol: 40,
            omega3: 0.1,
            omega6: 3.4,
            proteinQuality: 97,
            confidence: {
                overall: 97,
                calories: 99,
                protein: 97,
                carbs: 94,
                fat: 92
            }
        },
        scorecard: {
            overall: 92,
            proteinQuality: 97,
            microDensity: 75,
            satiety: 88,
            muscleBuilding: 94,
            weightLoss: 60,
            heartHealth: 85,
            gradeTitle: "Anabolic Post-Workout Charger",
            gradeDesc: "Rapid-digesting whey isolate paired with complex oats, potassium-rich banana, and energy-dense peanut butter. Superior hyper-bulk snack."
        },
        eaaProfile: {
            leucine: 4.1,
            isoleucine: 2.4,
            valine: 2.3,
            lysine: 3.4,
            methionine: 0.9,
            phenylalanine: 1.5,
            threonine: 2.3,
            tryptophan: 0.6,
            histidine: 0.9
        },
        items: [
            { name: "Whey Protein Isolate", description: "30g scoop • Vanilla", protein: 26, carbs: 2, fat: 1, calories: 120, confidence: 99 },
            { name: "Organic Rolled Oats", description: "80g • Cooked in water", protein: 10, carbs: 54, fat: 5, calories: 300, confidence: 95 },
            { name: "Medium Banana", description: "110g • Fresh, sliced", protein: 1, carbs: 27, fat: 0.3, calories: 105, confidence: 97 },
            { name: "Creamy Peanut Butter", description: "20g • Stirred into oats", protein: 5, carbs: 5, fat: 11, calories: 125, confidence: 96 }
        ],
        pins: [
            { label: "Oatmeal + Whey", top: 50, left: 50 },
            { label: "Banana Slices", top: 40, left: 35 },
            { label: "Peanut Butter", top: 60, left: 60 }
        ]
    }
];

// Custom Meal Templates (Simulated AI Vision Library for Custom Uploads)
const customMealDatabase = [
    {
        name: "Sirloin Steak with Jasmine Rice and Asparagus",
        category: "Dinner",
        calories: 710,
        macros: { protein: 48, carbs: 65, fat: 22, saturatedFat: 8, fiber: 5, sugar: 1 },
        micros: { vitA: 10, vitC: 15, vitD: 4, vitE: 8, vitK: 70, vitB: 55, iron: 30, zinc: 50, magnesium: 22, potassium: 20, calcium: 6, sodium: 380 },
        metrics: { glycemicIndex: 52, glycemicIndexLabel: "Low GI", glycemicLoad: 32, glycemicLoadLabel: "High GL", cholesterol: 110, omega3: 0.3, omega6: 1.8, proteinQuality: 96, confidence: { overall: 91, calories: 93, protein: 91, carbs: 88, fat: 86 } },
        scorecard: {
            overall: 91, proteinQuality: 96, microDensity: 85, satiety: 90, muscleBuilding: 95, weightLoss: 55, heartHealth: 72,
            gradeTitle: "Optimal Bulking Fusion",
            gradeDesc: "Leads with high-quality creatine-rich beef protein, quick carbs, and essential fiber. Perfect for post-strength sessions."
        },
        eaaProfile: { leucine: 3.9, isoleucine: 2.5, valine: 2.6, lysine: 3.6, methionine: 1.1, phenylalanine: 2.0, threonine: 1.9, tryptophan: 0.5, histidine: 1.3 },
        items: [
            { name: "Pan-Seared Sirloin Steak", description: "180g • Lean beef", protein: 44, carbs: 0, fat: 16, calories: 350, confidence: 93 },
            { name: "Steamed White Jasmine Rice", description: "180g • Steamed", protein: 3, carbs: 59, fat: 0.4, calories: 240, confidence: 90 },
            { name: "Sautéed Green Asparagus", description: "100g • Prepared in butter", protein: 1, carbs: 6, fat: 5, calories: 120, confidence: 92 }
        ],
        pins: [
            { label: "Sirloin Steak (180g)", top: 40, left: 30 },
            { label: "Jasmine Rice (180g)", top: 60, left: 60 },
            { label: "Asparagus (100g)", top: 30, left: 55 }
        ]
    },
    {
        name: "Baked Cod, Sweet Potato Mash & Sautéed Spinach",
        category: "Lunch",
        calories: 510,
        macros: { protein: 38, carbs: 42, fat: 16, saturatedFat: 3, fiber: 8, sugar: 7 },
        micros: { vitA: 280, vitC: 75, vitD: 60, vitE: 20, vitK: 300, vitB: 45, iron: 25, zinc: 12, magnesium: 40, potassium: 26, calcium: 15, sodium: 410 },
        metrics: { glycemicIndex: 45, glycemicIndexLabel: "Low GI", glycemicLoad: 18, glycemicLoadLabel: "Medium GL", cholesterol: 65, omega3: 1.2, omega6: 0.8, proteinQuality: 95, confidence: { overall: 92, calories: 94, protein: 92, carbs: 89, fat: 87 } },
        scorecard: {
            overall: 93, proteinQuality: 95, microDensity: 98, satiety: 85, muscleBuilding: 88, weightLoss: 78, heartHealth: 92,
            gradeTitle: "Super-Lean Micronutrient Fuel",
            gradeDesc: "High in lean white fish protein, vitamin A from sweet potatoes, and massive iron/potassium. Incredible bodybuilding fuel."
        },
        eaaProfile: { leucine: 3.1, isoleucine: 2.0, valine: 2.1, lysine: 2.9, methionine: 0.9, phenylalanine: 1.6, threonine: 1.6, tryptophan: 0.4, histidine: 1.1 },
        items: [
            { name: "Baked Pacific Cod", description: "160g • Wild caught, skinless", protein: 35, carbs: 0, fat: 1.5, calories: 160, confidence: 95 },
            { name: "Sweet Potato Mash", description: "180g • Seasoned, light butter", protein: 2, carbs: 36, fat: 4, calories: 200, confidence: 91 },
            { name: "Sautéed Baby Spinach", description: "120g • Cooked with garlic & oil", protein: 1, carbs: 6, fat: 10, calories: 150, confidence: 94 }
        ],
        pins: [
            { label: "Baked Cod (160g)", top: 35, left: 45 },
            { label: "Sweet Potato (180g)", top: 65, left: 35 },
            { label: "Spinach (120g)", top: 50, left: 65 }
        ]
    },
    {
        name: "Tofu Stir-fry with Brown Rice and Peppers",
        category: "Lunch",
        calories: 540,
        macros: { protein: 25, carbs: 70, fat: 18, saturatedFat: 2.5, fiber: 9, sugar: 6 },
        micros: { vitA: 40, vitC: 160, vitD: 15, vitE: 10, vitK: 35, vitB: 25, iron: 28, zinc: 18, magnesium: 35, potassium: 15, calcium: 30, sodium: 590 },
        metrics: { glycemicIndex: 48, glycemicIndexLabel: "Low GI", glycemicLoad: 33, glycemicLoadLabel: "High GL", cholesterol: 0, omega3: 0.4, omega6: 4.8, proteinQuality: 82, confidence: { overall: 89, calories: 91, protein: 89, carbs: 86, fat: 84 } },
        scorecard: {
            overall: 84, proteinQuality: 82, microDensity: 85, satiety: 82, muscleBuilding: 78, weightLoss: 68, heartHealth: 90,
            gradeTitle: "Plant-Based Recovery Plate",
            gradeDesc: "Features calcium-rich tofu and high-fiber brown rice. The EAA profile is good, but lower leucine suggests adding a BCAAs supplement."
        },
        eaaProfile: { leucine: 1.8, isoleucine: 1.2, valine: 1.3, lysine: 1.4, methionine: 0.3, phenylalanine: 1.1, threonine: 0.9, tryptophan: 0.3, histidine: 0.6 },
        items: [
            { name: "Extra Firm Soy Tofu", description: "150g • Cubed, pan seared", protein: 18, carbs: 4, fat: 10, calories: 170, confidence: 92 },
            { name: "Organic Brown Rice", description: "200g • Steamed", protein: 5, carbs: 52, fat: 2, calories: 250, confidence: 90 },
            { name: "Stir-fry Bell Peppers & Sesame Oil", description: "100g • Wok fried", protein: 2, carbs: 14, fat: 6, calories: 120, confidence: 85 }
        ],
        pins: [
            { label: "Pan Tofu (150g)", top: 40, left: 35 },
            { label: "Brown Rice (200g)", top: 60, left: 60 },
            { label: "Bell Peppers", top: 30, left: 55 }
        ]
    },
    {
        name: "Lean Ground Beef Bowl, Quinoa & Black Beans",
        category: "Dinner",
        calories: 780,
        macros: { protein: 46, carbs: 75, fat: 28, saturatedFat: 8, fiber: 14, sugar: 2 },
        micros: { vitA: 8, vitC: 12, vitD: 2, vitE: 6, vitK: 15, vitB: 45, iron: 40, zinc: 58, magnesium: 42, potassium: 25, calcium: 8, sodium: 620 },
        metrics: { glycemicIndex: 40, glycemicIndexLabel: "Low GI", glycemicLoad: 30, glycemicLoadLabel: "High GL", cholesterol: 110, omega3: 0.2, omega6: 2.1, proteinQuality: 94, confidence: { overall: 92, calories: 94, protein: 92, carbs: 89, fat: 87 } },
        scorecard: {
            overall: 90, proteinQuality: 94, microDensity: 88, satiety: 96, muscleBuilding: 95, weightLoss: 52, heartHealth: 75,
            gradeTitle: "High-Fiber Iron Powerhouse",
            gradeDesc: "Superior iron and fiber density. Quinoa and black beans combine to form a complete carbohydrate base alongside bioavailable beef."
        },
        eaaProfile: { leucine: 3.6, isoleucine: 2.3, valine: 2.4, lysine: 3.2, methionine: 1.0, phenylalanine: 1.9, threonine: 1.8, tryptophan: 0.5, histidine: 1.2 },
        items: [
            { name: "93/7 Ground Beef", description: "160g • Sautéed, drained", protein: 38, carbs: 0, fat: 16, calories: 300, confidence: 95 },
            { name: "Organic Quinoa (Cooked)", description: "150g • Steamed", protein: 6, carbs: 32, fat: 3, calories: 180, confidence: 92 },
            { name: "Canned Organic Black Beans", description: "120g • Rinsed", protein: 8, carbs: 25, fat: 1, calories: 140, confidence: 94 },
            { name: "Olive Oil & Seasoning", description: "15g • Sautéing dressing", protein: 0, carbs: 18, fat: 8, calories: 160, confidence: 80 }
        ],
        pins: [
            { label: "Ground Beef (160g)", top: 40, left: 35 },
            { label: "Quinoa Base (150g)", top: 60, left: 50 },
            { label: "Black Beans (120g)", top: 50, left: 65 }
        ]
    }
];

// Generates simulated results for custom user uploads
function generateMockCustomAnalysis(fileName) {
    // Select one template randomly
    const randomIndex = Math.floor(Math.random() * customMealDatabase.length);
    const template = JSON.parse(JSON.stringify(customMealDatabase[randomIndex]));
    
    // Add slightly randomized adjustments to mock realistic AI vision variability
    const variance = (Math.random() * 0.1) - 0.05; // +/- 5% variance
    
    template.calories = Math.round(template.calories * (1 + variance));
    template.macros.protein = Math.round(template.macros.protein * (1 + variance));
    template.macros.carbs = Math.round(template.macros.carbs * (1 + variance));
    template.macros.fat = Math.round(template.macros.fat * (1 + variance));
    
    // Scale items too
    template.items.forEach(item => {
        item.calories = Math.round(item.calories * (1 + variance));
        item.protein = Math.round(item.protein * (1 + variance));
        item.carbs = Math.round(item.carbs * (1 + variance));
        item.fat = Math.round(item.fat * (1 + variance));
        // Add random confidence values
        item.confidence = Math.floor(Math.random() * 10) + 88;
    });

    // Randomize general confidence
    const overallConf = Math.floor(Math.random() * 7) + 89; // 89% - 95%
    template.metrics.confidence = {
        overall: overallConf,
        calories: overallConf + Math.floor(Math.random() * 3) - 1,
        protein: overallConf + Math.floor(Math.random() * 3) - 1,
        carbs: overallConf + Math.floor(Math.random() * 4) - 2,
        fat: overallConf + Math.floor(Math.random() * 5) - 3
    };
    
    return template;
}

// Normalize confidence to object format
function normalizeConfidence(confidenceVal) {
    if (typeof confidenceVal === 'object' && confidenceVal !== null) {
        return confidenceVal;
    }
    const val = confidenceVal || 90;
    return {
        overall: val,
        calories: Math.min(100, val + 2),
        protein: val,
        carbs: Math.max(0, val - 2),
        fat: Math.max(0, val - 4)
    };
}

// AI Insights Rules Engine
function runInsightsEngine(mealsList, goals) {
    const insights = [];
    if (!mealsList || mealsList.length === 0) {
        return [
            {
                type: "info",
                text: "No meal data logged yet. Upload a photo or select a preset to analyze your nutrition habits."
            }
        ];
    }

    // Insight 1: Breakfast protein check
    const breakfastMeals = mealsList.filter(m => m.category.toLowerCase() === "breakfast");
    if (breakfastMeals.length > 0) {
        const avgBreakfastProtein = breakfastMeals.reduce((acc, curr) => acc + curr.macros.protein, 0) / breakfastMeals.length;
        if (avgBreakfastProtein < 30) {
            insights.push({
                type: "warning",
                text: `Breakfast protein averages only ${Math.round(avgBreakfastProtein)}g. Gym-goers need 30g+ at breakfast to trigger muscle protein synthesis (Leucine threshold).`
            });
        } else {
            insights.push({
                type: "success",
                text: `Excellent breakfast protein! Averages ${Math.round(avgBreakfastProtein)}g, which triggers muscle synthesis pathways immediately after waking.`
            });
        }
    }

    // Insight 2: Magnesium deficiencies (bulking recovery)
    const avgMagnesium = mealsList.reduce((acc, curr) => acc + (curr.micros.magnesium || 0), 0) / mealsList.length;
    if (avgMagnesium < 25) { // averages below 25% RDA per meal
        insights.push({
            type: "warning",
            text: "You consistently miss optimal Magnesium targets. Increase seeds, spinach, and avocado intake to improve muscle recovery and prevent cramping."
        });
    }

    // Insight 3: Protein Quality Score check
    const avgProteinQuality = mealsList.reduce((acc, curr) => acc + curr.metrics.proteinQuality, 0) / mealsList.length;
    if (avgProteinQuality > 92) {
        insights.push({
            type: "success",
            text: `High-quality EAA distribution! Your meals average ${Math.round(avgProteinQuality)}% protein quality score, offering rapid recovery bioavailability.`
        });
    } else if (avgProteinQuality < 85) {
        insights.push({
            type: "info",
            text: `Moderate protein quality average (${Math.round(avgProteinQuality)}%). Consider combining plant proteins or supplementing with whey to optimize muscle hypertrophic pathways.`
        });
    }

    // Insight 4: Glycemic index patterns
    const avgGI = mealsList.reduce((acc, curr) => acc + curr.metrics.glycemicIndex, 0) / mealsList.length;
    if (avgGI > 60) {
        insights.push({
            type: "info",
            text: `Your average Glycemic Index is high (${Math.round(avgGI)}). Best to consume these quick carbs strictly around workouts to prevent mid-day energy crashes.`
        });
    }

    // Ensure we return at least a default insights array
    if (insights.length === 0) {
        insights.push({
            type: "success",
            text: "Your daily food distribution aligns well with basic lean-bulking guidelines. Maintain consistent tracking!"
        });
    }

    return insights;
}

// AI Health Coach Suggestion Engine
function getCoachRecommendation(totals, goals) {
    const caloriesLeft = goals.kcal - totals.calories;
    const proteinLeft = goals.protein - totals.protein;
    
    // Core bulk suggestion arrays
    const proteinFoods = [
        { name: "Chicken Breast", desc: "Lean protein" },
        { name: "Greek Yogurt", desc: "Bioavailable casein" },
        { name: "Whey Protein", desc: "Fast-acting EAAs" },
        { name: "Paneer", desc: "Sustained-release protein" },
        { name: "Boiled Eggs", desc: "Premium quality standard" },
        { name: "Tofu", desc: "Soy complete protein" }
    ];

    const carbFoods = [
        { name: "Sweet Potato", desc: "Complex energy carbs" },
        { name: "Rolled Oats", desc: "Fiber-rich glycogen fuel" },
        { name: "Jasmine Rice", desc: "Clean fast digesting carbs" }
    ];

    const fatFoods = [
        { name: "Avocado", desc: "Monounsaturated fats" },
        { name: "Peanut Butter", desc: "High calorie density" },
        { name: "Salmon", desc: "Essential Omega-3 fats" }
    ];

    let message = "";
    let suggestedFoods = [];

    if (proteinLeft > 0) {
        message = `You still need **${proteinLeft}g of protein** today to hit your hypertrophic muscle-building threshold. `;
        suggestedFoods = [...proteinFoods.slice(0, 3)];

        if (caloriesLeft > 300) {
            message += `Since you are in a calorie surplus target (**${caloriesLeft} kcal remaining**), prioritize rich, whole food calorie sources.`;
            suggestedFoods.push(proteinFoods[3]); // Paneer
            suggestedFoods.push(fatFoods[1]); // Peanut Butter
        } else {
            message += `Calorie budget is tight (**${caloriesLeft} kcal remaining**). Focus strictly on high-purity protein sources.`;
            suggestedFoods.push(proteinFoods[4]); // Boiled eggs
        }
    } else {
        // Protein targets hit
        if (caloriesLeft > 0) {
            message = `Fantastic job! You've hit your daily protein synthesis target. To lock in your **bulking surplus**, you still need **${caloriesLeft} kcal** from clean carbs and fats.`;
            suggestedFoods = [...carbFoods, ...fatFoods.slice(0, 1)];
        } else {
            message = `Daily targets fully achieved! Calorie surplus locked in, protein threshold met. Get ample sleep tonight to support hypertrophy and muscle remodeling.`;
            suggestedFoods = [proteinFoods[2], fatFoods[0]]; // whey, avocado
        }
    }

    return {
        message: message,
        foods: suggestedFoods.map(f => f.name)
    };
}

// Default Meal Logging History Database (Prepopulated for Trends Page)
const defaultHistory = [
    {
        id: "log-1",
        name: "Whey Protein Oats, Banana & Peanut Butter",
        category: "Breakfast",
        calories: 650,
        macros: { protein: 42, carbs: 78, fat: 18, saturatedFat: 3, fiber: 12, sugar: 22 },
        micros: { vitA: 4, vitC: 15, vitD: 0, vitE: 12, vitK: 8, vitB: 30, iron: 20, zinc: 15, magnesium: 35, potassium: 22, calcium: 25, sodium: 210 },
        metrics: { glycemicIndex: 58, glycemicIndexLabel: "Medium GI", glycemicLoad: 45, glycemicLoadLabel: "High GL", cholesterol: 40, omega3: 0.1, omega6: 3.4, proteinQuality: 97, confidence: { overall: 97, calories: 99, protein: 97, carbs: 94, fat: 92 } },
        scorecard: { overall: 92 },
        timestamp: "2026-06-11T08:30:00+05:30",
        image: "assets/hero_food_bowl.png"
    },
    {
        id: "log-2",
        name: "Chicken Breast, Jasmine Rice & Broccoli",
        category: "Lunch",
        calories: 620,
        macros: { protein: 52, carbs: 70, fat: 8, saturatedFat: 1.5, fiber: 6, sugar: 2 },
        micros: { vitA: 12, vitC: 90, vitD: 0, vitE: 6, vitK: 85, vitB: 35, iron: 15, zinc: 20, magnesium: 25, potassium: 18, calcium: 6, sodium: 350 },
        metrics: { glycemicIndex: 55, glycemicIndexLabel: "Low GI", glycemicLoad: 38, glycemicLoadLabel: "High GL", cholesterol: 95, omega3: 0.2, omega6: 1.1, proteinQuality: 98, confidence: { overall: 94, calories: 96, protein: 94, carbs: 91, fat: 89 } },
        scorecard: { overall: 94 },
        timestamp: "2026-06-11T13:15:00+05:30",
        image: "assets/chicken_rice_broccoli.png"
    },
    // Past days prepopulated logs for trends
    {
        id: "log-p1-1",
        name: "Egg & Avocado Toast",
        category: "Breakfast",
        calories: 450,
        macros: { protein: 22, carbs: 32, fat: 26 },
        timestamp: "2026-06-10T08:10:00+05:30",
        image: ""
    },
    {
        id: "log-p1-2",
        name: "Salmon Quinoa Plate",
        category: "Lunch",
        calories: 710,
        macros: { protein: 42, carbs: 45, fat: 38 },
        timestamp: "2026-06-10T12:45:00+05:30",
        image: ""
    },
    {
        id: "log-p1-3",
        name: "Steak and Sweet Potatoes",
        category: "Dinner",
        calories: 820,
        macros: { protein: 58, carbs: 52, fat: 36 },
        timestamp: "2026-06-10T20:00:00+05:30",
        image: ""
    },
    
    // Day -2
    {
        id: "log-p2-1",
        name: "Whey Oats Bowl",
        category: "Breakfast",
        calories: 650,
        macros: { protein: 42, carbs: 78, fat: 18 },
        timestamp: "2026-06-09T08:20:00+05:30",
        image: ""
    },
    {
        id: "log-p2-2",
        name: "Chicken Bowl",
        category: "Lunch",
        calories: 620,
        macros: { protein: 52, carbs: 70, fat: 8 },
        timestamp: "2026-06-09T13:00:00+05:30",
        image: ""
    },
    {
        id: "log-p2-3",
        name: "Greek Yogurt Bowl",
        category: "Snacks",
        calories: 320,
        macros: { protein: 24, carbs: 20, fat: 6 },
        timestamp: "2026-06-09T17:30:00+05:30",
        image: ""
    },
    
    // Day -3
    {
        id: "log-p3-1",
        name: "Scrambled Eggs & Toast",
        category: "Breakfast",
        calories: 480,
        macros: { protein: 24, carbs: 30, fat: 28 },
        timestamp: "2026-06-08T08:00:00+05:30",
        image: ""
    },
    {
        id: "log-p3-2",
        name: "Chicken Rice prep",
        category: "Lunch",
        calories: 620,
        macros: { protein: 52, carbs: 70, fat: 8 },
        timestamp: "2026-06-08T13:00:00+05:30",
        image: ""
    },
    {
        id: "log-p3-3",
        name: "Salmon and Quinoa",
        category: "Dinner",
        calories: 710,
        macros: { protein: 42, carbs: 45, fat: 38 },
        timestamp: "2026-06-08T19:30:00+05:30",
        image: ""
    },
    
    // Day -4
    {
        id: "log-p4-1",
        name: "Eggs and Toast",
        category: "Breakfast",
        calories: 480,
        macros: { protein: 24, carbs: 30, fat: 28 },
        timestamp: "2026-06-07T08:15:00+05:30",
        image: ""
    },
    {
        id: "log-p4-2",
        name: "Turkey Stir fry",
        category: "Lunch",
        calories: 550,
        macros: { protein: 35, carbs: 60, fat: 12 },
        timestamp: "2026-06-07T12:50:00+05:30",
        image: ""
    },
    {
        id: "log-p4-3",
        name: "Whey shake",
        category: "Snacks",
        calories: 220,
        macros: { protein: 28, carbs: 10, fat: 4 },
        timestamp: "2026-06-07T16:00:00+05:30",
        image: ""
    },

    // Day -5
    {
        id: "log-p5-1",
        name: "Oatmeal Bowl",
        category: "Breakfast",
        calories: 550,
        macros: { protein: 18, carbs: 80, fat: 10 },
        timestamp: "2026-06-06T08:30:00+05:30",
        image: ""
    },
    {
        id: "log-p5-2",
        name: "Tuna Salad wrap",
        category: "Lunch",
        calories: 420,
        macros: { protein: 32, carbs: 30, fat: 14 },
        timestamp: "2026-06-06T13:00:00+05:30",
        image: ""
    },
    {
        id: "log-p5-3",
        name: "Sirloin Steak",
        category: "Dinner",
        calories: 780,
        macros: { protein: 46, carbs: 75, fat: 28 },
        timestamp: "2026-06-06T19:40:00+05:30",
        image: ""
    },

    // Day -6
    {
        id: "log-p6-1",
        name: "Scrambled Eggs",
        category: "Breakfast",
        calories: 380,
        macros: { protein: 20, carbs: 10, fat: 26 },
        timestamp: "2026-06-05T08:10:00+05:30",
        image: ""
    },
    {
        id: "log-p6-2",
        name: "Steak Plate",
        category: "Lunch",
        calories: 820,
        macros: { protein: 58, carbs: 52, fat: 36 },
        timestamp: "2026-06-05T13:20:00+05:30",
        image: ""
    },
    {
        id: "log-p6-3",
        name: "Greek Yogurt Prep",
        category: "Snacks",
        calories: 320,
        macros: { protein: 24, carbs: 20, fat: 6 },
        timestamp: "2026-06-05T18:00:00+05:30",
        image: ""
    }
];
