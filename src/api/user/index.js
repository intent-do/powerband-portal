import { connectDB, sql } from "../../lib/db";
import messages from "@/utils/messages";
// import { userSchema } from "../../schemas/userSchema"
import bcrypt from 'bcrypt';
import Joi from "joi";
import { encryptPassword } from "@/helper/securityFunctions";
import { sendMail } from '../../lib/mail';

export default async function handler(req, res) {
    try {
        const pool = await connectDB();
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        let { organization, firstName, lastName, email } = req?.body;

        let findUser = await pool.request().input("email", sql.VarChar, email).query(`select * from users u where u."email" = @email`);

        if (findUser?.recordset?.length > 0) {
            return res.status(200).json({ code: 400, message: messages.errors.USER_ALREADY_EXIST, status: "Success" })
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
            // password: Joi.string().required().not(null).messages({
            //     "any.required": "Password is required",
            //     "any.invalid": "Password cannot be null",
            //     "string.empty": "Password cannot be empty",
            // }),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(200).json({ code: 400, message: error?.details[0]?.message?.replace(/[/"]/g, ''), status: "Bad Request!" });
        }

        // const hashedPassword = await bcrypt.hash(
        //     password,
        //     10,
        // );

        let password = "12345"
        let encrypPass = encryptPassword(password);

        let userData = await pool.request()
            .input("name", sql.VarChar, `${firstName} ${lastName}`)
            .input("organizationName", sql.VarChar, organization)
            .input("firstname", sql.VarChar, firstName)
            .input("lastname", sql.VarChar, lastName)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, encrypPass?.encryptedPassword)
            .input("IV", sql.VarChar, encrypPass?.iv)
            .query(`INSERT INTO users (name,organizationName, firstname, lastname, email, password,IV) 
                OUTPUT INSERTED.id,INSERTED.name,INSERTED.email,INSERTED.firstname,INSERTED.lastname,INSERTED.lastActive,INSERTED.organizationName,INSERTED.password,INSERTED.IV
                VALUES (@name,@organizationName, @firstname, @lastname, @email, @password,@IV)`);

        sendMail(`${firstName}`, email, 'Login Password', "It's a system-generated password, you can change it later.", password);

        res.status(200).json({ code: 200, data: userData?.recordset[0], message: messages?.success?.USER_CREATED, status: "Success" });
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}