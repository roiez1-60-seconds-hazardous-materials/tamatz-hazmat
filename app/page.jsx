"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   DATA — כל המידע מהמצגת
   ═══════════════════════════════════════════ */

const AXES_DATA = [
  {
    id: "command",
    title: "ציר פיקודי",
    subtitle: "אמת לשטח",
    color: "#C41E2A",
    icon: "🎯",
    summary: "מפקדים בזירה המספקים מידע דינמי המשתנה לאורך הזמן.",
    details: [
      "מפקד האירוע מדווח בזמן אמת על שינויים בשטח",
      "עדכונים על כיוון רוח, התפשטות הענן, ריח, צבע עשן",
      "דיווח על מספר לכודים ומצבם",
      "תיאור פעולות שבוצעו מרגע ההגעה",
      "זיהוי שינויים בעוצמת האירוע"
    ],
    warning: "ללא אספקת מידע בציר זה — נבנית תמ\"צ שגויה שמובילה להחלטות שגויות."
  },
  {
    id: "control",
    title: "ציר שליטה",
    subtitle: "מידע חיצוני ומערכתי",
    color: "#2E86C1",
    icon: "📡",
    summary: "איסוף מידע ממחזיק החומ\"ס, גופים חברים (מד\"א, משטרת ישראל), עוברי אורח, ומידע מבצעי הזמין במערכת הלפיד.",
    details: [
      "מידע ממנהל המפעל / מחזיק החומ\"ס",
      "דיווחי מד\"א — מספר נפגעים, סוגי פגיעות",
      "מידע ממשטרת ישראל — גישה לזירה, פינויים",
      "עדויות עוברי אורח ותושבים",
      "נתונים ממערכת הלפיד ומערכות מבצעיות"
    ],
    warning: null
  },
  {
    id: "professional",
    title: "ציר מקצועי",
    subtitle: "מודיעין סטטי והנדסי",
    color: "#D4A843",
    icon: "📋",
    summary: "רמ\"ח הגנה מאש, רע\"ן חומ\"ס וקציני הע\"ס. אספקת מידע מתיק המפעל/תיק שטח ותכנון מוקדם.",
    details: [
      "תיק מפעל — מפות, תוכניות חירום, רשימת חומרים",
      "גיליון בטיחות (SDS) של החומר המעורב",
      "תכנון מוקדם — תרחישי ייחוס ודרכי פעולה",
      "ניסיון מאירועים קודמים דומים",
      "מידע הנדסי על המתקן והתשתיות"
    ],
    warning: null
  }
];

const DASHBOARD_CARDS = [
  {
    id: "location",
    icon: "📍",
    title: "מיקום וסוג",
    color: "#2E86C1",
    items: [
      "בירור מיקום מדויק של האירוע",
      "סוג המתקן (מפעל, מחסן, תחנת דלק...)",
      "שם המתקן והכתובת",
      "התהליך המתרחש (ייצור, אחסון, העברה)"
    ]
  },
  {
    id: "materials",
    icon: "⚗️",
    title: "זיהוי חומרים",
    color: "#10B981",
    items: [
      "איסוף מידע מדויק על שם החומר",
      "מספר האו\"ם (UN Number)",
      "כמות החומר המעורב",
      "מצב צבירה (גז/נוזל/מוצק)"
    ]
  },
  {
    id: "risk",
    icon: "⚠️",
    title: "מאפייני הסיכון",
    color: "#F59E0B",
    items: [
      "זיהוי אופי האירוע: דליפה / שריפה / פיצוץ / שפך",
      "סיווג החומר: דליק / רעיל / משתך / מחמצן",
      "מצב צבירה וכיוון התפשטות",
      "טווחי סיכון — ERPG / AEGL"
    ]
  },
  {
    id: "casualties",
    icon: "🚑",
    title: "לכודים ונפגעים",
    color: "#EF4444",
    items: [
      "סטטוס הימצאות לכודים בזירת האירוע",
      "מספר לכודים ומיקומם",
      "מספר נפגעים וחומרת הפגיעה",
      "האם בוצע פינוי ראשוני"
    ]
  },
  {
    id: "actions",
    icon: "🏭",
    title: "פעולות מפעל",
    color: "#8B5CF6",
    items: [
      "פעולות שבוצעו ע\"י צוותי הכיבוי המפעליים",
      "סגירת ברזים / בידוד מקור הדליפה",
      "הפעלת מערכות כיבוי/ספיגה קבועות",
      "פעולות שבוצעו עד הגעת כוחות כבאות והצלה"
    ]
  }
];

