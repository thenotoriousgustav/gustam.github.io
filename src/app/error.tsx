'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html><body><main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f4f5f7', color: '#18202b', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ width: 'min(100%, 560px)' }} aria-labelledby="error-title">
        <p style={{ margin: '0 0 12px', color: '#536174', fontSize: 14 }}>Gustam Rheza · Portfolio</p>
        <h1 id="error-title" style={{ margin: '0 0 16px', fontSize: 36, lineHeight: 1.15 }}>Content is temporarily unavailable.</h1>
        <p style={{ margin: '0 0 24px', lineHeight: 1.6 }}>Please try again shortly. If the problem continues, the site administrator should check the CMS database connection.</p>
        <button onClick={reset} style={{ minHeight: 44, padding: '10px 18px', border: 0, borderRadius: 999, background: '#18202b', color: '#fff', font: 'inherit', cursor: 'pointer' }}>Try again</button>
      </section>
    </main></body></html>
}
