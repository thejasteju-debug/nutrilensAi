// NutriLens AI Health Coach & Insights Engine
(function() {
  window.NutriLensCoach = {
    // Generates real-time muscle-building recommendations on the Dashboard
    getCoachingAdvice(goals, todayTotals) {
      const remainingProtein = Math.max(0, goals.protein - todayTotals.protein);
      const remainingCalories = Math.max(0, goals.calories - todayTotals.calories);
      
      const advice = {
        proteinNeeded: remainingProtein,
        caloriesNeeded: remainingCalories,
        mainTip: '',
        suggestions: []
      };

      if (remainingProtein > 0) {
        advice.mainTip = `You still need <strong>${Math.round(remainingProtein)}g</strong> of protein today to sustain muscle protein synthesis.`;
        
        if (remainingProtein > 40) {
          advice.suggestions = [
            { food: 'Chicken Breast (200g)', protein: '62g', carbs: '0g', fat: '7g', reason: 'High purity lean source, perfect for heavy deficits.' },
            { food: 'Whey Protein (1.5 scoops)', protein: '36g', carbs: '2g', fat: '1g', reason: 'Rapid absorption, ideal post-workout.' },
            { food: 'Liquid Egg Whites (250ml)', protein: '28g', carbs: '2g', fat: '0g', reason: 'Pure protein, easy to scramble or blend.' }
          ];
        } else {
          advice.suggestions = [
            { food: 'Greek Yogurt (200g)', protein: '20g', carbs: '8g', fat: '4g', reason: 'Rich in casein, great pre-bed source.' },
            { food: 'Whole Boiled Eggs (3 eggs)', protein: '18g', carbs: '1.5g', fat: '15g', reason: 'High biological value, rich in healthy fats.' },
            { food: 'Cottage Cheese / Paneer (150g)', protein: '18g', carbs: '5g', fat: '14g', reason: 'Slow-digesting protein to keep you anabolic overnight.' }
          ];
        }
      } else if (remainingCalories > 0) {
        advice.mainTip = `Protein target achieved! You still need <strong>${Math.round(remainingCalories)} kcal</strong> to hit your bulking calorie surplus.`;
        advice.suggestions = [
          { food: 'Organic Peanut Butter (2 tbsp)', protein: '8g', carbs: '6g', fat: '16g', reason: 'Calorie-dense, easy to add to shakes or toast.' },
          { food: 'Mixed Almonds & Walnuts (50g)', protein: '10g', carbs: '10g', fat: '26g', reason: 'Packed with essential omega fatty acids.' },
          { food: 'Avocado (1 whole)', protein: '3g', carbs: '13g', fat: '22g', reason: 'Healthy monounsaturated fats to boost testosterone.' }
        ];
      } else {
        advice.mainTip = "Outstanding! You've met all your bulking targets for today. You are fully anabolic!";
        advice.suggestions = [
          { food: 'Water & Electrolytes', protein: '0g', carbs: '0g', fat: '0g', reason: 'Ensure hydration is optimal for cellular hypertrophy.' },
          { food: 'Active Sleep / Rest', protein: '0g', carbs: '0g', fat: '0g', reason: 'Aim for 8 hours to maximize growth hormone release.' }
        ];
      }

      return advice;
    },

    // Generates deeper text insights based on history (Insights Tab)
    generateInsights(meals, goals) {
      if (!meals || meals.length === 0) {
        return [
          { type: 'neutral', text: 'Upload your first meal photo to start generating personal nutrition insights.' }
        ];
      }

      const insights = [];
      const now = new Date();
      const last7DaysMeals = meals.filter(m => {
        const mealDate = new Date(m.timestamp);
        const diffTime = Math.abs(now - mealDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      if (last7DaysMeals.length === 0) {
        return [
          { type: 'neutral', text: 'No meals logged in the last 7 days. Log your meals to populate trends.' }
        ];
      }

      // Group by date to calculate daily totals
      const dailyTotals = {};
      last7DaysMeals.forEach(m => {
        const dateStr = new Date(m.timestamp).toDateString();
        if (!dailyTotals[dateStr]) {
          dailyTotals[dateStr] = { calories: 0, protein: 0, magnesium: 0 };
        }
        dailyTotals[dateStr].calories += m.analysis.totals.calories || 0;
        dailyTotals[dateStr].protein += m.analysis.totals.protein || 0;
        if (m.analysis.micronutrients) {
          dailyTotals[dateStr].magnesium += m.analysis.micronutrients.magnesium || 0;
        }
      });

      const dates = Object.keys(dailyTotals);
      const totalDays = dates.length;

      let avgProtein = 0;
      let avgCalories = 0;
      let avgMagnesium = 0;

      dates.forEach(d => {
        avgProtein += dailyTotals[d].protein;
        avgCalories += dailyTotals[d].calories;
        avgMagnesium += dailyTotals[d].magnesium;
      });

      avgProtein = Math.round(avgProtein / totalDays);
      avgCalories = Math.round(avgCalories / totalDays);
      avgMagnesium = Math.round(avgMagnesium / totalDays);

      // Check 1: Protein consistency
      let proteinHitCount = 0;
      dates.forEach(d => {
        if (dailyTotals[d].protein >= goals.protein) {
          proteinHitCount++;
        }
      });

      if (proteinHitCount >= 5) {
        insights.push({
          type: 'success',
          category: 'Consistency',
          title: 'Optimal Protein Consistency',
          text: `You hit your protein goal of ${goals.protein}g on ${proteinHitCount} out of the last ${totalDays} tracked days. This consistency is perfect for muscle hypertrophy.`
        });
      } else {
        insights.push({
          type: 'warning',
          category: 'Consistency',
          title: 'Protein Consistency Gaps',
          text: `You met your protein targets on only ${proteinHitCount} of the last ${totalDays} days. Try planning snacks like shakes or Greek yogurt to avoid falling short.`
        });
      }

      // Check 2: Breakfast Protein Distribution
      const breakfastMeals = last7DaysMeals.filter(m => m.category === 'Breakfast');
      let totalBreakfastProtein = 0;
      breakfastMeals.forEach(m => {
        totalBreakfastProtein += m.analysis.totals.protein || 0;
      });
      const avgBreakfastProtein = breakfastMeals.length > 0 ? Math.round(totalBreakfastProtein / breakfastMeals.length) : 0;

      if (avgBreakfastProtein < 30) {
        insights.push({
          type: 'warning',
          category: 'Protein Distribution',
          title: 'Insufficient Protein at Breakfast',
          text: `Your average breakfast protein is just ${avgBreakfastProtein}g. Gym-goers should target at least 30g-40g protein at breakfast to stimulate muscle protein synthesis (MPS) early in the day.`
        });
      } else {
        insights.push({
          type: 'success',
          category: 'Protein Distribution',
          title: 'Excellent Breakfast Protein Intake',
          text: `Your breakfast protein averages ${avgBreakfastProtein}g. Consuming 30g+ at breakfast triggers muscle protein synthesis and supports muscle retention.`
        });
      }

      // Check 3: Micronutrient Deficiencies (specifically Magnesium for recovery)
      // Standard target is 400mg
      const targetMagnesium = 400;
      if (avgMagnesium < 350) {
        insights.push({
          type: 'warning',
          category: 'Micronutrients',
          title: 'Consistent Magnesium Deficiencies',
          text: `Your average daily magnesium is ${avgMagnesium}mg, falling below the optimal 400mg target for active adults. Magnesium is crucial for muscle relaxation, ATP energy production, and sleep. Add seeds, spinach, or almond butter.`
        });
      } else {
        insights.push({
          type: 'success',
          category: 'Micronutrients',
          title: 'Magnesium Levels Satisfied',
          text: `You average ${avgMagnesium}mg magnesium daily. This is excellent for preventing muscle cramps, accelerating recovery, and improving sleep quality.`
        });
      }

      // Check 4: Bulking Calorie Surplus
      if (avgCalories < goals.calories - 100) {
        insights.push({
          type: 'warning',
          category: 'Caloric Intake',
          title: 'Sub-Optimal Caloric Surplus',
          text: `Your average intake is ${avgCalories} kcal, below your bulking goal of ${goals.calories} kcal. If you are struggling to build mass, your body needs a slight caloric surplus. Increase healthy fats like avocado or extra virgin olive oil.`
        });
      } else if (avgCalories > goals.calories + 400) {
        insights.push({
          type: 'warning',
          category: 'Caloric Intake',
          title: 'High Calorie Surplus (Dirty Bulking)',
          text: `Your average intake is ${avgCalories} kcal, significantly exceeding your goal of ${goals.calories} kcal. Excess calories above a +300-500 surplus may lead to accelerated fat gain rather than additional muscle tissue.`
        });
      } else {
        insights.push({
          type: 'success',
          category: 'Caloric Intake',
          title: 'Perfect Bulking Surplus',
          text: `Your average calorie intake is ${avgCalories} kcal, aligning perfectly with your bulking goals. You are gaining clean mass without excessive fat storage.`
        });
      }

      return insights;
    }
  };
})();
