// משתנים גלובליים - יוגדרו לפני טעינת שאר הקבצים
let gameContainer;
let scalerWrapper; // **** משתנה חדש לדיב העוטף ****
let startScreen;
let gameOverScreen;
let levelCompleteScreen;
let gameCompleteScreen;
let levelSelectScreen;
let moopiMeetingScreen; // מסך המפגש עם מופי
let scoreElement;
let livesElement;
let levelElement;
let finalScoreElement;
let levelScoreElement;
let finalTotalScoreElement;
let ammoElement;
let collectedGemsElement;
let totalGemsElement;
let foundPresentElement;
let bossHealthElement; // אלמנט חדש להצגת בריאות הבוס

// מצב המשחק
let gameRunning = false;
let score = 0;
let lives = 3;
let currentLevel = 1;
let player = null;
let platforms = [];
let gems = [];
let enemies = [];
let bullets = [];
let exit = null;
let keys = {};
let ammo = 10;
let maxAmmo = 10;
let lastShotTime = 0;
let shootDelay = 500; // מילישניות בין יריות
let allLevelsPresentCollected = [];

// אובייקט המתנה בשלב הנוכחי
let presentObject = null;
let presentCollected = false;

// משתנים חדשים לטיפול בפלטפורמות נעות
let playerPlatform = null; // הפלטפורמה עליה השחקן עומד כרגע
let lastPlatformX = 0;     // מיקום X האחרון של הפלטפורמה
let lastPlatformY = 0;     // מיקום Y האחרון של הפלטפורמה

// התוספות החדשות - מופי ובופי
let moopi = null;
let boofi = null;
let wingsItem = null; // פריט כנפיים
let bossBullets = []; // יריות של הבוס
let clouds = []; // עננים לשלב 9
let playerHasWings = false; // האם השחקן אסף כנפיים
let bossHealth = 10; // בריאות הבוס
let persistentBossHealth = 10; // משתנה חדש לשמירת בריאות הבוס בין איפוסים

// מידע על שלבים - כמות היהלומים וסוגי המתנות
const levelInfo = [
    { // שלב 1 - מבצר נטוש
        gemCount: 5,
        presentType: "car",
        presentName: "מכונית המירוץ"
    },
    { // שלב 2 - יער מכושף
        gemCount: 7,
        presentType: "lego",
        presentName: "סט הלגו"
    },
    { // שלב 3 - מבוך תת-קרקעי
        gemCount: 12,
        presentType: "console",
        presentName: "קונסולת המשחקים"
    },
    { // שלב 4 - מערת קרח
        gemCount: 9,
        presentType: "robot",
        presentName: "הרובוט"
    },
    { // שלב 5 - מכרה תת-קרקעי
        gemCount: 10,
        presentType: "telescope",
        presentName: "הטלסקופ"
    },
    { // שלב 6 - מגדל עננים
        gemCount: 15,
        presentType: "bicycle",
        presentName: "האופניים החדשים"
    },
    { // שלב 7 - מדבר מסוכן
        gemCount: 15,
        presentType: "camera",
        presentName: "המצלמה הדיגיטלית"
    },
    { // שלב 8 - מקדש אפל
        gemCount: 10,
        presentType: "game",
        presentName: "משחק המחשב החדש"
    },
    { // שלב 9 - קרב בשמיים
        gemCount: 0, // אין יהלומים בשלב הבוס
        presentType: "",
        presentName: ""
    }
];

// אובייקטים נוספים
let doors = [];
let keyItems = []; // שונה מ-keys כדי למנוע התנגשות
let spikes = [];
let quicksands = [];
let geysers = [];
let trampolines = [];
let laserPlatforms = [];
let boss = null;

// קבועים
const PLAYER_SPEED = 5;
const GRAVITY = 0.8;
const JUMP_POWER = 15;
const BULLET_SPEED = 10;
const GAME_TICK = 20; // ms
const BOSS_BULLET_SPEED = 7; // מהירות הירי של הבוס
const BOSS_SHOOT_DELAY = 1500; // זמן בין יריות של הבוס (מילישניות) - הוגדל מ-1000 ל-1500
let gameInterval = null;
let lastBossShootTime = 0; // זמן הירייה האחרונה של הבוס

