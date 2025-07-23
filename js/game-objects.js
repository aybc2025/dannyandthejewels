// מחלקת אובייקט משחק בסיסית
class GameObject {
    constructor(x, y, width, height, className) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.element = document.createElement('div');
        this.element.className = className;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        gameContainer.appendChild(this.element);
    }
}

// מחלקת שחקן
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.grounded = false;
        this.facingRight = true;
        this.slipping = false; // משתנה חדש למשטחים חלקלקים
        this.friction = 1; // מקדם חיכוך רגיל
        this.hasKey = false; // האם השחקן אסף מפתח
        this.flying = false; // האם השחקן במצב טיסה
        
        // יצירת אלמנט השחקן
        this.element = document.createElement('div');
        this.element.className = 'player';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        gameContainer.appendChild(this.element);
        
        // בדיקה אם השחקן צריך להיות במצב טיסה (כי יש כנפיים)
        if (playerHasWings) {
            this.flying = true;
            this.element.classList.add('flying');
        }
    }
    
    update() {
        // עדכון ממשק כנפיים
        if (playerHasWings && !this.flying) {
            this.flying = true;
            this.element.classList.add('flying');
        }
        
        // תנועה אופקית עם התחשבות בחיכוך ומשטחים חלקלקים
        if (keys['ArrowLeft']) {
            this.velX = -PLAYER_SPEED;
            this.facingRight = false;
            this.element.classList.add('face-left');
        } else if (keys['ArrowRight']) {
            this.velX = PLAYER_SPEED;
            this.facingRight = true;
            this.element.classList.remove('face-left');
        } else {
            // האטה הדרגתית במקום עצירה מיידית על משטחים חלקלקים
            if (this.slipping) {
                this.velX *= 0.95; // האטה איטית על קרח
            } else {
                this.velX = 0; // עצירה רגילה
            }
        }
        
        // קפיצה או טיסה
        if (keys[' ']) {
            if (this.flying) {
                // טיסה - לחיצה רצופה על רווח
                this.velY = -JUMP_POWER / 3; // כוח עלייה מתון יותר
                this.jumping = true;
            } else if (!this.jumping && this.grounded) {
                // קפיצה רגילה
                this.jumping = true;
                this.grounded = false;
                this.velY = -JUMP_POWER;
            }
        } else if (this.flying && this.velY < 0) {
            // האטה כשמפסיקים ללחוץ על רווח במצב טיסה
            this.velY *= 0.9;
        }
        
        // תנועה אנכית עם מקש למעלה ולמטה במצב טיסה
        if (this.flying) {
            if (keys['ArrowUp']) {
                this.velY = -PLAYER_SPEED;
            } else if (keys['ArrowDown']) {
                this.velY = PLAYER_SPEED;
            }
        }
        
        // החלת כוח הכבידה - כוח חלש יותר במצב טיסה
        if (this.flying) {
            this.velY += GRAVITY * 0.2; // כבידה חלשה במצב טיסה
        } else {
            this.velY += GRAVITY; // כבידה רגילה
        }
        
        // עדכון מיקום
        this.x += this.velX;
        this.y += this.velY;
        
        // הגבלה לגבולות המשחק בצד
        if (this.x < 0) this.x = 0;
        if (this.x > gameContainer.offsetWidth - this.width) 
            this.x = gameContainer.offsetWidth - this.width;
        
        // הגבלה לגבולות המשחק למעלה ולמטה (במצב טיסה/בוס)
        if (currentLevel === 9) {
            if (this.y < 0) this.y = 0;
        }
        
        // איפוס מצב החלקה לפני בדיקת התנגשות
        this.slipping = false;
        
        // בדיקת התנגשות עם פלטפורמות
        this.grounded = false;
        playerPlatform = null; // איפוס הפלטפורמה הנוכחית בכל מסגרת
        
        // בדיקת התנגשות עם פלטפורמות תמיד, גם בשלב 9 וגם במצב טיסה
        for (let platform of platforms) {
            // בדיקה אם זו פלטפורמה מתמוטטת לא יציבה
            if (platform.type === 'collapsing' && !platform.stable) {
                // אם השחקן עמד על פלטפורמה שהתמוטטה, הוא צריך ליפול
                if (platform instanceof SpecialPlatform && platform.checkPlayerOnPlatform(this)) {
                    // השחקן מתחיל ליפול
                    this.grounded = false;
                    this.jumping = true; // לא קפיצה אמיתית, אלא מצב נפילה
                }
                continue; // דילוג על המשך הבדיקות עבור פלטפורמה זו
            }
            
            if (this.checkCollision(platform)) {
                // התנגשות מלמעלה (נחיתה)
                if (this.y + this.height > platform.y && 
                    this.y < platform.y && 
                    this.velY > 0) {
                    this.grounded = true;
                    this.jumping = false;
                    this.velY = 0;
                    this.y = platform.y - this.height;
                    
                    // שמירת הפלטפורמה עליה עומד השחקן
                    playerPlatform = platform;
                    lastPlatformX = platform.x;
                    lastPlatformY = platform.y;
                    
                    // בדיקה אם זו פלטפורמה מיוחדת
                    if (platform.type === 'ice') {
                        this.slipping = true;
                    } else if (platform.type === 'collapsing' && platform.stable) {
                        platform.startCollapse();
                    }
                }
                // התנגשות מהצד
                else if (this.y + this.height > platform.y + 10 && 
                        this.y < platform.y + platform.height - 10) {
                    this.x -= this.velX;
                }
            }
        }
        
        // איסוף יהלומים
        for (let i = gems.length - 1; i >= 0; i--) {
            if (this.checkCollision(gems[i])) {
                score += 100;
                
                // חידוש תחמושת
                if (ammo < maxAmmo) {
                    ammo += 2;
                    if (ammo > maxAmmo) ammo = maxAmmo;
                }
                
                updateHUD();
                
                // הסרת היהלום
                gems[i].element.remove();
                gems.splice(i, 1);
                
                // בדיקה אם אספנו את כל היהלומים והמתנה - להציג את הדלת
                if (gems.length === 0 && presentCollected) {
                    showExit();
                }
            }
        }
        
        // איסוף כנפיים בשלב 9
        if (wingsItem && this.checkCollision(wingsItem)) {
            collectWings();
        }
        
        // איסוף מתנה - תיקון הבדיקה
        if (presentObject && !presentCollected && this.checkCollision(presentObject)) {
            collectPresent();
        }
        
        // התנגשות עם אויבים
        for (let enemy of enemies) {
            if (this.checkCollision(enemy)) {
                this.die();
                return;
            }
        }
        
        // התנגשות עם יריות הבוס
        for (let i = bossBullets.length - 1; i >= 0; i--) {
            if (this.checkCollision(bossBullets[i])) {
                // הסרת הירייה
                bossBullets[i].element.remove();
                bossBullets.splice(i, 1);
                
                // פגיעה בשחקן
                this.die();
                return;
            }
        }
        
        // בדיקה אם הגענו ליציאה
        if (exit && exit.element.style.display !== 'none' && this.checkCollision(exit)) {
            if (currentLevel === 8) {
                // במקום להשלים את השלב, מציגים את המפגש עם מופי
                showMoopiMeeting();
                return;
            } else if (gems.length === 0 && presentCollected) {
                levelComplete();
                return;
            } else {
                // עדיין לא אספנו את כל היהלומים והמתנה
                this.x -= this.velX * 2;
            }
        }
        
        // בדיקה אם השחקן נופל מחוץ למסך
        if (this.y > gameContainer.offsetHeight) {
            this.die();
            return;
        }
        
        // עדכון מיקום האלמנט
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
    
    checkCollision(obj) {
        // אם זה אובייקט דלת שמוסתרת, אל תאפשר התנגשות
        if (obj === exit && obj.element.style.display === 'none') {
            return false;
        }
        
        return this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y;
    }
    
    die() {
        lives--;
        
        // אפקט פיצוץ במיקום השחקן
        createExplosion(this.x + this.width/2, this.y + this.height/2);
        
        // עדכון ממשק המשתמש
        updateHUD();
        
        if (lives <= 0) {
            gameOver();
        } else {
            resetLevel();
        }
    }
}

