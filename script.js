document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area");
    const container = document.getElementById("aphorism-container");
    
    // 【視覚的語彙の拡張：カテゴリー別に分けた数倍の記号】
    const symDensity = ['·', '⠄', '⠂', '⠁', '◦', '⸰', '◌', '⢀', '⡀', '⢄', '⡠', '⢂', '⡐', '⢁', '⡈'];
    const symGeometry = ['■', '▲', '▼', '◆', '⧖', '⬟', '⬡', '⬢', '⭔', '⭓', '◫', '◪', '◩', '▩', '▧', '▨', '▣'];
    const symLinear = ['—', '|', '╱', '╲', '◜', '◞', '◟', '◝', '〰', '⌇', '∿', '∣', '∥', '⦀', '╌', '╍', '┊', '┋', '┇'];
    const symAbstract = ['ꙮ', '⌭', '⍝', '⏣', '⎔', '⑆', '⑈', '⑌', '○', '●', '∴', '∵', '⋮', '⋯', '∰', '∮', '∲'];
    const allSymbols = [...symDensity, ...symGeometry, ...symLinear, ...symAbstract];
    
    const phases = [];
    const rng = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
    
    // 31の「相（フェーズ）」を生成し、劇的な視覚的変化をデザインする
    for(let i = 0; i < 31; i++) {
        const categoryRaw = Math.floor(rng(i * 10) * 3);
        const categories = ['density', 'geometry', 'linear'];
        const phaseType = categories[categoryRaw]; // 「密」「幾何」「線」のいずれか
        
        // 深淵度 (Depth): どれだけパララックス（視差）で動くか。浅い水面(低) 〜 底なしの深淵(高)をランダムに
        const abyssFactor = rng(i * 10 + 1); 
        
        // 幽霊のような薄さ(幽玄)か、強い実体か
        const opacityTheme = rng(i * 10 + 2); // 0.0 ~ 1.0 (Low = ghost, High = solid)
        
        const speedBase = 3 + rng(i * 10 + 3) * 20; // 揺らぎの速度ベース (3s 〜 23s)
        const colorTint = { 
            r: Math.floor(rng(i * 10 + 4)*60)-30, 
            g: Math.floor(rng(i * 10 + 5)*60)-30, 
            b: Math.floor(rng(i * 10 + 6)*60)-30 
        };

        let patternLayouts = [];
        
        if (phaseType === 'density') {
            // 【「密」の相 (Density)】数百の極小記号が中心部に密集、星雲や細胞のよう
            const count = 300 + Math.floor(rng(i*20) * 500); // 300〜800個
            for(let j=0; j<count; j++) {
                // 中央に集まるガウス分布的な配置
                const u = (Math.random() + Math.random() + Math.random()) / 3;
                const v = (Math.random() + Math.random() + Math.random()) / 3;
                patternLayouts.push({
                    sym: Math.random() < 0.9 ? symDensity[Math.floor(Math.random()*symDensity.length)] : allSymbols[Math.floor(Math.random()*allSymbols.length)],
                    top: -10 + (u * 120),
                    left: -10 + (v * 120),
                    size: 2 + Math.random() * 8, // 極小〜小 (2px〜10px)
                    opacity: opacityTheme < 0.5 ? (0.05 + Math.random()*0.15) : (0.2 + Math.random()*0.4),
                    rotate: Math.random() * 360
                });
            }
        } else if (phaseType === 'geometry') {
            // 【「幾何」の相 (Geometry)】少数の巨大記号が黄金比や対角線に配置され、強烈な緊張感を生む
            const count = 3 + Math.floor(rng(i*20) * 12); // 3〜14個
            const focusPoints = [
                {t: 50, l: 50}, {t: 38.2, l: 38.2}, {t: 61.8, l: 61.8}, 
                {t: 20, l: 80}, {t: 80, l: 20}, {t: 38.2, l: 61.8}, {t: 61.8, l: 38.2}
            ];
            for(let j=0; j<count; j++) {
                const pt = focusPoints[j % focusPoints.length];
                patternLayouts.push({
                    sym: symGeometry[Math.floor(Math.random()*symGeometry.length)],
                    top: pt.t + (Math.random() * 15 - 7.5), // わずかに焦点をずらして有機的に
                    left: pt.l + (Math.random() * 15 - 7.5),
                    size: 60 + Math.random() * 250, // 巨大 (60px〜310px)
                    opacity: opacityTheme < 0.5 ? (0.1 + Math.random()*0.3) : (0.6 + Math.random()*0.35),
                    rotate: Math.floor(Math.random() * 8) * 45 // 幾何学的な直角・45度の傾き
                });
            }
        } else {
            // 【「線」の相 (Linearity)】特定の向きを持った記号が流れやリズムを生み出す
            const count = 60 + Math.floor(rng(i*20) * 120); // 60〜180個
            const flowDirection = rng(i*30) > 0.5 ? 'horizontal' : 'vertical';
            const chaos = rng(i*40) * 30; // 秩序か混沌か
            for(let j=0; j<count; j++) {
                let top, left, rotBase;
                if (flowDirection === 'horizontal') {
                    top = (Math.floor(j / 8) * 10) % 100 + (Math.random() * chaos - chaos/2);
                    left = -20 + Math.random() * 140;
                    rotBase = 0;
                } else {
                    left = (Math.floor(j / 8) * 10) % 100 + (Math.random() * chaos - chaos/2);
                    top = -20 + Math.random() * 140;
                    rotBase = 90;
                }
                patternLayouts.push({
                    sym: symLinear[Math.floor(Math.random()*symLinear.length)],
                    top: top,
                    left: left,
                    size: 15 + Math.random() * 60, // 中〜大 (15px〜75px)
                    opacity: opacityTheme < 0.5 ? (0.1 + Math.random()*0.4) : (0.3 + Math.random()*0.5),
                    rotate: rotBase + (Math.random() * 20 - 10) // 基準方向から少し揺らぐ
                });
            }
        }
        
        phases.push({
            type: phaseType,
            layouts: patternLayouts,
            speedBase: speedBase,
            abyssFactor: abyssFactor,
            colorTint: colorTint
        });
    }

    let currentIndex = 0;
    let isTransitioning = false;
    
    // フェーズを描画
    const renderPhase = (phase, seedIndex) => {
        contentArea.innerHTML = ''; 
        
        phase.layouts.forEach((layout, idx) => {
            const span = document.createElement("span");
            span.textContent = layout.sym;
            span.className = "symbol";
            
            // ブラックトーン〜ライトグレーのベース色計算
            let baseGray = 50 + Math.floor(Math.random() * 150);
            if(Math.random() < 0.2) baseGray = 20 + Math.floor(Math.random() * 20); // ダークなコア
            
            const r = Math.max(0, Math.min(255, baseGray + phase.colorTint.r));
            const g = Math.max(0, Math.min(255, baseGray + phase.colorTint.g));
            const b = Math.max(0, Math.min(255, baseGray + phase.colorTint.b));
            span.style.color = `rgb(${r}, ${g}, ${b})`;
            
            // 描画深度 (z-index)
            const zIndex = Math.floor(Math.random() * 100);
            
            // 重力（引力）の計算：abyssFactor（深淵度）が高いほど、奥や手前へ極端に動く
            // 浅い水面の時はほとんど動かず、深淵の時は強烈なパララックスが発生する
            const pullMultiplier = 0.2 + (phase.abyssFactor * 3.0); 
            const pullFactor = (zIndex - 50) * pullMultiplier; 
            
            // 独立した微動（催眠）アニメーションのドリフト量
            const driftDuration = phase.speedBase * (0.5 + Math.random());
            const driftX = (Math.random() - 0.5) * 15;
            const driftY = (Math.random() - 0.5) * 15;
            const delay = Math.random() * -20; 

            // プロパティとインラインスタイルの適用
            span.style.setProperty('--base-op', layout.opacity);
            span.style.setProperty('--pull', pullFactor);
            span.style.setProperty('--drift-dur', `${driftDuration}s`);
            span.style.setProperty('--drift-x', driftX);
            span.style.setProperty('--drift-y', driftY);
            
            span.style.fontSize = `${layout.size}px`;
            span.style.top = `${layout.top}%`;
            span.style.left = `${layout.left}%`;
            span.style.zIndex = zIndex;
            span.style.animationDelay = `${delay}s`;
            
            span.style.transform = `translate(-50%, -50%) rotate(${layout.rotate}deg)`;
            
            contentArea.appendChild(span);
        });
    };

    const transitionToNextPattern = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        contentArea.classList.remove("visible");
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % phases.length;
            renderPhase(phases[currentIndex], currentIndex);
            void contentArea.offsetWidth;
            contentArea.classList.add("visible");
            setTimeout(() => { isTransitioning = false; }, 2000);
        }, 2000);
    };

    const transitionToPrevPattern = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        contentArea.classList.remove("visible");
        
        setTimeout(() => {
            currentIndex = (currentIndex - 1 + phases.length) % phases.length;
            renderPhase(phases[currentIndex], currentIndex);
            void contentArea.offsetWidth;
            contentArea.classList.add("visible");
            setTimeout(() => { isTransitioning = false; }, 2000);
        }, 2000);
    };

    renderPhase(phases[currentIndex], currentIndex);
    setTimeout(() => { contentArea.classList.add("visible"); }, 100);

    const prevBtn = document.getElementById("nav-btn-prev");
    const nextBtn = document.getElementById("nav-btn-next");
    const shareBtn = document.getElementById("share-toggle");

    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); transitionToPrevPattern(); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); transitionToNextPattern(); });
    if (shareBtn) shareBtn.addEventListener("click", (e) => { e.stopPropagation(); alert("シェア機能が呼び出されました。"); });
    
    container.addEventListener("click", transitionToNextPattern);
    
    // 【ホバー時の「重力」演出】
    container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        // -1.0 から 1.0 の座標系
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        contentArea.style.setProperty('--mx', x);
        contentArea.style.setProperty('--my', y);
    });
    
    container.addEventListener("mouseleave", () => {
        contentArea.style.setProperty('--mx', 0);
        contentArea.style.setProperty('--my', 0);
    });
});
