import { connectDB, sql } from "../lib/db";
import messages from "@/utils/messages";
import { sendMail, doGenerateResetToken } from '../lib/mail';
import moment from "moment";

export default async function handler(req, res) {
    try {
        const pool = await connectDB();
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { email } = req.body;

        let findUser = await pool.request().input("email", sql.VarChar, email).query(`select * from users u where u."email" = @email`);

        if (findUser?.recordset?.length === 0) {
            return res.status(200).json({ code: 404, message: messages.errors.USER_NOT_FOUND, data: [], status: "Not Found!" })
        }

        const getUserResetToken = await doGenerateResetToken();

        await pool.request()
            .input("email", sql.VarChar, email)
            .input("resetToken", sql.VarChar, getUserResetToken?.resetPasswordToken)
            .input("expireIn", sql.VarChar, moment(getUserResetToken?.resetPasswordExpire).format('YYYY-MM-DDTHH:mm:ssZ'))
            .query(`update users set resetToken = @resetToken, resetExpiry = @expireIn from users u where u."email" = @email`);

        await sendMail('John', email, 'Reset Password Link', "Welcome to our platform! We're excited to have you.");

        res.status(200).json({ code: 200, data: {}, message: "Mail Send SuccessFully", status: "Success" });
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}