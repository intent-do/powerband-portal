export function emailTemplate(name, password, message, email, loginLink) {
  return `
    <div style="font-family: Arial, sans-serif;max-width: 600px;margin: auto;padding: 24px;border: 1px solid #e0e0e0;border-radius: 8px;background-color: #fff;/* color: #fff; */">
    <h2 style="color: #000;margin-bottom:20px;">Hi ${name},</h2>

    <span style="font-size: 15px;margin-bottom:10px;color: #000;">Powerband Electrical is inviting you to gain access to your client portal.</span>
    <br>
    <br>

    <span style="font-size: 15px;color: #000;">Click the link below and login using the provided email ID and password. You can then navigate the portal to receive information on all of your jobs entrusted with us.</span>

    <div style="background-color: #fff;padding: 16px;border-radius: 6px;box-shadow: 0 2px 4px rgba(0,0,0,0.05);margin-top: 16px;">
        <p style="margin: 0 0 12px 0; font-size: 16px;">
        <a href="${loginLink}" style="color: #e85e1b;text-decoration: none;font-weight: bold;">
            Powerband Customer Portal Login
        </a><br>
        <a style="color: #0066cc;font-size: 15px;" href="${loginLink}">${loginLink}</a>
        </p>

        <p style="margin: 0 0 8px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0; font-size: 15px;"><strong>Password:</strong> ${password}</p>
    </div>

        <div style="display:flex;flex-direction:row;margin-bottom: 12px;padding: 0px 12px;">
        <p style="margin-top: 24px;font-size: 15px;color: #333;">If you have trouble logging in, kindly contact our office.</p>
        
        </div>

        <div style="display:block;color: #fff;padding: 12px;background-color: #121212;">
        <span style="font-size: 15px;display:block;">Warm Regards</span> 
        
        <span style="font-size: 15px;display:block;">p: 0466-355-441</span><span style="font-size: 15px;display:block;">e: admin@powerbandelectrical.com.au</span><span style="font-size: 15px;display:block;">a: U44/10 Speedwell Street, Somerville VIC 3912</span><span style="margin-top: 2px;font-size: 15px;display:block;color: rgb(243, 156, 18);">Powerband Electrical Pty Ltd

</span><span style="font-size: 15px;display:block;">REC: 32300 | ABN: 29 539 700 510</span>
<img alt="Logo" src="http://portal.powerbandelectrical.com.au/images/dashboard/logo2.png" style="width: 280px;"></div>
    </div>`;
}
