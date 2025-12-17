// DOM要素を取得
const colorText = document.getElementById('color-text');
const changeButton = document.getElementById('change-button');

// 色の配列を定義
const colors = ['#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#3498db', '#1abc9c'];

// ランダムな色を生成する関数
function getRandomColor() {
    // 0 から colors.length - 1 までのランダムな整数を生成
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// ボタンがクリックされた時の処理を設定
changeButton.addEventListener('click', () => {
    // 1. ランダムな色を取得
    const newColor = getRandomColor();
    
    // 2. h1要素のテキストの色を変更
    colorText.style.color = newColor;
    
    // (おまけ) テキストの内容も変更
    colorText.textContent = `Color is ${newColor}`;
});

// ページロード時に初期の色を設定
colorText.style.color = colors[0];