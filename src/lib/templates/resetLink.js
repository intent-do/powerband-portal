export function emailTemplate(name, password, message, email, loginLink) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
  <h2 style="color: #333;margin-bottom:20px">Hi ${name},</h2>

  <span style="font-size: 15px;margin-bottom:10px">Powerband Electrical is inviting you to gain access to your client portal.</span>
  </br>
  </br>

  <span style="font-size: 15px">Click the link below and login using the provided email ID and password. You can then navigate the portal to receive information on all of your jobs entrusted with us.</span>

  <div style="background-color: #fff; padding: 16px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 16px;">
    <p style="margin: 0 0 12px 0; font-size: 16px;">
      <a href="${loginLink}" style="color: #000000; text-decoration: none; font-weight: bold;">
        🔗 Powerband Customer Portal Login
      </a><br />
      <a style="color: #0066cc;font-size: 15px;" href=${loginLink}>${loginLink}</a>
    </p>

    <p style="margin: 0 0 8px 0; font-size: 15px;"><strong>📧 Email:</strong> ${email}</p>
    <p style="margin: 0; font-size: 15px;"><strong>🔐 Password:</strong> ${password}</p>
  </div>

    <div style="display:flex;flex-direction:row">
      <p style="margin-top: 24px; font-size: 15px; color: #333;">If you have trouble logging in, kindly contact</p>
      <p style="margin-top: 24px;margin-left: 4px;font-size: 15px; color: #0066cc">hello@powerbandelectrical.com.au</p>
    </div>

    <div style="display:flex;flex-direction:column">
      <span style="font-size: 15px; color: #333;">Regards</span> 
      <span style="margin-top: 2px;font-size: 15px;">\nThe Powerband Team</span>
    </div>
</div>`;
}