// מחלקת יריות
class Bullet extends GameObject {
    constructor(x, y, direction) {
        // גודל הכדור
        const width = 8;
        const height = 4;
        
        // כיוון
        super(x - (direction > 0 ? 0 : width), y - height/2, width, height, 'bullet');
        this.direction = direction;
        this.speed = BULLET_SPEED;
    }
    
    update() {
        this.x += this.speed * this.direction;
        this.element.style.left = this.x + 'px';
    }
        
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y;
    }
}

// מחלקת אויב
class Enemy extends GameObject {
    constructor(x, y, width, height, speedX, speedY, rangeX) {
        super(x, y, width, height, 'enemy');
        this.startX = x;
        this.speedX = speedX;
        this.speedY = speedY;
        this.rangeX = rangeX;
        this.direction = 1;
        this.active = currentLevel !== 8; // לא פעיל בהתחלה בשלב 8
    }
    
    update() {
        // אם לא פעיל (זמן חסד בשלב 8), לא זז
        if (!this.active) return;
        
        // תנועה אופקית
        if (this.rangeX > 0) {
            this.x += this.speedX * this.direction;
            
            if (Math.abs(this.x - this.startX) >= this.rangeX) {
                this.direction *= -1;
            }
        }
        
        // סיבוב האויב לפי כיוון התנועה
        if (this.direction < 0) {
            this.element.style.transform = 'scaleX(-1)';
        } else {
            this.element.style.transform = 'scaleX(1)';
        }
        
        this.element.style.left = this.x + 'px';
    }
}

