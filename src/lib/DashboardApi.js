import { connectDB, sql } from "../lib/db";
import TASK_STATUS from '../helper/taskStatus';
import verifyToken from "@/middleware/verifyToken";
import moment from 'moment-timezone';

async function DashboardAPI(organizationName) {
    try {
        let currentDate = moment().format('YYYY/MM/DD');
        // for the filter previous 7 days
        let previousSevenDayDate = moment().subtract(7, 'days').format('YYYY/MM/DD');
        let nextSevenDayDate = moment().add(7, 'days').format('YYYY/MM/DD');
        const pool = await connectDB();
        const result = await pool.request()
            .input("organizationName", sql.VarChar, organizationName)
            .query(`SELECT id, taskName, status, OverallResultValue FROM vwArofloTaskCFOverallResult 
                where REPLACE(ClientName, ' ', '') IN ( SELECT REPLACE(ClientName, ' ', '') FROM [dbo].[ArofloParentChildClient] WHERE REPLACE(ParentClient, ' ', '') = REPLACE(@organizationName, ' ', '')UNION SELECT REPLACE(@organizationName, ' ', ''))`);

        let completionsJobLast7Daysdata = await pool.request()
            .input("currentDate", sql.Date, currentDate) // Use Date type
            .input("previousSevenDayDate", sql.Date, previousSevenDayDate)
            .input("status", sql.VarChar, TASK_STATUS.Completed)
            .input("organizationName", sql.VarChar, organizationName)
            .query(`
        SELECT id, taskName, completeddate,status, OverallResultValue, tasklocationlocationname as location 
        FROM vwArofloTaskCFOverallResult 
            WHERE completeddate >= @previousSevenDayDate AND completeddate <= @currentDate and status = @status and REPLACE(ClientName, ' ', '') IN ( SELECT REPLACE(ClientName, ' ', '') FROM [dbo].[ArofloParentChildClient] WHERE REPLACE(ParentClient, ' ', '') = REPLACE(@organizationName, ' ', '')UNION SELECT REPLACE(@organizationName, ' ', '')) 
            ORDER BY completeddate`);
        
        let upcomingJobNext7Daysdata = await pool.request()
            .input("currentDate", sql.Date, currentDate) // Use Date type
            .input("nextSevenDayDate", sql.Date, nextSevenDayDate)
            .input("status", sql.VarChar, TASK_STATUS.InProgres)
            .input("organizationName", sql.VarChar, organizationName)
            .query(`
            SELECT a.taskid, MAX(a.id) as id, MAX(a.taskName) as taskName,MAX(a.status) as status, MAX(a.OverallResultValue) as OverallResultValue ,MAX(a.duedate) as duedate, MAX(b.startdate) as scheduledate , MAX(a.tasklocationlocationname) as location
            FROM vwArofloTaskCFOverallResult as a inner join ArofloTaskSchedule as b on a.taskid = b.taskid 
            WHERE b.startdate > @currentDate AND b.startdate <= @nextSevenDayDate and status = @status and REPLACE(ClientName, ' ', '') IN ( SELECT REPLACE(ClientName, ' ', '') FROM [dbo].[ArofloParentChildClient] WHERE REPLACE(ParentClient, ' ', '') = REPLACE(@organizationName, ' ', '')UNION SELECT REPLACE(@organizationName, ' ', ''))
            GROUP BY a.taskid ORDER BY scheduledate`);

        let completedTaskCount = 0,
            inProgressTaskCount = 0,
            scheduledTaskCount = 0,
            pendingTaskCount = 0,
            passTasksCount = 0,
            failTasksCount = 0;

        for (const element of result?.recordset || []) {
            switch (element.status) {
                case TASK_STATUS.Completed: completedTaskCount++; break;
                case TASK_STATUS.InProgres: inProgressTaskCount++; break;
                case TASK_STATUS.Scheduled: scheduledTaskCount++; break;
                case TASK_STATUS.Pending: pendingTaskCount++; break;
            }

            if (element.OverallResultValue === TASK_STATUS.PASS) {
                passTasksCount++;
            } else if (element.OverallResultValue === TASK_STATUS.FAIL) {
                failTasksCount++;
            }
        }
        return {
            completedTasks: completedTaskCount,
            inProgressTasks: inProgressTaskCount,
            scheduledTasks: scheduledTaskCount,
            pendingTasks: pendingTaskCount,
            passTasks: passTasksCount,
            failTasks: failTasksCount,
            completionsJobs: completionsJobLast7Daysdata?.recordset,
            upcomingJobs: upcomingJobNext7Daysdata?.recordset
        }
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        return error;
    }
}

export default DashboardAPI;
