import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  // If no API key is configured, log the link to the console
  if (!process.env.MAILERSEND_API_KEY || process.env.MAILERSEND_API_KEY.includes('YOUR_API_KEY_HERE')) {
    console.log('================================================');
    console.log(`Password reset requested for ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('================================================');
    return;
  }

  const sentFrom = new Sender(process.env.EMAIL_FROM || "info@btraining.com", "BTraining Support");
  const recipients = [
    new Recipient(email, name || "Athlete")
  ];

  const personalization = [
    {
      email: email,
      data: {
        name: name || 'Athlete',
        reset_link: resetLink
      },
    }
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Reset your BTraining password")
    .setTemplateId('v69oxl5dypx4785k')
    .setPersonalization(personalization);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error('Error sending email:', error);
    // Fallback to console log in case of error
    console.log('================================================');
    console.log(`Password reset requested for ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('================================================');
  }
}