// מחלקת ענן רקע
class Cloud extends GameObject {
    constructor(x, y, speed) {
        super(x, y, 80, 40, 'cloud');
        this.speed = speed;
    }
    
    update() {
        this.x -= this.speed;
        
        // אם הענן יצא מהמסך, העבר אותו לקצה הימני
        if (this.x < -this.width) {
            this.x = gameContainer.offsetWidth;
            // נעדכן את הגובה גם באופן רנדומלי
            this.y = Math.random() * (gameContainer.offsetHeight - this.height);
        }
        
        this.element.style.left = this.x + 'px';
    }
}

// מחלקת מופי (המפלצת הכחולה)
class Moopi extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40, 'moopi');
        this.startX = x;
        this.direction = 1;
        this.speed = 1; // איטי יותר מאויבים רגילים
        this.range = 150;
    }
    
    update() {
        // תנועה אופקית
        this.x += this.speed * this.direction;
        
        if (Math.abs(this.x - this.startX) >= this.range) {
            this.direction *= -1;
        }
        
        // סיבוב לפי כיוון התנועה
        if (this.direction < 0) {
            this.element.style.transform = 'scaleX(-1)';
        } else {
            this.element.style.transform = 'scaleX(1)';
        }
        
        this.element.style.left = this.x + 'px';
    }
}

