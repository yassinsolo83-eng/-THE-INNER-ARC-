'use client'

export function ContactForm() {
  return (
    <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="group block text-sm text-muted-foreground">
          Your name
          <input
            required
            className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-foreground outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_2px_0_0_var(--accent)]"
          />
        </label>
        <label className="group block text-sm text-muted-foreground">
          Email address
          <input
            required
            type="email"
            className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-foreground outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_2px_0_0_var(--accent)]"
          />
        </label>
      </div>
      <label className="block text-sm text-muted-foreground">
        What&apos;s on your mind?
        <textarea
          required
          rows={7}
          className="mt-3 w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 text-foreground outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_2px_0_0_var(--accent)]"
        />
      </label>
      <button className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-95">
        Send your note
      </button>
    </form>
  )
}
