// ניקוי המשחק
function clearGameElements() {
    if (player && player.element) player.element.remove();
    
    for (let platform of platforms) {
        if (platform.element) platform.element.remove();
    }
    
    for (let gem of gems) {
        if (gem.element) gem.element.remove();
    }
    
    for (let enemy of enemies) {
        if (enemy.element) enemy.element.remove();
    }
    
    for (let bullet of bullets) {
        if (bullet.element) bullet.element.remove();
    }

    for (let bossBullet of bossBullets) {
        if (bossBullet.element) bossBullet.element.remove();
    }
    
    for (let cloud of clouds) {
        if (cloud.element) cloud.element.remove();
    }
    
    if (exit && exit.element) exit.element.remove();
    
    if (presentObject && presentObject.element) presentObject.element.remove();
    
    if (moopi && moopi.element) moopi.element.remove();
    
    if (boofi && boofi.element) boofi.element.remove();
    
    if (wingsItem && wingsItem.element) wingsItem.element.remove();
    
    platforms = [];
    gems = [];
    enemies = [];
    bullets = [];
    bossBullets = [];
    clouds = [];
    player = null;
    exit = null;
    presentObject = null;
    presentCollected = false;
    moopi = null;
    boofi = null;
    wingsItem = null;
    // לא מאפסים את playerHasWings כאן - נשאיר את זה לפונקציה resetLevel
}

// אתחול המשחק
function initGame() {
    // איפוס מצב המשחק
    clearGameElements();
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameCompleteScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    moopiMeetingScreen.style.display = 'none';
    gameRunning = true;
    score = 0;
    lives = 3;
    currentLevel = 1;
    ammo = maxAmmo;
    
    // הסתרת מד בריאות הבוס
    const bossHealthBar = document.querySelector('.boss-health');
    if (bossHealthBar) {
        bossHealthBar.style.display = 'none';
    }
    
    // איפוס מערך איסוף המתנות
    allLevelsPresentCollected = new Array(9).fill(false);
    
    // איפוס בריאות הבוס
    persistentBossHealth = 10;
    
    // איפוס משתנה הכנפיים - רק באתחול המשחק מההתחלה
    playerHasWings = false;
    
    updateHUD();
    
    // טעינת שלב
    loadLevel(currentLevel);
    
    // התחלת לולאת משחק
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, GAME_TICK);
}

// עדכון ממשק המשתמש
function updateHUD() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = currentLevel;
    ammoElement.textContent = ammo;
    
    // עדכון ספירת יהלומים - רק אם לא בשלב הבוס
    if (currentLevel !== 9 && levelInfo[currentLevel - 1]) {
        const currentLevelInfo = levelInfo[currentLevel - 1];
        totalGemsElement.textContent = currentLevelInfo.gemCount;
        collectedGemsElement.textContent = currentLevelInfo.gemCount - gems.length;
    } else if (currentLevel === 9) {
        // בשלב הבוס אין יהלומים
        totalGemsElement.textContent = "0";
        collectedGemsElement.textContent = "0";
    }
    
    // עדכון מד בריאות הבוס
    if (currentLevel === 9 && bossHealthElement) {
        bossHealthElement.textContent = bossHealth;
    }
}