// מחלקת בופי (האחות של מופי)
class Boofi extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 40, 'boofi');
        this.speedX = 3;
        this.speedY = 2;
        this.maxSpeed = 5;
        this.directionX = 1;
        this.directionY = 1;
        // שימוש בבריאות הבוס השמורה אם קיימת
        this.health = typeof persistentBossHealth === 'number' ? persistentBossHealth : 10;
        this.lastShootTime = 0;
        this.shootDelay = BOSS_SHOOT_DELAY;
        this.damaged = false; // מצב פגיעה
        this.creationTime = Date.now(); // זמן יצירת הבוס - לחישוב השהיית ירי
    }
    
    update() {
        // תנועה - מסלול מורכב
        this.x += this.speedX * this.directionX;
        this.y += this.speedY * this.directionY;
        
        // שינוי כיוון בקצוות המסך
        if (this.x <= 0 || this.x >= gameContainer.offsetWidth - this.width) {
            this.directionX *= -1;
            // הגדלת המהירות מעט עם כל פגיעה בקצה
            this.speedX = Math.min(this.speedX + 0.2, this.maxSpeed);
        }
        
        if (this.y <= 0 || this.y >= gameContainer.offsetHeight / 2) {
            this.directionY *= -1;
            // הגדלת המהירות מעט עם כל פגיעה בקצה
            this.speedY = Math.min(this.speedY + 0.1, this.maxSpeed);
        }
        
        // עדכון מיקום
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        // זמן הירייה - עם השהייה של 2 שניות בתחילת השלב או אחרי פגיעה
        const now = Date.now();
        const timeSinceCreation = now - this.creationTime;
        
        // יורה רק אם עברו 2 שניות מאז היצירה
        if (timeSinceCreation >= 2000 && now - this.lastShootTime > this.shootDelay) {
            this.shoot();
            this.lastShootTime = now;
        }
    }
    
    shoot() {
        // אם השחקן אינו מוגדר או המשחק הופסק, אל תירה
        if (!player || !gameRunning) return;
        
        // חישוב הכיוון לעבר השחקן
        const dx = player.x + player.width/2 - (this.x + this.width/2);
        const dy = player.y + player.height/2 - (this.y + this.height/2);
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // נרמול הכיוון
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        // יצירת ירייה חדשה
        const bullet = new BossBullet(this.x + this.width/2, this.y + this.height/2, dirX, dirY);
        bossBullets.push(bullet);
    }
    
    takeDamage() {
        if (this.damaged) return; // אם כבר במצב פגיעה, אל תקבל נזק נוסף
        
        this.health--;
        this.damaged = true;
        
        // עדכון מד הבריאות
        bossHealth = this.health;
        persistentBossHealth = this.health; // שמירת הבריאות במשתנה החיצוני
        if (bossHealthElement) {
            bossHealthElement.textContent = bossHealth;
        }
        
        // אפקט פגיעה ויזואלי
        this.element.classList.add('damage');
        
        // הסרת אפקט הפגיעה אחרי זמן קצר
        setTimeout(() => {
            this.element.classList.remove('damage');
            this.damaged = false;
        }, 500);
        
        // הוסף קצת מהירות עם כל פגיעה
        this.speedX = Math.min(this.speedX + 0.3, this.maxSpeed);
        this.speedY = Math.min(this.speedY + 0.2, this.maxSpeed);
        this.shootDelay = Math.max(this.shootDelay - 50, 500); // הגדלת קצב הירי עד לגבול של 500ms
        
        // בדיקה אם בופי הובסה
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        // יצירת אפקט פיצוץ גדול
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createExplosion(
                    this.x + Math.random() * this.width, 
                    this.y + Math.random() * this.height
                );
            }, i * 200);
        }
        
        // הסרת בופי
        this.element.remove();
        boofi = null;
        
        // החזרת כל היריות של הבוס
        for (let bullet of bossBullets) {
            bullet.element.remove();
        }
        bossBullets = [];
        
        // הוספת נקודות ענק
        score += 5000;
        updateHUD();
        
        // הסתרת מד בריאות הבוס
        const bossHealthBar = document.querySelector('.boss-health');
        if (bossHealthBar) {
            bossHealthBar.style.display = 'none';
        }
        
        // סיום המשחק בניצחון
        setTimeout(() => {
            gameOver(true);
        }, 1000);
    }
}

// מחלקת ירייה של הבוס
class BossBullet extends GameObject {
    constructor(x, y, dirX, dirY) {
        super(x - 6, y - 6, 12, 12, 'boss-bullet');
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = BOSS_BULLET_SPEED;
    }
    
    update() {
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
        
        // עדכון מיקום האלמנט
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        // הסרת הירייה אם יצאה מגבולות המסך
        if (this.x < -this.width || this.x > gameContainer.offsetWidth ||
            this.y < -this.height || this.y > gameContainer.offsetHeight) {
            this.element.remove();
            bossBullets.splice(bossBullets.indexOf(this), 1);
        }
    }
}

// מחלקת כנפיים
class Wings extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40, 'wings');
    }
}

// מחלקת פלטפורמה נעה
class MovingPlatform extends GameObject {
    constructor(x, y, width, height, speedX, speedY, range) {
        super(x, y, width, height, 'platform');
        this.startX = x;
        this.startY = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.range = range;
        this.direction = 1;
        this.element.classList.add('moving-platform');
    }
    
    update() {
        if (this.speedX !== 0) {
            this.x += this.speedX * this.direction;
            
            if (Math.abs(this.x - this.startX) >= this.range) {
                this.direction *= -1;
            }
        }
        
        if (this.speedY !== 0) {
            this.y += this.speedY * this.direction;
            
            if (Math.abs(this.y - this.startY) >= this.range) {
                this.direction *= -1;
            }
        }
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
}

// מחלקת פלטפורמה מיוחדת
class SpecialPlatform extends GameObject {
    constructor(x, y, width, height, type) {
        super(x, y, width, height, 'platform');
        this.type = type;
        this.stable = true;
        this.collapseTimer = null;
        
        // עיצוב מיוחד לפי סוג הפלטפורמה
        switch(type) {
            case 'ice':
                this.element.classList.add('ice-platform');
                break;
            case 'collapsing':
                this.element.classList.add('collapsing-platform');
                break;
        }
    }
    