const ANALYSIS_STEPS = [
  {
    id: "situation",
    icon: "📊",
    title: "תמונת מצב ראשונית מתגבשת",
    desc: "המידע הגולמי מ-3 הצירים מועבר לציר המקצועי לניתוח משמעויות מבצעיות.",
    color: "#2E86C1"
  },
  {
    id: "risk-assess",
    icon: "⚖️",
    title: "הע\"ס (הערכת סיכונים)",
    desc: "ביצוע הערכת מצב שוטפת על בסיס הנתונים בזמן אמת — קביעת טווחי סיכון, רמות חשיפה, וסיכון לחיים.",
    color: "#F59E0B"
  },
  {
    id: "protection",
    icon: "🛡️",
    title: "מיגון לוחמים",
    desc: "ניתוח סיכונים וקביעה מיידית של רמת המיגון הנדרשת לכוחות — חליפות A/B/C, מסנני אוויר, ציוד מיגון אישי.",
    color: "#10B981"
  },
  {
    id: "strategy",
    icon: "🗺️",
    title: "תכנון אסטרטגי",
    desc: "כתיבת דפ\"אות (דרכי פעולה אפשריות) — חלופות להתמודדות עם התפתחות האירוע, כולל תרחישי מדרג.",
    color: "#8B5CF6"
  },
  {
    id: "manpower",
    icon: "👥",
    title: "ניהול כוח אדם",
    desc: "המלצה מושכלת להזנקה ותגבור של כוחות סד\"כ ואמצעים ייעודיים נוספים.",
    color: "#C41E2A"
  }
];

