// NutriLens AI State Management
(function() {
  window.NutriLensState = {
    goals: {
      calories: 2800,
      protein: 180,
      carbs: 350,
      fat: 75
    },
    meals: [],

    init() {
      const savedGoals = localStorage.getItem('nutrilens_goals');
      if (savedGoals) {
        this.goals = JSON.parse(savedGoals);
      }

      const savedMeals = localStorage.getItem('nutrilens_meals');
      if (savedMeals) {
        this.meals = JSON.parse(savedMeals);
      } else {
        // Prepopulate with mock history if empty
        this.meals = this.getMockHistory();
        this.saveMeals();
      }
    },

    saveGoals(goals) {
      this.goals = { ...this.goals, ...goals };
      localStorage.setItem('nutrilens_goals', JSON.stringify(this.goals));
      // Dispatch an event to notify dashboard/charts
      window.dispatchEvent(new Event('nutrilens_state_changed'));
    },

    saveMeals() {
      localStorage.setItem('nutrilens_meals', JSON.stringify(this.meals));
      window.dispatchEvent(new Event('nutrilens_state_changed'));
    },

    addMeal(meal) {
      this.meals.push(meal);
      this.saveMeals();
    },

    deleteMeal(id) {
      this.meals = this.meals.filter(m => m.id !== id);
      this.saveMeals();
    },

    getTodayMeals() {
      const today = new Date().toDateString();
      return this.meals.filter(m => new Date(m.timestamp).toDateString() === today);
    },

    getTodayTotals() {
      const todayMeals = this.getTodayMeals();
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        saturatedFat: 0,
        fiber: 0,
        sugar: 0,
        vitaminA: 0,
        vitaminB: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminE: 0,
        vitaminK: 0,
        iron: 0,
        zinc: 0,
        magnesium: 0,
        potassium: 0,
        calcium: 0,
        sodium: 0
      };

      todayMeals.forEach(m => {
        const sum = m.analysis.totals;
        const micro = m.analysis.micronutrients || {};
        totals.calories += sum.calories || 0;
        totals.protein += sum.protein || 0;
        totals.carbs += sum.carbs || 0;
        totals.fat += sum.fat || 0;
        totals.saturatedFat += sum.saturatedFat || 0;
        totals.fiber += sum.fiber || 0;
        totals.sugar += sum.sugar || 0;

        // Micros
        totals.vitaminA += micro.vitaminA || 0;
        totals.vitaminB += micro.vitaminB || 0;
        totals.vitaminC += micro.vitaminC || 0;
        totals.vitaminD += micro.vitaminD || 0;
        totals.vitaminE += micro.vitaminE || 0;
        totals.vitaminK += micro.vitaminK || 0;
        totals.iron += micro.iron || 0;
        totals.zinc += micro.zinc || 0;
        totals.magnesium += micro.magnesium || 0;
        totals.potassium += micro.potassium || 0;
        totals.calcium += micro.calcium || 0;
        totals.sodium += micro.sodium || 0;
      });

      // Round all values
      Object.keys(totals).forEach(key => {
        totals[key] = Math.round(totals[key] * 10) / 10;
      });

      return totals;
    },

    getMockHistory() {
      const meals = [];
      const now = new Date();

      // Definitions of the 4 preset food analyses for simulation
      const basePresetData = {
        eggs: {
          name: 'Scrambled Eggs & Avocado Toast',
          category: 'Breakfast',
          image: 'images/eggs_toast.png',
          analysis: {
            totals: { calories: 690, protein: 32, carbs: 42, fat: 44, saturatedFat: 12, fiber: 11.2, sugar: 3.5 },
            micronutrients: { vitaminA: 450, vitaminB: 1.8, vitaminC: 15, vitaminD: 180, vitaminE: 4.2, vitaminK: 25, iron: 3.8, zinc: 2.5, magnesium: 95, potassium: 720, calcium: 110, sodium: 580 },
            confidence: { calories: 94, protein: 95, carbs: 92, fat: 91 }
          }
        },
        chicken: {
          name: 'Grilled Chicken & Brown Rice',
          category: 'Lunch',
          image: 'images/chicken_rice.png',
          analysis: {
            totals: { calories: 720, protein: 65, carbs: 85, fat: 12, saturatedFat: 2.5, fiber: 6.8, sugar: 1.2 },
            micronutrients: { vitaminA: 120, vitaminB: 3.2, vitaminC: 8, vitaminD: 0, vitaminE: 1.8, vitaminK: 12, iron: 4.2, zinc: 3.8, magnesium: 120, potassium: 850, calcium: 60, sodium: 450 },
            confidence: { calories: 95, protein: 96, carbs: 90, fat: 88 }
          }
        },
        shake: {
          name: 'Bulking Protein Shake',
          category: 'Snacks',
          image: 'images/protein_shake.png',
          analysis: {
            totals: { calories: 480, protein: 40, carbs: 55, fat: 10, saturatedFat: 3.0, fiber: 4.5, sugar: 22 },
            micronutrients: { vitaminA: 300, vitaminB: 1.2, vitaminC: 5, vitaminD: 100, vitaminE: 2.5, vitaminK: 5, iron: 1.5, zinc: 1.2, magnesium: 80, potassium: 520, calcium: 350, sodium: 280 },
            confidence: { calories: 98, protein: 98, carbs: 95, fat: 93 }
          }
        },
        salmon: {
          name: 'Seared Salmon & Sweet Potato',
          category: 'Dinner',
          image: 'images/salmon_sweetpotato.png',
          analysis: {
            totals: { calories: 880, protein: 52, carbs: 68, fat: 42, saturatedFat: 8.0, fiber: 9.5, sugar: 12 },
            micronutrients: { vitaminA: 14000, vitaminB: 4.8, vitaminC: 38, vitaminD: 650, vitaminE: 6.5, vitaminK: 48, iron: 2.9, zinc: 1.8, magnesium: 140, potassium: 980, calcium: 90, sodium: 620 },
            confidence: { calories: 92, protein: 94, carbs: 91, fat: 90 }
          }
        }
      };

      // Create meals for past 7 days
      for (let i = 7; i >= 1; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        // Daily calorie factor fluctuation to make mock logs look organic
        const dayFactor = 0.88 + Math.random() * 0.24; // 88% to 112%

        // Timestamps
        const bTime = new Date(date); bTime.setHours(8, 30, 0);
        const lTime = new Date(date); lTime.setHours(13, 15, 0);
        const sTime = new Date(date); sTime.setHours(16, 45, 0);
        const dTime = new Date(date); dTime.setHours(20, 0, 0);

        meals.push({
          id: `mock-egg-${i}`,
          name: basePresetData.eggs.name,
          category: 'Breakfast',
          image: basePresetData.eggs.image,
          timestamp: bTime.toISOString(),
          analysis: scaleAnalysis(basePresetData.eggs.analysis, dayFactor)
        });

        meals.push({
          id: `mock-chicken-${i}`,
          name: basePresetData.chicken.name,
          category: 'Lunch',
          image: basePresetData.chicken.image,
          timestamp: lTime.toISOString(),
          analysis: scaleAnalysis(basePresetData.chicken.analysis, dayFactor)
        });

        meals.push({
          id: `mock-shake-${i}`,
          name: basePresetData.shake.name,
          category: 'Snacks',
          image: basePresetData.shake.image,
          timestamp: sTime.toISOString(),
          analysis: scaleAnalysis(basePresetData.shake.analysis, dayFactor)
        });

        meals.push({
          id: `mock-salmon-${i}`,
          name: basePresetData.salmon.name,
          category: 'Dinner',
          image: basePresetData.salmon.image,
          timestamp: dTime.toISOString(),
          analysis: scaleAnalysis(basePresetData.salmon.analysis, dayFactor)
        });
      }

      return meals;
    }
  };

  function scaleAnalysis(baseAnalysis, factor) {
    const scaled = JSON.parse(JSON.stringify(baseAnalysis));
    
    // Scale macros and key totals
    Object.keys(scaled.totals).forEach(key => {
      scaled.totals[key] = Math.round(scaled.totals[key] * factor * 10) / 10;
    });

    // Scale micros
    Object.keys(scaled.micronutrients).forEach(key => {
      scaled.micronutrients[key] = Math.round(scaled.micronutrients[key] * factor * 10) / 10;
    });

    return scaled;
  }
})();
