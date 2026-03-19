import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, phone, email, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'RealEstate App <onboarding@resend.dev>',
      to: ['gauriishak17@gmail.com'],
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fefcf8; border-radius: 16px; overflow: hidden; border: 1px solid #e8e0d0;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1208 0%, #2d1f0a 50%, #c9906e 100%); padding: 40px 36px;">
            <h1 style="color: #fff; font-size: 26px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.3px;">New Property Enquiry</h1>
            <p style="color: rgba(255,255,255,0.65); font-size: 14px; margin: 0; font-family: sans-serif;">Someone is interested in buying a home</p>
          </div>

          <!-- Body -->
          <div style="padding: 36px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 14px 0; border-bottom: 1px solid #f0ebe0;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9a7c3f; font-family: sans-serif;">Full Name</p>
                  <p style="margin: 0; font-size: 16px; color: #16140f; font-weight: 500;">${name}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 0; border-bottom: 1px solid #f0ebe0;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9a7c3f; font-family: sans-serif;">Phone Number</p>
                  <p style="margin: 0; font-size: 16px; color: #16140f; font-weight: 500;">+91 ${phone}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 0; border-bottom: 1px solid #f0ebe0;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9a7c3f; font-family: sans-serif;">Email Address</p>
                  <p style="margin: 0; font-size: 16px; color: #16140f; font-weight: 500;">${email}</p>
                </td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 14px 0;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #9a7c3f; font-family: sans-serif;">Message</p>
                  <p style="margin: 0; font-size: 15px; color: #16140f; line-height: 1.6;">${message}</p>
                </td>
              </tr>` : ''}
            </table>
          </div>

          <!-- Footer -->
          <div style="background: #f5f4f0; padding: 20px 36px; border-top: 1px solid #e8e0d0;">
            <p style="margin: 0; font-size: 12px; color: #9a7c3f; font-family: sans-serif;">
              Sent from your Real Estate App · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}