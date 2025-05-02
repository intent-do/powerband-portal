import { encryptPassword } from "@/helper/securityFunctions";
import { connectDB, sql } from "../../lib/db";
import messages from "@/utils/messages";
import bcrypt from 'bcrypt';
import Joi from "joi";

export default async function handler(req, res) {
    try {
        const pool = await connectDB();
        if (req.method !== "PUT") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        let { organization, firstName, lastName, email, password } = req?.body;
        let { userId } = req?.query;
        userId = parseInt(userId);

        let findUser = await pool.request().input("id", sql.Numeric, userId).query(`select * from users u where u."id" = @id`);

        if (findUser?.recordset?.length === 0) {
            return res.status(200).json({ code: 404, message: messages.errors.USER_ID_NOT_FOUND, data: [], status: "Not Found!" })
        }

        const schema = Joi.object({
            // userName: Joi.string().required().not(null).messages({
            //     "any.required": "userName is required",
            //     "any.invalid": "userName cannot be null",
            //     "string.empty": "userName cannot be empty",
            // }),
            organization: Joi.string().required().not(null).messages({
                "any.required": "Organization is required",
                "any.invalid": "Organization cannot be null",
                "string.empty": "Organization cannot be empty",
                "string.base": "Organization must be a string",
            }),
            firstName: Joi.string().required().not(null).messages({
                "any.required": "Firstname is required",
                "any.invalid": "Firstname cannot be null",
                "string.empty": "Firstname cannot be empty",
            }),
            lastName: Joi.string().required().not(null).messages({
                "any.required": "Lastname is required",
                "any.invalid": "Lastname cannot be null",
                "string.empty": "Lastname cannot be empty",
            }),
            email: Joi.string()
                .email()
                .required()
                .messages({
                    "string.base": "Email must be a string", // Ensure it's treated as a string
                    "string.email": "Invalid email format",
                    "string.empty": "Email cannot be empty",
                    "any.required": "Email is required",
                }),
            password: Joi.string().required().not(null).messages({
                "any.required": "Password is required",
                "any.invalid": "Password cannot be null",
                "string.empty": "Password cannot be empty",
            }),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(200).json({ code: 400, message: error?.details[0]?.message?.replace(/[/"]/g, ''), status: "Bad Request!" });
        }

        // const hashedPassword = await bcrypt.hash(
        //     password,
        //     10,
        // );

        let { encryptedPassword, iv } = await encryptPassword(password);

        let updatedUserData = await pool.request()
            .input("id", sql.Int, userId)  // Assuming 'id' is the primary key
            .input("name", sql.VarChar, `${firstName} ${lastName}`)
            .input("organizationName", sql.VarChar, organization)
            .input("firstname", sql.VarChar, firstName)
            .input("lastname", sql.VarChar, lastName)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, encryptedPassword)
            .input("IV", sql.VarChar, iv)
            .query(`UPDATE users SET name = @name, 
            organizationName = @organizationName, 
            firstname = @firstname, 
            lastname = @lastname, 
            email = @email, 
            password = @password,
            IV = @IV 
            OUTPUT INSERTED.id,INSERTED.name,INSERTED.email,INSERTED.firstname,INSERTED.lastname,INSERTED.lastActive,INSERTED.password,INSERTED.organizationName,INSERTED.IV
            WHERE id = @id`);

        res.status(200).json({ code: 200, data: updatedUserData?.recordset[0], message: messages?.success?.USER_UPDATED, status: "Success" });
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}