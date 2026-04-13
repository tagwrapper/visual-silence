document.addEventListener("DOMContentLoaded", () => {
    // 完全に静寂にフォーカスするため、UIロジックなどは極限まで削減。
    // まず画像をゆっくりとフェードインさせる演出を加えます。
    const img = document.getElementById("gallery-image");
    
    // 初期状態を透明に
    img.style.opacity = "0";
    
    // 少し遅延を入れてからゆっくりと表示させることで「静寂」を強調
    setTimeout(() => {
        img.style.opacity = "1";
    }, 500);
});