const SIM_STEPS = [
  {
    phase: "התרעה",
    time: "00:00",
    title: "קבלת הודעה — דליפת גז במפעל כימי",
    narrative: "מוקד 102 מקבל דיווח על דליפת גז בלתי מזוהה במפעל כימי באזור התעשייה. מדווח על ריח חריף ועובדים שמתלוננים על גירוי בעיניים ובדרכי הנשימה.",
    question: "מהו המידע הראשון שתבקש מהמוקד?",
    options: [
      { text: "מיקום מדויק, שם המפעל, כמות נפגעים, כיוון רוח", correct: true, feedback: "מצוין! זהו בדיוק המידע הראשוני הנדרש מציר השליטה." },
      { text: "לשלוח מיד את כל הכוחות הזמינים", correct: false, feedback: "שליחת כוחות ללא מידע עלולה לסכן את הלוחמים. קודם — מידע!" },
      { text: "לחכות לדיווח נוסף מהמפעל", correct: false, feedback: "המתנה פסיבית מסכנת חיים. יש לאסוף מידע באופן אקטיבי." }
    ],
    axis: "control"
  },
  {
    phase: "איסוף מידע",
    time: "02:00",
    title: "ציר שליטה — מידע ממנהל המפעל",
    narrative: "מנהל המפעל מדווח: החומר הוא אמוניה (NH₃), UN 1005. הדליפה ממכל אחסון של 20 טון. הרוח מדרום-מערב, 15 קמ\"ש. 3 עובדים חשופים, אחד מהם מחוסר הכרה.",
    question: "מה הפעולה הבאה?",
    options: [
      { text: "להפעיל את ציר מקצועי — לבקש תיק מפעל והע\"ס", correct: true, feedback: "נכון! הציר המקצועי ינתח את המידע ויספק הע\"ס מיידית." },
      { text: "לפנות את כל האזור ברדיוס 5 ק\"מ", correct: false, feedback: "פינוי ברדיוס כזה ללא הע\"ס הוא מוגזם ויגרום לפאניקה. קודם — הערכה מקצועית." },
      { text: "לשלוח כוחות עם ציוד כיבוי רגיל", correct: false, feedback: "אמוניה דורשת מיגון ייעודי (חליפה B לפחות). כניסה בציוד רגיל מסכנת חיים!" }
    ],
    axis: "professional"
  },
  {
    phase: "ניתוח מקצועי",
    time: "05:00",
    title: "ציר מקצועי — הערכת סיכונים",
    narrative: "רע\"ן חומ\"ס מבצע הע\"ס: אמוניה — גז רעיל, משתך, קל מאוויר. ERPG-2: 150 ppm (טווח סכנה לבריאות). ERPG-3: 750 ppm (סכנת חיים). ברוח 15 קמ\"ש מכיוון דרום-מערב — טווח סיכון מוערך: 800 מ' בכיוון צפון-מזרח.",
    question: "מה צריך לקבוע כעת?",
    options: [
      { text: "רמת מיגון לכוחות + טווחי פינוי + דפ\"א", correct: true, feedback: "מדויק! זו בדיוק תפוקת הציר המקצועי: מיגון, טווחים, ודרכי פעולה." },
      { text: "להזמין מסוק פינוי", correct: false, feedback: "מסוק בענן אמוניה? מסוכן מאוד. הפינוי יתבצע ביבשה בכיוון ההפוך לרוח." },
      { text: "לחסום את הכביש הראשי", correct: false, feedback: "חסימת כבישים חשובה, אבל קודם — קביעת טווחים ומיגון לכוחות שנכנסים לזירה." }
    ],
    axis: "professional"
  },
  {
    phase: "פעולה מבצעית",
    time: "08:00",
    title: "ציר פיקודי — דיווח מהשטח",
    narrative: "מפקד האירוע מדווח: הענן נע צפונה-מזרחה כצפוי. 2 עובדים פונו למד\"א, אחד עדיין לכוד ליד מכל האחסון. צוות מפעלי סגר ברז ראשי אך הדליפה נמשכת מסדק במכל. ריח חריף מורגש ב-500 מ'.",
    question: "איזה עדכון קריטי חייב לזרום לשולחן השליטה?",
    options: [
      { text: "כל הנ\"ל — זהו מידע דינמי מהציר הפיקודי שמשנה את התמ\"צ", correct: true, feedback: "בדיוק! כל פיסת מידע מהשטח מעדכנת את תמונת המצב ומשפיעה על ההחלטות." },
      { text: "רק מצב הלכוד — זה הדחוף ביותר", correct: false, feedback: "מצב הלכוד חשוב, אבל גם התפשטות הענן, כיוון הרוח, ומצב הדליפה קריטיים להחלטות." },
      { text: "שום דבר — המפקד צריך לפעול עצמאית", correct: false, feedback: "פעולה ללא דיווח = שולחן שליטה עיוור. הסנכרון בין הציר הפיקודי לשליטה הוא הבסיס לתמ\"צ מדויקת." }
    ],
    axis: "command"
  },
  {
    phase: "סנכרון",
    time: "12:00",
    title: "גיבוש תמ\"צ מלאה — סנכרון כל הצירים",
    narrative: "שולחן השליטה מרכז: החומר מזוהה (אמוניה UN 1005), הטווח מוגדר (800 מ' צפון-מזרח), מיגון נקבע (חליפה B + SCBA), לכוד אחד — צוות חילוץ בחליפות A בדרך. פינוי 500 מ' בוצע. דפ\"א: ריסוס מים ליצירת מסך מים + ניטור רציף.",
    question: "מה החשיבות של סנכרון כל 3 הצירים?",
    options: [
      { text: "רק שילוב של הציר הפיקודי והמקצועי עם ציר השליטה יוצר תמ\"צ מדויקת — בלעדיו, החלטות שגויות", correct: true, feedback: "מושלם! זהו עיקרון הליבה — סנכרון מלא בין 3 הצירים = תמ\"צ אמינה = החלטות מצילות חיים." },
      { text: "הסנכרון חשוב אבל לא קריטי — ניסיון מספיק", correct: false, feedback: "ניסיון בלבד אינו מספיק. כל אירוע חומ\"ס הוא ייחודי — מידע בזמן אמת מ-3 צירים הוא הבסיס." },
      { text: "מספיק ציר אחד טוב כדי לנהל אירוע", correct: false, feedback: "ציר אחד = תמונה חלקית. החלטות שגויות מתחילות במידע חסר!" }
    ],
    axis: "all"
  }
];

