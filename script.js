// キャンバスとコンテキストの取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 定数
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const BUBBLE_RADIUS = 15;

// ゲームの状態を保持する変数
let bubbles = []; // 画面上の全てのバブル（固定されたものと発射中のもの）
let launcher = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30 };
let currentBubble = null; // 発射待機中のバブル

// --- クラス定義 (次項で説明) ---

// ゲームのメインループ
function gameLoop() {
    // 1. 描画をクリア
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. 状態の更新
    update();

    // 3. 描画
    draw();

    // 次のフレームをリクエスト
    requestAnimationFrame(gameLoop);
}

// 最初のバブルをセットアップ
function initializeGame() {
    // 最初の固定バブルをいくつか配置 (例: 3行)
    setupInitialBubbles();
    // プレイヤーが発射するバブルを生成
    spawnNewBubble();
}

// ゲーム開始
initializeGame();
gameLoop();
class Bubble {
    constructor(x, y, color, angle = 0, speed = 0) {
        this.x = x;
        this.y = y;
        this.radius = BUBBLE_RADIUS;
        this.color = color;
        this.vx = Math.cos(angle) * speed; // X方向の速度
        this.vy = Math.sin(angle) * speed; // Y方向の速度
        this.isFixed = true; // true: 壁に固定されている / false: 発射中
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // 発射中のバブルの位置を更新
    updatePosition() {
        if (!this.isFixed) {
            this.x += this.vx;
            this.y += this.vy;
        }
    }
}
function update() {
    // 1. 発射中のバブルの処理
    if (currentBubble && !currentBubble.isFixed) {
        currentBubble.updatePosition();

        // 壁との衝突判定 (左右)
        if (currentBubble.x - BUBBLE_RADIUS < 0 || currentBubble.x + BUBBLE_RADIUS > CANVAS_WIDTH) {
            currentBubble.vx *= -1; // 速度を反転
        }

        // 天井との衝突判定
        if (currentBubble.y - BUBBLE_RADIUS < 0) {
            currentBubble.isFixed = true;
            // 衝突処理とバブルのクラスター判定を呼び出す (別途実装が必要)
            handleCollision(currentBubble);
            spawnNewBubble();
        }

        // 2. 固定バブルとの衝突判定
        for (let i = 0; i < bubbles.length; i++) {
            const fixedBubble = bubbles[i];
            if (fixedBubble.isFixed) {
                const dx = currentBubble.x - fixedBubble.x;
                const dy = currentBubble.y - fixedBubble.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 衝突距離 (半径の2倍)
                if (distance < BUBBLE_RADIUS * 2) {
                    currentBubble.isFixed = true;
                    // 衝突したバブルをbubbles配列に追加
                    bubbles.push(currentBubble);
                    // 衝突処理とクラスター判定
                    handleCollision(currentBubble); 
                    spawnNewBubble();
                    break;
                }
            }
        }
    }
}
function draw() {
    // 1. 固定バブルと発射中のバブルを描画
    for (const bubble of bubbles) {
        bubble.draw();
    }
    if (currentBubble) {
        currentBubble.draw();
    }

    // 2. ランチャー（砲台）を描画 (シンプルに線で表現)
    ctx.fillStyle = '#34495e';
    ctx.fillRect(launcher.x - 5, launcher.y, 10, 30); 
}
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
const BUBBLE_SPEED = 10;

function spawnNewBubble() {
    // ランダムな色で新しいバブルを生成
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    // ランチャーの位置にセット
    currentBubble = new Bubble(launcher.x, launcher.y, randomColor);
    currentBubble.isFixed = true; // 最初は固定状態
}

// マウスクリックイベントで発射
canvas.addEventListener('click', (event) => {
    if (currentBubble && currentBubble.isFixed) {
        // クリック位置を取得
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // 角度を計算
        const angle = Math.atan2(clickY - launcher.y, clickX - launcher.x);
        
        // 速度と角度を設定して発射！
        currentBubble.vx = Math.cos(angle) * BUBBLE_SPEED;
        currentBubble.vy = Math.sin(angle) * BUBBLE_SPEED;
        currentBubble.isFixed = false; // 発射中に切り替え
    }
});