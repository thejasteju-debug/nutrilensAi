// NutriLens AI Main Shell Controller
(function() {
  let currentAnalysis = null;
  const CIRCUMFERENCE = 314.16; // circumference of progress rings (radius = 50)

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize state
    window.NutriLensState.init();
    
    // Bind navigation links
    setupNavigation();

    // Bind file upload events
    setupUpload();

    // Bind dashboard and goals events
    setupGoalsForm();

    // Bind state changed listener to re-render
    window.addEventListener('nutrilens_state_changed', () => {
      renderDashboard();
      renderHistory();
      renderInsights();
    });

    // Populate default forms with state
    populateGoalsForm();

    // Initial render of sections
    renderDashboard();
    renderHistory();
    renderInsights();
  });

  // 1. Navigation / SPA Routing
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show target section
        sections.forEach(s => s.classList.remove('active'));
        const targetSec = document.getElementById(targetId);
        if (targetSec) {
          targetSec.classList.add('active');
        }

        // Trigger updates depending on view
        if (targetId === 'dashboard-view') {
          renderDashboard();
        } else if (targetId === 'history-view') {
          renderHistory();
        } else if (targetId === 'insights-view') {
          renderInsights();
        }
      });
    });

    // Logo click goes Home
    document.getElementById('nav-logo').addEventListener('click', () => {
      navigateTo('home-view');
    });

    // Back to home button in report view
    document.getElementById('back-to-home-btn').addEventListener('click', () => {
      navigateTo('home-view');
    });

    // Tabs toggle inside report view
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabId = btn.getAttribute('data-tab');
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  function navigateTo(sectionId) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Update active nav-link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 2. Upload, Preset Cards, and Scanning Flow
  function setupUpload() {
    const fileInput = document.getElementById('file-upload-input');
    const uploadCta = document.getElementById('upload-cta-btn');
    const dropZone = document.getElementById('drop-zone');

    uploadCta.addEventListener('click', () => fileInput.click());

    // File selection
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processUploadedFile(e.target.files[0]);
      }
    });

    // Drag and drop
    dropZone.addEventListener('click', () => fileInput.click());
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        processUploadedFile(files[0]);
      }
    });

    // Preset cards
    const presetCards = document.querySelectorAll('.preset-card');
    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        const presetKey = card.getAttribute('data-preset');
        const imgPath = card.querySelector('img').getAttribute('src');
        
        // Move to scanning view
        navigateToScanning(imgPath);
        
        // Analyze preset
        window.NutriLensAnalyzer.analyzeImage(imgPath, true, presetKey)
          .then(result => {
            currentAnalysis = result;
            showReport(result);
          })
          .catch(err => {
            console.error(err);
            alert("Error analyzing preset. Please try again.");
            navigateTo('home-view');
          });
      });
    });
  }

  function processUploadedFile(file) {
    const previewUrl = URL.createObjectURL(file);
    navigateToScanning(previewUrl);

    window.NutriLensAnalyzer.analyzeImage(file, false, '')
      .then(result => {
        currentAnalysis = result;
        showReport(result);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to analyze image file. Try again.");
        navigateTo('home-view');
      });
  }

  function navigateToScanning(imgUrl) {
    const preview = document.getElementById('scan-preview');
    preview.src = imgUrl;

    const logText = document.getElementById('scan-log-text');
    const logs = [
      { delay: 0, text: 'Initializing food detection engine...' },
      { delay: 500, text: 'Scanning shape contours and volume...' },
      { delay: 1000, text: 'Detecting main food items...' },
      { delay: 1500, text: 'Analyzing cooking oils, fats, and sauces...' },
      { delay: 2000, text: 'Resolving micro-nutrition targets...' },
      { delay: 2300, text: 'Finalizing USDA data attribution...' }
    ];

    logs.forEach(log => {
      setTimeout(() => {
        if (document.getElementById('scanning-view').classList.contains('active')) {
          logText.innerText = log.text;
        }
      }, log.delay);
    });

    navigateTo('scanning-view');
  }

  // 3. Report View Populate
  function showReport(analysis) {
    navigateTo('report-view');

    // Fill basic details
    document.getElementById('report-food-img').src = analysis.image;
    document.getElementById('report-title').innerText = analysis.name;
    document.getElementById('report-badge-category').innerText = analysis.category;
    document.getElementById('report-timestamp').innerText = new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('report-source-text').innerText = analysis.source;

    // Fill main macro values
    document.getElementById('macro-val-calories').innerText = Math.round(analysis.totals.calories);
    document.getElementById('macro-val-protein').innerText = Math.round(analysis.totals.protein) + 'g';
    document.getElementById('macro-val-carbs').innerText = Math.round(analysis.totals.carbs) + 'g';
    document.getElementById('macro-val-fats').innerText = Math.round(analysis.totals.fat) + 'g';

    // Fill confidence strings
    document.getElementById('macro-conf-calories').innerText = (analysis.confidence.overall || 90) + '% confidence';
    document.getElementById('macro-conf-protein').innerText = (analysis.confidence.proteinEstimation || 92) + '% confidence';
    document.getElementById('macro-conf-carbs').innerText = (analysis.confidence.portionEstimation || 88) + '% confidence';
    document.getElementById('macro-conf-fats').innerText = (analysis.confidence.portionEstimation || 88) + '% confidence';

    // Populate Detections Table
    const itemsList = document.getElementById('report-items-list');
    itemsList.innerHTML = '';
    
    analysis.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'food-row';
      row.innerHTML = `
        <div class="food-name-weight">
          <span class="food-name">${item.name}</span>
          <span class="food-weight">${item.weight}g</span>
        </div>
        <div class="food-cooking-sauce">
          Cooking: ${item.cooking}<br>
          Sauce: ${item.sauce} ${item.hidden !== 'None' ? `• Hidden: ${item.hidden}` : ''}
        </div>
        <div class="food-item-macros">
          <strong>${Math.round(item.calories)} kcal</strong><br>
          <span class="food-item-p">P: ${Math.round(item.protein)}g</span> • C: ${Math.round(item.carbs)}g • F: ${Math.round(item.fat)}g
        </div>
      `;
      itemsList.appendChild(row);
    });

    // Populate Scorecard
    document.getElementById('score-val-overall').innerText = analysis.scores.overall;
    
    const scorecardCategories = ['proteinQuality', 'muscleBuilding', 'micronutrientDensity', 'satiety', 'weightLoss', 'heartHealth'];
    const scorecardLabelIds = {
      proteinQuality: 'protein',
      muscleBuilding: 'muscle',
      micronutrientDensity: 'micro',
      satiety: 'satiety',
      weightLoss: 'weightloss',
      heartHealth: 'heart'
    };

    scorecardCategories.forEach(cat => {
      const score = analysis.scores[cat];
      const targetId = scorecardLabelIds[cat];
      document.getElementById(`score-val-${targetId}`).innerText = score + '%';
      document.getElementById(`score-bar-${targetId}`).style.width = score + '%';
    });

    // Populate Micronutrient Tab
    const microGrid = document.getElementById('report-micro-grid');
    microGrid.innerHTML = '';

    const microLabels = {
      vitaminA: { label: 'Vitamin A', unit: 'mcg' },
      vitaminB: { label: 'Vitamin B12', unit: 'mcg' },
      vitaminC: { label: 'Vitamin C', unit: 'mg' },
      vitaminD: { label: 'Vitamin D', unit: 'IU' },
      vitaminE: { label: 'Vitamin E', unit: 'mg' },
      vitaminK: { label: 'Vitamin K', unit: 'mcg' },
      iron: { label: 'Iron', unit: 'mg' },
      zinc: { label: 'Zinc', unit: 'mg' },
      magnesium: { label: 'Magnesium', unit: 'mg' },
      potassium: { label: 'Potassium', unit: 'mg' },
      calcium: { label: 'Calcium', unit: 'mg' },
      sodium: { label: 'Sodium', unit: 'mg' }
    };

    Object.keys(microLabels).forEach(key => {
      const microVal = analysis.micronutrients[key] || 0;
      const meta = microLabels[key];
      const itemDiv = document.createElement('div');
      itemDiv.className = 'micro-item';
      itemDiv.innerHTML = `
        <span class="micro-lbl">${meta.label}</span>
        <span class="micro-val">${microVal} ${meta.unit}</span>
      `;
      microGrid.appendChild(itemDiv);
    });

    // Populate Amino Acids Tab
    const aminoGrid = document.getElementById('report-amino-grid');
    aminoGrid.innerHTML = '';

    const aminoLabels = {
      leucine: 'Leucine (L-Leucine)',
      isoleucine: 'Isoleucine (L-Isoleucine)',
      valine: 'Valine (L-Valine)',
      lysine: 'Lysine',
      methionine: 'Methionine',
      threonine: 'Threonine',
      tryptophan: 'Tryptophan',
      histidine: 'Histidine',
      phenylalanine: 'Phenylalanine'
    };

    Object.keys(aminoLabels).forEach(key => {
      const aaVal = analysis.aminoAcids[key] || 0;
      const itemDiv = document.createElement('div');
      itemDiv.className = 'amino-item';
      itemDiv.innerHTML = `
        <span class="amino-lbl">${aminoLabels[key]}</span>
        <span class="amino-val">${aaVal.toFixed(1)}g</span>
      `;
      aminoGrid.appendChild(itemDiv);
    });

    // Populate Glycemic & Specialty Metrics
    document.getElementById('metric-val-gi').innerText = analysis.glycemicIndex;
    document.getElementById('metric-val-gl').innerText = analysis.glycemicLoad;
    document.getElementById('metric-val-cholesterol').innerText = analysis.cholesterol + ' mg';
    document.getElementById('metric-val-omega3').innerText = (analysis.omega3 || 0) + ' g';
    document.getElementById('metric-val-omega6').innerText = (analysis.omega6 || 0) + ' g';
    document.getElementById('metric-val-diaas').innerText = `${analysis.proteinQualityScore} (${analysis.proteinQualityScore >= 95 ? 'Optimal' : 'Good'})`;

    // Log Meal Button binding
    const logBtn = document.getElementById('log-meal-btn');
    // Remove old listeners by cloning
    const newLogBtn = logBtn.cloneNode(true);
    logBtn.parentNode.replaceChild(newLogBtn, logBtn);

    newLogBtn.addEventListener('click', () => {
      window.NutriLensState.addMeal(currentAnalysis);
      navigateTo('dashboard-view');
    });
  }

  // 4. Goals Form configuration
  function setupGoalsForm() {
    document.getElementById('save-goals-btn').addEventListener('click', () => {
      const calories = parseInt(document.getElementById('goal-calories-input').value);
      const protein = parseInt(document.getElementById('goal-protein-input').value);
      const carbs = parseInt(document.getElementById('goal-carbs-input').value);
      const fat = parseInt(document.getElementById('goal-fat-input').value);

      if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
        alert("Please enter valid numeric goals!");
        return;
      }

      window.NutriLensState.saveGoals({ calories, protein, carbs, fat });
      alert("Nutrition goals updated successfully!");
    });
  }

  function populateGoalsForm() {
    const goals = window.NutriLensState.goals;
    document.getElementById('goal-calories-input').value = goals.calories;
    document.getElementById('goal-protein-input').value = goals.protein;
    document.getElementById('goal-carbs-input').value = goals.carbs;
    document.getElementById('goal-fat-input').value = goals.fat;
  }

  // 5. Render Dashboard Progress
  function renderDashboard() {
    const state = window.NutriLensState;
    const totals = state.getTodayTotals();
    const goals = state.goals;

    // Numerical progress strings
    document.getElementById('dash-text-calories').innerText = `${Math.round(totals.calories)} / ${goals.calories} kcal`;
    document.getElementById('dash-text-protein').innerText = `${Math.round(totals.protein)} / ${goals.protein}g`;
    document.getElementById('dash-text-carbs').innerText = `${Math.round(totals.carbs)} / ${goals.carbs}g`;
    document.getElementById('dash-text-fat').innerText = `${Math.round(totals.fat)} / ${goals.fat}g`;

    // Remaining counts
    const calLeft = Math.max(0, goals.calories - totals.calories);
    const protLeft = Math.max(0, goals.protein - totals.protein);
    const carbLeft = Math.max(0, goals.carbs - totals.carbs);
    const fatLeft = Math.max(0, goals.fat - totals.fat);

    document.getElementById('dash-calories-val').innerText = Math.round(calLeft);
    document.getElementById('dash-protein-val').innerText = Math.round(protLeft) + 'g';
    document.getElementById('dash-carbs-val').innerText = Math.round(carbLeft) + 'g';
    document.getElementById('dash-fat-val').innerText = Math.round(fatLeft) + 'g';

    // SVG Circular offsets
    setRingProgress('calories', totals.calories / goals.calories);
    setRingProgress('protein', totals.protein / goals.protein);
    setRingProgress('carbs', totals.carbs / goals.carbs);
    setRingProgress('fat', totals.fat / goals.fat);

    // AI Coach Recommendations
    const coachAdvice = window.NutriLensCoach.getCoachingAdvice(goals, totals);
    document.getElementById('coach-tip-text').innerHTML = coachAdvice.mainTip;
    
    const suggestList = document.getElementById('coach-suggestions-list');
    suggestList.innerHTML = '';
    
    coachAdvice.suggestions.forEach(item => {
      const suggestDiv = document.createElement('div');
      suggestDiv.className = 'suggest-item';
      suggestDiv.innerHTML = `
        <div class="suggest-row-top">
          <span class="suggest-food-name">${item.food}</span>
          <span class="suggest-food-macro">+${item.protein} protein</span>
        </div>
        <div class="suggest-food-reason">${item.reason}</div>
      `;
      suggestList.appendChild(suggestDiv);
    });

    // Populate daily meal list grouped by category
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const todayMeals = state.getTodayMeals();

    categories.forEach(cat => {
      const listDiv = document.getElementById(`cat-meals-${cat}`);
      const summarySpan = document.getElementById(`cat-macros-${cat}`);
      
      const catMeals = todayMeals.filter(m => m.category === cat);
      
      // Calculate category macro totals
      let catKcal = 0;
      let catProt = 0;
      catMeals.forEach(m => {
        catKcal += m.analysis.totals.calories || 0;
        catProt += m.analysis.totals.protein || 0;
      });
      summarySpan.innerText = `${Math.round(catKcal)} kcal • ${Math.round(catProt)}g Protein`;

      if (catMeals.length === 0) {
        listDiv.innerHTML = `<p class="subtitle" style="font-size: 0.85rem; margin-bottom: 0; padding-left: 0.5rem;">No meals logged.</p>`;
      } else {
        listDiv.innerHTML = '';
        catMeals.forEach(meal => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'logged-meal-item';
          itemDiv.innerHTML = `
            <div class="logged-meal-info">
              <img class="logged-meal-img" src="${meal.image}" alt="${meal.name}">
              <div class="logged-meal-meta">
                <span class="logged-meal-title">${meal.name}</span>
                <span class="logged-meal-sub">${Math.round(meal.analysis.totals.calories)} kcal • P: ${Math.round(meal.analysis.totals.protein)}g • C: ${Math.round(meal.analysis.totals.carbs)}g • F: ${Math.round(meal.analysis.totals.fat)}g</span>
              </div>
            </div>
            <div class="logged-meal-actions">
              <button class="delete-meal-btn" data-id="${meal.id}">Delete</button>
            </div>
          `;

          // Bind delete action
          itemDiv.querySelector('.delete-meal-btn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            window.NutriLensState.deleteMeal(id);
          });

          listDiv.appendChild(itemDiv);
        });
      }
    });
  }

  function setRingProgress(macro, ratio) {
    const bar = document.getElementById(`ring-bar-${macro}`);
    if (!bar) return;
    
    // Clamp ratio between 0 and 1
    const clampedRatio = Math.min(1, Math.max(0, ratio));
    const offset = CIRCUMFERENCE * (1 - clampedRatio);
    bar.style.strokeDashoffset = offset;
  }

  // 6. Render History & Trend Charts
  function renderHistory() {
    const meals = window.NutriLensState.meals;
    const goals = window.NutriLensState.goals;

    // Render Chart.js trends
    if (window.NutriLensCharts) {
      window.NutriLensCharts.renderTrends(meals, goals);
    }

    // Populate complete logs list
    const logList = document.getElementById('history-meals-list');
    logList.innerHTML = '';

    if (meals.length === 0) {
      logList.innerHTML = `<p class="subtitle" style="padding-left: 1rem;">No historical meals logged yet.</p>`;
      return;
    }

    // Sort historical meals descending by timestamp
    const sortedMeals = [...meals].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedMeals.forEach(meal => {
      const date = new Date(meal.timestamp);
      const displayDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'food-row';
      itemDiv.innerHTML = `
        <div class="food-name-weight">
          <span class="food-name">${meal.name}</span>
          <span class="food-weight">${displayDate} • <span class="badge" style="display:inline; padding: 0.1rem 0.4rem; font-size:0.7rem; border-radius:4px;">${meal.category}</span></span>
        </div>
        <div class="food-cooking-sauce" style="font-size: 0.8rem;">
          P: <strong>${Math.round(meal.analysis.totals.protein)}g</strong> • C: ${Math.round(meal.analysis.totals.carbs)}g • F: ${Math.round(meal.analysis.totals.fat)}g
        </div>
        <div class="food-item-macros" style="display: flex; align-items: center; gap: 1rem;">
          <strong style="font-size:1.05rem;">${Math.round(meal.analysis.totals.calories)} kcal</strong>
          <button class="delete-meal-btn history-del" data-id="${meal.id}" style="font-size:0.8rem; background:none; border:none; padding: 0.2rem;">Delete</button>
        </div>
      `;

      itemDiv.querySelector('.history-del').addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        window.NutriLensState.deleteMeal(id);
      });

      logList.appendChild(itemDiv);
    });
  }

  // 7. Render AI Insights Tab
  function renderInsights() {
    const meals = window.NutriLensState.meals;
    const goals = window.NutriLensState.goals;

    const insights = window.NutriLensCoach.generateInsights(meals, goals);
    const container = document.getElementById('insights-stack-container');
    container.innerHTML = '';

    insights.forEach(item => {
      const card = document.createElement('div');
      card.className = `glass-card insight-card ${item.type || 'success'}`;
      card.innerHTML = `
        <div class="insight-header">
          <span class="insight-cat">${item.category || 'AI INSIGHT'}</span>
          <span>${item.type === 'success' ? 'OPTIMAL' : 'ACTION REQUIRED'}</span>
        </div>
        <h3 class="insight-title">${item.title}</h3>
        <p class="insight-text">${item.text}</p>
      `;
      container.appendChild(card);
    });
  }

})();
