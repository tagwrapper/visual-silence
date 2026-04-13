document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area");
    
    // 静寂を表現する様々なUnicode記号群
    const symbolDictionary = ['○', '●', '△', '▲', '□', '■', '◇', '◆', '✶', '✧', '✦', '◦', '◒', '◓', '◔', '◕', '◍', '◎', '∴', '∵', '⋮', '⋯'];
    
    // 31種類の異なる記号パターン（配列）を生成する
    const patterns = [];
    
    // 乱数ジェネレーター（インデックスごとに固定の結果を生成し、31種類の固定配列を作るため）
    const rng = (seed) => {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    
    for(let i = 0; i < 31; i++) {
        // パターンごとに 4個 ～ 9個 の記号を持たせる
        let numSymbols = 4 + Math.floor(rng(i * 10 + 1) * 6);
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
            
            // ご指定の通り様々な色使い（HSLを使って彩度や明度を調整し、鮮やかさと馴染みやすさを両立）
            const hue = Math.floor(Math.random() * 360);
            const sat = 40 + Math.random() * 60; // 40% ~ 100%
            const lit = 40 + Math.random() * 40; // 40% ~ 80%
            const color = `hsl(${hue}, ${sat}%, ${lit}%)`;
            
            // 不透明度 (0.2 ～ 0.8)
            const opacity = 0.15 + (Math.random() * 0.55);
            
            // 異なるフォントサイズ (2rem ～ 8rem)
            const size = 2 + (Math.random() * 6);
            
            // 画面の中央付近にランダム配置 (中心を基準にある程度散らばらせる)
            const top = 20 + Math.random() * 60; // 20% ~ 80%
            const left = 20 + Math.random() * 60; // 20% ~ 80%
            
            // 微妙な傾きを追加
            const rotate = Math.random() * 360;
            
            span.style.color = color;
            span.style.opacity = opacity;
            span.style.fontSize = `${size}rem`;
            span.style.top = `${top}%`;
            span.style.left = `${left}%`;
            span.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
            
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
