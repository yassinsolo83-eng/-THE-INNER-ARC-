'use client'

import { useState } from 'react'

export function ReadingContent({ contentEn, contentAr }: { contentEn: string; contentAr?: string | null }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const content = lang === 'ar' && contentAr ? contentAr : contentEn

  return (
    <div className="mt-10">
      {contentAr && (
        <div className="mb-6 flex justify-end gap-2">
          <button
            onClick={() => setLang('en')}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${lang === 'en' ? 'bg-accent text-background' : 'border border-border text-muted-foreground'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ar')}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${lang === 'ar' ? 'bg-accent text-background' : 'border border-border text-muted-foreground'}`}
          >
            عربي
          </button>
        </div>
      )}

      <div
        className="border border-border bg-card p-6 sm:p-8"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-none text-sm leading-7 text-muted-foreground">
          {content.split('\n').map((p, i) => {
            if (!p.trim()) return null
            const isHeading = p.startsWith('#')
            return (
              <p
                key={i}
                className={isHeading ? 'font-serif text-xl text-foreground mt-8 mb-3' : 'mt-3'}
              >
                {p.replace(/^#+\s*/, '')}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}
