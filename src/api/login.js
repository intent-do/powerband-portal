import { connectDB, sql } from "../lib/db";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import messages from "@/utils/messages";
import { runMiddleware, cors } from "../lib/cors";
import { decryptPassword } from "@/helper/securityFunctions";

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

    try {
        const pool = await connectDB();
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { email, password } = req.body;

        let findUser = await pool.request().input("email", sql.VarChar, email).query(`select * from users u where u."email" = @email`);

        if (findUser?.recordset?.length === 0) {
            return res.status(200).json({ code: 404, message: messages.errors.USER_NOT_FOUND, data: [], status: "Not Found!" })
        }

        // const passwordValid = await bcrypt.compare(
        //     password,
        //     findUser.recordset[0].password,
        // );
        let dcryptPass = await decryptPassword(findUser?.recordset[0]?.password, findUser?.recordset[0]?.IV);

        if (dcryptPass === password) {
            // const SECRET_KEY = process.env.JWT_SECRET;
            const SECRET_KEY = "SECRET";
            const payload = {
                id: findUser?.recordset[0]?.id,
                name: findUser?.recordset[0]?.name,
                email: findUser?.recordset[0]?.email,
                organizationName: findUser?.recordset[0]?.organizationName,
                isAdmin: findUser?.recordset[0]?.isAdmin,

            };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

            // res.setHeader('Set-Cookie', `payload=${JSON.stringify({ organizationName: payload?.organizationName, name: payload?.name, email: payload?.email })}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`);

            res.status(200).json({ code: 200, data: { accessToken: token, payload }, status: "Success" });
        } else {
            // throw new HttpException(messages.errors.PASSWORD_NOT_MATCH, 404);
            res.status(200).json({ code: 400, message: messages.errors.PASSWORD_NOT_MATCH, status: "Bad request" });
        }
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}