// NutriLens AI Vision Simulation Engine
(function() {
  const PRESET_ANALYSES = {
    eggs: {
      name: 'Scrambled Eggs & Avocado Toast',
      category: 'Breakfast',
      image: 'images/eggs_toast.png',
      totals: { calories: 690, protein: 32, carbs: 42, fat: 44, saturatedFat: 12, fiber: 11.2, sugar: 3.5, sodium: 580, magnesium: 95 },
      confidence: { overall: 93, foodRecognition: 96, portionEstimation: 91, microAnalysis: 88 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Scrambled Eggs', weight: 180, calories: 240, protein: 18, carbs: 1.2, fat: 18, cooking: 'Pan-Scrambled', sauce: 'None', hidden: 'Butter (5g)' },
        { name: 'Whole Wheat Toast', weight: 60, calories: 160, protein: 7, carbs: 28, fat: 2, cooking: 'Toasted', sauce: 'None', hidden: 'None' },
        { name: 'Sliced Avocado', weight: 75, calories: 120, protein: 1.5, carbs: 6.5, fat: 11, cooking: 'Raw Sliced', sauce: 'Lime Juice & Salt', hidden: 'None' },
        { name: 'Olive Oil Drizzle', weight: 8, calories: 72, protein: 0, carbs: 0, fat: 8, cooking: 'Cold-pressed raw', sauce: 'None', hidden: 'Brushed on toast' }
      ],
      micronutrients: {
        vitaminA: 450, // mcg
        vitaminB: 1.8,  // mcg (B12)
        vitaminC: 15,   // mg
        vitaminD: 180,  // IU
        vitaminE: 4.2,  // mg
        vitaminK: 25,   // mcg
        iron: 3.8,      // mg
        zinc: 2.5,      // mg
        magnesium: 95,  // mg
        potassium: 720, // mg
        calcium: 110,   // mg
        sodium: 580     // mg
      },
      aminoAcids: {
        leucine: 2.8,
        isoleucine: 1.8,
        valine: 2.0,
        lysine: 2.4,
        methionine: 1.0,
        threonine: 1.5,
        tryptophan: 0.4,
        histidine: 0.9,
        phenylalanine: 1.7
      },
      proteinQualityScore: 98,
      glycemicIndex: 35, // Low
      glycemicLoad: 6.5, // Low
      cholesterol: 555, // mg
      omega3: 0.6, // g
      omega6: 3.2, // g
      scores: {
        overall: 88,
        proteinQuality: 98,
        micronutrientDensity: 85,
        satiety: 90,
        muscleBuilding: 85,
        weightLoss: 60,
        heartHealth: 70
      }
    },
    chicken: {
      name: 'Grilled Chicken & Brown Rice',
      category: 'Lunch',
      image: 'images/chicken_rice.png',
      totals: { calories: 720, protein: 65, carbs: 85, fat: 12, saturatedFat: 2.5, fiber: 6.8, sugar: 1.2, sodium: 450, magnesium: 120 },
      confidence: { overall: 95, foodRecognition: 98, portionEstimation: 94, microAnalysis: 92 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Grilled Chicken Breast', weight: 200, calories: 330, protein: 62, carbs: 0, fat: 7, cooking: 'Flame Grilled', sauce: 'Low-sodium soy marinade', hidden: 'Olive oil brushing (5g)' },
        { name: 'Steamed Brown Rice', weight: 150, calories: 165, protein: 3.8, carbs: 35, fat: 1.2, cooking: 'Boiled/Steamed', sauce: 'None', hidden: 'None' },
        { name: 'Steamed Broccoli', weight: 100, calories: 35, protein: 2.5, carbs: 7, fat: 0.4, cooking: 'Lightly Steamed', sauce: 'Garlic herb shake', hidden: 'None' },
        { name: 'Sliced Avocado', weight: 50, calories: 80, protein: 1.0, carbs: 4.3, fat: 7.3, cooking: 'Raw Sliced', sauce: 'None', hidden: 'None' }
      ],
      micronutrients: {
        vitaminA: 120,
        vitaminB: 3.2,
        vitaminC: 80,
        vitaminD: 0,
        vitaminE: 1.8,
        vitaminK: 120,
        iron: 4.2,
        zinc: 3.8,
        magnesium: 120,
        potassium: 850,
        calcium: 60,
        sodium: 450
      },
      aminoAcids: {
        leucine: 5.6,
        isoleucine: 3.4,
        valine: 3.5,
        lysine: 5.2,
        methionine: 1.8,
        threonine: 2.8,
        tryptophan: 0.8,
        histidine: 1.9,
        phenylalanine: 2.6
      },
      proteinQualityScore: 100,
      glycemicIndex: 45,
      glycemicLoad: 15.5,
      cholesterol: 170,
      omega3: 0.3,
      omega6: 2.2,
      scores: {
        overall: 96,
        proteinQuality: 100,
        micronutrientDensity: 90,
        satiety: 95,
        muscleBuilding: 100,
        weightLoss: 85,
        heartHealth: 92
      }
    },
    shake: {
      name: 'Bulking Protein Shake',
      category: 'Snacks',
      image: 'images/protein_shake.png',
      totals: { calories: 480, protein: 40, carbs: 55, fat: 10, saturatedFat: 3.0, fiber: 4.5, sugar: 22, sodium: 280, magnesium: 80 },
      confidence: { overall: 98, foodRecognition: 99, portionEstimation: 97, microAnalysis: 95 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Whey Protein Isolate', weight: 30, calories: 120, protein: 25, carbs: 2, fat: 1, cooking: 'Blended powder', sauce: 'None', hidden: 'None' },
        { name: 'Skim Milk', weight: 250, calories: 90, protein: 9, carbs: 12, fat: 0, cooking: 'Raw liquid', sauce: 'None', hidden: 'None' },
        { name: 'Cavendish Banana', weight: 118, calories: 105, protein: 1.3, carbs: 27, fat: 0.3, cooking: 'Raw peeled', sauce: 'None', hidden: 'None' },
        { name: 'Rolled Oats', weight: 30, calories: 115, protein: 4, carbs: 20, fat: 2, cooking: 'Blended raw', sauce: 'None', hidden: 'None' },
        { name: 'Organic Peanut Butter', weight: 10, calories: 50, protein: 1.7, carbs: 2, fat: 4.2, cooking: 'Raw paste', sauce: 'None', hidden: 'None' }
      ],
      micronutrients: {
        vitaminA: 300,
        vitaminB: 1.2,
        vitaminC: 5,
        vitaminD: 100,
        vitaminE: 2.5,
        vitaminK: 5,
        iron: 1.5,
        zinc: 1.2,
        magnesium: 80,
        potassium: 520,
        calcium: 350,
        sodium: 280
      },
      aminoAcids: {
        leucine: 4.8,
        isoleucine: 2.8,
        valine: 2.6,
        lysine: 3.8,
        methionine: 1.1,
        threonine: 2.5,
        tryptophan: 0.7,
        histidine: 0.9,
        phenylalanine: 1.8
      },
      proteinQualityScore: 96,
      glycemicIndex: 52,
      glycemicLoad: 18.2,
      cholesterol: 15,
      omega3: 0.1,
      omega6: 1.5,
      scores: {
        overall: 82,
        proteinQuality: 96,
        micronutrientDensity: 75,
        satiety: 78,
        muscleBuilding: 95,
        weightLoss: 50,
        heartHealth: 80
      }
    },
    salmon: {
      name: 'Seared Salmon & Sweet Potato',
      category: 'Dinner',
      image: 'images/salmon_sweetpotato.png',
      totals: { calories: 880, protein: 52, carbs: 68, fat: 42, saturatedFat: 8.0, fiber: 9.5, sugar: 12, sodium: 620, magnesium: 140 },
      confidence: { overall: 94, foodRecognition: 97, portionEstimation: 92, microAnalysis: 91 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Atlantic Salmon Filet', weight: 200, calories: 410, protein: 44, carbs: 0, fat: 25, cooking: 'Pan-Seared with skin', sauce: 'Lemon dill glaze', hidden: 'Butter glaze coating (5g)' },
        { name: 'Baked Sweet Potato', weight: 150, calories: 135, protein: 3, carbs: 31, fat: 0.2, cooking: 'Oven Roasted', sauce: 'None', hidden: 'Coconut oil spray (3g)' },
        { name: 'Grilled Asparagus', weight: 100, calories: 20, protein: 2.2, carbs: 3.7, fat: 0.2, cooking: 'Char Grilled', sauce: 'Lemon juice & olive spray', hidden: 'None' },
        { name: 'Olive Oil & Butter Glaze', weight: 15, calories: 125, protein: 0, carbs: 0, fat: 14, cooking: 'Heated sauce', sauce: 'Garlic Butter Herb', hidden: 'Basted during sear' }
      ],
      micronutrients: {
        vitaminA: 14000,
        vitaminB: 4.8,
        vitaminC: 38,
        vitaminD: 650,
        vitaminE: 6.5,
        vitaminK: 48,
        iron: 2.9,
        zinc: 1.8,
        magnesium: 140,
        potassium: 980,
        calcium: 90,
        sodium: 620
      },
      aminoAcids: {
        leucine: 4.5,
        isoleucine: 2.8,
        valine: 2.9,
        lysine: 4.2,
        methionine: 1.5,
        threonine: 2.4,
        tryptophan: 0.6,
        histidine: 1.4,
        phenylalanine: 2.1
      },
      proteinQualityScore: 99,
      glycemicIndex: 48,
      glycemicLoad: 14.8,
      cholesterol: 120,
      omega3: 4.2, // Incredibly high omega 3
      omega6: 1.8,
      scores: {
        overall: 94,
        proteinQuality: 99,
        micronutrientDensity: 95,
        satiety: 88,
        muscleBuilding: 92,
        weightLoss: 55,
        heartHealth: 98
      }
    }
  };

  const CUSTOM_MEAL_TEMPLATES = [
    {
      name: 'Flame-Grilled Ribeye & Garlic Mash',
      category: 'Dinner',
      totals: { calories: 950, protein: 58, carbs: 48, fat: 52, saturatedFat: 18, fiber: 4.5, sugar: 4.0, sodium: 720, magnesium: 105 },
      confidence: { overall: 89, foodRecognition: 94, portionEstimation: 86, microAnalysis: 83 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Ribeye Steak (Choice)', weight: 250, calories: 680, protein: 54, carbs: 0, fat: 48, cooking: 'Cast-iron Seared', sauce: 'Garlic butter baste', hidden: 'Melted butter (10g)' },
        { name: 'Garlic Mashed Potatoes', weight: 180, calories: 210, protein: 4, carbs: 40, fat: 4, cooking: 'Boiled and mashed', sauce: 'None', hidden: 'Heavy cream & butter' },
        { name: 'Sautéed Asparagus', weight: 80, calories: 60, protein: 1.5, carbs: 4, fat: 4.5, cooking: 'Pan sautéed', sauce: 'Lemon drizzle', hidden: 'Olive oil (5g)' }
      ],
      micronutrients: { vitaminA: 650, vitaminB: 4.2, vitaminC: 12, vitaminD: 40, vitaminE: 2.8, vitaminK: 32, iron: 5.2, zinc: 8.5, magnesium: 105, potassium: 910, calcium: 80, sodium: 720 },
      aminoAcids: { leucine: 4.8, isoleucine: 2.9, valine: 3.1, lysine: 4.5, methionine: 1.4, threonine: 2.3, tryptophan: 0.6, histidine: 1.8, phenylalanine: 2.4 },
      proteinQualityScore: 98, glycemicIndex: 65, glycemicLoad: 26, cholesterol: 195, omega3: 0.4, omega6: 2.8,
      scores: { overall: 78, proteinQuality: 98, micronutrientDensity: 70, satiety: 92, muscleBuilding: 95, weightLoss: 40, heartHealth: 55 }
    },
    {
      name: 'Tuna Salad & Quinoa Bowl',
      category: 'Lunch',
      totals: { calories: 580, protein: 45, carbs: 62, fat: 14, saturatedFat: 2.0, fiber: 8.5, sugar: 3.2, sodium: 680, magnesium: 130 },
      confidence: { overall: 91, foodRecognition: 95, portionEstimation: 89, microAnalysis: 87 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Yellowfin Canned Tuna', weight: 150, calories: 195, protein: 39, carbs: 0, fat: 3, cooking: 'Canned/Drained', sauce: 'Olive oil dressing', hidden: 'None' },
        { name: 'Organic Red Quinoa', weight: 130, calories: 160, protein: 5.5, carbs: 32, fat: 2.5, cooking: 'Simmered', sauce: 'None', hidden: 'None' },
        { name: 'Mixed Greens & Cucumber', weight: 100, calories: 25, protein: 0.5, carbs: 4.5, fat: 0.1, cooking: 'Raw tossed', sauce: 'Lemon vinaigrette', hidden: 'None' },
        { name: 'Avocado & Hemp Seeds', weight: 40, calories: 120, protein: 2.5, carbs: 3, fat: 10.5, cooking: 'Raw sprinkled', sauce: 'None', hidden: 'None' }
      ],
      micronutrients: { vitaminA: 1800, vitaminB: 3.5, vitaminC: 28, vitaminD: 80, vitaminE: 3.4, vitaminK: 65, iron: 3.9, zinc: 2.8, magnesium: 130, potassium: 740, calcium: 70, sodium: 680 },
      aminoAcids: { leucine: 3.8, isoleucine: 2.2, valine: 2.4, lysine: 3.2, methionine: 1.1, threonine: 1.9, tryptophan: 0.5, histidine: 1.2, phenylalanine: 1.8 },
      proteinQualityScore: 97, glycemicIndex: 40, glycemicLoad: 12.8, cholesterol: 45, omega3: 1.9, omega6: 1.2,
      scores: { overall: 91, proteinQuality: 97, micronutrientDensity: 88, satiety: 85, muscleBuilding: 90, weightLoss: 75, heartHealth: 92 }
    },
    {
      name: 'Greek Yogurt & Mixed Berry Bowl',
      category: 'Breakfast',
      totals: { calories: 390, protein: 26, carbs: 38, fat: 8, saturatedFat: 4.5, fiber: 5.2, sugar: 24, sodium: 120, magnesium: 70 },
      confidence: { overall: 94, foodRecognition: 97, portionEstimation: 91, microAnalysis: 90 },
      source: 'USDA FoodData Central / NutriLens Vision Database v2.1',
      items: [
        { name: 'Non-Fat Greek Yogurt', weight: 200, calories: 150, protein: 20, carbs: 8, fat: 4, cooking: 'Raw cold', sauce: 'None', hidden: 'Honey sweetener' },
        { name: 'Mixed Berries (Blue/Raspberry)', weight: 100, calories: 50, protein: 1.0, carbs: 12, fat: 0.3, cooking: 'Raw fresh', sauce: 'None', hidden: 'None' },
        { name: 'Whole Grain Granola', weight: 30, calories: 130, protein: 3.5, carbs: 16, fat: 3.2, cooking: 'Baked clusters', sauce: 'None', hidden: 'None' },
        { name: 'Chia Seeds', weight: 8, calories: 40, protein: 1.5, carbs: 2, fat: 2.5, cooking: 'Raw sprinkled', sauce: 'None', hidden: 'None' }
      ],
      micronutrients: { vitaminA: 200, vitaminB: 1.4, vitaminC: 45, vitaminD: 60, vitaminE: 1.5, vitaminK: 8, iron: 1.2, zinc: 1.4, magnesium: 70, potassium: 480, calcium: 240, sodium: 120 },
      aminoAcids: { leucine: 2.1, isoleucine: 1.3, valine: 1.4, lysine: 1.8, methionine: 0.5, threonine: 1.1, tryptophan: 0.3, histidine: 0.6, phenylalanine: 1.0 },
      proteinQualityScore: 92, glycemicIndex: 42, glycemicLoad: 16.0, cholesterol: 15, omega3: 0.9, omega6: 0.5,
      scores: { overall: 89, proteinQuality: 92, micronutrientDensity: 82, satiety: 80, muscleBuilding: 80, weightLoss: 75, heartHealth: 88 }
    }
  ];

  window.NutriLensAnalyzer = {
    // Simulates an AI image recognition scanning process (takes 2.5 seconds)
    analyzeImage(imageFile, isPreset = false, presetKey = '') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let result;
            if (isPreset && PRESET_ANALYSES[presetKey]) {
              // Deep clone preset data
              result = JSON.parse(JSON.stringify(PRESET_ANALYSES[presetKey]));
            } else {
              // Select a random custom template to simulate custom upload analysis
              const randomIndex = Math.floor(Math.random() * CUSTOM_MEAL_TEMPLATES.length);
              result = JSON.parse(JSON.stringify(CUSTOM_MEAL_TEMPLATES[randomIndex]));
              // If it's a custom uploaded file, set a temporary blob URL as the image
              if (imageFile instanceof File) {
                result.image = URL.createObjectURL(imageFile);
              } else {
                result.image = imageFile; // String path or fallback
              }
            }

            // Always add a real timestamp
            result.timestamp = new Date().toISOString();
            result.id = 'meal-' + Date.now();

            resolve(result);
          } catch (e) {
            reject(e);
          }
        }, 2500); // 2.5 seconds for a realistic scanning experience
      });
    },

    getPresets() {
      return PRESET_ANALYSES;
    }
  };
})();