    startCollapse() {
        if (this.collapseTimer) return;
        
        // התחלת אנימציית רעידה
        this.element.classList.add('shaking');
        
        // הפלטפורמה תיעלם אחרי 1.5 שניות
        this.collapseTimer = setTimeout(() => {
            this.element.classList.add('collapsed');
            this.element.style.opacity = '0';
            this.stable = false;
            
            // אם השחקן עומד על הפלטפורמה, הגדר מחדש את ה-grounded שלו
            if (player && this.checkPlayerOnPlatform(player)) {
                player.grounded = false;
            }
            
            // הפלטפורמה תחזור אחרי 3 שניות
            setTimeout(() => {
                this.element.classList.remove('shaking', 'collapsed');
                this.element.style.opacity = '1';
                this.stable = true;
                this.collapseTimer = null;
            }, 3000);
        }, 1500);
    }
    
    // פונקציה חדשה: בדיקה אם השחקן עומד על הפלטפורמה
    checkPlayerOnPlatform(player) {
        // בדיקה אם השחקן נמצא מעל הפלטפורמה
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               Math.abs((player.y + player.height) - this.y) < 5; // טולרנס של כמה פיקסלים
    }
}

// מחלקת מתנה
class Present extends GameObject {
    constructor(x, y, type) {
        super(x, y, 32, 32, 'present');
        this.type = type;
        this.element.classList.add(`present-${type}`);
    }
}

// פונקציה ליצירת אויב
function createEnemy(x, y, speedX, rangeX) {
    const width = 32;
    const height = 24;
    const enemyY = y - 6;  // הזזה כלפי מעלה ב-6 פיקסלים
    return new Enemy(x, enemyY, width, height, speedX, 0, rangeX);
}

// פונקציה ליצירת אפקט פיצוץ
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = (x - 16) + 'px';
    explosion.style.top = (y - 16) + 'px';
    gameContainer.appendChild(explosion);
    
    // הסרת אלמנט הפיצוץ לאחר האנימציה
    setTimeout(() => {
        if (explosion && explosion.parentNode) {
            explosion.parentNode.removeChild(explosion);
        }
    }, 500);
}

// פונקציה להוספת מתנה לשלב
function createPresent(x, y, type) {
    return new Present(x, y, type);
}

// פונקציה לאיסוף מתנה
function collectPresent() {
    if (!presentObject || presentCollected) return;
    
    // סימון שאספנו את המתנה
    presentCollected = true;
    allLevelsPresentCollected[currentLevel - 1] = true;
    
    // אפקט אנימציה
    presentObject.element.classList.add('collected');
    
    // הוספת נקודות
    score += 500;
    updateHUD();
    
    // עדכון השער/דלת ליציאה אם אספנו את כל היהלומים
    if (gems.length === 0) {
        showExit();
    }
    
    // הסרת המתנה לאחר האנימציה
    setTimeout(() => {
        if (presentObject && presentObject.element && presentObject.element.parentNode) {
            presentObject.element.parentNode.removeChild(presentObject.element);
            presentObject = null;
        }
    }, 500);
}

// פונקציה לאיסוף כנפיים
function collectWings() {
    if (!wingsItem) return;
    
    // הוספת אפקט אנימציה
    wingsItem.element.classList.add('collected');
    
    // הפיכת השחקן לבעל כנפיים
    playerHasWings = true;
    
    // עדכון השחקן למצב טיסה
    if (player) {
        player.flying = true;
        player.element.classList.add('flying');
    }
    
    // הוספת נקודות
    score += 1000;
    updateHUD();
    
    // הסרת פריט הכנפיים אחרי האנימציה
    setTimeout(() => {
        if (wingsItem && wingsItem.element && wingsItem.element.parentNode) {
            wingsItem.element.parentNode.removeChild(wingsItem.element);
            wingsItem = null;
        }
    }, 500);
}

// פונקציה להצגת המפגש עם מופי
function showMoopiMeeting() {
    gameRunning = false;
    clearInterval(gameInterval);
    
    // מציגים את מסך המפגש עם מופי
    moopiMeetingScreen.style.display = 'flex';
}