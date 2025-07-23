// פונקציות לתצוגת מסכים
function showLevelSelect() {
    startScreen.style.display = 'none';
    levelSelectScreen.style.display = 'flex';
}

function showStartScreen() {
    levelSelectScreen.style.display = 'none';
    startScreen.style.display = 'flex';
}

// פונקציה להתחלת משחק משלב נבחר
function startLevelFromSelect(level) {
    clearGameElements();
    levelSelectScreen.style.display = 'none';
    gameRunning = true;
    score = 0;
    lives = 3;
    currentLevel = level;
    ammo = maxAmmo;
    
    // הסתרת מד בריאות הבוס אם לא בשלב 9
    if (level !== 9) {
        const bossHealthBar = document.querySelector('.boss-health');
        if (bossHealthBar) {
            bossHealthBar.style.display = 'none';
        }
    }
    
    updateHUD();
    loadLevel(currentLevel);
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, GAME_TICK);
    
    // Add exit button
    addExitButton();
}

// הגדרת מאזיני אירועים
window.addEventListener('DOMContentLoaded', function() {
    // הגדרת מאזיני אירועים לכפתורים
    document.getElementById('start-button').addEventListener('click', initGame);
    document.getElementById('restart-button').addEventListener('click', initGame);
    document.getElementById('next-level-button').addEventListener('click', nextLevel);
    document.getElementById('level-select-button').addEventListener('click', showLevelSelect);
    document.getElementById('back-to-menu-button').addEventListener('click', showStartScreen);
    document.getElementById('play-again-button').addEventListener('click', initGame);
    document.getElementById('final-battle-button').addEventListener('click', startFinalBattle);
    
    // הגדרת מאזיני אירועים לכפתורי בחירת שלב
    document.querySelectorAll('.level-button').forEach(button => {
        button.addEventListener('click', function() {
            startLevelFromSelect(parseInt(this.getAttribute('data-level')));
        });
    });
    
    // מאזינים למקשים
    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
        
        // מניעת גלילה של הדף עם מקשי החיצים ורווח
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        // תמיכה במקלדת עברית
        if (e.key === 'ז') {
            keys['z'] = true;
        }
        
        // Add escape key to return to main menu
        if (e.key === 'Escape') {
            if (gameRunning) {
                exitToMainMenu();
            }
        }
        
        // מקש דיבוג D - מציג מידע על מצב המשחק
        if (e.key === 'd' || e.key === 'D') {
            debugCurrentLevel();
            
            // בדיקה אם כל היהלומים נאספו והמתנה גם, ובכל זאת הדלת לא מוצגת
            if (currentLevel === 8 && gems.length === 0 && presentCollected && exit && exit.element.style.display === 'none') {
                console.log("תיקון מצב הדלת: אילוץ הצגה");
                showExit(); // כפיית הצגת הדלת
            }
            
            // בדיקה מיוחדת למצב הבוס
            if (currentLevel === 9 && boofi) {
                console.log("מצב בריאות הבוס:", boofi.health);
                console.log("האם לשחקן יש כנפיים:", playerHasWings);
            }
        }
    });

    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
        
        // תמיכה במקלדת עברית
        if (e.key === 'ז') {
            keys['z'] = false;
        }
    });
    
    // טעינת התחמושת מחדש באופן אוטומטי כל 3 שניות
    setInterval(reloadAmmo, 3000);
    
    // הוספת תמיכה במכשירי מגע
    addTouchControls();
    
    console.log("Game event listeners initialized");
});

