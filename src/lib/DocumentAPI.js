import { connectDB, sql } from "../lib/db";
import axios from "axios";

async function DocumentAPI({ page, pageSize, organizationName }) {
    try {
        // Validate and sanitize inputs
        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);

        if (isNaN(page) || page < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page number" });
        }
        if (isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ code: 400, error: "Invalid page size" });
        }

        const offsetRows = (page - 1) * pageSize;

        // await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/lastactive`, {
        const updateLastActive = await axios.post('http://20.213.184.177:3000/tasks/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // data: { clientname: organizationName },
            clientname: organizationName
        });

        // const pool = await connectDB();

        // const result = await pool.request()
        //     .input("offsetRows", sql.Int, offsetRows)
        //     .input("fetchRows", sql.Int, pageSize)
        //     .input("clientname", sql.VarChar, organizationName)
        //     .query(`
        //         WITH PaginatedResult AS (
        //             SELECT id, taskName, description, OverallResultValue, [File Name] as fileName,clientname
        //             FROM vwArofloTask where clientname = @clientname
        //         )
        //         SELECT * FROM PaginatedResult
        //         ORDER BY id
        //         OFFSET @offsetRows ROWS FETCH NEXT @fetchRows ROWS ONLY;`);

        // const totalResult = await pool.request()
        //     .input("clientname", sql.VarChar, organizationName)
        //     .query(`
        //         SELECT COUNT(*) AS TotalCount 
        //         FROM vwArofloTask where clientname = @clientname`);

        // const records = result.recordset;
        // const totalRecords = totalResult.recordset[0]?.TotalCount || 0;
        // const totalPages = Math.ceil(totalRecords / pageSize);
        // const isLastPage = page >= totalPages;

        let totalRecords;
        let totalPages;
        let startIndex;
        let paginatedTasks;
        let currentPageRecords;
        let isLastPage;

        totalRecords = updateLastActive?.data?.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        startIndex = (page - 1) * pageSize;
        paginatedTasks = updateLastActive?.data.slice(startIndex, startIndex + pageSize);
        currentPageRecords = paginatedTasks.length;
        isLastPage = page >= totalPages;
        // let response = records

        return {
            totalPages,
            totalRecords,
            currentPage: page,
            currentPageRecords,
            isLastPage,
            records: paginatedTasks
        }

    } catch (error) {
        console.error("Error fetching tasks:", error);
        // res.status(500).json({ code: 500, error: "Internal Server Error" });
        return error;
    }
}

export default DocumentAPI;
