import { connectDB, sql } from "../../lib/db";
import TASK_STATUS from '../../helper/taskStatus';
import verifyToken from "@/middleware/verifyToken";
import moment from 'moment';

async function handler(req, res) {
    const cookies = req.headers.cookie;

    const payloadCookie = cookies
        .split('; ')
        .find(row => row.startsWith('payload='))
        ?.split('=')[1];

    let { organizationName } = JSON.parse(payloadCookie);

    try {
        let { filter } = req?.query;
        filter = parseInt(filter);

        let startDate;
        let endDate;
        if (filter === 1) {
            startDate = moment().startOf('year').format('YYYY/MM/DD');
            endDate = moment().endOf('year').format('YYYY/MM/DD');
        } else if (filter === 2) {
            startDate = moment().startOf('month').format('YYYY/MM/DD');
            endDate = moment().endOf('month').format('YYYY/MM/DD');
        }

        const pool = await connectDB();
        // let jobData = await pool.request()
        //     .input("startDate", sql.Date, startDate)
        //     .input("endDate", sql.Date, endDate)
        //     .input("status", sql.VarChar, TASK_STATUS.Completed)
        //     .query(`SELECT id,status FROM vwArofloTaskCFOverallResult WHERE createdutc BETWEEN @startDate AND @endDate and  status != @status`);

        // let statusCounts = { inProcess: 0, pending: 0, completed: 0, notStarted: 0 };

        // jobData?.recordset?.forEach(task => {
        //     if (task.status === TASK_STATUS.InProgres) statusCounts.inProcess++;
        //     else if (task.status === TASK_STATUS.NOT_STARTED) statusCounts.notStarted++;
        //     // else if (task.status === TASK_STATUS.Completed) statusCounts.completed++;
        //     else if (task.status === TASK_STATUS.Pending) statusCounts.pending++;
        // });

        // let completedJobData = await pool.request()
        //     .input("startDate", sql.Date, startDate)
        //     .input("endDate", sql.Date, endDate)
        //     .input("status", sql.VarChar, TASK_STATUS.Completed)
        //     .query(`SELECT id,status FROM vwArofloTaskCFOverallResult WHERE createdutc BETWEEN @startDate AND @endDate and  status = @status`);

        // completedJobData?.recordset?.forEach(task => {
        //     if (task.status === TASK_STATUS.Completed) statusCounts.completed++;
        // });

        // let jobData = await pool.request()
        //     .input("startDate", sql.Date, startDate)
        //     .input("endDate", sql.Date, endDate)
        //     .input("status", sql.VarChar, TASK_STATUS.Completed)
        //     .input("filter", sql.Int, filter)
        //     .input("organizationName", sql.VarChar, organizationName)
        //     .query(`
        //         SELECT 
        //         FORMAT(CAST(createdUtc AS DATETIME), 'MMM') AS month, 
        //         COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending_count,
        //         COUNT(CASE WHEN status = 'In Progress' THEN 1 END) AS inprogress_count,
        //         COUNT(CASE WHEN status = 'Not Started' THEN 1 END) AS notstarted_count,
        //             (SELECT COUNT(*) 
        //                 FROM vwArofloTaskCFOverallResult vatcr_sub 
        //                 WHERE FORMAT(CAST(vatcr_sub.completedDate AS DATETIME), 'MMM') = 
        //                 FORMAT(CAST(vatcr.createdUtc AS DATETIME), 'MMM')
        //                 AND status = 'Completed') AS completed_count
        //             FROM vwArofloTaskCFOverallResult vatcr 
        //         WHERE 
        //         (@filter = 1 AND YEAR(CAST(createdUtc AS DATETIME)) = YEAR(GETDATE()))
        //             OR 
        //         (@filter = 2 AND YEAR(CAST(createdUtc AS DATETIME)) = YEAR(GETDATE()) 
        //         AND MONTH(CAST(createdUtc AS DATETIME)) = MONTH(GETDATE())) and clientname = @organizationName
        //         GROUP BY FORMAT(CAST(createdUtc AS DATETIME), 'MMM')
        //         ORDER BY month;`);

        // let jobData = await pool.request()
        //     .input("startDate", sql.Date, startDate)
        //     .input("endDate", sql.Date, endDate)
        //     .input("status", sql.VarChar, TASK_STATUS.Completed)
        //     .input("filter", sql.Int, filter)
        //     .input("organizationName", sql.VarChar, organizationName)
        //     .query(`
        //         SELECT 
        //             FORMAT(CAST(completeddate AS DATETIME), 'MMM') AS month, 
        //             COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending_count,
        //             COUNT(CASE WHEN status = 'In Progress' THEN 1 END) AS inprogress_count,
        //             COUNT(CASE WHEN status = 'Not Started' THEN 1 END) AS notstarted_count,
        //             COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_count
        //         FROM vwArofloTaskCFOverallResult 
        //         WHERE 
        //             YEAR(CAST(completeddate AS DATETIME)) = YEAR(GETDATE())
        //             AND clientname = @organizationName
        //         GROUP BY FORMAT(CAST(completeddate AS DATETIME), 'MMM')
        //         ORDER BY month;`);

        let jobData = await pool.request()
            .input("startDate", sql.Date, startDate)
            .input("endDate", sql.Date, endDate)
            .input("status", sql.VarChar, TASK_STATUS.Completed)
            .input("filter", sql.Int, filter)
            .input("organizationName", sql.VarChar, organizationName)
            .query(`
                SELECT 
                    FORMAT(
                        CAST(
                            CASE 
                                WHEN status = 'Completed' THEN completeddate
                                ELSE createdUtc
                            END AS DATETIME
                        ), 
                        'MMM'
                    ) AS month, 
                    COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending_count,
                    COUNT(CASE WHEN status = 'In Progress' THEN 1 END) AS inprogress_count,
                    COUNT(CASE WHEN status = 'Not Started' THEN 1 END) AS notstarted_count,
                    COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_count
                FROM vwArofloTaskCFOverallResult
                WHERE 
                    YEAR(
                        CAST(
                            CASE 
                                WHEN status = 'Completed' THEN completeddate
                                ELSE createdUtc
                            END AS DATETIME
                        )
                    ) = YEAR(GETDATE())
                    AND clientname = @organizationName
                GROUP BY 
                    FORMAT(
                        CAST(
                            CASE 
                                WHEN status = 'Completed' THEN completeddate
                                ELSE createdUtc
                            END AS DATETIME
                        ), 
                        'MMM'
                    )
                ORDER BY month;`);

        // if (filter === 1) {
        //     for (let i = 0; i < 12; i++) {
        //         let month = moment().month(i).format("MMM");

        //         let findMonth = jobData?.recordset?.find(item => item.month === month);

        //         if (!findMonth) {
        //             jobData?.recordset?.push({
        //                 id: i,
        //                 month: month,
        //                 pending_count: 0,
        //                 inprogress_count: 0,
        //                 notstarted_count: 0,
        //                 completed_count: 0
        //             })
        //         } else {
        //             findMonth['id'] = i;
        //         }

        //     }
        // }

        if (filter === 1) {
            const allMonths = Array.from({ length: 12 }, (_, i) => moment().month(i).format("MMM"));
            const filledData = allMonths.map((month, i) => {
                let existingMonth = jobData?.recordset?.find(item => item.month === month);
                return existingMonth || {
                    id: i,
                    month,
                    pending_count: 0,
                    inprogress_count: 0,
                    notstarted_count: 0,
                    completed_count: 0
                };
            });

            jobData.recordset = filledData;
        }

        let response = {
            code: 200,
            data: jobData?.recordset,
            status: "Success"
        }

        jobData?.recordset.sort(function (a, b) {
            const nameA = a.id;
            const nameB = b.id;
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        res.status(200).send(response)
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export default verifyToken(handler);