// פונקציה להוספת לחצנים למכשירי מגע
function addTouchControls() {
    if ('ontouchstart' in window && gameContainer) {
        const touchControls = document.createElement('div');
        touchControls.style.position = 'absolute';
        touchControls.style.bottom = '10px';
        touchControls.style.width = '100%';
        touchControls.style.display = 'flex';
        touchControls.style.justifyContent = 'space-between';
        touchControls.style.zIndex = '100';
        touchControls.style.pointerEvents = 'none'; // מאפשר משחק גם מתחת לשכבת השליטה
        gameContainer.appendChild(touchControls);
        
        // לחצן שמאלה
        const leftBtn = document.createElement('button');
        leftBtn.textContent = '◀';
        leftBtn.style.width = '60px';
        leftBtn.style.height = '60px';
        leftBtn.style.marginLeft = '10px';
        leftBtn.style.pointerEvents = 'auto'; // מאפשר לחיצה
        touchControls.appendChild(leftBtn);
        
        // לחצן קפיצה
        const jumpBtn = document.createElement('button');
        jumpBtn.textContent = '▲';
        jumpBtn.style.width = '60px';
        jumpBtn.style.height = '60px';
        jumpBtn.style.pointerEvents = 'auto';
        touchControls.appendChild(jumpBtn);
        
        // לחצן ירייה
        const shootBtn = document.createElement('button');
        shootBtn.textContent = '🔫';
        shootBtn.style.width = '60px';
        shootBtn.style.height = '60px';
        shootBtn.style.pointerEvents = 'auto';
        touchControls.appendChild(shootBtn);
        
        // לחצן ימינה
        const rightBtn = document.createElement('button');
        rightBtn.textContent = '▶';
        rightBtn.style.width = '60px';
        rightBtn.style.height = '60px';
        rightBtn.style.marginRight = '10px';
        rightBtn.style.pointerEvents = 'auto';
        touchControls.appendChild(rightBtn);
        
        // טיפול באירועי מגע
        leftBtn.addEventListener('touchstart', () => { keys['ArrowLeft'] = true; });
        leftBtn.addEventListener('touchend', () => { keys['ArrowLeft'] = false; });
        
        rightBtn.addEventListener('touchstart', () => { keys['ArrowRight'] = true; });
        rightBtn.addEventListener('touchend', () => { keys['ArrowRight'] = false; });
        
        jumpBtn.addEventListener('touchstart', () => { keys[' '] = true; });
        jumpBtn.addEventListener('touchend', () => { keys[' '] = false; });
        
        shootBtn.addEventListener('touchstart', () => { keys['z'] = true; });
        shootBtn.addEventListener('touchend', () => { keys['z'] = false; });
        
        console.log("Touch controls added");
    }
}

// הוספת פונקציות תחזוקה
function checkGamePerformance() {
    // פונקציה לבדיקת ביצועי המשחק
    const fps = Math.round(1000 / GAME_TICK);
    console.log(`Game running at target ${fps} FPS`);
    console.log(`Current game state: ${gameRunning ? 'Running' : 'Paused'}`);
    console.log(`Elements count: ${platforms.length} platforms, ${enemies.length} enemies, ${gems.length} gems, ${bullets.length} bullets`);
    
    if (currentLevel === 9) {
        console.log(`Boss bullets: ${bossBullets.length}`);
    }
}

// פונקציית עזרה
function debugCurrentLevel() {
    console.log(`Current level: ${currentLevel}`);
    console.log(`Remaining gems: ${gems.length}`);
    console.log(`Present collected: ${presentCollected}`);
    console.log(`Player position: ${player ? `X:${Math.round(player.x)}, Y:${Math.round(player.y)}` : 'Player not found'}`);
    
    if (currentLevel === 9) {
        console.log(`Player has wings: ${playerHasWings}`);
        console.log(`Boss health: ${bossHealth}`);
        console.log(`Boss bullets: ${bossBullets.length}`);
    }
}

// פונקציית דיבאג לבדיקת הדלת והיהלומים בשלב 8
function debugLevel8() {
    if (currentLevel === 8) {
        console.log("------- דיבאג שלב 8 -------");
        console.log("מספר יהלומים שנשארו: " + gems.length);
        console.log("האם המתנה נאספה: " + presentCollected);
        console.log("האם כל היהלומים נאספו והמתנה נאספה: " + (gems.length === 0 && presentCollected));
        
        if (exit) {
            console.log("דלת יציאה: קיימת");
            console.log("מצב תצוגת הדלת: " + exit.element.style.display);
            console.log("שקיפות הדלת: " + exit.element.style.opacity);
        } else {
            console.log("דלת יציאה: לא קיימת");
        }
        
        if (moopi) {
            console.log("מופי: קיים");
            console.log("מיקום מופי: X=" + moopi.x + ", Y=" + moopi.y);
        } else {
            console.log("מופי: לא קיים");
        }
        console.log("---------------------------");
    }
}

// פונקציית דיבאג לבדיקת מצב הבוס בשלב 9
function debugLevel9() {
    if (currentLevel === 9) {
        console.log("------- דיבאג שלב 9 -------");
        console.log("בריאות הבוס: " + bossHealth + "/10");
        
        if (boofi) {
            console.log("בופי: קיימת");
            console.log("מיקום בופי: X=" + boofi.x + ", Y=" + boofi.y);
            console.log("מהירות אופקית: " + boofi.speedX);
            console.log("מהירות אנכית: " + boofi.speedY);
            console.log("זמן בין יריות: " + boofi.shootDelay + "ms");
        } else {
            console.log("בופי: לא קיימת");
        }
        
        console.log("מספר יריות פעילות של הבוס: " + bossBullets.length);
        console.log("האם לשחקן יש כנפיים: " + playerHasWings);
        console.log("---------------------------");
    }
}

// קריאה לפונקציית הדיבאג כל 3 שניות כאשר נמצאים בשלב 8 או 9
setInterval(() => {
    if (gameRunning) {
        if (currentLevel === 8) {
            debugLevel8();
        } else if (currentLevel === 9) {
            debugLevel9();
        }
    }
}, 3000);