import * as nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { randomBytes, createHash } from 'crypto';
import { emailTemplate } from "@/lib/templates/resetLink";

dotenv.config();

export async function sendMail(name, receiver, subject, text, password) {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "hello@powerbandelectrical.com.au",
            pass: "bhbhzonmlcdlxicb",
        },
    });

    const mailOptions = {
        // from: process.env.SMTP_MAIL,
        from: "hello@powerbandelectrical.com.au",
        to: receiver,
        subject: subject,
        html: emailTemplate(name, password, text, receiver,process.env.NEXT_PUBLIC_POWERBAND_LOGIN_LINK),
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // return emails;
    });
    //         }
    //     },
    // );
}

export async function doGenerateResetToken() {
    // Generating Token
    const resetToken = randomBytes(20).toString('hex');
    // Hashing and adding resetPasswordTOken to userSchema
    const resetPasswordToken = createHash('sha256')
        .update(resetToken)
        .digest('hex');
    //* this will valid only for 15 min
    const resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return { resetToken, resetPasswordToken, resetPasswordExpire };
}
