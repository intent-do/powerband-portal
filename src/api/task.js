import { connectDB, sql } from "../lib/db";
import TASK_STATUS from '../helper/taskStatus';
import verifyToken from "@/middleware/verifyToken";

async function handler(req, res) {
  try {
    const pool = await connectDB();
    const result = await pool.query(`SELECT id, taskName, status, OverallResultValue FROM vwArofloTaskCFOverallResult`);

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

    res.status(200).json({
      code: 200,
      data: {
        completedTasks: completedTaskCount,
        inProgressTasks: inProgressTaskCount,
        scheduledTasks: scheduledTaskCount,
        pendingTasks: pendingTaskCount,
        passTasks: passTasksCount,
        failTasks: failTasksCount
      },
      status: "Success"
    });
  } catch (error) {
    console.error("Error fetching Tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default verifyToken(handler);
