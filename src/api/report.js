import { connectDB, sql } from "../lib/db";
import verifyToken from "@/middleware/verifyToken";
import axios from "axios";

async function handler(req, res) {
    try {
        let { page, pageSize, search } = req.query;
        let { organizationName } = req?.user;

        // Validate and sanitize inputs
        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);
        search = search?.trim();

        if (isNaN(page) || page < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page number" });
        }
        if (isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page size" });
        }

        const offsetRows = (page - 1) * pageSize;
        const searchQuery = search ? `%${search}%` : null;

        const pool = await connectDB();

        // await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/lastactive`, {
        const updateLastActive = await axios.post('http://20.213.184.177:3000/tasks/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // data: { clientname: organizationName },
            clientname: organizationName
        });

        // Fetch paginated data
        // const result = await pool.request()
        //     .input("offsetRows", sql.Int, offsetRows)
        //     .input("fetchRows", sql.Int, pageSize)
        //     .input("searchParam", sql.NVarChar, searchQuery)
        //     .input("organizationName", sql.NVarChar, organizationName)
        //     .query(`
        //         WITH PaginatedResult AS (
        //             SELECT id, taskName, description, OverallResultValue, [File Name] as fileName
        //             FROM vwArofloTask
        //             WHERE clientname = @organizationName
        //             ${search ? "AND taskName LIKE @searchParam" : ""}
        //         )
        //         SELECT * FROM PaginatedResult
        //         ORDER BY id
        //         OFFSET @offsetRows ROWS FETCH NEXT @fetchRows ROWS ONLY;`);

        // const totalResult = await pool.request()
        //     .input("searchParam", sql.NVarChar, searchQuery)
        //     .input("organizationName", sql.NVarChar, organizationName)
        //     .query(`
        //         SELECT COUNT(*) AS TotalCount 
        //         FROM vwArofloTask
        //         WHERE clientname = @organizationName
        //         ${search ? "AND taskName LIKE @searchParam" : ""}`);

        // const records = result.recordset;
        // const totalRecords = totalResult.recordset[0]?.TotalCount || 0;
        // const totalPages = Math.ceil(totalRecords / pageSize);
        // const isLastPage = page >= totalPages;

        // let data;
        // if (search) {
        //     data = updateLastActive?.data?.filter(item => item.taskname.includes(search));
        // }

        // const records = updateLastActive?.data;
        // const totalRecords = updateLastActive?.data?.length || 0;
        // const totalPages = Math.ceil(totalRecords / pageSize);
        // const isLastPage = page >= totalPages;

        const filteredTasks = updateLastActive?.data.filter(user =>
            user.taskname.toLowerCase().includes(search) ||
            user.clientname.toLowerCase().includes(search)
        );

        let totalRecords;
        let totalPages;
        let startIndex;
        let paginatedTasks;
        let currentPageRecords;
        let isLastPage;

        totalRecords = search ? filteredTasks.length : updateLastActive?.data?.length;

        totalPages = Math.ceil(totalRecords / pageSize);

        startIndex = (page - 1) * pageSize;
        // paginatedTasks = updateLastActive?.data?.slice(startIndex, startIndex + pageSize);
        paginatedTasks = search ? filteredTasks?.slice(startIndex, startIndex + pageSize) : updateLastActive?.data?.slice(startIndex, startIndex + pageSize);
        currentPageRecords = paginatedTasks.length;
        isLastPage = page >= totalPages;

        res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                totalPages,
                totalRecords: totalRecords,
                currentPage: page,
                currentPageRecords,
                isLastPage,
                records: paginatedTasks
            }
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ code: 500, error: "Internal Server Error" });
    }
}

export default verifyToken(handler);