const TECH_GAPS = [
  {
    icon: "🔗",
    title: "שילוב מערכות",
    desc: "תיק המפעל מכיל מידע קריטי מנוהל כיום במערכת \"שלהבת\" ואינו זמין ב\"לפיד\". חובה לקדם פיתוח טכנולוגי שישקף מידע זה ישירות למכשירי ה-POC של מפקדי האירוע בשטח.",
    color: "#2E86C1"
  },
  {
    icon: "📱",
    title: "מודיעין חזותי",
    desc: "תמונת מצב מבוססת מציאות דורשת מהמפקד בשטח להעביר תמונה או סרטון קצר מהמכשיר הנייד לשולחן השליטה המרכזי באופן מיידי.",
    color: "#D4A843"
  }
];

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function NavBar({ activeSection, scrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "ראשי" },
    { id: "axes", label: "מודל הצירים" },
    { id: "dashboard", label: "דשבורד" },
    { id: "analysis", label: "ניתוח מקצועי" },
    { id: "simulation", label: "סימולציה" },
    { id: "tech", label: "פערים" },
    { id: "docs", label: "מסמכים" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(10,22,40,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease", padding: "0 24px"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        height: 64
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo-operations.jpg" alt="אגף מבצעים" style={{ height: 42, borderRadius: 8 }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--white)" }}>
            אגף מבצעים
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{
              padding: "6px 14px", border: "none", borderRadius: 8,
              background: activeSection === n.id ? "rgba(196,30,42,0.2)" : "transparent",
              color: activeSection === n.id ? "var(--red-light)" : "var(--gray-400)",
              fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 500,
              cursor: "pointer", transition: "all 0.3s", whiteSpace: "nowrap"
            }}>
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "120px 24px 80px", position: "relative", overflow: "hidden"
    }}>
      {/* Background effects */}
      <div style={{
        position: "absolute", top: "10%", right: "-20%", width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(196,30,42,0.08) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "-15%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(46,134,193,0.06) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none"
      }} />

      <div style={{ animation: "fadeInUp 1s ease-out", position: "relative", zIndex: 1 }}>
        <img src="/logo-operations.jpg" alt="כבאות והצלה — אגף מבצעים"
          style={{ width: 140, height: 140, borderRadius: 24, marginBottom: 32,
            boxShadow: "0 20px 60px rgba(196,30,42,0.3)", animation: "breathe 4s ease-in-out infinite" }} />

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
          fontWeight: 900, lineHeight: 1.2, marginBottom: 20,
          background: "linear-gradient(135deg, #fff 30%, #D4A843 70%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
        }}>
          גיבוש תמונת מצב
          <br />
          <span style={{ background: "linear-gradient(135deg, #E8343F, #C41E2A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            באירועי חומ״ס
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--gray-300)",
          maxWidth: 650, margin: "0 auto 20px", lineHeight: 1.8
        }}>
          תובנות מערכתיות מאירוע בז״ן (22.03.26) והחשיבות הקריטית של איסוף מידע רב-ערוצי
        </p>

        <div style={{
          background: "rgba(196,30,42,0.1)", border: "1px solid rgba(196,30,42,0.3)",
          borderRadius: 12, padding: "16px 24px", maxWidth: 600, margin: "0 auto 40px",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <p style={{ fontSize: "0.95rem", color: "var(--gray-200)", textAlign: "right", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--red-light)" }}>החלטות שגויות מתחילות במידע חסר.</strong>{" "}
            איסוף מידע מדויק בזמן אמת הוא הבסיס לשמירה על חיי הלוחמים והצלחת המשימה.
          </p>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => document.getElementById("axes")?.scrollIntoView({ behavior: "smooth" })}>
            התחל ללמוד ←
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById("simulation")?.scrollIntoView({ behavior: "smooth" })}>
            🎮 כנס לסימולציה
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "breathe 2s ease-in-out infinite", opacity: 0.5
      }}>
        <span style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>גלול למטה</span>
        <span style={{ fontSize: 20 }}>↓</span>
      </div>
    </section>
  );
}

