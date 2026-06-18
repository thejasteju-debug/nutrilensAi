/* 
   NutriLens AI - Core Application Logic
   Orchestrates SPA routing, upload handling, preset selectors, goal calculations, and DOM rendering.
*/

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. STATE MANAGEMENT & SYSTEM INITIALIZATION
    // ----------------------------------------------------
    let goals = {
        kcal: 3000,
        protein: 180,
        carbs: 350,
        fat: 80,
        mode: "lean-bulk"
    };

    let historyList = [];
    let currentAnalyzedMeal = null; // Temp holder for active report data
    let customImageBase64 = null;  // Temp holder for uploaded custom image
    let geminiApiKey = "";          // Google Gemini API Key

    // Load from LocalStorage
    function initApp() {
        const savedGoals = localStorage.getItem("nutrilens_goals");
        if (savedGoals) {
            goals = JSON.parse(savedGoals);
        } else {
            localStorage.setItem("nutrilens_goals", JSON.stringify(goals));
        }

        const savedHistory = localStorage.getItem("nutrilens_history");
        if (savedHistory) {
            historyList = JSON.parse(savedHistory);
        } else {
            // Prepopulate with default logs
            historyList = [...defaultHistory];
            localStorage.setItem("nutrilens_history", JSON.stringify(historyList));
        }
        
        // Load API Key
        geminiApiKey = localStorage.getItem("gemini_api_key") || "";
        
        // Load initial dashboard & preset cards
        renderPresets();
        renderDashboard();
    }

    // Save helper
    function saveHistory() {
        localStorage.setItem("nutrilens_history", JSON.stringify(historyList));
    }

    // Call Google Gemini Vision API to analyze custom food photo
    async function analyzeImageWithGemini(base64Data) {
        if (!geminiApiKey) {
            throw new Error("No API key configured.");
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        // Using gemini-2.5-flash as the fast, multimodal vision engine
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const mimeType = base64Data.match(/data:(.*?);base64/)[1];
        const rawBase64 = base64Data.split(",")[1];

        const imagePart = {
            inlineData: {
                data: rawBase64,
                mimeType: mimeType
            }
        };

        const prompt = `You are a clinical-grade nutritionist and hypertrophy specialist AI. 
Analyze the uploaded food photo. Perform the following steps precisely:
1. Identify the specific recipe and preparation method (e.g. Soya Chunk Curry, Spinach Omelette, Grilled Chicken Breast with gravy). Do not give generic answers; resolve exact recipes.
2. Estimate the quantity of each ingredient, estimating its component-level weights in grams based on visual portion sizing relative to the plate.
3. Calculate the complete macronutrient and micronutrient profiles.
4. Calculate the Essential Amino Acid (EAA) profile in grams. Ensure that high-protein recipes (omelettes, soya bean recipes, chicken recipes) return highly realistic EAA profiles.
5. Generate a Meal Quality Scorecard (0-100 overall) with subscores.

Return a structured JSON report matching the following schema:
{
  "name": "Specific Recipe Name (e.g. Masala Omelette with Whole Wheat Toast)",
  "category": "Breakfast, Lunch, Dinner, or Snacks",
  "calories": Total calories (integer),
  "macros": {
    "protein": Total protein in grams (integer),
    "carbs": Total carbs in grams (integer),
    "fat": Total fats in grams (integer),
    "saturatedFat": Saturated fat in grams (number),
    "fiber": Fiber in grams (number),
    "sugar": Sugar in grams (number)
  },
  "micros": {
    "vitA": Vitamin A % DV (integer),
    "vitC": Vitamin C % DV (integer),
    "vitD": Vitamin D % DV (integer),
    "vitE": Vitamin E % DV (integer),
    "vitK": Vitamin K % DV (integer),
    "vitB": Vitamin B Complex % DV (integer),
    "iron": Iron % DV (integer),
    "zinc": Zinc % DV (integer),
    "magnesium": Magnesium % DV (integer),
    "potassium": Potassium % DV (integer),
    "calcium": Calcium % DV (integer),
    "sodium": Sodium in mg (integer)
  },
  "metrics": {
    "glycemicIndex": Estimated Glycemic Index 0-100 (integer),
    "glycemicIndexLabel": "Low GI" or "Medium GI" or "High GI",
    "glycemicLoad": Estimated Glycemic Load (integer),
    "glycemicLoadLabel": "Low GL" or "Medium GL" or "High GL",
    "cholesterol": Cholesterol in mg (integer),
    "omega3": Omega-3 in grams (number),
    "omega6": Omega-6 in grams (number),
    "proteinQuality": Protein Quality Score 0-100 (integer),
    "confidence": {
      "overall": Overall confidence score 0-100 (integer),
      "calories": Calories confidence score 0-100 (integer),
      "protein": Protein confidence score 0-100 (integer),
      "carbs": Carbs confidence score 0-100 (integer),
      "fat": Fats confidence score 0-100 (integer)
    }
  },
  "scorecard": {
    "overall": Overall food quality score 0-100 (integer),
    "proteinQuality": Subscore 0-100 (integer),
    "microDensity": Subscore 0-100 (integer),
    "satiety": Subscore 0-100 (integer),
    "muscleBuilding": Subscore 0-100 (integer),
    "weightLoss": Subscore 0-100 (integer),
    "heartHealth": Subscore 0-100 (integer),
    "gradeTitle": "Anabolic grade title (e.g. Superior Muscle Fuel)",
    "gradeDesc": "2-sentence nutritional rationale explaining why this score was given."
  },
  "eaaProfile": {
    "leucine": Leucine in grams (number),
    "isoleucine": Isoleucine in grams (number),
    "valine": Valine in grams (number),
    "lysine": Lysine in grams (number),
    "methionine": Methionine in grams (number),
    "phenylalanine": Phenylalanine in grams (number),
    "threonine": Threonine in grams (number),
    "tryptophan": Tryptophan in grams (number),
    "histidine": Histidine in grams (number)
  },
  "items": [
    {
      "name": "Food Item Component Name (e.g. Soya Chunks)",
      "description": "Portion size, weight, cooking description (e.g. 100g cooked)",
      "protein": Protein in grams (integer),
      "carbs": Carbs in grams (integer),
      "fat": Fats in grams (integer),
      "saturatedFat": Saturated fat in grams (number),
      "fiber": Fiber in grams (number),
      "sugar": Sugar in grams (number),
      "calories": Calories (integer),
      "confidence": Detection confidence score 0-100 (integer)
    }
  ],
  "pins": [
    {
      "label": "Item Label & Weight (e.g. Soya Chunks 100g)",
      "top": Relative Y percent coordinate on image 0-100 (integer),
      "left": Relative X percent coordinate on image 0-100 (integer)
    }
  ]
}

Ensure the response contains only raw, valid JSON matching the schema, with no markdown styling wrappers.`;

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        
        // Clean markdown code blocks if any got returned despite instructions
        let cleanedJson = responseText.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.substring(7, cleanedJson.length - 3).trim();
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.substring(3, cleanedJson.length - 3).trim();
        }
        
        return JSON.parse(cleanedJson);
    }

    // Helper to get Swedish style YYYY-MM-DD local date string
    function getLocalDateString(date = new Date()) {
        return date.toLocaleDateString('sv');
    }

    // Show custom toast alerts
    function showToast(text, type = "success") {
        const toast = document.getElementById("toast-message-box");
        const toastText = document.getElementById("toast-text");
        const toastIcon = document.getElementById("toast-icon");
        
        toastText.innerText = text;
        if (type === "success") {
            toast.className = "toast-notification toast-success active";
            toastIcon.innerText = "✓";
        } else {
            toast.className = "toast-notification active";
            toastIcon.innerText = "ℹ";
        }
        
        setTimeout(() => {
            toast.classList.remove("active");
        }, 3000);
    }

    // ----------------------------------------------------
    // 2. ROUTING (SPA VIEW SWITCHING)
    // ----------------------------------------------------
    const navTabs = document.querySelectorAll("#nav-tabs li");
    const viewSections = document.querySelectorAll(".view-section");
    const headerLogo = document.getElementById("header-logo");

    function switchView(targetViewId) {
        // Update Nav Menu active states
        navTabs.forEach(li => {
            if (li.getAttribute("data-view") === targetViewId) {
                li.classList.add("active");
            } else {
                li.classList.remove("active");
            }
        });

        // Toggle active panels
        viewSections.forEach(sec => {
            if (sec.id === targetViewId) {
                sec.classList.add("active-view");
            } else {
                sec.classList.remove("active-view");
            }
        });

        // Trigger updates when landing on specific tabs
        if (targetViewId === "view-dashboard") {
            renderDashboard();
        } else if (targetViewId === "view-history") {
            renderHistoryLog();
        } else if (targetViewId === "view-trends") {
            renderTrends();
        } else if (targetViewId === "view-settings") {
            populateSettingsForm();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            switchView(tab.getAttribute("data-view"));
        });
    });

    headerLogo.addEventListener("click", (e) => {
        e.preventDefault();
        switchView("view-home");
    });

    // ----------------------------------------------------
    // 3. HOME VIEW: PRESET LOAD & SCROLL ACTIONS
    // ----------------------------------------------------
    const btnScrollPresets = document.getElementById("btn-scroll-presets");
    const presetsSection = document.getElementById("presets-section");

    btnScrollPresets.addEventListener("click", () => {
        presetsSection.scrollIntoView({ behavior: "smooth" });
    });

    function renderPresets() {
        const presetsContainer = document.getElementById("presets-gallery-container");
        if (!presetsContainer) return;
        
        presetsContainer.innerHTML = "";
        
        presetMeals.forEach(meal => {
            const card = document.createElement("div");
            card.className = "preset-item";
            card.setAttribute("data-id", meal.id);
            
            const imageTag = meal.image 
                ? `<img src="${meal.image}" alt="${meal.name}" onerror="this.src='assets/hero_food_bowl.png'">`
                : `<div class="preset-fallback">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                   </div>`;

            card.innerHTML = `
                <div class="preset-kcal-badge">${meal.calories} kcal</div>
                <div class="preset-img-wrap">
                    ${imageTag}
                </div>
                <div class="preset-info">
                    <h4>${meal.name}</h4>
                    <div class="preset-macros-summary">
                        <span>P: <strong>${meal.macros.protein}g</strong></span>
                        <span>C: <strong>${meal.macros.carbs}g</strong></span>
                        <span>F: <strong>${meal.macros.fat}g</strong></span>
                    </div>
                </div>
            `;
            
            card.addEventListener("click", () => {
                triggerAIVisionSimulation(meal, null);
            });
            
            presetsContainer.appendChild(card);
        });
    }

    // ----------------------------------------------------
    // 4. FILE UPLOAD & VISION ANALYSIS SIMULATION
    // ----------------------------------------------------
    const dropZone = document.getElementById("drop-zone");
    const fileSelector = document.getElementById("file-selector");
    const btnTriggerUpload = document.getElementById("btn-trigger-upload");
    const analyzerOverlay = document.getElementById("visual-analyzer-overlay");
    const scanningImgPreview = document.getElementById("scanning-img-preview");
    const analyzerStatus = document.getElementById("analyzer-main-status");

    // Click handler to open selector
    btnTriggerUpload.addEventListener("click", () => fileSelector.click());
    dropZone.addEventListener("click", () => fileSelector.click());

    // File Selector Change Event
    fileSelector.addEventListener("change", (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag and Drop Events
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    function handleFileSelect(file) {
        if (!file || !file.type.startsWith("image/")) {
            showToast("Invalid file format. Please select an image.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            customImageBase64 = e.target.result;
            // Generate customized analysis data
            const mockAnalysis = generateMockCustomAnalysis(file.name);
            triggerAIVisionSimulation(mockAnalysis, customImageBase64);
        };
        reader.readAsDataURL(file);
    }

    // Step-by-step vision analyzer overlay simulator
    function triggerAIVisionSimulation(mealData, customImg) {
        // Reset steps status UI
        const steps = [
            { id: "step-recognize", text: "Segmenting food boundaries..." },
            { id: "step-volume", text: "Estimating volume & gram weight..." },
            { id: "step-cooking", text: "Detecting cooking oils & hidden sauces..." },
            { id: "step-nutrients", text: "Resolving micronutrients & EAA profiles..." }
        ];

        steps.forEach(step => {
            const el = document.getElementById(step.id);
            el.className = "analysis-step";
        });

        // Set scanning preview image
        if (customImg) {
            scanningImgPreview.src = customImg;
        } else if (mealData.image) {
            scanningImgPreview.src = mealData.image;
        } else {
            scanningImgPreview.src = "assets/hero_food_bowl.png";
        }

        // Show Overlay
        analyzerOverlay.classList.add("active");

        // IF CUSTOM UPLOAD & GEMINI API KEY INSTALLED -> LIVE MODE
        if (customImg && geminiApiKey) {
            analyzerStatus.innerText = "Connecting to Google Gemini Vision API...";
            const step1 = document.getElementById("step-recognize");
            step1.className = "analysis-step active";
            step1.innerHTML = `<span class="analysis-step-check"></span>Connecting to Google Gemini API...`;
            
            analyzeImageWithGemini(customImg).then(liveMealData => {
                // Set steps completed rapidly to show success
                document.getElementById("step-recognize").className = "analysis-step completed";
                
                const step2 = document.getElementById("step-volume");
                step2.className = "analysis-step active";
                step2.innerHTML = `<span class="analysis-step-check"></span>AI segmenting food & portion estimation...`;
                
                setTimeout(() => {
                    step2.className = "analysis-step completed";
                    const step3 = document.getElementById("step-cooking");
                    step3.className = "analysis-step active";
                    step3.innerHTML = `<span class="analysis-step-check"></span>Extracting macro, micro, and EAA data...`;
                    
                    setTimeout(() => {
                        step3.className = "analysis-step completed";
                        const step4 = document.getElementById("step-nutrients");
                        step4.className = "analysis-step active";
                        step4.innerHTML = `<span class="analysis-step-check"></span>Validating clinical nutrition scorecard...`;
                        
                        setTimeout(() => {
                            step4.className = "analysis-step completed";
                            
                            setTimeout(() => {
                                analyzerOverlay.classList.remove("active");
                                currentAnalyzedMeal = liveMealData;
                                renderNutritionReport(liveMealData, customImg);
                                switchView("view-report");
                                showToast(`Resolved Recipe: ${liveMealData.name}!`, "success");
                            }, 500);
                        }, 800);
                    }, 800);
                }, 800);
                
            }).catch(err => {
                console.error("Gemini live analysis error: ", err);
                // Inform user of failure and fallback to simulated analysis
                showToast("Live analysis failed. Running simulation mode...", "error");
                
                // Reset steps texts back to original simulated labels
                steps.forEach(step => {
                    const el = document.getElementById(step.id);
                    el.innerHTML = `<span class="analysis-step-check"></span>${step.text}`;
                });
                
                runSimulatedSteps(mealData, customImg);
            });
        } else {
            // Check if user uploaded a custom image but has NO key
            if (customImg && !geminiApiKey) {
                showToast("No Gemini key. Enter key in Settings for live vision. Running offline simulation...", "info");
            }
            
            // Restore step text labels just in case they were modified by a previous live call
            steps.forEach(step => {
                const el = document.getElementById(step.id);
                el.innerHTML = `<span class="analysis-step-check"></span>${step.text}`;
            });
            
            runSimulatedSteps(mealData, customImg);
        }

        function runSimulatedSteps(fallbackMeal, img) {
            currentAnalyzedMeal = fallbackMeal;
            analyzerStatus.innerText = "Vision Engine Booting...";
            
            let currentStepIndex = 0;

            function runStep() {
                if (currentStepIndex > 0) {
                    const prevEl = document.getElementById(steps[currentStepIndex - 1].id);
                    prevEl.className = "analysis-step completed";
                }

                if (currentStepIndex < steps.length) {
                    const el = document.getElementById(steps[currentStepIndex].id);
                    el.className = "analysis-step active";
                    analyzerStatus.innerText = steps[currentStepIndex].text;
                    currentStepIndex++;
                    setTimeout(runStep, 900);
                } else {
                    setTimeout(() => {
                        analyzerOverlay.classList.remove("active");
                        renderNutritionReport(fallbackMeal, img);
                        switchView("view-report");
                        showToast("AI Vision analysis successfully resolved!");
                    }, 400);
                }
            }
            setTimeout(runStep, 600);
        }
    }

    // ----------------------------------------------------
    // 5. NUTRITION REPORT CARD VIEW
    // ----------------------------------------------------
    const btnCancelReport = document.getElementById("btn-cancel-report");
    const btnAddMealToLog = document.getElementById("btn-add-meal-to-log");

    btnCancelReport.addEventListener("click", () => {
        currentAnalyzedMeal = null;
        customImageBase64 = null;
        switchView("view-home");
    });

    btnAddMealToLog.addEventListener("click", () => {
        if (!currentAnalyzedMeal) return;
        
        // Deep copy report into history
        const loggedEntry = JSON.parse(JSON.stringify(currentAnalyzedMeal));
        loggedEntry.id = "log-" + Date.now();
        loggedEntry.timestamp = new Date().toISOString();
        if (customImageBase64) {
            loggedEntry.image = customImageBase64;
        }
        
        historyList.push(loggedEntry);
        saveHistory();
        
        showToast("Meal successfully logged to your dashboard!", "success");
        
        // Reset temp variables
        currentAnalyzedMeal = null;
        customImageBase64 = null;
        
        switchView("view-dashboard");
    });

    function renderNutritionReport(meal, customImg) {
        // 1. Injected Image Container with markers
        const imgContainer = document.getElementById("report-img-container");
        imgContainer.innerHTML = "";
        
        const imgEl = document.createElement("img");
        if (customImg) {
            imgEl.src = customImg;
        } else if (meal.image) {
            imgEl.src = meal.image;
        } else {
            imgEl.src = "assets/hero_food_bowl.png";
        }
        imgContainer.appendChild(imgEl);

        // Inject vision segments (pins)
        if (meal.pins && meal.pins.length > 0) {
            meal.pins.forEach(pin => {
                const badge = document.createElement("div");
                badge.className = "item-overlay-marker";
                badge.style.top = `${pin.top}%`;
                badge.style.left = `${pin.left}%`;
                badge.innerText = pin.label;
                imgContainer.appendChild(badge);
            });
        }

        // 2. Detected items breakdown
        const itemsListContainer = document.getElementById("report-items-list-container");
        itemsListContainer.innerHTML = "";

        meal.items.forEach(item => {
            const row = document.createElement("div");
            row.className = "food-item-row";
            
            // Extract detailed ingredient macros or mock fallbacks if missing
            const satFat = item.saturatedFat !== undefined ? item.saturatedFat : Math.round((item.fat || 0) * 0.25 * 10) / 10;
            const fiber = item.fiber !== undefined ? item.fiber : 0;
            const sugar = item.sugar !== undefined ? item.sugar : 0;
            const carbs = item.carbs !== undefined ? item.carbs : 0;
            const fat = item.fat !== undefined ? item.fat : 0;

            row.innerHTML = `
                <div class="food-item-details">
                    <span class="food-item-name">${item.name}</span>
                    <span class="food-item-meta">${item.description}</span>
                    <span class="food-item-meta" style="font-size:0.75rem; color:var(--color-text-muted); margin-top:2px;">
                        P: <strong>${item.protein}g</strong> • C: <strong>${carbs}g</strong> (Sug: ${sugar}g) • F: <strong>${fat}g</strong> (Sat: ${satFat}g) • Fib: <strong>${fiber}g</strong>
                    </span>
                </div>
                <div class="food-item-macros">
                    <div class="food-item-macro-chip">
                        <div class="food-item-macro-val">${item.calories}</div>
                        <div class="food-item-macro-label">kcal</div>
                    </div>
                    <div class="food-item-macro-chip">
                        <span class="food-item-tag" style="background: rgba(16, 185, 129, 0.08); color: var(--color-calories);">${item.confidence}% conf</span>
                    </div>
                </div>
            `;
            itemsListContainer.appendChild(row);
        });

        // 3. Scorecard gauge & subscores
        const overallScoreRing = document.getElementById("report-score-ring");
        const overallScoreNum = document.getElementById("report-score-number");
        const scoreTitle = document.getElementById("report-score-title");
        const scoreDesc = document.getElementById("report-score-desc");
        
        const score = meal.scorecard.overall;
        overallScoreNum.innerText = score;
        scoreTitle.innerText = meal.scorecard.gradeTitle;
        scoreDesc.innerText = meal.scorecard.gradeDesc;
        
        // Radial progress mapping (stroke-dasharray="strokeVal, 100")
        overallScoreRing.style.strokeDasharray = `${score}, 100`;

        const subscoresContainer = document.getElementById("report-subscores-container");
        subscoresContainer.innerHTML = "";
        
        const subcategories = [
            { name: "Protein Quality", key: "proteinQuality", icon: "💪" },
            { name: "Micronutrient Density", key: "microDensity", icon: "🥦" },
            { name: "Satiety Score", key: "satiety", icon: "🍽️" },
            { name: "Muscle Building Score", key: "muscleBuilding", icon: "🔥" },
            { name: "Weight Loss Score", key: "weightLoss", icon: "📉" },
            { name: "Heart Health Score", key: "heartHealth", icon: "❤️" }
        ];

        subcategories.forEach(sub => {
            const val = meal.scorecard[sub.key] || 0;
            let badgeClass = "badge-moderate";
            let badgeText = "Moderate";
            if (val >= 90) {
                badgeClass = "badge-optimal";
                badgeText = "Optimal";
            } else if (val >= 80) {
                badgeClass = "badge-good";
                badgeText = "Good";
            }

            const card = document.createElement("div");
            card.className = "subscore-card";
            card.innerHTML = `
                <div class="subscore-info">
                    <span class="subscore-name">${sub.icon} ${sub.name}</span>
                    <span class="subscore-num">${val}/100</span>
                </div>
                <span class="subscore-badge ${badgeClass}">${badgeText}</span>
            `;
            subscoresContainer.appendChild(card);
        });

        // 4. Macro progress rings
        const macrosContainer = document.getElementById("report-macros-rings-container");
        macrosContainer.innerHTML = "";
        
        const confObj = normalizeConfidence(meal.metrics.confidence);
        const macrosMap = [
            { label: "CALORIES", val: `${meal.calories}`, target: `${goals.kcal}`, color: "var(--color-calories)", suffix: "kcal", conf: confObj.calories },
            { label: "PROTEIN", val: `${meal.macros.protein}`, target: `${goals.protein}`, color: "var(--color-protein)", suffix: "g", conf: confObj.protein },
            { label: "CARBS", val: `${meal.macros.carbs}`, target: `${goals.carbs}`, color: "var(--color-carbs)", suffix: "g", conf: confObj.carbs },
            { label: "FATS", val: `${meal.macros.fat}`, target: `${goals.fat}`, color: "var(--color-fat)", suffix: "g", conf: confObj.fat }
        ];

        macrosMap.forEach(macro => {
            const pct = Math.min(100, Math.round((macro.val / macro.target) * 100));
            
            const widget = document.createElement("div");
            widget.className = "macro-ring-widget";
            widget.innerHTML = `
                <span class="macro-widget-title">${macro.label}</span>
                <div class="macro-circle-container">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%;">
                        <path class="macro-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="macro-circle-fill" style="stroke: ${macro.color}; stroke-dasharray: ${pct}, 100;" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    </svg>
                    <div class="macro-circle-text">
                        ${macro.val}<small>${macro.suffix}</small>
                    </div>
                </div>
                <div class="macro-widget-confidence" style="font-size:0.72rem; opacity:0.8; margin-top:4px;">${macro.label.charAt(0) + macro.label.slice(1).toLowerCase()} Estimate: ${macro.val}${macro.suffix} — ${macro.conf}% confidence</div>
            `;
            macrosContainer.appendChild(widget);
        });

        // 4.5 Detailed macros grid
        const detailedMacrosContainer = document.getElementById("report-macros-detailed-container");
        if (detailedMacrosContainer) {
            detailedMacrosContainer.innerHTML = `
                <div class="metric-pill-card">
                    <div class="metric-pill-label">Total Fat</div>
                    <div class="metric-pill-value-flex">
                        <div class="metric-pill-val" style="font-size: 1.1rem; color: var(--color-fat);">${meal.macros.fat}g</div>
                        <div class="metric-pill-subtext">${confObj.fat}% conf</div>
                    </div>
                </div>
                <div class="metric-pill-card">
                    <div class="metric-pill-label">Saturated Fat</div>
                    <div class="metric-pill-value-flex">
                        <div class="metric-pill-val" style="font-size: 1.1rem;">${meal.macros.saturatedFat || 0}g</div>
                        <div class="metric-pill-subtext">Limit Intake</div>
                    </div>
                </div>
                <div class="metric-pill-card">
                    <div class="metric-pill-label">Dietary Fiber</div>
                    <div class="metric-pill-value-flex">
                        <div class="metric-pill-val" style="font-size: 1.1rem; color: #10b981;">${meal.macros.fiber || 0}g</div>
                        <div class="metric-pill-subtext">Digestion</div>
                    </div>
                </div>
                <div class="metric-pill-card">
                    <div class="metric-pill-label">Total Sugars</div>
                    <div class="metric-pill-value-flex">
                        <div class="metric-pill-val" style="font-size: 1.1rem; color: #f59e0b;">${meal.macros.sugar || 0}g</div>
                        <div class="metric-pill-subtext">Energy</div>
                    </div>
                </div>
            `;
        }

        // 5. Micronutrients bars
        const microContainer = document.getElementById("report-micronutrients-container");
        microContainer.innerHTML = "";

        const microsMap = [
            { name: "Vitamin A", val: meal.micros.vitA, suffix: "% DV" },
            { name: "Vitamin C", val: meal.micros.vitC, suffix: "% DV" },
            { name: "Vitamin D", val: meal.micros.vitD, suffix: "% DV" },
            { name: "Vitamin E", val: meal.micros.vitE, suffix: "% DV" },
            { name: "Vitamin K", val: meal.micros.vitK, suffix: "% DV" },
            { name: "Vitamin B Complex", val: meal.micros.vitB, suffix: "% DV" },
            { name: "Iron", val: meal.micros.iron, suffix: "% DV" },
            { name: "Zinc", val: meal.micros.zinc, suffix: "% DV" },
            { name: "Magnesium", val: meal.micros.magnesium, suffix: "% DV" },
            { name: "Potassium", val: meal.micros.potassium, suffix: "% DV" },
            { name: "Calcium", val: meal.micros.calcium, suffix: "% DV" },
            { name: "Sodium", val: meal.micros.sodium, suffix: "mg" }
        ];

        microsMap.forEach(micro => {
            const bar = document.createElement("div");
            bar.className = "micro-item-bar";
            
            // Map percentage bar logic (capped at 100 for visual sanity)
            const percentWidth = Math.min(100, micro.suffix === "% DV" ? micro.val : Math.round((micro.val / 2300) * 100)); // 2300mg RDI sodium
            
            bar.innerHTML = `
                <div class="micro-item-info">
                    <span class="micro-item-name">${micro.name}</span>
                    <span class="micro-item-val">${micro.val !== undefined ? micro.val : 0}${micro.suffix}</span>
                </div>
                <div class="micro-progress-track">
                    <div class="micro-progress-fill" style="width: ${percentWidth}%"></div>
                </div>
            `;
            microContainer.appendChild(bar);
        });

        // 6. Advanced analytics
        document.getElementById("report-gi-val").innerText = meal.metrics.glycemicIndex;
        document.getElementById("report-gi-lbl").innerText = meal.metrics.glycemicIndexLabel;
        document.getElementById("report-gl-val").innerText = meal.metrics.glycemicLoad;
        document.getElementById("report-gl-lbl").innerText = meal.metrics.glycemicLoadLabel;
        document.getElementById("report-cholesterol-val").innerText = `${meal.metrics.cholesterol}mg`;
        document.getElementById("report-omega-val").innerText = `${meal.metrics.omega3}g / ${meal.metrics.omega6}g`;
        document.getElementById("report-conf-overall").innerText = `${confObj.overall}%`;

        // Amino acid list rendering
        const aminoContainer = document.getElementById("report-amino-list-container");
        aminoContainer.innerHTML = "";
        
        const eaas = [
            { name: "L-Leucine (Muscle Trigger)", val: meal.eaaProfile.leucine, desc: "Anabolic trigger" },
            { name: "L-Isoleucine (BCAA)", val: meal.eaaProfile.isoleucine, desc: "Recovery" },
            { name: "L-Valine (BCAA)", val: meal.eaaProfile.valine, desc: "Repair" },
            { name: "L-Lysine", val: meal.eaaProfile.lysine, desc: "Tissue repair" },
            { name: "L-Methionine", val: meal.eaaProfile.methionine, desc: "Metabolism" },
            { name: "L-Phenylalanine", val: meal.eaaProfile.phenylalanine, desc: "Nervous health" },
            { name: "L-Threonine", val: meal.eaaProfile.threonine, desc: "Structural" },
            { name: "L-Tryptophan", val: meal.eaaProfile.tryptophan, desc: "Serotonin precursor" },
            { name: "L-Histidine", val: meal.eaaProfile.histidine, desc: "Carnosine builder" }
        ];

        eaas.forEach(aa => {
            const row = document.createElement("div");
            row.className = "amino-row";
            row.innerHTML = `
                <span class="amino-name">${aa.name}</span>
                <span class="amino-val">${aa.val}g</span>
            `;
            aminoContainer.appendChild(row);
        });
    }

    // ----------------------------------------------------
    // 6. DAILY DASHBOARD VIEW RENDERER
    // ----------------------------------------------------
    const btnDashManualAdd = document.getElementById("btn-dashboard-manual-add");
    btnDashManualAdd.addEventListener("click", () => triggerManualAddModal());

    function renderDashboard() {
        // Today String
        const todayStr = getLocalDateString();
        
        // Filter history for today
        const todayMeals = historyList.filter(log => {
            return getLocalDateString(new Date(log.timestamp)) === todayStr;
        });

        // Sum consumed macros
        const totals = {
            calories: todayMeals.reduce((acc, c) => acc + (c.calories || 0), 0),
            protein: todayMeals.reduce((acc, c) => acc + (c.macros.protein || 0), 0),
            carbs: todayMeals.reduce((acc, c) => acc + (c.macros.carbs || 0), 0),
            fat: todayMeals.reduce((acc, c) => acc + (c.macros.fat || 0), 0)
        };

        // Date Label
        const displayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
        document.getElementById("dash-date-string").innerText = displayDate;

        // Render Goals Consumed vs Targets cards
        const progressContainer = document.getElementById("dash-progress-cards-container");
        progressContainer.innerHTML = "";

        const trackerList = [
            { key: "kcal", label: "Calories", consumed: totals.calories, target: goals.kcal, unit: "kcal", class: "dash-card-kcal" },
            { key: "protein", label: "Protein", consumed: totals.protein, target: goals.protein, unit: "g", class: "dash-card-protein" },
            { key: "carbs", label: "Carbs", consumed: totals.carbs, target: goals.carbs, unit: "g", class: "dash-card-carbs" },
            { key: "fat", label: "Fat", consumed: totals.fat, target: goals.fat, unit: "g", class: "dash-card-fat" }
        ];

        trackerList.forEach(t => {
            const remaining = t.target - t.consumed;
            const pct = Math.min(100, Math.round((t.consumed / t.target) * 100));
            
            let statusText = "";
            if (remaining >= 0) {
                statusText = `${remaining}${t.unit} remaining`;
            } else {
                statusText = `${Math.abs(remaining)}${t.unit} Surplus 🔥`;
            }

            const card = document.createElement("div");
            card.className = `dash-progress-card ${t.class}`;
            card.innerHTML = `
                <div class="dash-card-label">${t.label} Goal</div>
                <div class="dash-card-val">${t.consumed} / ${t.target} <span style="font-size:0.9rem; font-weight:500; color: var(--color-text-muted);">${t.unit}</span></div>
                <div class="dash-card-sub">${statusText}</div>
                <div class="dash-card-bar-track">
                    <div class="dash-card-bar-fill" style="width: ${pct}%"></div>
                </div>
            `;
            progressContainer.appendChild(card);
        });

        // Today's Micronutrient Intake Tracker
        const dashMicroContainer = document.getElementById("dash-micronutrients-container");
        if (dashMicroContainer) {
            dashMicroContainer.innerHTML = "";
            
            const microTotals = {
                vitA: 0, vitC: 0, vitD: 0, vitE: 0, vitK: 0, vitB: 0,
                iron: 0, zinc: 0, magnesium: 0, potassium: 0, calcium: 0, sodium: 0
            };

            todayMeals.forEach(meal => {
                if (meal.micros) {
                    microTotals.vitA += meal.micros.vitA || 0;
                    microTotals.vitC += meal.micros.vitC || 0;
                    microTotals.vitD += meal.micros.vitD || 0;
                    microTotals.vitE += meal.micros.vitE || 0;
                    microTotals.vitK += meal.micros.vitK || 0;
                    microTotals.vitB += meal.micros.vitB || 0;
                    microTotals.iron += meal.micros.iron || 0;
                    microTotals.zinc += meal.micros.zinc || 0;
                    microTotals.magnesium += meal.micros.magnesium || 0;
                    microTotals.potassium += meal.micros.potassium || 0;
                    microTotals.calcium += meal.micros.calcium || 0;
                    microTotals.sodium += meal.micros.sodium || 0;
                }
            });

            const dashMicrosMap = [
                { name: "Vitamin A", val: microTotals.vitA, suffix: "% DV" },
                { name: "Vitamin C", val: microTotals.vitC, suffix: "% DV" },
                { name: "Vitamin D", val: microTotals.vitD, suffix: "% DV" },
                { name: "Vitamin E", val: microTotals.vitE, suffix: "% DV" },
                { name: "Vitamin K", val: microTotals.vitK, suffix: "% DV" },
                { name: "Vitamin B Complex", val: microTotals.vitB, suffix: "% DV" },
                { name: "Iron", val: microTotals.iron, suffix: "% DV" },
                { name: "Zinc", val: microTotals.zinc, suffix: "% DV" },
                { name: "Magnesium", val: microTotals.magnesium, suffix: "% DV" },
                { name: "Potassium", val: microTotals.potassium, suffix: "% DV" },
                { name: "Calcium", val: microTotals.calcium, suffix: "% DV" },
                { name: "Sodium", val: microTotals.sodium, suffix: "mg" }
            ];

            dashMicrosMap.forEach(micro => {
                const bar = document.createElement("div");
                bar.className = "micro-item-bar";
                
                const targetVal = micro.suffix === "% DV" ? 100 : 2300;
                const percentWidth = Math.min(100, Math.round((micro.val / targetVal) * 100));
                
                bar.innerHTML = `
                    <div class="micro-item-info">
                        <span class="micro-item-name">${micro.name}</span>
                        <span class="micro-item-val">${micro.val}${micro.suffix}</span>
                    </div>
                    <div class="micro-progress-track">
                        <div class="micro-progress-fill" style="width: ${percentWidth}%"></div>
                    </div>
                `;
                dashMicroContainer.appendChild(bar);
            });
        }

        // Category Groups (Breakfast, Lunch, Dinner, Snacks)
        const categories = ["Breakfast", "Lunch", "Dinner", "Snacks"];
        const categoryContainer = document.getElementById("dashboard-categories-container");
        categoryContainer.innerHTML = "";

        categories.forEach(cat => {
            const catMeals = todayMeals.filter(m => m.category.toLowerCase() === cat.toLowerCase() || (cat === "Snacks" && m.category.toLowerCase() === "snack"));
            const catKcal = catMeals.reduce((acc, c) => acc + (c.calories || 0), 0);
            
            const block = document.createElement("div");
            block.className = "meal-category-block";
            
            let mealsRowsHtml = "";
            if (catMeals.length > 0) {
                catMeals.forEach(m => {
                    mealsRowsHtml += `
                        <div class="food-item-row" style="background: rgba(255,255,255,0.01); border-color: rgba(255,255,255,0.03);">
                            <div class="food-item-details">
                                <span class="food-item-name" style="font-size:0.95rem;">${m.name}</span>
                                <span class="food-item-meta" style="font-size:0.75rem;">P: ${m.macros.protein}g • C: ${m.macros.carbs}g • F: ${m.macros.fat}g</span>
                            </div>
                            <div class="food-item-macros" style="gap:10px;">
                                <div class="food-item-macro-val" style="font-size:0.9rem;">${m.calories} kcal</div>
                                <button class="btn-delete-log" data-id="${m.id}" style="padding: 4px 8px; font-size:0.8rem;">✕</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                mealsRowsHtml = `<div class="empty-category-placeholder">No ${cat.toLowerCase()} logged today</div>`;
            }

            block.innerHTML = `
                <div class="category-header">
                    <span class="category-title">${getCategoryIcon(cat)} ${cat}</span>
                    <span class="category-kcal">${catKcal} kcal total</span>
                </div>
                <div class="category-meals-list">
                    ${mealsRowsHtml}
                </div>
            `;
            
            categoryContainer.appendChild(block);
        });

        // Register Delete event listener
        categoryContainer.querySelectorAll(".btn-delete-log").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const logId = e.target.getAttribute("data-id");
                deleteMealLog(logId);
            });
        });

        // AI Health Coach Suggestion Call
        const coachRecommends = getCoachRecommendation(totals, goals);
        document.getElementById("coach-message").innerHTML = coachRecommends.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Coach Suggestion chips
        const chipsContainer = document.getElementById("coach-suggestions-chips");
        chipsContainer.innerHTML = "";
        coachRecommends.foods.forEach(food => {
            const chip = document.createElement("span");
            chip.className = "suggestion-chip";
            chip.innerText = food;
            chip.addEventListener("click", () => {
                // Prepopulate a manual add form with this chip name
                triggerManualAddModal(food);
            });
            chipsContainer.appendChild(chip);
        });

        // Run AI Insights Engine
        const insightsList = runInsightsEngine(todayMeals, goals);
        const insightsContainer = document.getElementById("dashboard-insights-container");
        insightsContainer.innerHTML = "";

        insightsList.forEach(ins => {
            const card = document.createElement("div");
            card.className = `insight-card ${ins.type === "success" ? "insight-success" : ins.type === "info" ? "insight-info" : ""}`;
            card.innerHTML = `<p>${ins.text}</p>`;
            insightsContainer.appendChild(card);
        });
    }

    function getCategoryIcon(cat) {
        switch(cat.toLowerCase()) {
            case "breakfast": return "🍳";
            case "lunch": return "🥗";
            case "dinner": return "🥩";
            default: return "🍌";
        }
    }

    function deleteMealLog(id) {
        historyList = historyList.filter(log => log.id !== id);
        saveHistory();
        showToast("Meal log removed.", "info");
        renderDashboard();
    }

    // Modal Dynamic Builder for Manual Add
    function triggerManualAddModal(prefilledName = "") {
        // Create dynamic modal layout element
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(9, 10, 15, 0.85)";
        modal.style.backdropFilter = "blur(12px)";
        modal.style.zIndex = "3000";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.id = "dynamic-manual-add-modal";

        modal.innerHTML = `
            <div class="glass-card" style="width:90%; max-width:450px; border-color:var(--color-primary); box-shadow: var(--shadow-lg);">
                <div class="card-header-flex" style="margin-bottom: 16px;">
                    <div class="card-title-main">🍳 Log Food Manually</div>
                </div>
                <form id="modal-form" class="settings-form">
                    <div class="form-group">
                        <label>Food Item Name</label>
                        <input type="text" id="modal-input-name" value="${prefilledName}" placeholder="e.g. Greek Yogurt & Honey" required>
                    </div>
                    <div class="form-row-grid">
                        <div class="form-group">
                            <label>Meal Category</label>
                            <select id="modal-input-cat">
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner" selected>Dinner</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Calories (kcal)</label>
                            <input type="number" id="modal-input-kcal" min="0" value="350" required>
                        </div>
                    </div>
                    <div class="form-row-grid">
                        <div class="form-group">
                            <label>Protein (g)</label>
                            <input type="number" id="modal-input-pro" min="0" value="30" required>
                        </div>
                        <div class="form-group">
                            <label>Carbs (g)</label>
                            <input type="number" id="modal-input-carb" min="0" value="40" required>
                        </div>
                    </div>
                    <div class="form-row-grid">
                        <div class="form-group">
                            <label>Fat (g)</label>
                            <input type="number" id="modal-input-fat" min="0" value="8" required>
                        </div>
                        <div style="display:flex; align-items:flex-end;">
                            <!-- empty spacer -->
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:16px; margin-top:16px;">
                        <button type="submit" class="settings-btn-save" style="flex:1; margin:0;">Save Entry</button>
                        <button type="button" id="modal-btn-close" class="btn-secondary" style="flex:0.8; padding: 12px 24px;">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close logic
        const btnClose = modal.querySelector("#modal-btn-close");
        btnClose.addEventListener("click", () => modal.remove());

        // Submit logic
        const form = modal.querySelector("#modal-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const newMeal = {
                id: "log-" + Date.now(),
                name: modal.querySelector("#modal-input-name").value,
                category: modal.querySelector("#modal-input-cat").value,
                calories: parseInt(modal.querySelector("#modal-input-kcal").value),
                macros: {
                    protein: parseInt(modal.querySelector("#modal-input-pro").value),
                    carbs: parseInt(modal.querySelector("#modal-input-carb").value),
                    fat: parseInt(modal.querySelector("#modal-input-fat").value)
                },
                micros: { vitA: 10, vitC: 10, vitD: 0, vitB: 10, iron: 10, zinc: 10, magnesium: 15, potassium: 10, calcium: 10, sodium: 250 },
                metrics: { glycemicIndex: 45, glycemicIndexLabel: "Low GI", glycemicLoad: 10, glycemicLoadLabel: "Low GL", cholesterol: 20, omega3: 0.1, omega6: 1.0, proteinQuality: 90, confidence: 100 },
                scorecard: { overall: 85 },
                timestamp: new Date().toISOString()
            };

            historyList.push(newMeal);
            saveHistory();
            modal.remove();
            
            showToast("Logged food successfully!");
            renderDashboard();
        });
    }

    // ----------------------------------------------------
    // 7. HISTORICAL LOG VIEW
    // ----------------------------------------------------
    const historySearchInput = document.getElementById("history-search");
    historySearchInput.addEventListener("input", () => renderHistoryLog());

    function renderHistoryLog() {
        const container = document.getElementById("history-items-list-container");
        if (!container) return;
        
        container.innerHTML = "";
        const search = historySearchInput.value.toLowerCase().trim();

        // Sort descending by timestamp
        const sortedHistory = [...historyList].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        const filteredHistory = sortedHistory.filter(item => item.name.toLowerCase().includes(search));

        if (filteredHistory.length === 0) {
            container.innerHTML = `<div class="empty-category-placeholder" style="padding: 40px;">No matching historical meals found.</div>`;
            return;
        }

        filteredHistory.forEach(log => {
            const card = document.createElement("div");
            card.className = "history-card";
            
            const dateStr = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            const imgHtml = log.image 
                ? `<img src="${log.image}" class="history-img-thumb" alt="${log.name}">`
                : `<div class="history-img-thumb" style="display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass);"><span style="font-size:1.5rem;">🥗</span></div>`;

            card.innerHTML = `
                ${imgHtml}
                <div class="history-details">
                    <div class="history-header-flex">
                        <span class="history-meal-name">${log.name}</span>
                        <span class="history-meta-sub">${dateStr}</span>
                    </div>
                    <div class="history-header-flex" style="margin: 0;">
                        <div class="history-macros-flex">
                            <span class="history-macro-item">Calories: <strong>${log.calories}</strong> kcal</span>
                            <span class="history-macro-item" style="color: var(--color-protein);">Protein: <strong>${log.macros.protein}g</strong></span>
                            <span class="history-macro-item" style="color: var(--color-carbs);">Carbs: <strong>${log.macros.carbs}g</strong></span>
                            <span class="history-macro-item" style="color: var(--color-fat);">Fat: <strong>${log.macros.fat}g</strong></span>
                        </div>
                        <span class="food-item-tag">${log.category}</span>
                    </div>
                </div>
                <button class="btn-delete-log history-delete-btn" data-id="${log.id}">✕</button>
            `;
            
            card.querySelector(".history-delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                deleteHistoryMeal(log.id);
            });
            
            container.appendChild(card);
        });
    }

    function deleteHistoryMeal(id) {
        historyList = historyList.filter(log => log.id !== id);
        saveHistory();
        showToast("Meal deleted from history.", "info");
        renderHistoryLog();
    }

    // ----------------------------------------------------
    // 8. WEEKLY / MONTHLY TRENDS VIEW
    // ----------------------------------------------------
    const trendsTimeframeToggles = document.getElementById("trends-timeframe-toggles");
    
    // Wire up timeframe button clicks
    trendsTimeframeToggles.querySelectorAll(".timeframe-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            trendsTimeframeToggles.querySelectorAll(".timeframe-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderTrends();
        });
    });

    function renderTrends() {
        const activeTimeframeBtn = trendsTimeframeToggles.querySelector(".timeframe-btn.active");
        const timeframe = activeTimeframeBtn.getAttribute("data-timeframe");
        const days = timeframe === "week" ? 7 : 30;

        // Draw Calories Surplus Bar Chart
        drawCalorieChart("calories-chart-container", historyList, goals.kcal, days);
        
        // Draw Protein Line Curve Chart
        drawProteinChart("protein-chart-container", historyList, goals.protein, days);

        // Draw Carbohydrates Line Curve Chart
        drawCarbsChart("carbs-chart-container", historyList, goals.carbs, days);

        // Draw Fats Line Curve Chart
        drawFatChart("fat-chart-container", historyList, goals.fat, days);
    }

    // ----------------------------------------------------
    // 9. SETTINGS TARGET GOALS CONFIGURATION
    // ----------------------------------------------------
    const settingsForm = document.getElementById("settings-form-element");

    function populateSettingsForm() {
        document.getElementById("input-target-kcal").value = goals.kcal;
        document.getElementById("input-target-protein").value = goals.protein;
        document.getElementById("input-target-carbs").value = goals.carbs;
        document.getElementById("input-target-fat").value = goals.fat;
        document.getElementById("input-fitness-mode").value = goals.mode;
        
        // Populate Gemini API Key UI
        const savedKey = localStorage.getItem("gemini_api_key") || "";
        document.getElementById("input-gemini-key").value = savedKey;
        geminiApiKey = savedKey;
    }

    settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        goals.kcal = parseInt(document.getElementById("input-target-kcal").value);
        goals.protein = parseInt(document.getElementById("input-target-protein").value);
        goals.carbs = parseInt(document.getElementById("input-target-carbs").value);
        goals.fat = parseInt(document.getElementById("input-target-fat").value);
        goals.mode = document.getElementById("input-fitness-mode").value;
        
        // Save Gemini API Key
        const keyVal = document.getElementById("input-gemini-key").value.trim();
        localStorage.setItem("gemini_api_key", keyVal);
        geminiApiKey = keyVal;
        
        localStorage.setItem("nutrilens_goals", JSON.stringify(goals));
        showToast("Goals and settings updated successfully!", "success");
        
        // Return to Dashboard to view updated trackers
        switchView("view-dashboard");
    });

    // Toggle key visibility listener
    const btnToggleKey = document.getElementById("btn-toggle-key-visibility");
    const inputGeminiKey = document.getElementById("input-gemini-key");
    if (btnToggleKey && inputGeminiKey) {
        btnToggleKey.addEventListener("click", () => {
            if (inputGeminiKey.type === "password") {
                inputGeminiKey.type = "text";
                btnToggleKey.innerText = "Hide";
            } else {
                inputGeminiKey.type = "password";
                btnToggleKey.innerText = "Show";
            }
        });
    }

    // ----------------------------------------------------
    // START APPLICATION MAIN LOAD
    // ----------------------------------------------------
    initApp();
});
