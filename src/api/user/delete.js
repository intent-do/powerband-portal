import { connectDB, sql } from "../../lib/db";
import messages from "@/utils/messages";

export default async function handler(req, res) {
    try {
        const pool = await connectDB();
        if (req.method !== "DELETE") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }
        let { userId } = req?.query;
        userId = parseInt(userId);

        let findUser = await pool.request().input("id", sql.Numeric, userId).query(`select * from users u where u."id" = @id`);

        if (findUser?.recordset?.length === 0) {
            return res.status(200).json({ code: 404, message: messages.errors.USER_ID_NOT_FOUND, data: [], status: "Not Found!" })
        }

        await pool.request()
            .input("id", sql.Int, userId)
            .query(`Delete users WHERE id = @id`);


        res.status(200).json({ code: 200, data: true, message: messages?.success?.USER_DELETED, status: "Success" });
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}