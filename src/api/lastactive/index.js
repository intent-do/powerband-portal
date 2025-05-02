import { connectDB, sql } from "../../lib/db";

export const runtime = 'edge';

async function handler(req, res) {
    try {
        const { userId } = await req.body;
        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const pool = await connectDB(); // Connect to MSSQL
        await pool.request()
            .input('id', sql.Numeric, userId)
            .query(`UPDATE users SET lastActive = GETUTCDATE() WHERE id = @id`);

        res.status(200).send({ message: 'Last active updated' });
    } catch (error) {
        console.error("Error updating last active:", error);

        res.status(500).send({ error: 'Error updating last active' });
    }
}

export default handler;
 