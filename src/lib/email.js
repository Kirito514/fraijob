import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailWithCode(email, code) {
  const sender = process.env.RESEND_FROM || 'FraiJob <onboarding@resend.dev>';

  // ✅ Test rejimi: faqat o'z emailingizga yuboriladi
  if (email !== 'student02949@gmail.com') {
    console.warn('❌ Test rejimida boshqa emailga yuborilmaydi:', email);
    return { error: 'Test rejimida faqat student02949@gmail.com ga yuborish mumkin' };
  }

  const { data, error } = await resend.emails.send({
    from: sender,
    to: email,
    subject: 'Emailingizni tasdiqlang',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #ECFDF5; padding: 40px; border-radius: 12px; max-width: 500px; margin: auto; color: #17424D;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px; color: #10B981;">FraiJob</h1>
          <p style="margin: 8px 0 0; font-size: 16px;">AI yordamida ish toping</p>
        </div>

        <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);">
          <h2 style="font-size: 22px; margin-bottom: 12px;">Emailingizni tasdiqlang</h2>
          <p style="font-size: 16px; margin-bottom: 24px;">
            Quyidagi 6 xonali kodni FraiJob ilovasiga kiriting:
          </p>

          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; background-color: #ECFDF5; color: #10B981; padding: 16px 0; border-radius: 10px; border: 1px dashed #10B981;">
            ${code}
          </div>

          <p style="margin-top: 24px; font-size: 14px; color: #6B7280;">
            Ushbu kod 10 daqiqa davomida amal qiladi. Agar bu siz bo‘lmasangiz, bu xabarni e’tiborsiz qoldiring.
          </p>
        </div>

        <p style="text-align: center; font-size: 13px; color: #94A3B8; margin-top: 32px;">
          © ${new Date().getFullYear()} FraiJob. Barcha huquqlar himoyalangan.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('❌ Email yuborishda xato:', error);
  }

  return { data, error };
}
