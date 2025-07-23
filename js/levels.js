// שלב 1 - המבצר הנטוש
function loadLevel1() {
    // שחקן
    player = new Player(50, 400);
    
    // פלטפורמות (רצפה, מדרגות)
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    platforms.push(new GameObject(100, 400, 100, 20, 'platform'));
    platforms.push(new GameObject(300, 350, 100, 20, 'platform'));
    platforms.push(new GameObject(500, 300, 100, 20, 'platform'));
    platforms.push(new GameObject(200, 250, 100, 20, 'platform'));
    platforms.push(new GameObject(400, 200, 100, 20, 'platform'));
    
    // יהלומים - 5 יהלומים בשלב זה
    gems.push(new GameObject(130, 370, 20, 20, 'gem'));
    gems.push(new GameObject(330, 320, 20, 20, 'gem'));
    gems.push(new GameObject(530, 270, 20, 20, 'gem'));
    gems.push(new GameObject(230, 220, 20, 20, 'gem'));
    gems.push(new GameObject(430, 170, 20, 20, 'gem'));
    
    // מתנה - מכונית המירוץ
    if (!allLevelsPresentCollected[0]) {
    presentObject = createPresent(650, 470, "car");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[0]; // האם כבר אספנו את המתנה
    
    // אויבים
    enemies.push(createEnemy(300, 480, 2, 150));
    
    // יציאה (מוסתרת בתחילה)
    exit = new GameObject(700, 440, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 2 - היער המכושף
function loadLevel2() {
    // שחקן
    player = new Player(50, 400);
    
    // פלטפורמות
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    platforms.push(new GameObject(100, 400, 80, 20, 'platform'));
    platforms.push(new GameObject(240, 350, 80, 20, 'platform'));
    platforms.push(new GameObject(380, 300, 80, 20, 'platform'));
    platforms.push(new GameObject(520, 250, 80, 20, 'platform'));
    platforms.push(new GameObject(660, 200, 80, 20, 'platform'));
    platforms.push(new GameObject(200, 150, 80, 20, 'platform'));
    
    // יהלומים - 7 יהלומים בשלב זה
    gems.push(new GameObject(130, 370, 20, 20, 'gem'));
    gems.push(new GameObject(270, 320, 20, 20, 'gem'));
    gems.push(new GameObject(410, 270, 20, 20, 'gem'));
    gems.push(new GameObject(550, 220, 20, 20, 'gem'));
    gems.push(new GameObject(690, 170, 20, 20, 'gem'));
    gems.push(new GameObject(500, 470, 20, 20, 'gem'));
    gems.push(new GameObject(230, 120, 20, 20, 'gem'));
    
    // מתנה - סט הלגו
    if (!allLevelsPresentCollected[1]) {
    presentObject = createPresent(400, 470, "lego");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[1]; // האם כבר אספנו את המתנה
    
    // אויבים
    enemies.push(createEnemy(200, 480, 2, 150));
    enemies.push(createEnemy(400, 480, 3, 100));
    enemies.push(createEnemy(690, 180, 1, 40));
    
    // יציאה (מוסתרת בתחילה)
    exit = new GameObject(750, 440, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 3 - המבוך התת-קרקעי
function loadLevel3() {
    // שחקן
    player = new Player(50, 450);
    
    // פלטפורמות - מבוך מורכב
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    platforms.push(new GameObject(120, 450, 100, 20, 'platform'));
    platforms.push(new GameObject(280, 420, 100, 20, 'platform'));
    platforms.push(new GameObject(440, 390, 100, 20, 'platform'));
    platforms.push(new GameObject(600, 360, 100, 20, 'platform'));
    
    platforms.push(new GameObject(50, 350, 100, 20, 'platform'));
    platforms.push(new GameObject(210, 320, 100, 20, 'platform'));
    platforms.push(new GameObject(370, 290, 100, 20, 'platform'));
    platforms.push(new GameObject(530, 260, 100, 20, 'platform'));
    
    platforms.push(new GameObject(120, 230, 100, 20, 'platform'));
    platforms.push(new GameObject(280, 200, 100, 20, 'platform'));
    platforms.push(new GameObject(440, 170, 100, 20, 'platform'));
    platforms.push(new GameObject(600, 140, 100, 20, 'platform'));
    
    platforms.push(new GameObject(50, 110, 100, 20, 'platform'));
    
    // יהלומים - 12 יהלומים בשלב זה
    gems.push(new GameObject(150, 420, 20, 20, 'gem'));
    gems.push(new GameObject(310, 390, 20, 20, 'gem'));
    gems.push(new GameObject(470, 360, 20, 20, 'gem'));
    gems.push(new GameObject(630, 330, 20, 20, 'gem'));
    
    gems.push(new GameObject(80, 320, 20, 20, 'gem'));
    gems.push(new GameObject(240, 290, 20, 20, 'gem'));
    gems.push(new GameObject(400, 260, 20, 20, 'gem'));
    gems.push(new GameObject(560, 230, 20, 20, 'gem'));
    
    gems.push(new GameObject(150, 200, 20, 20, 'gem'));
    gems.push(new GameObject(310, 170, 20, 20, 'gem'));
    gems.push(new GameObject(470, 140, 20, 20, 'gem'));
    gems.push(new GameObject(630, 110, 20, 20, 'gem'));
    
    // מתנה - קונסולת המשחקים
    if (!allLevelsPresentCollected[2]) {
    presentObject = createPresent(350, 470, "console");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[2]; // האם כבר אספנו את המתנה
    
    // אויבים
    enemies.push(createEnemy(100, 480, 2, 150));
    enemies.push(createEnemy(300, 480, 3, 200));
    enemies.push(createEnemy(500, 480, 4, 150));
    
    enemies.push(createEnemy(200, 400, 2, 70));
    enemies.push(createEnemy(400, 370, 3, 70));
    enemies.push(createEnemy(300, 280, 3, 70));
    enemies.push(createEnemy(150, 210, 2, 50));
    
    // יציאה (מוסתרת בתחילה)
    exit = new GameObject(80, 80, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 4 - מערת קרח (עם פלטפורמות קרח)
function loadLevel4() {
    // שחקן
    player = new Player(50, 400);
    
    // פלטפורמות
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    
    // מדרגות רגילות
    platforms.push(new GameObject(150, 440, 60, 20, 'platform')); 
    
    // פלטפורמת קרח - תגרום להחלקה
    platforms.push(new SpecialPlatform(260, 390, 60, 20, 'ice'));
    
    // פלטפורמה רגילה
    platforms.push(new GameObject(370, 340, 60, 20, 'platform'));
    
    // פלטפורמות קרח במסלול העליון
    platforms.push(new SpecialPlatform(480, 290, 60, 20, 'ice'));
    platforms.push(new SpecialPlatform(590, 240, 60, 20, 'ice'));
    platforms.push(new SpecialPlatform(480, 190, 60, 20, 'ice'));
    platforms.push(new SpecialPlatform(370, 140, 60, 20, 'ice'));
    
    // פלטפורמות רגילות בצד שמאל
    platforms.push(new GameObject(260, 190, 60, 20, 'platform'));
    platforms.push(new GameObject(150, 240, 60, 20, 'platform'));
    
    // יהלומים - 9 יהלומים בשלב זה
    gems.push(new GameObject(165, 410, 20, 20, 'gem'));
    gems.push(new GameObject(275, 360, 20, 20, 'gem'));
    gems.push(new GameObject(385, 310, 20, 20, 'gem'));
    gems.push(new GameObject(495, 260, 20, 20, 'gem'));
    gems.push(new GameObject(605, 210, 20, 20, 'gem'));
    gems.push(new GameObject(495, 160, 20, 20, 'gem'));
    gems.push(new GameObject(385, 110, 20, 20, 'gem'));
    gems.push(new GameObject(275, 160, 20, 20, 'gem'));
    gems.push(new GameObject(165, 210, 20, 20, 'gem'));
    
    // מתנה - הרובוט הצעצוע
if (!allLevelsPresentCollected[3]) {
    presentObject = createPresent(700, 470, "robot");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[3]; // האם כבר אספנו את המתנה
    
    // אויבים
    enemies.push(createEnemy(200, 480, 3, 200));
    enemies.push(createEnemy(500, 480, 4, 180));
    enemies.push(createEnemy(605, 220, 1, 30));
    enemies.push(createEnemy(165, 220, 1, 30));
    
    // יציאה (מוסתרת בתחילה)
    exit = new GameObject(385, 80, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 5 - מכרה תת-קרקעי (עם פלטפורמות מתמוטטות)
function loadLevel5() {
    // שחקן
    player = new Player(50, 400);
    
    // פלטפורמות בצורת "Z"
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    platforms.push(new GameObject(100, 400, 200, 20, 'platform'));
    platforms.push(new GameObject(200, 350, 200, 20, 'platform'));
    platforms.push(new GameObject(300, 300, 200, 20, 'platform'));
    platforms.push(new GameObject(400, 250, 200, 20, 'platform'));
    platforms.push(new GameObject(500, 200, 200, 20, 'platform'));
    
    // "מלכודת" של פלטפורמות קטנות מתמוטטות
    platforms.push(new SpecialPlatform(100, 180, 50, 20, 'collapsing'));
    platforms.push(new SpecialPlatform(250, 150, 50, 20, 'collapsing'));
    platforms.push(new SpecialPlatform(400, 120, 50, 20, 'collapsing'));
    platforms.push(new SpecialPlatform(550, 90, 50, 20, 'collapsing'));
    
    // יהלומים - 10 יהלומים בשלב זה
    gems.push(new GameObject(130, 370, 20, 20, 'gem'));
    gems.push(new GameObject(230, 320, 20, 20, 'gem'));
    gems.push(new GameObject(330, 270, 20, 20, 'gem'));
    gems.push(new GameObject(430, 220, 20, 20, 'gem'));
    gems.push(new GameObject(530, 170, 20, 20, 'gem'));
    gems.push(new GameObject(650, 170, 20, 20, 'gem'));
    
    // יהלומים במלכודות
    gems.push(new GameObject(115, 150, 20, 20, 'gem'));
    gems.push(new GameObject(265, 120, 20, 20, 'gem'));
    gems.push(new GameObject(415, 90, 20, 20, 'gem'));
    gems.push(new GameObject(565, 60, 20, 20, 'gem'));
    
    // מתנה - הטלסקופ
if (!allLevelsPresentCollected[4]) {
    presentObject = createPresent(550, 470, "telescope");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[4]; // האם כבר אספנו את המתנה
    
    // אויבים
    enemies.push(createEnemy(150, 480, 3, 250));
    enemies.push(createEnemy(400, 480, 4, 200));
    enemies.push(createEnemy(200, 380, 2, 100));
    enemies.push(createEnemy(300, 280, 2, 100));
    enemies.push(createEnemy(400, 230, 2, 100));
    enemies.push(createEnemy(500, 180, 2, 100));
    
    // יציאה (מוסתרת בתחילה)
    exit = new GameObject(700, 440, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 6 - מגדל עננים (עם פלטפורמות נעות אופקית)
function loadLevel6() {
    // שחקן
    player = new Player(50, 450);
    
    // פלטפורמה תחתונה
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    
    // צד שמאל - מדרגות עולות
    platforms.push(new GameObject(100, 430, 150, 20, 'platform'));
    platforms.push(new GameObject(50, 360, 150, 20, 'platform'));
    platforms.push(new GameObject(100, 290, 150, 20, 'platform'));
    platforms.push(new GameObject(50, 220, 150, 20, 'platform'));
    
    // מרכז - פלטפורמה ארוכה
    platforms.push(new GameObject(250, 220, 300, 20, 'platform'));
    
    // צד ימין - מדרגות עולות
    platforms.push(new GameObject(600, 430, 150, 20, 'platform'));
    platforms.push(new GameObject(650, 360, 150, 20, 'platform'));
    platforms.push(new GameObject(600, 290, 150, 20, 'platform'));
    platforms.push(new GameObject(650, 220, 150, 20, 'platform'));
    
    // פלטפורמות עליונות - מוחלפות בפלטפורמות נעות אופקית
    platforms.push(new MovingPlatform(250, 150, 100, 20, 2, 0, 100)); // נעה אופקית
    platforms.push(new MovingPlatform(450, 150, 100, 20, 3, 0, 80));  // נעה אופקית
    
    // פלטפורמה עליונה במרכז - משאירים רגילה
    platforms.push(new GameObject(350, 80, 100, 20, 'platform'));
    
    // יהלומים - 15 יהלומים בשלב זה
    gems.push(new GameObject(150, 400, 20, 20, 'gem'));
    gems.push(new GameObject(100, 330, 20, 20, 'gem'));
    gems.push(new GameObject(150, 260, 20, 20, 'gem'));
    
    // יהלומים במרכז למטה
    gems.push(new GameObject(300, 470, 20, 20, 'gem'));
    gems.push(new GameObject(500, 470, 20, 20, 'gem'));
    
    // יהלומים בצד ימין
    gems.push(new GameObject(650, 400, 20, 20, 'gem'));
    gems.push(new GameObject(700, 330, 20, 20, 'gem'));
    gems.push(new GameObject(650, 260, 20, 20, 'gem'));
    
    // יהלומים בפלטפורמה המרכזית
    gems.push(new GameObject(300, 190, 20, 20, 'gem'));
    gems.push(new GameObject(400, 190, 20, 20, 'gem'));
    gems.push(new GameObject(500, 190, 20, 20, 'gem'));
    
    // יהלומים בפלטפורמות העליונות
    gems.push(new GameObject(300, 120, 20, 20, 'gem'));
    gems.push(new GameObject(500, 120, 20, 20, 'gem'));
    
    // יהלום בפסגה - שינוי מיקום שלא יהיה מאחורי הדלת
    gems.push(new GameObject(350, 50, 20, 20, 'gem'));
    
    // מתנה - האופניים החדשים
if (!allLevelsPresentCollected[5]) {
    presentObject = createPresent(400, 470, "bicycle");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[5]; // האם כבר אספנו את המתנה
    
    // אויבים
    // תחתית המגדל
    enemies.push(createEnemy(200, 480, 3, 200));
    enemies.push(createEnemy(500, 480, 3, 200));
    
    // בפלטפורמות הצדדיות
    enemies.push(createEnemy(150, 410, 1, 80));
    enemies.push(createEnemy(650, 410, 1, 80));
    
    // בפלטפורמה המרכזית
    enemies.push(createEnemy(350, 200, 4, 150));
    
    // בפלטפורמות העליונות
    enemies.push(createEnemy(300, 130, 1, 50));
    enemies.push(createEnemy(500, 130, 1, 50));
    
    // אויב בפסגה
    enemies.push(createEnemy(390, 60, 1, 30));
    
    // יציאה בפסגה (מוסתרת בתחילה)
    exit = new GameObject(380, 20, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 7 - מדבר מסוכן (עם פלטפורמות נעות אנכית)
function loadLevel7() {
    // שחקן
    player = new Player(50, 400);
    
    // פלטפורמות במסלול זיגזג
    platforms.push(new GameObject(0, 500, 800, 100, 'platform')); // רצפה
    
    // צד שמאל למעלה
    platforms.push(new GameObject(100, 400, 100, 20, 'platform'));
    platforms.push(new GameObject(50, 320, 100, 20, 'platform'));
    platforms.push(new GameObject(100, 240, 100, 20, 'platform'));
    platforms.push(new GameObject(50, 160, 100, 20, 'platform'));
    
    // רצף לצד ימין - מוחלף בפלטפורמות נעות אנכית
    platforms.push(new MovingPlatform(200, 160, 50, 20, 0, 1.5, 60)); // זזה אנכית
    platforms.push(new MovingPlatform(300, 160, 50, 20, 0, 1.5, 70)); // זזה אנכית
    platforms.push(new MovingPlatform(400, 160, 50, 20, 0, 1.5, 80)); // זזה אנכית
    platforms.push(new MovingPlatform(500, 160, 50, 20, 0, 1.5, 90)); // זזה אנכית
    platforms.push(new MovingPlatform(600, 160, 50, 20, 0, 1.5, 100)); // זזה אנכית
    
    // צד ימין למטה
    platforms.push(new GameObject(650, 240, 100, 20, 'platform'));
    platforms.push(new GameObject(700, 320, 100, 20, 'platform'));
    platforms.push(new GameObject(650, 400, 100, 20, 'platform'));
    
    // פלטפורמות באמצע
    platforms.push(new GameObject(350, 320, 100, 20, 'platform'));
    platforms.push(new GameObject(350, 240, 100, 20, 'platform'));
    
    // יהלומים - 15 יהלומים בשלב זה
    gems.push(new GameObject(130, 370, 20, 20, 'gem'));
    gems.push(new GameObject(80, 290, 20, 20, 'gem'));
    gems.push(new GameObject(130, 210, 20, 20, 'gem'));
    gems.push(new GameObject(80, 130, 20, 20, 'gem'));
    
    // יהלומים ברצף
    gems.push(new GameObject(215, 130, 20, 20, 'gem'));
    gems.push(new GameObject(315, 130, 20, 20, 'gem'));
    gems.push(new GameObject(415, 130, 20, 20, 'gem'));
    gems.push(new GameObject(515, 130, 20, 20, 'gem'));
    gems.push(new GameObject(615, 130, 20, 20, 'gem'));
    
    // יהלומים בצד ימין
    gems.push(new GameObject(680, 210, 20, 20, 'gem'));
    gems.push(new GameObject(730, 290, 20, 20, 'gem'));
    gems.push(new GameObject(680, 370, 20, 20, 'gem'));
    
    // יהלומים באמצע
    gems.push(new GameObject(390, 290, 20, 20, 'gem'));
    gems.push(new GameObject(390, 210, 20, 20, 'gem'));
    
    // מתנה - המצלמה הדיגיטלית
if (!allLevelsPresentCollected[6]) {
    presentObject = createPresent(700, 470, "camera");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[6]; // האם כבר אספנו את המתנה
    
    // אויבים
    enemies.push(createEnemy(200, 480, 4, 400));
    enemies.push(createEnemy(500, 480, 4, 400));
    enemies.push(createEnemy(100, 380, 1, 50));
    enemies.push(createEnemy(650, 380, 1, 50));
    enemies.push(createEnemy(390, 300, 1, 50));
    
    // אויבים נוספים לאורך המסלול העליון
    enemies.push(createEnemy(250, 140, 2, 100));
    enemies.push(createEnemy(450, 140, 2, 100));
    
    // יציאה (מוסתרת בתחילה)
    exit = new GameObject(700, 100, 40, 60, 'exit');
    exit.element.style.display = gems.length === 0 && presentCollected ? 'block' : 'none';
}

// שלב 8 - מקדש אפל (עם שילוב של כל סוגי הפלטפורמות)
function loadLevel8() {
    // שחקן
    player = new Player(400, 450);
    
    // פלטפורמות מורכבות
    platforms.push(new GameObject(300, 500, 200, 20, 'platform')); // רצפה קטנה באמצע
    
    // פלטפורמות משני הצדדים - אחת רגילה, אחת מתמוטטת
    platforms.push(new GameObject(100, 420, 100, 20, 'platform'));
    platforms.push(new SpecialPlatform(600, 420, 100, 20, 'collapsing'));
    
    // מסלול מעגלי עם שילוב של סוגי פלטפורמות
    platforms.push(new GameObject(50, 320, 100, 20, 'platform')); // רגילה
    platforms.push(new SpecialPlatform(200, 270, 100, 20, 'ice')); // קרח
    platforms.push(new GameObject(350, 250, 100, 20, 'platform')); // רגילה 
    platforms.push(new SpecialPlatform(500, 270, 100, 20, 'ice')); // קרח
    platforms.push(new GameObject(650, 320, 100, 20, 'platform')); // רגילה
    
    // פלטפורמות נעות
    platforms.push(new MovingPlatform(600, 180, 100, 20, 3, 0, 120)); // אופקית
    platforms.push(new MovingPlatform(100, 180, 100, 20, 0, 2, 60)); // אנכית
    
    // פלטפורמה מרכזית עליונה - מתמוטטת
    platforms.push(new SpecialPlatform(350, 100, 100, 20, 'collapsing'));
    
    // יהלומים - 10 יהלומים בשלב זה
    gems.push(new GameObject(350, 470, 20, 20, 'gem')); // באמצע למטה
    gems.push(new GameObject(140, 390, 20, 20, 'gem')); // בצד שמאל
    gems.push(new GameObject(640, 390, 20, 20, 'gem')); // בצד ימין
    
    // יהלומים במסלול המעגלי
    gems.push(new GameObject(90, 290, 20, 20, 'gem'));
    gems.push(new GameObject(240, 240, 20, 20, 'gem'));
    gems.push(new GameObject(390, 220, 20, 20, 'gem'));
    gems.push(new GameObject(540, 240, 20, 20, 'gem'));
    gems.push(new GameObject(690, 290, 20, 20, 'gem'));
    
    // יהלומים בפלטפורמות העליונות
    gems.push(new GameObject(140, 150, 20, 20, 'gem'));
    gems.push(new GameObject(640, 150, 20, 20, 'gem'));
    
    // מתנה - משחק המחשב החדש
if (!allLevelsPresentCollected[7]) {
    presentObject = createPresent(500, 470, "game");
} else {
    presentObject = null;
}
presentCollected = allLevelsPresentCollected[7]; // האם כבר אספנו את המתנה
    
    // שינוי: לא יוצרים את מופי כאן
    // מופי ייווצר רק בסוף השלב בתוך מסך המפגש עם מופי
    
    // אויבים
    enemies.push(createEnemy(250, 480, 2, 80));
    enemies.push(createEnemy(480, 480, 2, 80));
    enemies.push(createEnemy(100, 400, 1.5, 40));
    enemies.push(createEnemy(600, 400, 1.5, 40));
    enemies.push(createEnemy(50, 300, 1.5, 40));
    enemies.push(createEnemy(650, 300, 1.5, 40));
    enemies.push(createEnemy(200, 250, 1.5, 40));
    enemies.push(createEnemy(500, 250, 1.5, 40));
    enemies.push(createEnemy(100, 160, 1.5, 40));
    enemies.push(createEnemy(600, 160, 1.5, 40));
    enemies.push(createEnemy(350, 80, 1, 30));
    
    // יציאה בפסגה (מוסתרת בתחילה)
    exit = new GameObject(380, 40, 40, 60, 'exit');
    exit.element.style.display = 'none'; // תמיד מוסתרת בתחילה
}

// שלב 9 - הקרב הסופי נגד בופי
function loadLevel9() {
    // שחקן - מתחיל בדיוק מעל המדף
    player = new Player(380, 510);
    
    // יצירת רקע של עננים נעים
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * gameContainer.offsetWidth;
        const y = Math.random() * gameContainer.offsetHeight;
        const speed = 0.2 + Math.random() * 0.5; // מהירות אקראית
        
        clouds.push(new Cloud(x, y, speed));
    }
    
    // פלטפורמה אחת בתחתית - הרחבת המדף כדי שהשחקן לא יפול
    platforms.push(new GameObject(310, 550, 180, 20, 'platform')); // רצפה קטנה למקרה שאין כנפיים
    
    // הזזת הכנפיים רחוק מדי מהשחקן בהתחלה כדי למנוע איסוף אוטומטי
    if (!playerHasWings) {
        wingsItem = new Wings(200, 480);
    }
    
    // הצגת מד בריאות הבוס
    const bossHealthBar = document.querySelector('.boss-health');
    if (bossHealthBar) {
        bossHealthBar.style.display = 'block';
    }
    
    // יצירת הבוס - בופי
    boofi = new Boofi(400, 100);
    
    // עדכון בריאות הבוס - במקרה של טעינה מחדש, משתמשים בבריאות השמורה
    bossHealth = boofi.health;
    if (bossHealthElement) {
        bossHealthElement.textContent = bossHealth;
    }
    
    // הודעת דיבאג על בריאות הבוס
    console.log("בריאות בופי נטענה: " + boofi.health);
    console.log("האם לשחקן יש כנפיים: " + playerHasWings);
}

// טעינת שלב - פונקציה ראשית
function loadLevel(level) {
    // ניקוי אלמנטי המשחק הקודמים
    clearGameElements();
    
    // וידוא שהשלב שנבחר הוא מספר תקף
    level = parseInt(level) || 1;
    
    // הודעת דיבאג
    console.log("Loading level: " + level);
    
    // עדכון משתנה גלובלי של השלב הנוכחי
    currentLevel = level;
    
    // איפוס משתני השלב
    presentCollected = allLevelsPresentCollected[level - 1] || false;
    
    // בדיקה וטעינת השלב המתאים
    try {
        switch (level) {
            case 1:
                loadLevel1();
                break;
            case 2:
                loadLevel2();
                break;
            case 3:
                loadLevel3();
                break;
            case 4:
                loadLevel4();
                break;
            case 5:
                loadLevel5();
                break;
            case 6:
                loadLevel6();
                break;
            case 7:
                loadLevel7();
                break;
            case 8:
                loadLevel8();
                break;
            case 9:
                loadLevel9();
                break;
            default:
                // אם מגיעים לשלב לא מוגדר, חוזרים לשלב הראשון
                console.log("שלב לא מוגדר, חוזר לשלב 1");
                loadLevel1();
                currentLevel = 1; // עדכון המשתנה הגלובלי
                break;
        }
        
        // עדכון תמת המשחק לפי השלב
        updateLevelTheme(currentLevel);
        
        // בדיקה אם צריך להציג את הדלת אם כבר אספנו את כל היהלומים והמתנה
        if (gems.length === 0 && presentCollected && exit) {
            exit.element.style.display = 'block';
            exit.element.style.opacity = '1';
        }
        
        // הוספת כפתור יציאה לתפריט
        addExitButton();
        
    } catch (error) {
        console.error("שגיאה בטעינת שלב:", error);
        // טעינת שלב ברירת מחדל במקרה של שגיאה
        loadLevel1();
        currentLevel = 1; // עדכון המשתנה הגלובלי
    }
    
    // עדכון ממשק המשתמש
    updateHUD();
    
    console.log(`שלב ${level} נטען בהצלחה`);
}