// עדכון מצב המשחק
function updateGame() {
    if (!gameRunning) return;
    
    // עדכון העננים בשלב 9
    if (currentLevel === 9) {
        for (let cloud of clouds) {
            cloud.update();
        }
    }
    
    // עדכון פלטפורמות נעות - חשוב שזה יבוא לפני עדכון השחקן!
    for (let i = 0; i < platforms.length; i++) {
        if (platforms[i] instanceof MovingPlatform) {
            // שמירת המיקום הקודם של הפלטפורמה
            const oldX = platforms[i].x;
            const oldY = platforms[i].y;
            
            // עדכון הפלטפורמה
            platforms[i].update();
            
            // אם זו הפלטפורמה שהשחקן עומד עליה, עדכן גם את מיקום השחקן
            if (player && playerPlatform === platforms[i]) {
                // חישוב ההפרש במיקום
                const deltaX = platforms[i].x - oldX;
                const deltaY = platforms[i].y - oldY;
                
                // עדכון מיקום השחקן בהתאם לתנועת הפלטפורמה
                player.x += deltaX;
                player.y += deltaY;
                
                // עדכון מיקום אלמנט השחקן
                player.element.style.left = player.x + 'px';
                player.element.style.top = player.y + 'px';
            }
        }
        
        // בדיקה נוספת לפלטפורמות מתמוטטות - וודא שהשחקן נופל כאשר הפלטפורמה מתמוטטת
        if (platforms[i] instanceof SpecialPlatform && 
            platforms[i].type === 'collapsing' && 
            !platforms[i].stable && 
            player && 
            platforms[i].checkPlayerOnPlatform(player)) {
            player.grounded = false;
        }
    }
    
    // עדכון השחקן
    if (player) player.update();
    
    // עדכון אויבים
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }
    
    // עדכון מופי אם קיים
    if (moopi) {
        moopi.update();
    }
    
    // עדכון בופי אם קיימת (בוס שלב 9)
    if (boofi) {
        boofi.update();
    }
    
    // עדכון יריות
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.update();
        
        // בדיקת פגיעה באויב
        for (let j = enemies.length - 1; j >= 0; j--) {
            let enemy = enemies[j];
            if (bullet.checkCollision(enemy)) {
                // יצירת אפקט פיצוץ
                createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                
                // הסרת האויב והכדור
                enemy.element.remove();
                enemies.splice(j, 1);
                bullet.element.remove();
                bullets.splice(i, 1);
                
                // הוספת נקודות
                score += 50;
                updateHUD();
                break;
            }
        }
        
        // בדיקת פגיעה בבוס (בופי) - רק בשלב 9
        if (currentLevel === 9 && boofi && bullet.checkCollision(boofi)) {
            // יצירת אפקט פיצוץ
            createExplosion(bullet.x, bullet.y);
            
            // גורם נזק לבוס
            boofi.takeDamage();
            
            // הסרת הכדור
            bullet.element.remove();
            bullets.splice(i, 1);
            
            // הוספת נקודות
            score += 200;
            updateHUD();
            
            // יוצאים מהלולאה כי הכדור כבר הוסר
            break;
        }
        
        // בדיקת פגיעה בפלטפורמה
        for (let j = 0; j < platforms.length; j++) {
            if (bullet.checkCollision(platforms[j])) {
                bullet.element.remove();
                bullets.splice(i, 1);
                break;
            }
        }
        
        // הסרת כדורים מחוץ למסך
        if (bullet.x < 0 || bullet.x > gameContainer.offsetWidth || 
            bullet.y < 0 || bullet.y > gameContainer.offsetHeight) {
            bullet.element.remove();
            bullets.splice(i, 1);
        }
    }
    
    // עדכון יריות הבוס
    for (let i = bossBullets.length - 1; i >= 0; i--) {
        bossBullets[i].update();
    }
    
    // טיפול ביריות השחקן
    if (keys['z'] || keys['Z']) {
        playerShoot();
    }
}

// פונקציה ליריית השחקן
function playerShoot() {
    if (!gameRunning || !player) return;
    
    const now = Date.now();
    if (now - lastShotTime < shootDelay || ammo <= 0) return;
    
    lastShotTime = now;
    ammo--;
    updateHUD();
    
    // יצירת כדור ירי בהתאם לכיוון השחקן
    const direction = player.element.classList.contains('face-left') ? -1 : 1;
    const startX = direction > 0 ? player.x + player.width : player.x;
    const startY = player.y + player.height/2;
    
    const bullet = new Bullet(startX, startY, direction);
    bullets.push(bullet);
}

// פונקציית טעינת תחמושת
function reloadAmmo() {
    if (ammo < maxAmmo) {
        ammo++;
        updateHUD();
    }
}

// אתחול שלב מחדש
function resetLevel() {
    // שמירת מצב הבוס אם בשלב 9
    if (currentLevel === 9 && boofi) {
        persistentBossHealth = boofi.health;
        console.log("שמירת בריאות הבוס:", persistentBossHealth);
    }
    
    // שמירת מצב הכנפיים לפני האיפוס
    const hadWings = playerHasWings;
    
    // איפוס יריות
    for (let bullet of bullets) {
        if (bullet.element) bullet.element.remove();
    }
    bullets = [];
    
    for (let bossBullet of bossBullets) {
        if (bossBullet.element) bossBullet.element.remove();
    }
    bossBullets = [];
    
    // טעינת השלב
    loadLevel(currentLevel);
    
    // שחזור מצב הכנפיים אם היו לשחקן כנפיים קודם
    if (currentLevel === 9 && hadWings) {
        playerHasWings = true;
        
        // אם נוצר שחקן חדש, עדכן את מצב הטיסה שלו
        if (player) {
            player.flying = true;
            player.element.classList.add('flying');
        }
        
        // הסרת אובייקט הכנפיים אם קיים (כי כבר אספנו אותו)
        if (wingsItem && wingsItem.element) {
            wingsItem.element.remove();
            wingsItem = null;
        }
    }
    
    // חידוש תחמושת
    ammo = maxAmmo;
    updateHUD();
}

