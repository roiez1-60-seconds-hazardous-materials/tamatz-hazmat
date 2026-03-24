import './globals.css'

export const metadata = {
  title: 'גיבוש תמ"צ באירועי חומ"ס | כבאות והצלה לישראל — אגף מבצעים',
  description: 'אפליקציה אינטראקטיבית לגיבוש תמונת מצב באירועי חומרים מסוכנים — מודל שלושת הצירים, דשבורד מידע חובה, וסימולציה מבצעית.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
