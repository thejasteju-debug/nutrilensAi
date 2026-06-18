/* 
   NutriLens AI - Dynamic SVG Charting Library
   Renders premium, responsive charts without external dependencies.
*/

// Main helper to aggregate historical logs by date
function aggregateHistoryByDate(historyList, daysCount) {
    const data = [];
    const today = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Find all logs on this date (local date matching)
        const mealsOnDate = historyList.filter(log => {
            const logDateStr = new Date(log.timestamp).toISOString().split('T')[0];
            return logDateStr === dateStr;
        });
        
        const totalKcal = mealsOnDate.reduce((acc, curr) => acc + (curr.calories || 0), 0);
        const totalProtein = mealsOnDate.reduce((acc, curr) => acc + (curr.macros.protein || 0), 0);
        const totalCarbs = mealsOnDate.reduce((acc, curr) => acc + (curr.macros.carbs || 0), 0);
        const totalFat = mealsOnDate.reduce((acc, curr) => acc + (curr.macros.fat || 0), 0);
        
        // Formatted label e.g. "Jun 11" or "11 Jun"
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        data.push({
            dateString: dateStr,
            label: label,
            calories: totalKcal,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat
        });
    }
    
    return data;
}

// Draw Calorie surplus bar chart
function drawCalorieChart(containerId, historyList, targetKcal, daysCount = 7) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; // Clear
    
    const data = aggregateHistoryByDate(historyList, daysCount);
    
    // SVG Dimensions
    const width = 600;
    const height = 300;
    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Find Max Value for scaling
    let maxVal = Math.max(...data.map(d => d.calories), targetKcal);
    maxVal = Math.ceil((maxVal * 1.15) / 500) * 500; // Add 15% headroom, round to nearest 500
    if (maxVal < 1000) maxVal = 1000;
    
    // SVG Boilerplate
    let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // Gradients definitions
    svgHtml += `
        <defs>
            <linearGradient id="cal-bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-calories)" stop-opacity="1" />
                <stop offset="100%" stop-color="var(--color-calories)" stop-opacity="0.3" />
            </linearGradient>
            <linearGradient id="cal-surplus-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="1" />
                <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.4" />
            </linearGradient>
        </defs>
    `;
    
    // Draw horizontal grid lines & Y-axis labels
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
        const val = Math.round((maxVal / gridCount) * i);
        const y = height - paddingBottom - (chartHeight / gridCount) * i;
        
        // Grid Line
        svgHtml += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />`;
        // Label
        svgHtml += `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" class="chart-label-text">${val}</text>`;
    }
    
    // Draw target baseline line (e.g. 3000 kcal target)
    const targetY = height - paddingBottom - (chartHeight / maxVal) * targetKcal;
    svgHtml += `
        <line x1="${paddingLeft}" y1="${targetY}" x2="${width - paddingRight}" y2="${targetY}" stroke="rgba(255, 111, 67, 0.4)" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${width - paddingRight - 10}" y="${targetY - 6}" text-anchor="end" fill="var(--color-primary)" font-size="9" font-weight="600">Goal: ${targetKcal} kcal</text>
    `;
    
    // Calculate Bar widths
    const barSpacing = daysCount === 7 ? 20 : 6;
    const totalSpacing = barSpacing * (daysCount - 1);
    const barWidth = (chartWidth - totalSpacing) / daysCount;
    
    // Draw Bars
    data.forEach((d, index) => {
        const x = paddingLeft + index * (barWidth + barSpacing);
        const barHeight = (chartHeight / maxVal) * d.calories;
        const y = height - paddingBottom - barHeight;
        
        // Date X label
        // For monthly, only show label every 5 days to prevent overlap
        if (daysCount === 7 || index % 5 === 0 || index === daysCount - 1) {
            svgHtml += `<text x="${x + barWidth / 2}" y="${height - 15}" text-anchor="middle" class="chart-label-text">${d.label}</text>`;
        }
        
        if (d.calories > 0) {
            // Decide color (surplus vs normal)
            const fillGradient = d.calories >= targetKcal ? "url(#cal-surplus-gradient)" : "url(#cal-bar-gradient)";
            const glowFilter = d.calories >= targetKcal ? "filter: drop-shadow(0 0 4px rgba(255, 111, 67, 0.25));" : "";
            
            svgHtml += `
                <rect 
                    x="${x}" 
                    y="${y}" 
                    width="${barWidth}" 
                    height="${barHeight}" 
                    rx="${Math.min(4, barWidth / 2)}" 
                    ry="${Math.min(4, barWidth / 2)}" 
                    fill="${fillGradient}" 
                    class="chart-bar-rect" 
                    style="${glowFilter}"
                    data-calories="${d.calories}"
                    data-label="${d.label}"
                    data-date="${d.dateString}"
                />
            `;
        } else {
            // Placeholder empty bar indicator
            svgHtml += `
                <rect 
                    x="${x}" 
                    y="${height - paddingBottom - 4}" 
                    width="${barWidth}" 
                    height="4" 
                    rx="2"
                    fill="rgba(255,255,255,0.03)" 
                />
            `;
        }
    });
    
    // Close SVG
    svgHtml += `</svg>`;
    
    // Draw tooltip box inside container if not already exists
    let tooltip = container.querySelector(".chart-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "chart-tooltip";
        container.appendChild(tooltip);
    }
    
    // Set SVG content
    const svgWrapper = document.createElement("div");
    svgWrapper.style.width = "100%";
    svgWrapper.style.height = "100%";
    svgWrapper.innerHTML = svgHtml;
    container.appendChild(svgWrapper);
    
    // Add Tooltip Hover Events
    const bars = container.querySelectorAll(".chart-bar-rect");
    bars.forEach(bar => {
        bar.addEventListener("mouseenter", (e) => {
            const kcal = e.target.getAttribute("data-calories");
            const dateStr = e.target.getAttribute("data-label");
            const surplus = kcal - targetKcal;
            
            let surplusText = "";
            if (surplus >= 0) {
                surplusText = `<div style="color: var(--color-primary); font-weight:600;">+${surplus} kcal Surplus 🔥</div>`;
            } else {
                surplusText = `<div style="color: var(--color-text-muted);">${Math.abs(surplus)} kcal below target</div>`;
            }
            
            tooltip.innerHTML = `
                <div style="font-weight: 700; margin-bottom:4px;">${dateStr}</div>
                <div>Intake: <strong>${kcal} kcal</strong></div>
                ${surplusText}
            `;
            tooltip.style.display = "block";
        });
        
        bar.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left + 15;
            const y = e.clientY - rect.top - 50;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
        
        bar.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}

// Draw Protein Intake Curve Chart
function drawProteinChart(containerId, historyList, targetProtein, daysCount = 7) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; // Clear
    
    const data = aggregateHistoryByDate(historyList, daysCount);
    
    // SVG Dimensions
    const width = 600;
    const height = 300;
    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Find Max Value for scaling
    let maxVal = Math.max(...data.map(d => d.protein), targetProtein);
    maxVal = Math.ceil((maxVal * 1.15) / 20) * 20; // Headroom, round to nearest 20g
    if (maxVal < 50) maxVal = 50;
    
    // SVG Boilerplate
    let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // Gradient definition
    svgHtml += `
        <defs>
            <linearGradient id="proteins-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-protein)" stop-opacity="0.3" />
                <stop offset="100%" stop-color="var(--color-protein)" stop-opacity="0.0" />
            </linearGradient>
        </defs>
    `;
    
    // Draw Y grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
        const val = Math.round((maxVal / gridCount) * i);
        const y = height - paddingBottom - (chartHeight / gridCount) * i;
        
        svgHtml += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />`;
        svgHtml += `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" class="chart-label-text">${val}g</text>`;
    }
    
    // Draw target line
    const targetY = height - paddingBottom - (chartHeight / maxVal) * targetProtein;
    svgHtml += `
        <line x1="${paddingLeft}" y1="${targetY}" x2="${width - paddingRight}" y2="${targetY}" stroke="rgba(59, 130, 246, 0.4)" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${width - paddingRight - 10}" y="${targetY - 6}" text-anchor="end" fill="var(--color-protein)" font-size="9" font-weight="600">Hypertrophy Goal: ${targetProtein}g</text>
    `;
    
    // Calculate point positions
    const points = [];
    const stepX = chartWidth / (daysCount - 1);
    
    data.forEach((d, index) => {
        const x = paddingLeft + index * stepX;
        const y = height - paddingBottom - (chartHeight / maxVal) * d.protein;
        points.push({ x, y, val: d.protein, label: d.label, dateString: d.dateString });
        
        // Draw X Axis dates
        if (daysCount === 7 || index % 5 === 0 || index === daysCount - 1) {
            svgHtml += `<text x="${x}" y="${height - 15}" text-anchor="middle" class="chart-label-text">${d.label}</text>`;
        }
    });
    
    // Construct Line Path (Bezier Curve)
    if (points.length > 1) {
        let pathD = `M ${points[0].x} ${points[0].y}`;
        let areaD = `M ${points[0].x} ${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            const p0 = points[i - 1];
            const p = points[i];
            // Control points for smooth bezier curve
            const cpX1 = p0.x + stepX / 3;
            const cpY1 = p0.y;
            const cpX2 = p.x - stepX / 3;
            const cpY2 = p.y;
            
            pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
            areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
        }
        
        // Complete Area Path
        areaD += ` L ${points[points.length - 1].x} ${height - paddingBottom}`;
        areaD += ` L ${points[0].x} ${height - paddingBottom} Z`;
        
        // Draw shaded area
        svgHtml += `<path d="${areaD}" class="chart-line-area chart-gradient-proteins" />`;
        
        // Draw path line
        svgHtml += `<path d="${pathD}" class="chart-line-path chart-line-proteins" />`;
    }
    
    // Draw circles at data point peaks
    points.forEach(p => {
        svgHtml += `
            <circle 
                cx="${p.x}" 
                cy="${p.y}" 
                r="4.5" 
                class="chart-dot-marker chart-dot-proteins" 
                data-protein="${p.val}"
                data-label="${p.label}"
                data-date="${p.dateString}"
            />
        `;
    });
    
    svgHtml += `</svg>`;
    
    // Setup Tooltip
    let tooltip = container.querySelector(".chart-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "chart-tooltip";
        container.appendChild(tooltip);
    }
    
    // Set content
    const svgWrapper = document.createElement("div");
    svgWrapper.style.width = "100%";
    svgWrapper.style.height = "100%";
    svgWrapper.innerHTML = svgHtml;
    container.appendChild(svgWrapper);
    
    // Add dot triggers
    const dots = container.querySelectorAll(".chart-dot-marker");
    dots.forEach(dot => {
        dot.addEventListener("mouseenter", (e) => {
            const pro = e.target.getAttribute("data-protein");
            const dateStr = e.target.getAttribute("data-label");
            const gap = pro - targetProtein;
            
            let gapText = "";
            if (gap >= 0) {
                gapText = `<div style="color: var(--color-protein); font-weight:600;">HITTING TARGET (+${gap}g) ⚡</div>`;
            } else {
                gapText = `<div style="color: #ef4444;">Need ${Math.abs(gap)}g more for muscle growth</div>`;
            }
            
            tooltip.innerHTML = `
                <div style="font-weight: 700; margin-bottom:4px;">${dateStr}</div>
                <div>Protein: <strong>${pro}g</strong></div>
                ${gapText}
            `;
            tooltip.style.display = "block";
        });
        
        dot.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left + 15;
            const y = e.clientY - rect.top - 50;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
        
        dot.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}

// Draw Carbs Intake Curve Chart
function drawCarbsChart(containerId, historyList, targetCarbs, daysCount = 7) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; // Clear
    
    const data = aggregateHistoryByDate(historyList, daysCount);
    
    // SVG Dimensions
    const width = 600;
    const height = 300;
    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Find Max Value for scaling
    let maxVal = Math.max(...data.map(d => d.carbs), targetCarbs);
    maxVal = Math.ceil((maxVal * 1.15) / 50) * 50; // Headroom, round to nearest 50g
    if (maxVal < 100) maxVal = 100;
    
    // SVG Boilerplate
    let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // Gradient definition
    svgHtml += `
        <defs>
            <linearGradient id="carbs-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-carbs)" stop-opacity="0.3" />
                <stop offset="100%" stop-color="var(--color-carbs)" stop-opacity="0.0" />
            </linearGradient>
        </defs>
    `;
    
    // Draw Y grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
        const val = Math.round((maxVal / gridCount) * i);
        const y = height - paddingBottom - (chartHeight / gridCount) * i;
        
        svgHtml += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />`;
        svgHtml += `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" class="chart-label-text">${val}g</text>`;
    }
    
    // Draw target line
    const targetY = height - paddingBottom - (chartHeight / maxVal) * targetCarbs;
    svgHtml += `
        <line x1="${paddingLeft}" y1="${targetY}" x2="${width - paddingRight}" y2="${targetY}" stroke="rgba(245, 158, 11, 0.4)" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${width - paddingRight - 10}" y="${targetY - 6}" text-anchor="end" fill="var(--color-carbs)" font-size="9" font-weight="600">Goal: ${targetCarbs}g</text>
    `;
    
    // Calculate point positions
    const points = [];
    const stepX = chartWidth / (daysCount - 1);
    
    data.forEach((d, index) => {
        const x = paddingLeft + index * stepX;
        const y = height - paddingBottom - (chartHeight / maxVal) * d.carbs;
        points.push({ x, y, val: d.carbs, label: d.label, dateString: d.dateString });
        
        // Draw X Axis dates
        if (daysCount === 7 || index % 5 === 0 || index === daysCount - 1) {
            svgHtml += `<text x="${x}" y="${height - 15}" text-anchor="middle" class="chart-label-text">${d.label}</text>`;
        }
    });
    
    // Construct Line Path (Bezier Curve)
    if (points.length > 1) {
        let pathD = `M ${points[0].x} ${points[0].y}`;
        let areaD = `M ${points[0].x} ${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            const p0 = points[i - 1];
            const p = points[i];
            const cpX1 = p0.x + stepX / 3;
            const cpY1 = p0.y;
            const cpX2 = p.x - stepX / 3;
            const cpY2 = p.y;
            
            pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
            areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
        }
        
        areaD += ` L ${points[points.length - 1].x} ${height - paddingBottom}`;
        areaD += ` L ${points[0].x} ${height - paddingBottom} Z`;
        
        svgHtml += `<path d="${areaD}" class="chart-line-area chart-gradient-carbs" />`;
        svgHtml += `<path d="${pathD}" class="chart-line-path chart-line-carbs" />`;
    }
    
    // Draw circles at data point peaks
    points.forEach(p => {
        svgHtml += `
            <circle 
                cx="${p.x}" 
                cy="${p.y}" 
                r="4.5" 
                class="chart-dot-marker chart-dot-carbs" 
                data-carbs="${p.val}"
                data-label="${p.label}"
                data-date="${p.dateString}"
            />
        `;
    });
    
    svgHtml += `</svg>`;
    
    // Setup Tooltip
    let tooltip = container.querySelector(".chart-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "chart-tooltip";
        container.appendChild(tooltip);
    }
    
    // Set content
    const svgWrapper = document.createElement("div");
    svgWrapper.style.width = "100%";
    svgWrapper.style.height = "100%";
    svgWrapper.innerHTML = svgHtml;
    container.appendChild(svgWrapper);
    
    // Add dot triggers
    const dots = container.querySelectorAll(".chart-dot-marker");
    dots.forEach(dot => {
        dot.addEventListener("mouseenter", (e) => {
            const carbVal = e.target.getAttribute("data-carbs");
            const dateStr = e.target.getAttribute("data-label");
            const gap = carbVal - targetCarbs;
            
            let gapText = "";
            if (gap >= 0) {
                gapText = `<div style="color: var(--color-carbs); font-weight:600;">HITTING TARGET (+${gap}g) ⚡</div>`;
            } else {
                gapText = `<div style="color: #ef4444;">Need ${Math.abs(gap)}g more for carbs target</div>`;
            }
            
            tooltip.innerHTML = `
                <div style="font-weight: 700; margin-bottom:4px;">${dateStr}</div>
                <div>Carbohydrates: <strong>${carbVal}g</strong></div>
                ${gapText}
            `;
            tooltip.style.display = "block";
        });
        
        dot.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left + 15;
            const y = e.clientY - rect.top - 50;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
        
        dot.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}

// Draw Fat Intake Curve Chart
function drawFatChart(containerId, historyList, targetFat, daysCount = 7) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; // Clear
    
    const data = aggregateHistoryByDate(historyList, daysCount);
    
    // SVG Dimensions
    const width = 600;
    const height = 300;
    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Find Max Value for scaling
    let maxVal = Math.max(...data.map(d => d.fat), targetFat);
    maxVal = Math.ceil((maxVal * 1.15) / 10) * 10; // Headroom, round to nearest 10g
    if (maxVal < 20) maxVal = 20;
    
    // SVG Boilerplate
    let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;
    
    // Gradient definition
    svgHtml += `
        <defs>
            <linearGradient id="fat-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-fat)" stop-opacity="0.3" />
                <stop offset="100%" stop-color="var(--color-fat)" stop-opacity="0.0" />
            </linearGradient>
        </defs>
    `;
    
    // Draw Y grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
        const val = Math.round((maxVal / gridCount) * i);
        const y = height - paddingBottom - (chartHeight / gridCount) * i;
        
        svgHtml += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />`;
        svgHtml += `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" class="chart-label-text">${val}g</text>`;
    }
    
    // Draw target line
    const targetY = height - paddingBottom - (chartHeight / maxVal) * targetFat;
    svgHtml += `
        <line x1="${paddingLeft}" y1="${targetY}" x2="${width - paddingRight}" y2="${targetY}" stroke="rgba(236, 72, 153, 0.4)" stroke-width="2" stroke-dasharray="6,4" />
        <text x="${width - paddingRight - 10}" y="${targetY - 6}" text-anchor="end" fill="var(--color-fat)" font-size="9" font-weight="600">Goal: ${targetFat}g</text>
    `;
    
    // Calculate point positions
    const points = [];
    const stepX = chartWidth / (daysCount - 1);
    
    data.forEach((d, index) => {
        const x = paddingLeft + index * stepX;
        const y = height - paddingBottom - (chartHeight / maxVal) * d.fat;
        points.push({ x, y, val: d.fat, label: d.label, dateString: d.dateString });
        
        // Draw X Axis dates
        if (daysCount === 7 || index % 5 === 0 || index === daysCount - 1) {
            svgHtml += `<text x="${x}" y="${height - 15}" text-anchor="middle" class="chart-label-text">${d.label}</text>`;
        }
    });
    
    // Construct Line Path (Bezier Curve)
    if (points.length > 1) {
        let pathD = `M ${points[0].x} ${points[0].y}`;
        let areaD = `M ${points[0].x} ${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            const p0 = points[i - 1];
            const p = points[i];
            const cpX1 = p0.x + stepX / 3;
            const cpY1 = p0.y;
            const cpX2 = p.x - stepX / 3;
            const cpY2 = p.y;
            
            pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
            areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
        }
        
        areaD += ` L ${points[points.length - 1].x} ${height - paddingBottom}`;
        areaD += ` L ${points[0].x} ${height - paddingBottom} Z`;
        
        svgHtml += `<path d="${areaD}" class="chart-line-area chart-gradient-fat" />`;
        svgHtml += `<path d="${pathD}" class="chart-line-path chart-line-fat" />`;
    }
    
    // Draw circles at data point peaks
    points.forEach(p => {
        svgHtml += `
            <circle 
                cx="${p.x}" 
                cy="${p.y}" 
                r="4.5" 
                class="chart-dot-marker chart-dot-fat" 
                data-fat="${p.val}"
                data-label="${p.label}"
                data-date="${p.dateString}"
            />
        `;
    });
    
    svgHtml += `</svg>`;
    
    // Setup Tooltip
    let tooltip = container.querySelector(".chart-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "chart-tooltip";
        container.appendChild(tooltip);
    }
    
    // Set content
    const svgWrapper = document.createElement("div");
    svgWrapper.style.width = "100%";
    svgWrapper.style.height = "100%";
    svgWrapper.innerHTML = svgHtml;
    container.appendChild(svgWrapper);
    
    // Add dot triggers
    const dots = container.querySelectorAll(".chart-dot-marker");
    dots.forEach(dot => {
        dot.addEventListener("mouseenter", (e) => {
            const fatVal = e.target.getAttribute("data-fat");
            const dateStr = e.target.getAttribute("data-label");
            const gap = fatVal - targetFat;
            
            let gapText = "";
            if (gap >= 0) {
                gapText = `<div style="color: var(--color-fat); font-weight:600;">HITTING TARGET (+${gap}g) ⚡</div>`;
            } else {
                gapText = `<div style="color: #ef4444;">Need ${Math.abs(gap)}g more for fats target</div>`;
            }
            
            tooltip.innerHTML = `
                <div style="font-weight: 700; margin-bottom:4px;">${dateStr}</div>
                <div>Dietary Fat: <strong>${fatVal}g</strong></div>
                ${gapText}
            `;
            tooltip.style.display = "block";
        });
        
        dot.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left + 15;
            const y = e.clientY - rect.top - 50;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
        
        dot.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}
