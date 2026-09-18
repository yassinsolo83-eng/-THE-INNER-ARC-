import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// During development with unverified domain, Resend only allows sending from onboarding@resend.dev
// Once you verify your domain in Resend dashboard, change this to your actual email
const FROM_EMAIL = process.env.FROM_EMAIL || 'The Inner Arc <onboarding@resend.dev>'

export async function sendWelcomeEmail(toEmail: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'Welcome to The Inner Arc ✨',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1229; color: #F5F1EB;">
          <h1 style="font-size: 28px; color: #F5F1EB; margin-bottom: 20px;">Welcome, ${name}</h1>
          <p style="font-size: 16px; line-height: 1.7; color: #a0a0b8;">
            Thank you for joining The Inner Arc. You now have access to personalized readings,
            birth chart analysis, and spiritual insights from our specialists.
          </p>
          <p style="font-size: 16px; line-height: 1.7; color: #a0a0b8; margin-top: 16px;">
            To get started, complete your birth profile and request your first reading.
          </p>
          <a href="https://the-inner-arc.vercel.app/dashboard" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #B76E79; color: #0F1229; text-decoration: none; border-radius: 30px; font-size: 14px; font-weight: 600;">
            Go to your dashboard
          </a>
          <p style="font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #1a2454; padding-top: 20px;">
            The Inner Arc — A thoughtful space for reflection and insight.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }
}

export async function sendContactConfirmation(toEmail: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'We received your message — The Inner Arc',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1229; color: #F5F1EB;">
          <h1 style="font-size: 28px; color: #F5F1EB; margin-bottom: 20px;">Thank you, ${name}</h1>
          <p style="font-size: 16px; line-height: 1.7; color: #a0a0b8;">
            We have received your message and will get back to you within 2-3 working days.
          </p>
          <p style="font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #1a2454; padding-top: 20px;">
            The Inner Arc — A thoughtful space for reflection and insight.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send contact confirmation:', err)
  }
}

export async function sendReadingReadyEmail(toEmail: string, name: string, readingType: string, readingId: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `Your ${readingType} is ready ✨ — The Inner Arc`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1229; color: #F5F1EB;">
          <h1 style="font-size: 28px; color: #F5F1EB; margin-bottom: 20px;">Your reading is ready, ${name}</h1>
          <p style="font-size: 16px; line-height: 1.7; color: #a0a0b8;">
            One of our specialists has completed your <strong style="color: #C9A24B;">${readingType}</strong>.
            Visit your dashboard to view the full reading.
          </p>
          <a href="https://the-inner-arc.vercel.app/dashboard/reading/${readingId}" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #B76E79; color: #0F1229; text-decoration: none; border-radius: 30px; font-size: 14px; font-weight: 600;">
            View your reading
          </a>
          <p style="font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #1a2454; padding-top: 20px;">
            The Inner Arc — A thoughtful space for reflection and insight.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send reading ready email:', err)
  }
}

export async function sendNewsletterWelcome(toEmail: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'You are on the list ✨ — The Inner Arc',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1229; color: #F5F1EB;">
          <h1 style="font-size: 28px; color: #F5F1EB; margin-bottom: 20px;">Welcome to our circle</h1>
          <p style="font-size: 16px; line-height: 1.7; color: #a0a0b8;">
            You will receive reflections, card readings, and the occasional question worth
            sitting with — delivered thoughtfully, not frequently.
          </p>
          <p style="font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #1a2454; padding-top: 20px;">
            The Inner Arc — A thoughtful space for reflection and insight.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send newsletter welcome:', err)
  }
}

export async function sendNewsletterBroadcast(subscribers: string[], subject: string, content: string) {
  try {
    // Resend supports batch sending
    const emails = subscribers.map((email) => ({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F1229; color: #F5F1EB;">
          ${content}
          <p style="font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #1a2454; padding-top: 20px;">
            The Inner Arc — A thoughtful space for reflection and insight.
          </p>
        </div>
      `,
    }))

    // Send in batches of 50
    for (let i = 0; i < emails.length; i += 50) {
      const batch = emails.slice(i, i + 50)
      await resend.batch.send(batch)
    }
  } catch (err) {
    console.error('Failed to send broadcast:', err)
  }
}
