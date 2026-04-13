document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area");
    const container = document.getElementById("aphorism-container");
    
    // 単純さの極限：微細で抽象的な記号のプール
    // 基本記号、点線、円弧、ブロック、ブライユ点字、奇妙な多眼パターンなど
    const braille = Array.from({length: 64}, (_, i) => String.fromCharCode(0x2800 + Math.floor(Math.random() * 255)));
    const blockElements = ['░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '▞', '▚'];
    const simpleAbstract = ['·', '◌', '◜', '◞', '◟', '◝', '⧖', 'ꙮ', '⌭', '⍝', '⏣', '⎔', '⑆', '⑈', '⑌', '○', '●', '◦', '∴', '∵'];
    const symbolDictionary = [...braille, ...blockElements, ...simpleAbstract];
    
    // 31種類の「重力の位相（Phase）」を生成する
    const phases = [];
    const rng = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
    
    for(let i = 0; i < 31; i++) {
        // 重力の位相を定義
        const density = 200 + Math.floor(rng(i * 10 + 1) * 400); // 200〜600個の記号
        const speedBase = 5 + rng(i * 10 + 2) * 15; // 揺らぎの速度ベース (5s 〜 20s)
        
        // 色の微細な偏り（フェーズごとに赤み、青み、黄みなどが僅かに混じる）
        const rTint = Math.floor(rng(i * 10 + 3) * 40) - 20;
        const gTint = Math.floor(rng(i * 10 + 4) * 40) - 20;
        const bTint = Math.floor(rng(i * 10 + 5) * 40) - 20;

        let pattern = [];
        for(let j = 0; j < density; j++) {
            const symbolIndex = Math.floor(rng(i * 100 + j + 5) * symbolDictionary.length);
            pattern.push(symbolDictionary[symbolIndex]);
        }
        phases.push({
            symbols: pattern,
            speedBase: speedBase,
            colorTint: { r: rTint, g: gTint, b: bTint }
        });
    }

    let currentIndex = 0;
    let isTransitioning = false;
    
    // 星雲（フェーズ）を描画する関数
    const renderPhase = (phase, seedIndex) => {
        contentArea.innerHTML = ''; 
        
        phase.symbols.forEach((sym, idx) => {
            const span = document.createElement("span");
            span.textContent = sym;
            span.className = "symbol";
            
            // 色の計算（ベースのグレーに、フェーズ固有の微細なTintを加える）
            // 北欧系の濃いめのグレーから明るいグレーまで
            let baseGray = 50 + Math.floor(Math.random() * 150);
            
            // 20%の確率で極限まで黒に近い「重力の芯」を作る
            if(Math.random() < 0.2) baseGray = 20 + Math.floor(Math.random() * 20);
            
            const r = Math.max(0, Math.min(255, baseGray + phase.colorTint.r));
            const g = Math.max(0, Math.min(255, baseGray + phase.colorTint.g));
            const b = Math.max(0, Math.min(255, baseGray + phase.colorTint.b));
            span.style.color = `rgb(${r}, ${g}, ${b})`;
            
            // 不透明度 (10% ～ 90%) 密度のレイヤリング
            const baseOp = 0.1 + (Math.random() * 0.8);
            
            // フォントサイズ: 極小 (2px) から 中 (24px) までの極端な幅
            const sizePx = 2 + Math.floor(Math.pow(Math.random(), 2) * 22);
            
            // 画面中央を中心としたガウス分布的な偏りを持たせる（ブラックホール的密集）
            // Math.random() + Math.random() + Math.random() / 3 は 0.5 付近にピークを持つ
            const uTop = (Math.random() + Math.random() + Math.random()) / 3;
            const uLeft = (Math.random() + Math.random() + Math.random()) / 3;
            const top = -10 + (uTop * 120); // -10% ~ 110%
            const left = -10 + (uLeft * 120);
            
            const rotate = Math.random() * 360;
            
            // z-indexをランダムに割り当て視覚的な奥行きを強める
            const zIndex = Math.floor(Math.random() * 100);
            
            // マウス重力に引かれる係数（大きいほど強く引かれるか、逆位相になるか）
            // 重なり順(z-index)が手前のものほど強く引かれる（パララックス効果）
            const pullFactor = (zIndex - 50) * 1.5; 
            
            // 独立した微動アニメーションのパラメータ
            const driftDuration = phase.speedBase * (0.5 + Math.random());
            const driftX = (Math.random() - 0.5) * 10;
            const driftY = (Math.random() - 0.5) * 10;
            const delay = Math.random() * -20; // すぐにバラバラの位相で始まるようにマイナス遅延

            span.style.setProperty('--base-op', baseOp);
            span.style.setProperty('--pull', pullFactor);
            span.style.setProperty('--drift-dur', `${driftDuration}s`);
            span.style.setProperty('--drift-x', driftX);
            span.style.setProperty('--drift-y', driftY);
            
            span.style.fontSize = `${sizePx}px`;
            span.style.top = `${top}%`;
            span.style.left = `${left}%`;
            span.style.zIndex = zIndex;
            span.style.animationDelay = `${delay}s`;
            
            span.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
            
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

    // 初回描画
    renderPhase(phases[currentIndex], currentIndex);
    setTimeout(() => { contentArea.classList.add("visible"); }, 100);

    // イベントリスナー
    const prevBtn = document.getElementById("nav-btn-prev");
    const nextBtn = document.getElementById("nav-btn-next");
    const shareBtn = document.getElementById("share-toggle");

    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); transitionToPrevPattern(); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); transitionToNextPattern(); });
    
    if (shareBtn) shareBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        alert("シェア機能が呼び出されました。");
    });
    
    // 枠内（記号の星雲）をクリックした場合も次に進む（吸い込まれる誘発）
    container.addEventListener("click", transitionToNextPattern);
    
    // 【ホバー時の「重力」演出】
    // 枠内でのマウス座標を取得し、カスタムプロパティを更新する
    container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        // 中心を0とし、端を -1 〜 1 とする座標系 (-0.5~0.5 を作って 2倍)
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        
        contentArea.style.setProperty('--mx', x);
        contentArea.style.setProperty('--my', y);
    });
    
    // マウスが外れたら重力場をリセットしてゆっくり元に戻す
    container.addEventListener("mouseleave", () => {
        contentArea.style.setProperty('--mx', 0);
        contentArea.style.setProperty('--my', 0);
    });
});
