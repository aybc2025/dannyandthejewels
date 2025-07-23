// קובץ מידע על המתנות

// מערך שמות המתנות לפי סוג
const presentNames = {
    "car": "מכונית המירוץ",
    "lego": "סט הלגו",
    "console": "קונסולת המשחקים",
    "robot": "הרובוט הצעצוע",
    "telescope": "הטלסקופ",
    "bicycle": "האופניים החדשים",
    "camera": "המצלמה הדיגיטלית",
    "game": "משחק המחשב החדש"
};

// מערך תיאורי המתנות
const presentDescriptions = {
    "car": "מכונית מירוץ אדומה עם שלט רחוק!",
    "lego": "סט לגו ענק עם 1000 חלקים!",
    "console": "קונסולת משחקים חדשה ומגניבה!",
    "robot": "רובוט צעצוע שמתוכנת לבצע משימות!",
    "telescope": "טלסקופ חזק לצפייה בכוכבים!",
    "bicycle": "אופניים חדשות עם הילוכים!",
    "camera": "מצלמה דיגיטלית לצילום תמונות מדהימות!",
    "game": "משחק המחשב החדש והמבוקש ביותר השנה!"
};

// פונקציה להצגת תיאור המתנה לפי סוג
function getPresentDescription(type) {
    return presentDescriptions[type] || "מתנה מיוחדת";
}

// פונקציה לקבלת שם המתנה לפי סוג
function getPresentName(type) {
    return presentNames[type] || "מתנה";
}