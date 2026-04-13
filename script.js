document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area");
    
    // 静寂を表現する様々なUnicode記号群（数学記号や幾何学記号を大幅に追加し、人間の目に奇妙に映る複雑さを生む）
    const symbolDictionary = ['○', '●', '△', '▲', '□', '■', '◇', '◆', '✶', '✧', '✦', '◦', '◒', '◓', '◔', '◕', '◍', '◎', '∴', '∵', '⋮', '⋯', '∿', '∇', '∞', '∫', '≈', '≎', '⊕', '⊗', '∥', '⟡', '⟢', '⟣', '⧫', '⬡', '⬢', '⭘', '⨯', '⨀', '⨁', '⨂'];
    
    // 31種類の異なる記号パターン（配列）を生成する
    const patterns = [];
    
    // 乱数ジェネレーター（インデックスごとに固定の結果を生成し、31種類の固定配列を作るため）
    const rng = (seed) => {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    
    for(let i = 0; i < 31; i++) {
        // 密度をさらに約70%引き上げ、情報過多のアート空間へ（約90個 ～ 260個）
        let numSymbols = 88 + Math.floor(rng(i * 10 + 1) * 176);
        let pattern = [];
        for(let j = 0; j < numSymbols; j++) {
            // ディクショナリーからランダムに記号を選択
            const symbolIndex = Math.floor(rng(i * 100 + j + 5) * symbolDictionary.length);
            pattern.push(symbolDictionary[symbolIndex]);
        }
        patterns.push(pattern);
    }

    let currentIndex = 0;
    let isTransitioning = false; // 連続クリックによる進行防止
    
    // パターンを描画する関数
    const renderPattern = (pattern) => {
        contentArea.innerHTML = ''; // クリア
        
        pattern.forEach((sym) => {
            const span = document.createElement("span");
            span.textContent = sym;
            span.className = "symbol";
            
            // 北欧デザインを意識した洗練された「黒」と「グレー」の2色（濃淡）
            const isBlack = Math.random() < 0.25; // 25%の確率で引き締まった黒
            const baseGrays = [150, 180, 210]; // グレーのバリエーション
            
            let color;
            if (isBlack) {
                color = '#222222'; // 暖かみと深みのあるオフブラック
            } else {
                // グレーを選択
                const g = baseGrays[Math.floor(Math.random() * baseGrays.length)];
                color = `rgb(${g}, ${g}, ${g})`;
            }
            
            // 不透明度 (0.05 ～ 0.9)
            const opacity = 0.05 + (Math.random() * 0.85);
            
            // 異なるフォントサイズ (0.1rem ～ 30rem) - 累乗を使って「極小の無数のチリ」と「ごく少数の強烈な巨大物体」という二極化を作る
            const size = 0.1 + (Math.pow(Math.random(), 3) * 30);
            
            // 画面中心部に密集させつつも枠外まで広げる (-30% ~ 130%)
            const top = -30 + Math.random() * 160;
            const left = -30 + Math.random() * 160;
            
            // 傾きと、非対称な歪み（ストレッチ・スクワッシュ）を加えて、既存の記号の認識を崩す
            const rotate = Math.random() * 360;
            const scaleX = 0.2 + Math.random() * 2.5; // 横に引き伸ばすなど
            const scaleY = 0.2 + Math.random() * 2.5; // 縦に引き伸ばすなど
            
            // ランダムで一部の記号に「ぼかし」を追加して焦点の狂いを生む
            const blurAmount = Math.random() < 0.5 ? (Math.pow(Math.random(), 3) * 15) : 0; 

            span.style.color = color;
            span.style.opacity = opacity;
            span.style.fontSize = `${size}rem`;
            span.style.top = `${top}%`;
            span.style.left = `${left}%`;
            // rotate と scale を組み合わせることで、見慣れた記号が未知の抽象図形に化ける
            span.style.transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;
            if (blurAmount > 0) span.style.filter = `blur(${blurAmount}px)`;
            
            contentArea.appendChild(span);
        });
    };

    // 次の抽象絵（記号パターン）へ遷移する関数
    const transitionToNextPattern = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        contentArea.classList.remove("visible");
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % patterns.length;
            renderPattern(patterns[currentIndex]);
            
            void contentArea.offsetWidth;
            
            contentArea.classList.add("visible");
            setTimeout(() => {
                isTransitioning = false;
            }, 2000);
        }, 2000);
    };

    // 前の抽象絵（記号パターン）へ遷移する関数
    const transitionToPrevPattern = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        contentArea.classList.remove("visible");
        
        setTimeout(() => {
            currentIndex = (currentIndex - 1 + patterns.length) % patterns.length;
            renderPattern(patterns[currentIndex]);
            
            void contentArea.offsetWidth;
            
            contentArea.classList.add("visible");
            setTimeout(() => {
                isTransitioning = false;
            }, 2000);
        }, 2000);
    };

    // 初期表示
    renderPattern(patterns[currentIndex]);
    setTimeout(() => {
        contentArea.classList.add("visible");
    }, 100);

    // イベントリスナーの登録（bodyクリックから固有のボタンへ変更）
    const prevBtn = document.getElementById("nav-btn-prev");
    const nextBtn = document.getElementById("nav-btn-next");
    const shareBtn = document.getElementById("share-toggle");

    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); transitionToPrevPattern(); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); transitionToNextPattern(); });
    
    // シェアボタンの挙動は、将来的な拡張性を考えて仮実装
    if (shareBtn) shareBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        alert("シェア機能が呼び出されました。");
    });
});
