import { connectDB, sql } from "../lib/db";
import verifyToken from "@/middleware/verifyToken";
import TASK_STATUS from '../helper/taskStatus';
import moment from 'moment';
// import { runMiddleware, cors } from "../lib/cors";

async function fetchData(pool, statusParam, search, filter, startDate, endDate, organizationName, innerSearch) {
    let query = `SELECT id, taskname, status, duedate, completeddate,substatussubstatus, tasklocationlocationname as location FROM ArofloTask`;
    let conditions = [];

    if (search) {
        conditions.push("(taskName LIKE @searchParam OR tasklocationlocationname LIKE @searchParam)");
    }

    if (innerSearch) {
        conditions.push("(taskName LIKE @innerSearchParam OR tasklocationlocationname LIKE @innerSearchParam)");
    }

    conditions.push("status = @status");

    if (!startDate || !endDate) {
        switch (filter) {
            case "thisMonth":
                startDate = moment().startOf("month").format("YYYY-MM-DD");
                endDate = moment().endOf("month").format("YYYY-MM-DD");
                break;
            case "lastMonth":
                startDate = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
                endDate = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
                break;
            case "nextMonth":
                startDate = moment().add(1, "M").startOf("month").format("YYYY-MM-DD");
                endDate = moment().add(1, "M").endOf("month").format("YYYY-MM-DD");
                break;
            case "last7Days":
                startDate = moment().subtract(7, 'days').format("YYYY-MM-DD");
                endDate = moment().format("YYYY-MM-DD");
                break;
            case "next7Days":
                startDate = moment().format("YYYY-MM-DD");
                endDate = moment().add(7, 'days').format("YYYY-MM-DD");
                break;
            default:
                const today = new Date(); 
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth(); 
                const fyStartYear = currentMonth >= 6 ? currentYear : currentYear - 1; 
                const startOfFinancialYear = new Date(fyStartYear, 6, 1);    
                startDate =  moment(startOfFinancialYear).format("YYYY-MM-DD");
                endDate = moment().format("YYYY-MM-DD");
                break;
        }
    }

    if (statusParam === TASK_STATUS.Completed || statusParam === TASK_STATUS.Archived) {
        if (startDate) conditions.push("completeddate >= @startDate");
        if (endDate) conditions.push("completeddate <= @endDate");
    }

    conditions.push("ClientName in (SELECT ClientName FROM [dbo].[ArofloParentChildClient] WHERE ParentClient = @organizationName UNION SELECT @organizationName)")

    if(statusParam == TASK_STATUS.Scheduled){
        query = `SELECT  a.taskid, MAX(b.startdate) as scheduledate, MAX(a.taskname) as taskname, MAX(a.status) as status, 
        MAX(a.duedate) as duedate, MAX(a.completeddate) as completeddate, MAX(a.substatussubstatus) as substatussubstatus, MAX(a.tasklocationlocationname) as location
        FROM ArofloTask as a inner join ArofloTaskSchedule as b on a.taskid = b.taskid`;
        if (startDate) conditions.push("b.startdate > @startDate");
        if (endDate) conditions.push("b.startdate <= @endDate");
    }
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    if(statusParam == TASK_STATUS.Scheduled){
        query += " GROUP BY a.taskid ORDER BY scheduledate";
        statusParam = TASK_STATUS.InProgres
    }else{
        query += " ORDER BY completeddate";
    }

    // return await pool.request()
    //     .input("searchParam", sql.NVarChar, `%${search}%`)
    //     .input("startDate", sql.Date, startDate)
    //     .input("endDate", sql.Date, endDate)
    //     .input("status", sql.VarChar, statusParam)
    //     .input("organizationName", sql.VarChar, organizationName)
    //     .query(query);
   
    let request = await pool.request()
        .input("searchParam", sql.NVarChar, `%${search}%`)
        .input("startDate", sql.Date, startDate)
        .input("endDate", sql.Date, endDate)
        .input("status", sql.VarChar, statusParam)
        .input("organizationName", sql.VarChar, organizationName)

    if (innerSearch) {
        request.input("innerSearchParam", sql.VarChar, `%${innerSearch}%`)
    }
    return await request.query(query);
}

async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }
        const cookies = req.headers.cookie;
        const payloadCookie = cookies
            .split('; ')
            .find(row => row.startsWith('payload='))
            ?.split('=')[1];

        let { organizationName } = JSON.parse(payloadCookie);
        // console.log("organizationName Cookie", organizationName);
        // let organizationName = "Barry Plant Bayside";

        // filter
        // last7Days, lastMonth, thisMonth

        // taskStatus
        // 1 = In Progress, 2 = Scheduled, 3 = Pending, 4 = Completed

        let { search, filter } = req?.body;

        search = search?.trim();

        const pool = await connectDB();
        const statusMapping = {
            1: TASK_STATUS.InProgres,
            2: TASK_STATUS.Scheduled,
            3: TASK_STATUS.Pending,
            4: TASK_STATUS.Completed,
            5: TASK_STATUS.Archived,
        };
        
        const fetchPromisesAll = filter.map(({ taskStatus, filter, innerSearch }) => {
            return fetchData(pool, statusMapping[taskStatus], search, "", null, null, organizationName, innerSearch);
        });
        const fetchPromises = filter.map(({ taskStatus, filter, innerSearch }) => {
            return fetchData(pool, statusMapping[taskStatus], search, filter, null, null, organizationName, innerSearch);
        });

        const [inProgressData, scheduledData, pendingData, completedData, archivedData] = await Promise.all(fetchPromises);
        const [inProgressDataAll, scheduledDataAll, pendingDataAll, completedDataAll, archivedDataAll] = await Promise.all(fetchPromisesAll);
        // Sort completedJobs by completeddate descending
        const completedJobs = [...completedData?.recordset, ...archivedData?.recordset]
        .sort(
            (a, b) =>  new Date(a.completeddate) - new Date(b.completeddate)
        );

        res.status(200).json({
            code: 200,
            message: "Success",
            data: {
            inProgressJobs: inProgressData?.recordset,
            scheduledJob: scheduledData?.recordset,
            pendingJobs: pendingData?.recordset,
            completedJobs,
            allJobs: [
                ...inProgressDataAll?.recordset,
                // ...scheduledDataAll?.recordset, //repeated
                ...pendingDataAll?.recordset,
                ...completedDataAll?.recordset,
                ...archivedDataAll?.recordset
            ],
            }
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ code: 500, error: "Internal Server Error" });
    }
}

export default verifyToken(handler);