// **** פונקציה חדשה לשינוי גודל המשחק ****
function resizeGame() {
    if (!gameContainer || !scalerWrapper) {
        console.warn("Game container or scaler wrapper not found for resizing.");
        return;
    }

    const baseWidth = 800; // רוחב המשחק המקורי
    const baseHeight = 600; // גובה המשחק המקורי
    const parentWidth = scalerWrapper.clientWidth; // רוחב הדיב העוטף (כל החלון)
    const parentHeight = scalerWrapper.clientHeight; // גובה הדיב העוטף (כל החלון)

    // חשב את יחס הגודל האפשרי לפי רוחב וגובה
    const scaleX = parentWidth / baseWidth;
    const scaleY = parentHeight / baseHeight;

    // בחר את יחס הגודל הקטן יותר כדי שהמשחק כולו יכנס למסך
    const scale = Math.min(scaleX, scaleY);

    // החל את השינוי על game-container
    gameContainer.style.transform = `scale(${scale})`;

    // אופציונלי: התאמת עובי הגבול כדי שלא יראה עבה/דק מדי (יכול להיראות מוזר)
    // gameContainer.style.borderWidth = `${4 / scale}px`;
}

// אתחול האלמנטים כשהדף נטען
window.addEventListener('DOMContentLoaded', function() {
    gameContainer = document.getElementById('game-container');
    scalerWrapper = document.getElementById('scaler-wrapper'); // **** קבל את הדיב העוטף ****
    startScreen = document.getElementById('start-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    levelCompleteScreen = document.getElementById('level-complete-screen');
    gameCompleteScreen = document.getElementById('game-complete-screen');
    levelSelectScreen = document.getElementById('level-select-screen');
    moopiMeetingScreen = document.getElementById('moopi-meeting-screen');
    scoreElement = document.getElementById('score');
    livesElement = document.getElementById('lives');
    levelElement = document.getElementById('level');
    finalScoreElement = document.getElementById('final-score');
    levelScoreElement = document.getElementById('level-score');
    finalTotalScoreElement = document.getElementById('final-total-score');
    ammoElement = document.getElementById('ammo');
    collectedGemsElement = document.getElementById('collected-gems');
    totalGemsElement = document.getElementById('total-gems');
    foundPresentElement = document.getElementById('found-present');

    // הוספת אלמנט בריאות הבוס
    const bossHealthBar = document.createElement('div');
    bossHealthBar.className = 'boss-health';
    bossHealthBar.innerHTML = 'בופי: <span id="boss-health">10</span>/10';
    bossHealthBar.style.display = 'none';
    gameContainer.appendChild(bossHealthBar);
    bossHealthElement = document.getElementById('boss-health');

    // איפוס מערך האיסוף של המתנות
    allLevelsPresentCollected = new Array(9).fill(false);

    // הוספת מאזין למעבר לשלב הבוס הסופי
    document.getElementById('final-battle-button').addEventListener('click', function() {
        startFinalBattle();
    });

    resizeGame(); // **** קרא לפונקציה לראשונה בטעינה ****
    console.log("Global variables initialized and initial resize performed.");
});

// פונקציה להתחלת הקרב הסופי - שלב 9
function startFinalBattle() {
    moopiMeetingScreen.style.display = 'none';
    currentLevel = 9;
    loadLevel(currentLevel);
    gameRunning = true;
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, GAME_TICK);
    
    // הצגת מד בריאות הבוס
    const bossHealthBar = document.querySelector('.boss-health');
    if (bossHealthBar) {
        bossHealthBar.style.display = 'block';
    }
    
    // איפוס בריאות הבוס
    persistentBossHealth = 10; // אתחול מחדש כאשר מתחילים את הקרב הסופי
    bossHealth = 10;
    if (bossHealthElement) {
        bossHealthElement.textContent = bossHealth;
    }
}

// **** הוסף מאזין אירוע לשינוי גודל החלון ****
window.addEventListener('resize', resizeGame);