// סיום שלב
function levelComplete() {
    gameRunning = false;
    clearInterval(gameInterval);
    
    // אם זה השלב האחרון (שלב 9) וזה נגמר בהצלחה, מציג את מסך סיום המשחק
    if (currentLevel === 9) {
        completeGame();
        return;
    }
    
    // שם המתנה שאספנו
    const presentName = levelInfo[currentLevel - 1].presentName;
    foundPresentElement.textContent = presentName;
    
    levelCompleteScreen.style.display = 'flex';
    levelScoreElement.textContent = score;
}

// מעבר לשלב הבא
function nextLevel() {
    currentLevel++;
    
    // הדפסת הודעה לדיבוג
    console.log("Moving to next level: " + currentLevel);
    
    // בדיקה אם סיימנו את כל השלבים
    if (currentLevel > 9) {
        // ניצחון במשחק!
        score += 1000; // בונוס לסיום המשחק
        completeGame();
        return;
    }
    
    levelElement.textContent = currentLevel;
    levelCompleteScreen.style.display = 'none';
    
    // איפוס מצב הכנפיים בין שלבים
    if (currentLevel === 9) {
        playerHasWings = false;
    }
    
    // טעינת השלב החדש
    loadLevel(currentLevel);
    
    // חידוש תחמושת
    ammo = maxAmmo;
    updateHUD();
    
    // עדכון תמת המשחק לפי השלב
    updateLevelTheme(currentLevel);
    
    // חידוש המשחק
    gameRunning = true;
    gameInterval = setInterval(updateGame, GAME_TICK);
}

// סיום משחק
function gameOver(victory = false) {
    gameRunning = false;
    clearInterval(gameInterval);
    
    // הסתרת מד בריאות הבוס
    const bossHealthBar = document.querySelector('.boss-health');
    if (bossHealthBar) {
        bossHealthBar.style.display = 'none';
    }
    
    // מסתיר את מסך השלמת השלב כדי למנוע הופעה מעל מסך סיום המשחק
    levelCompleteScreen.style.display = 'none';
    moopiMeetingScreen.style.display = 'none';
    
    if (victory) {
        // הצג את מסך הניצחון הסופי
        gameCompleteScreen.style.display = 'flex';
        finalTotalScoreElement.textContent = score;
    } else {
        // מסך סיום המשחק רגיל
        gameOverScreen.style.display = 'flex';
        finalScoreElement.textContent = score;
    }
}

// פונקציה לסיום המשחק בניצחון
function completeGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    
    // מסתיר את כל שאר המסכים
    levelCompleteScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    moopiMeetingScreen.style.display = 'none';
    
    // הסתרת מד בריאות הבוס
    const bossHealthBar = document.querySelector('.boss-health');
    if (bossHealthBar) {
        bossHealthBar.style.display = 'none';
    }
    
    // מציג את מסך הסיום המיוחד
    gameCompleteScreen.style.display = 'flex';
    finalTotalScoreElement.textContent = score;
}

