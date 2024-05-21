import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const domain =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_URL

export const sendVerificationCodeEmail = async (
  email: string,
  token: string
) => {
  try {
    await resend.emails.send({
      from: 'onboarding@ibzn.org',
      to: email,
      subject: 'IBZN - Verify your email',
      html: `<p>Your token is: <strong>${token}</strong></p>`,
    })
    return true
  } catch {
    return false
  }
}

export const sendPasswordResetTokenEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: 'onboarding@ibzn.org',
      to: email,
      subject: 'IBZN - Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    })
    return true
  } catch {
    return false
  }
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verification?token=${token}`

  try {
    await resend.emails.send({
      from: 'onboarding@ibzn.org',
      to: email,
      subject: 'IBZN - Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
    })
    return true
  } catch {
    return false
  }
}