function AxesSection() {
  const [activeAxis, setActiveAxis] = useState(null);

  return (
    <section id="axes" className="section">
      <h2 className="section-title">מודל שלושת הצירים</h2>
      <p className="section-subtitle">זרימת המידע המבצעי — שלושה צירים שיוצרים יחד תמונת מצב שלמה</p>
      <div className="divider" />

      {/* Visual model */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 40,
        marginBottom: 48, flexWrap: "wrap"
      }}>
        {/* Axes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, maxWidth: 400 }}>
          {AXES_DATA.map((axis, i) => (
            <div key={axis.id}
              onClick={() => setActiveAxis(activeAxis === axis.id ? null : axis.id)}
              style={{
                background: activeAxis === axis.id
                  ? `linear-gradient(135deg, ${axis.color}22, ${axis.color}11)`
                  : "linear-gradient(145deg, rgba(18,34,64,0.9), rgba(10,22,40,0.95))",
                border: `2px solid ${activeAxis === axis.id ? axis.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16, padding: "20px 24px", cursor: "pointer",
                transition: "all 0.4s ease",
                animation: `slideFromRight 0.6s ease-out ${i * 0.15}s both`,
                transform: activeAxis === axis.id ? "scale(1.02)" : "scale(1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{axis.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: axis.color }}>
                    {axis.title}
                  </h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>{axis.subtitle}</span>
                </div>
                <span style={{
                  marginRight: "auto", fontSize: 18, transition: "transform 0.3s",
                  transform: activeAxis === axis.id ? "rotate(180deg)" : "rotate(0)"
                }}>▼</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-300)", lineHeight: 1.7 }}>{axis.summary}</p>

              {activeAxis === axis.id && (
                <div style={{ marginTop: 16, animation: "fadeInUp 0.3s ease-out" }}>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {axis.details.map((d, j) => (
                      <li key={j} style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        fontSize: "0.88rem", color: "var(--gray-200)", lineHeight: 1.6
                      }}>
                        <span style={{ color: axis.color, fontSize: 14, marginTop: 4 }}>◆</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  {axis.warning && (
                    <div style={{
                      marginTop: 14, background: "rgba(196,30,42,0.15)", border: "1px solid rgba(196,30,42,0.3)",
                      borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10
                    }}>
                      <span style={{ fontSize: 20, animation: "alertPulse 1.5s ease-in-out infinite" }}>⚠️</span>
                      <span style={{ fontSize: "0.85rem", color: "#EF4444", fontWeight: 600 }}>{axis.warning}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center — תמ"צ circle */}
        <div style={{
          width: 200, height: 200, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--navy-light), var(--navy-mid))",
          border: "3px solid var(--gold)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          animation: "pulseGlow 3s ease-in-out infinite", position: "relative",
          boxShadow: "0 0 40px rgba(212,168,67,0.2)"
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--gold-light)" }}>
            תמונת מצב
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--white)" }}>
            שלמה
          </span>
          {/* Arrows */}
          {["top", "right", "bottom"].map((pos, i) => (
            <div key={pos} style={{
              position: "absolute",
              ...(pos === "top" ? { top: -30, left: "50%", transform: "translateX(-50%) rotate(90deg)" } :
                pos === "right" ? { right: -30, top: "50%", transform: "translateY(-50%)" } :
                  { bottom: -30, left: "50%", transform: "translateX(-50%) rotate(-90deg)" }),
              fontSize: 22, color: AXES_DATA[i].color, animation: "flowArrow 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.3}s`
            }}>◄◄</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <section id="dashboard" className="section">
      <h2 className="section-title">דשבורד חומ״ס — מידע חובה משלב קבלת ההודעה</h2>
      <p className="section-subtitle">חמשת מרכיבי המידע הקריטיים שחייבים להיאסף מרגע קבלת ההודעה הראשונית</p>
      <div className="divider" />

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20
      }}>
        {DASHBOARD_CARDS.map((card, i) => (
          <div key={card.id} className="card"
            onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: `${card.color}20`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 28, marginBottom: 16,
              border: `1px solid ${card.color}40`
            }}>{card.icon}</div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700,
              color: card.color, marginBottom: 10
            }}>{card.title}</h3>

            {expandedCard === card.id ? (
              <ul style={{
                listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8,
                animation: "fadeIn 0.3s ease-out"
              }}>
                {card.items.map((item, j) => (
                  <li key={j} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    fontSize: "0.85rem", color: "var(--gray-200)", lineHeight: 1.6
                  }}>
                    <span style={{ color: card.color, marginTop: 2 }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "0.88rem", color: "var(--gray-400)" }}>לחץ לפרטים ←</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalysisSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="analysis" className="section">
      <h2 className="section-title">ממידע גולמי להחלטות מצילות חיים</h2>
      <p className="section-subtitle">מנגנון הניתוח המקצועי — כיצד מידע גולמי מ-3 הצירים הופך להחלטות מבצעיות</p>
      <div className="divider" />

      {/* Progress bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4, marginBottom: 48,
        padding: "0 20px", overflowX: "auto"
      }}>
        {ANALYSIS_STEPS.map((step, i) => (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <button onClick={() => setActiveStep(i)} style={{
              width: 44, height: 44, borderRadius: "50%", border: "none",
              background: i <= activeStep
                ? `linear-gradient(135deg, ${step.color}, ${step.color}cc)`
                : "rgba(255,255,255,0.08)",
              color: "var(--white)", fontSize: 18, cursor: "pointer",
              transition: "all 0.4s", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: i === activeStep ? `0 0 20px ${step.color}44` : "none",
              transform: i === activeStep ? "scale(1.15)" : "scale(1)"
            }}>{step.icon}</button>
            {i < ANALYSIS_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 3, margin: "0 4px", borderRadius: 2,
                background: i < activeStep ? `linear-gradient(90deg, ${ANALYSIS_STEPS[i].color}, ${ANALYSIS_STEPS[i + 1].color})` : "rgba(255,255,255,0.08)",
                transition: "background 0.6s"
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Active step detail */}
      <div style={{
        background: `linear-gradient(145deg, ${ANALYSIS_STEPS[activeStep].color}15, rgba(10,22,40,0.95))`,
        border: `1px solid ${ANALYSIS_STEPS[activeStep].color}40`,
        borderRadius: 20, padding: "36px 32px", animation: "fadeIn 0.4s ease-out",
        maxWidth: 700, margin: "0 auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 40 }}>{ANALYSIS_STEPS[activeStep].icon}</span>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--gray-400)", letterSpacing: 1 }}>
              שלב {activeStep + 1} מתוך {ANALYSIS_STEPS.length}
            </span>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700,
              color: ANALYSIS_STEPS[activeStep].color
            }}>{ANALYSIS_STEPS[activeStep].title}</h3>
          </div>
        </div>
        <p style={{ fontSize: "1rem", color: "var(--gray-200)", lineHeight: 1.8 }}>
          {ANALYSIS_STEPS[activeStep].desc}
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn-secondary" onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            style={{ opacity: activeStep === 0 ? 0.3 : 1 }} disabled={activeStep === 0}>
            ← הקודם
          </button>
          <button className="btn-primary" onClick={() => setActiveStep(Math.min(ANALYSIS_STEPS.length - 1, activeStep + 1))}
            style={{ opacity: activeStep === ANALYSIS_STEPS.length - 1 ? 0.3 : 1 }}
            disabled={activeStep === ANALYSIS_STEPS.length - 1}>
            הבא →
          </button>
        </div>
      </div>
    </section>
  );
}