// פונקציה לעדכון תמת השלב
function updateLevelTheme(level) {
    // איפוס הסגנונות הקודמים
    document.body.className = "";
    
    if (gameContainer) {
        gameContainer.style.boxShadow = "0 0 20px #ff6600, 0 0 40px rgba(255, 102, 0, 0.5)";
        gameContainer.style.border = "4px solid #ff6600";
        
        switch(level) {
            case 1: // המבצר הנטוש
                document.body.className = "";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23222233\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23333344\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #555599, 0 0 40px rgba(85, 85, 153, 0.5)";
                gameContainer.style.border = "4px solid #555599";
                break;
            case 2: // היער המכושף
                document.body.className = "";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23003300\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23004400\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #006600, 0 0 40px rgba(0, 102, 0, 0.5)";
                gameContainer.style.border = "4px solid #006600";
                break;
            case 3: // המבוך התת-קרקעי
                document.body.className = "";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23221100\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23332200\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #664400, 0 0 40px rgba(102, 68, 0, 0.5)";
                gameContainer.style.border = "4px solid #664400";
                break;
            case 4: // מערת קרח
                document.body.className = "ice-theme";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23e0f2ff\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23cce8ff\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #00ccff, 0 0 40px rgba(0, 204, 255, 0.5)";
                gameContainer.style.border = "4px solid #00ccff";
                break;
            case 5: // מכרה תת-קרקעי
                document.body.className = "mine-theme";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23222\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23333\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #885500, 0 0 40px rgba(136, 85, 0, 0.5)";
                gameContainer.style.border = "4px solid #885500";
                break;
            case 6: // מגדל עננים
                document.body.className = "cloud-theme";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%2399ccff\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23ccecff\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #ffffff, 0 0 40px rgba(255, 255, 255, 0.5)";
                gameContainer.style.border = "4px solid #ffffff";
                break;
            case 7: // מדבר מסוכן
                document.body.className = "desert-theme";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23ffcc99\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23ffbb77\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #ff9900, 0 0 40px rgba(255, 153, 0, 0.5)";
                gameContainer.style.border = "4px solid #ff9900";
                break;
            case 8: // מקדש אפל
                document.body.className = "temple-theme";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23331166\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23220044\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #cc00ff, 0 0 40px rgba(204, 0, 255, 0.5)";
                gameContainer.style.border = "4px solid #cc00ff";
                // הוספת זמן חסד בתחילת השלב
                setTimeout(() => {
                    if (enemies.length > 0) {
                        console.log("התחלת תנועת אויבים בשלב 8");
                        for (let enemy of enemies) {
                            enemy.active = true;
                        }
                    }
                }, 1500); // 1.5 שניות של זמן חסד
                break;
            case 9: // קרב בשמיים - שלב הבוס
                document.body.className = "sky-theme";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%236688ff\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%237799ff\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #8888ff, 0 0 40px rgba(136, 136, 255, 0.5)";
                gameContainer.style.border = "4px solid #8888ff";
                break;
            default: // שלבים 1-3 - הסגנון המקורי
                document.body.className = "";
                gameContainer.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23000033\"/><path d=\"M0 0L50 50L100 0ZM100 100L50 50L0 100Z\" fill=\"%23000044\"/></svg>')";
                gameContainer.style.boxShadow = "0 0 20px #ff6600, 0 0 40px rgba(255, 102, 0, 0.5)";
                gameContainer.style.border = "4px solid #ff6600";
        }
    }
}

// הוספת כפתור יציאה לתפריט
function addExitButton() {
    // בדיקה אם הכפתור כבר קיים
    if (document.getElementById('exit-to-menu-button')) return;
    
    // יצירת כפתור יציאה
    const exitButton = document.createElement('button');
    exitButton.id = 'exit-to-menu-button';
    exitButton.textContent = 'חזרה לתפריט';
    exitButton.style.position = 'absolute';
    exitButton.style.top = '10px';
    exitButton.style.left = '10px';
    exitButton.style.zIndex = '25';
    exitButton.style.padding = '8px 16px';
    exitButton.style.fontSize = '12px';
    exitButton.style.opacity = '0.8';
    
    // הוספת מאזין לאירועים
    exitButton.addEventListener('click', exitToMainMenu);
    
    // הוספה למיכל המשחק
    gameContainer.appendChild(exitButton);
}

// פונקציה ליציאה לתפריט הראשי
function exitToMainMenu() {
    // עצירת המשחק
    gameRunning = false;
    clearInterval(gameInterval);
    
    // ניקוי כל אלמנטי המשחק
    clearGameElements();
    
    // הסתרת כל מסכי המשחק מלבד מסך הפתיחה
    gameOverScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    gameCompleteScreen.style.display = 'none';
    levelSelectScreen.style.display = 'none';
    moopiMeetingScreen.style.display = 'none';
    
    // הסתרת מד בריאות הבוס
    const bossHealthBar = document.querySelector('.boss-health');
    if (bossHealthBar) {
        bossHealthBar.style.display = 'none';
    }
    
    // הצגת מסך הפתיחה
    startScreen.style.display = 'flex';
    
    // הסרת כפתור היציאה אם קיים
    const exitButton = document.getElementById('exit-to-menu-button');
    if (exitButton) exitButton.remove();
}

// פונקציה משופרת להצגת היציאה
function showExit() {
    if (!exit) return;
    
    console.log("מציג את הדלת"); // הודעת דיבאג
    
    // מוודא שהדלת מוצגת
    exit.element.style.display = 'block';
    exit.element.style.opacity = '0';
    
    // אנימציית הופעה שבולטת יותר
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
            clearInterval(fadeIn);
            exit.element.style.opacity = '1';
            
            // הוספת אפקט הבהוב זמני כדי למשוך תשומת לב
            let flashCount = 0;
            const exitFlash = setInterval(() => {
                exit.element.style.filter = exit.element.style.filter === 'brightness(2)' ? '' : 'brightness(2)';
                flashCount++;
                if (flashCount > 10) { // 5 הבהובים מלאים
                    clearInterval(exitFlash);
                    exit.element.style.filter = ''; // איפוס לברירת מחדל
                }
            }, 200);
            
            console.log("הדלת הוצגה בהצלחה עם אופסיטי 1"); // הודעת דיבאג
        } else {
            exit.element.style.opacity = opacity.toString();
        }
    }, 50);
}