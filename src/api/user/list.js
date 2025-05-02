import { connectDB, sql } from "../../lib/db";
import verifyToken from "@/middleware/verifyToken";

// async function handler(req, res) {
//     try {
//         let { page, pageSize, search } = req.query;

//         // Validate and sanitize inputs
//         page = parseInt(page, 10);
//         pageSize = parseInt(pageSize, 10);
//         search = search?.trim();

//         if (isNaN(page) || page < 1) {
//             return res.status(400).json({ code: 400, error: "Invalid page number" });
//         }
//         if (isNaN(pageSize) || pageSize < 1) {
//             return res.status(400).json({ code: 400, error: "Invalid page size" });
//         }

//         const offsetRows = (page - 1) * pageSize;
//         const searchQuery = search ? `%${search}%` : null;

//         const pool = await connectDB();

//         // Fetch paginated data
//         const result = await pool.request()
//             .input("offsetRows", sql.Int, offsetRows)
//             .input("fetchRows", sql.Int, pageSize)
//             .input("isAdmin", sql.Bit, 0)
//             .input("search", sql.NVarChar, searchQuery)
//             .query(`
//                 WITH PaginatedResult AS (
//                     SELECT id,email,password,name,firstname,lastname,organizationName,lastActive
//                     FROM users WHERE [isAdmin] = @isAdmin AND (
//                         name LIKE @search OR
//                         organizationName LIKE @search
//                     )
//                 )
//                 SELECT * FROM PaginatedResult
//                 ORDER BY name asc
//                 OFFSET @offsetRows ROWS FETCH NEXT @fetchRows ROWS ONLY;`);

//         // Fetch total record count
//         const totalResult = await pool.request()
//             .input("search", sql.NVarChar, searchQuery)
//             .input("isAdmin", sql.Bit, 0)
//             .query(`
//                 SELECT COUNT(*) AS TotalCount 
//                 FROM users WHERE [isAdmin] = @isAdmin AND (
//                     name LIKE @search OR
//                     organizationName LIKE @search
//                 )`);

//         const records = result.recordset;
//         const totalRecords = totalResult.recordset[0]?.TotalCount || 0;
//         const totalPages = Math.ceil(totalRecords / pageSize);
//         const isLastPage = page >= totalPages;

//         res.status(200).json({
//             code: 200,
//             message: "Success",
//             data: {
//                 totalPages,
//                 totalRecords: totalRecords,
//                 currentPage: page,
//                 currentPageRecords: records.length,
//                 isLastPage,
//                 records
//             }
//         });

//     } catch (error) {
//         console.error("Error fetching tasks:", error);
//         res.status(500).json({ code: 500, error: "Internal Server Error" });
//     }
// }

async function handler(req, res) {
    try {
        let { page, pageSize, search } = req.query;

        // Validate and sanitize inputs
        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);
        const hasSearch = search?.trim();
        const searchQuery = `%${hasSearch}%`;

        if (isNaN(page) || page < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page number" });
        }
        if (isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page size" });
        }

        const offsetRows = (page - 1) * pageSize;
        const pool = await connectDB();

        // Prepare dynamic query parts
        const whereClause = hasSearch
            ? `isAdmin = @isAdmin AND (
                name LIKE @search OR
                organizationName LIKE @search
            )`
            : `isAdmin = @isAdmin`;

        // Fetch paginated data
        const request = pool.request()
            .input("offsetRows", sql.Int, offsetRows)
            .input("fetchRows", sql.Int, pageSize)
            .input("isAdmin", sql.Bit, 0);

        if (hasSearch) {
            request.input("search", sql.NVarChar, searchQuery);
        }

        const result = await request.query(`
            WITH PaginatedResult AS (
                SELECT id, email, password, name, firstname, lastname, organizationName, lastActive,IV
                FROM users
                WHERE ${whereClause}
            )
            SELECT * FROM PaginatedResult
            ORDER BY name ASC
            OFFSET @offsetRows ROWS FETCH NEXT @fetchRows ROWS ONLY;
        `);

        // Fetch total record count
        const countRequest = pool.request()
            .input("isAdmin", sql.Bit, 0);

        if (hasSearch) {
            countRequest.input("search", sql.NVarChar, searchQuery);
        }

        const totalResult = await countRequest.query(`
            SELECT COUNT(*) AS TotalCount 
            FROM users
            WHERE ${whereClause};
        `);

        const records = result.recordset;
        const totalRecords = totalResult.recordset[0]?.TotalCount || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);
        const isLastPage = page >= totalPages;

        res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                totalPages,
                totalRecords,
                currentPage: page,
                currentPageRecords: records.length,
                isLastPage,
                records
            }
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ code: 500, error: "Internal Server Error" });
    }
}

export default verifyToken(handler);
