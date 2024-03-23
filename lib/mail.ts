import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_PUBLIC_URL

export const sendVerificationCodeEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'yanxi_tao@fis.edu', // testing purposes
    subject: 'IBZN - Verify your email',
    html: `<p>Your token is: <strong>${token}</strong></p>`,
  })
}

export const sendPasswordResetTokenEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'IBZN - Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verification?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'yanxi_tao@fis.edu', // testing purposes
    subject: 'IBZN - Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
  })
}
