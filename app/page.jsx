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
    { id: "tech", label: "פערים" },
    { id: "docs", label: "אינפוגרפיקה" },
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
          תובנות מאירועי חומ״ס והחשיבות הקריטית של איסוף מידע רב ערוצי
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
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <section id="docs" className="section">
      <h2 className="section-title">אינפוגרפיקה — גיבוש תמ״צ באירוע חומ״ס</h2>
      <p className="section-subtitle">תרשים מרכז של צירי איסוף וזרימת המידע, מרכיבי התמ״צ והמשמעויות המבצעיות</p>
      <div className="divider" />

      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div onClick={() => setFullscreen(true)} style={{
          cursor: "pointer", borderRadius: 16, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.4s",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
        }}>
          <img src="/infographic.png" alt="אינפוגרפיקה — גיבוש תמ״צ באירוע חומ״ס"
            style={{ width: "100%", display: "block" }} />
        </div>
        <p style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--gray-400)" }}>
          לחץ על התמונה להגדלה למסך מלא
        </p>
      </div>

      {fullscreen && (
        <div onClick={() => setFullscreen(false)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.95)", zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", animation: "fadeIn 0.3s ease-out"
        }}>
          <button onClick={() => setFullscreen(false)} style={{
            position: "fixed", top: 20, left: 20, zIndex: 10001,
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
            width: 48, height: 48, fontSize: 24, color: "var(--white)", cursor: "pointer",
            backdropFilter: "blur(8px)"
          }}>✕</button>
          <img src="/infographic.png" alt="אינפוגרפיקה"
            style={{ maxWidth: "95vw", maxHeight: "95vh", objectFit: "contain" }} />
        </div>
      )}

      {/* PDF presentation download */}
      <div style={{
        maxWidth: 700, margin: "40px auto 0",
        background: "linear-gradient(145deg, rgba(18,34,64,0.9), rgba(10,22,40,0.95))",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px",
        display: "flex", alignItems: "center", gap: 20
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: "rgba(196,30,42,0.12)", border: "1px solid rgba(196,30,42,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, flexShrink: 0
        }}>📊</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>
            מצגת — גיבוש תמ״צ באירועי חומ״ס
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--gray-400)", marginBottom: 0 }}>
            המצגת המלאה לצפייה והורדה
          </p>
        </div>
        <a href="/presentation.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary"
          style={{ fontSize: "0.85rem", padding: "10px 20px", textDecoration: "none", whiteSpace: "nowrap" }}>
          📄 צפייה / הורדה
        </a>
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
          <a href="mailto:Roiez@102.gov.il" style={{
            display: "flex", alignItems: "center", gap: 8, color: "var(--gray-300)",
            textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s"
          }}>📧 Roiez@102.gov.il</a>
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
    const sections = ["hero", "axes", "dashboard", "analysis", "tech", "docs"];
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
        <TechGapsSection />
        <DocumentsSection />
      </main>
      <Footer />
    </>
  );
}