function SimulationSection() {
  const [simStarted, setSimStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const step = SIM_STEPS[currentStep];

  const handleOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (step.options[idx].correct) setScore(s => s + 1);
    setAnswered(a => [...a, { step: currentStep, correct: step.options[idx].correct }]);
  };

  const nextStep = () => {
    if (currentStep < SIM_STEPS.length - 1) {
      setCurrentStep(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetSim = () => {
    setSimStarted(false); setCurrentStep(0); setSelectedOption(null);
    setScore(0); setAnswered([]); setShowResult(false);
  };

  const axisColor = step?.axis === "command" ? "#C41E2A" : step?.axis === "control" ? "#2E86C1" : step?.axis === "professional" ? "#D4A843" : "#10B981";
  const pct = ((score / SIM_STEPS.length) * 100).toFixed(0);

  if (!simStarted) {
    return (
      <section id="simulation" className="section">
        <h2 className="section-title">סימולציה מבצעית</h2>
        <p className="section-subtitle">נהל אירוע חומ\"ס בזמן אמת — אסוף מידע, קבל החלטות, ובנה תמ\"צ מדויקת</p>
        <div className="divider" />

        <div style={{
          maxWidth: 600, margin: "0 auto", textAlign: "center",
          background: "linear-gradient(145deg, rgba(18,34,64,0.9), rgba(10,22,40,0.95))",
          border: "1px solid rgba(196,30,42,0.3)", borderRadius: 24, padding: "48px 32px"
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎮</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, marginBottom: 16, color: "var(--gold-light)" }}>
            תרחיש: דליפת גז במפעל כימי
          </h3>
          <p style={{ color: "var(--gray-300)", marginBottom: 12, lineHeight: 1.7 }}>
            בסימולציה זו תנהל אירוע חומ\"ס מרגע קבלת ההודעה ועד גיבוש תמ\"צ מלאה.
          </p>
          <p style={{ color: "var(--gray-400)", marginBottom: 32, fontSize: "0.9rem" }}>
            5 שלבים | ~5 דקות | תקבל ציון בסוף
          </p>
          <button className="btn-primary" onClick={() => setSimStarted(true)}
            style={{ fontSize: "1.1rem", padding: "16px 40px" }}>
            🚨 התחל סימולציה
          </button>
        </div>
      </section>
    );
  }

  if (showResult) {
    return (
      <section id="simulation" className="section">
        <div style={{
          maxWidth: 600, margin: "0 auto", textAlign: "center",
          background: "linear-gradient(145deg, rgba(18,34,64,0.9), rgba(10,22,40,0.95))",
          border: `2px solid ${Number(pct) >= 80 ? "var(--success)" : Number(pct) >= 60 ? "var(--warning)" : "var(--danger)"}`,
          borderRadius: 24, padding: "48px 32px"
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {Number(pct) >= 80 ? "🏆" : Number(pct) >= 60 ? "👍" : "📚"}
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, marginBottom: 12, color: "var(--gold-light)" }}>
            סיום סימולציה
          </h3>
          <div style={{
            fontSize: "3rem", fontWeight: 900, fontFamily: "var(--font-display)",
            color: Number(pct) >= 80 ? "var(--success)" : Number(pct) >= 60 ? "var(--warning)" : "var(--danger)",
            marginBottom: 8
          }}>{pct}%</div>
          <p style={{ color: "var(--gray-300)", marginBottom: 8 }}>
            ענית נכון על {score} מתוך {SIM_STEPS.length} שאלות
          </p>
          <p style={{ color: "var(--gray-400)", marginBottom: 32, fontSize: "0.9rem", lineHeight: 1.7 }}>
            {Number(pct) >= 80
              ? "מצוין! הפגנת הבנה מעמיקה של מודל שלושת הצירים וגיבוש תמ\"צ."
              : Number(pct) >= 60
                ? "טוב! יש הבנה בסיסית, אבל יש מקום לשיפור באיסוף מידע מכל הצירים."
                : "מומלץ לחזור על החומר. סנכרון 3 הצירים הוא הבסיס להחלטות נכונות באירועי חומ\"ס."}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={resetSim}>🔄 נסה שוב</button>
            <button className="btn-secondary" onClick={() => document.getElementById("axes")?.scrollIntoView({ behavior: "smooth" })}>
              📖 חזור לחומר
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="simulation" className="section">
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
        {SIM_STEPS.map((_, i) => (
          <div key={i} style={{
            width: 48, height: 6, borderRadius: 3,
            background: i < currentStep ? "var(--success)" : i === currentStep ? axisColor : "rgba(255,255,255,0.1)",
            transition: "all 0.4s"
          }} />
        ))}
      </div>

      <div style={{
        maxWidth: 700, margin: "0 auto",
        background: "linear-gradient(145deg, rgba(18,34,64,0.9), rgba(10,22,40,0.95))",
        border: `1px solid ${axisColor}40`, borderRadius: 20, overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${axisColor}30, ${axisColor}10)`,
          padding: "20px 28px", borderBottom: `1px solid ${axisColor}30`,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--gray-400)", letterSpacing: 1 }}>
              {step.phase} | T+{step.time}
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: axisColor, marginTop: 4 }}>
              {step.title}
            </h3>
          </div>
          <div style={{
            background: `${axisColor}20`, border: `1px solid ${axisColor}40`,
            borderRadius: 8, padding: "6px 12px", fontSize: "0.8rem", color: axisColor, fontWeight: 600
          }}>
            שלב {currentStep + 1}/{SIM_STEPS.length}
          </div>
        </div>

        {/* Narrative */}
        <div style={{ padding: "24px 28px" }}>
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "20px",
            borderRight: `4px solid ${axisColor}`, marginBottom: 24
          }}>
            <p style={{ fontSize: "0.95rem", color: "var(--gray-200)", lineHeight: 1.8 }}>
              {step.narrative}
            </p>
          </div>

          {/* Question */}
          <h4 style={{
            fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700,
            color: "var(--gold-light)", marginBottom: 16
          }}>
            💡 {step.question}
          </h4>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {step.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = opt.correct;
              let bg = "rgba(255,255,255,0.04)";
              let borderColor = "rgba(255,255,255,0.1)";
              if (selectedOption !== null) {
                if (isCorrect) { bg = "rgba(16,185,129,0.15)"; borderColor = "#10B981"; }
                else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.15)"; borderColor = "#EF4444"; }
              }

              return (
                <button key={idx} onClick={() => handleOption(idx)} style={{
                  background: bg, border: `2px solid ${borderColor}`, borderRadius: 12,
                  padding: "16px 20px", textAlign: "right", cursor: selectedOption !== null ? "default" : "pointer",
                  transition: "all 0.3s", fontFamily: "var(--font-body)", fontSize: "0.92rem",
                  color: "var(--gray-200)", lineHeight: 1.6
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontWeight: 700, color: selectedOption !== null ? (isCorrect ? "#10B981" : isSelected ? "#EF4444" : "var(--gray-400)") : axisColor }}>
                      {selectedOption !== null ? (isCorrect ? "✓" : isSelected ? "✗" : "○") : `${idx + 1}.`}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {selectedOption !== null && (isSelected || isCorrect) && (
                    <p style={{
                      marginTop: 10, fontSize: "0.85rem", fontWeight: 500,
                      color: isCorrect ? "#10B981" : "#EF4444",
                      paddingRight: 24
                    }}>{opt.feedback}</p>
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button className="btn-primary" onClick={nextStep}>
                {currentStep < SIM_STEPS.length - 1 ? "← המשך לשלב הבא" : "🏆 סיים סימולציה"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TechGapsSection() {
  return (
    <section id="tech" className="section">
      <h2 className="section-title">סגירת פערים טכנולוגיים</h2>
      <p className="section-subtitle">הדרך לסנכרון מבצעי מלא — שני פערים קריטיים שיש לסגור</p>
      <div className="divider" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
        {TECH_GAPS.map((gap, i) => (
          <div key={i} className="card" style={{
            cursor: "default", animation: `fadeInUp 0.5s ease-out ${i * 0.2}s both`
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: `${gap.color}15`,
              border: `1px solid ${gap.color}30`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 32, marginBottom: 20
            }}>{gap.icon}</div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700,
              color: gap.color, marginBottom: 12
            }}>{gap.title}</h3>
            <p style={{ fontSize: "0.92rem", color: "var(--gray-300)", lineHeight: 1.8 }}>
              {gap.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 40, background: "rgba(196,30,42,0.1)", border: "1px solid rgba(196,30,42,0.25)",
        borderRadius: 16, padding: "20px 28px", maxWidth: 800, margin: "40px auto 0",
        display: "flex", alignItems: "center", gap: 16
      }}>
        <span style={{ fontSize: 32, flexShrink: 0 }}>🔑</span>
        <p style={{ fontSize: "0.95rem", color: "var(--gray-200)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--red-light)" }}>סנכרון מלא:</strong> הציר הפיקודי והציר המקצועי חייבים להשלים זה את זה בשולחן השליטה המרכזי.
          ללא הזרמת מידע רציפה — אין תמונת מצב מדויקת.
        </p>
      </div>
    </section>
  );
}

function DocumentsSection() {
  const docs = [
    {
      icon: "📊",
      title: "מצגת — גיבוש תמ\"צ באירועי חומ\"ס",
      desc: "מצגת מקצועית הכוללת מודל שלושת הצירים, דשבורד מידע חובה, מנגנון הניתוח המקצועי וסגירת פערים טכנולוגיים.",
      pdfLink: "/presentation.pdf",
      downloadLink: "/presentation.pptx",
      pdfLabel: "צפייה (PDF)",
      downloadLabel: "הורדה (PPTX)"
    }
  ];

  return (
    <section id="docs" className="section">
      <h2 className="section-title">מסמכים להורדה</h2>
      <p className="section-subtitle">המצגת המקורית בגרסת צפייה והורדה</p>
      <div className="divider" />

      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {docs.map((doc, i) => (
          <div key={i} className="card" style={{ cursor: "default", animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "rgba(46,134,193,0.12)", border: "1px solid rgba(46,134,193,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, flexShrink: 0
              }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700,
                  color: "var(--blue-light)", marginBottom: 8
                }}>{doc.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-300)", lineHeight: 1.7, marginBottom: 16 }}>
                  {doc.desc}
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href={doc.pdfLink} target="_blank" rel="noopener noreferrer" className="btn-primary"
                    style={{ fontSize: "0.9rem", padding: "10px 22px", textDecoration: "none" }}>
                    📄 {doc.pdfLabel}
                  </a>
                  <a href={doc.downloadLink} download className="btn-secondary"
                    style={{ fontSize: "0.9rem", padding: "10px 22px", textDecoration: "none" }}>
                    ⬇️ {doc.downloadLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
      borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px 32px", textAlign: "center"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <img src="/logo-operations.jpg" alt="אגף מבצעים" style={{ width: 72, borderRadius: 14, marginBottom: 16 }} />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>
          כבאות והצלה לישראל — אגף מבצעים
        </h3>
        <p style={{ color: "var(--gray-400)", fontSize: "0.9rem", marginBottom: 20 }}>
          ס/טפסר רועי צוקרמן | רע״ן חומ״ס ארצי
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <a href="mailto:roiez1@gmail.com" style={{
            display: "flex", alignItems: "center", gap: 8, color: "var(--gray-300)",
            textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s"
          }}>📧 roiez1@gmail.com</a>
          <a href="https://chat.whatsapp.com/K4NzcZucmimKYFOXE3VVtD?mode=gi_t"
            target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 8, color: "var(--gray-300)",
              textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s"
            }}>💬 60 שניות של חומ״ס</a>
        </div>
        <p style={{ color: "var(--gray-600)", fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} כבאות והצלה לישראל — אגף מבצעים. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "axes", "dashboard", "analysis", "simulation", "tech", "docs"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="noise-overlay" />
      <NavBar activeSection={activeSection} scrollTo={scrollTo} />
      <main>
        <HeroSection />
        <AxesSection />
        <DashboardSection />
        <AnalysisSection />
        <SimulationSection />
        <TechGapsSection />
        <DocumentsSection />
      </main>
      <Footer />
    </>
  );
}
