import { connectDB, sql } from "../lib/db";

export default async function UserListAPI({ page, pageSize }) {
    try {
        // let { page, pageSize, search } = req.query;

        // Validate and sanitize inputs
        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);
        // search = search?.trim();

        if (isNaN(page) || page < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page number" });
        }
        if (isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page size" });
        }

        const offsetRows = (page - 1) * pageSize;
        // const searchQuery = search ? `%${search}%` : null;

        const pool = await connectDB();

        // Fetch paginated data
        const result = await pool.request()
            .input("offsetRows", sql.Int, offsetRows)
            .input("fetchRows", sql.Int, pageSize)
            .input("isAdmin", sql.Bit, 0)
            .query(`
                WITH PaginatedResult AS (
                    SELECT id,email,password,name,firstname,lastname,organizationName,lastActive,isAdmin, IV
                    FROM users WHERE [isAdmin] = @isAdmin
                )
                SELECT * FROM PaginatedResult
                ORDER BY name asc
                OFFSET @offsetRows ROWS FETCH NEXT @fetchRows ROWS ONLY;`);

        // Fetch total record count
        const totalResult = await pool.request()
            // .input("searchParam", sql.NVarChar, searchQuery)
            .input("isAdmin", sql.Bit, 0)
            .query(`
                SELECT COUNT(*) AS TotalCount FROM users WHERE [isAdmin] = @isAdmin`);

        const records = result.recordset;
        const totalRecords = totalResult.recordset[0]?.TotalCount || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);
        const isLastPage = page >= totalPages;

        // res.status(200).json({
        //     code: 200,
        //     message: "Success",
        //     data: {
        //         totalPages,
        //         totalRecords: totalRecords,
        //         currentPage: page,
        //         currentPageRecords: records.length,
        //         isLastPage,
        //         records
        //     }
        // });

        return {
            totalPages,
            totalRecords: totalRecords,
            currentPage: page,
            currentPageRecords: records.length,
            isLastPage,
            records
        }

    } catch (error) {
        console.error("Error fetching tasks:", error);
        // res.status(500).json({ code: 500, error: "Internal Server Error" });
        return error;
    }
}