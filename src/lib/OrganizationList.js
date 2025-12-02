import { connectDB, sql } from "../lib/db";

export default async function OrganizationList() {
  try {
    const pool = await connectDB();

    // const result = await pool.request().query(`select DISTINCT LinkOrgName as clientname from ArofloClient vatcr where LinkOrgName is not null order by LinkOrgName asc`);
    // const result = await pool.request().query(`SELECT DISTINCT ISNULL(NULLIF(ParentClient,''), ClientName) as clientname FROM [dbo].[ArofloParentChildClient] WHERE ClientType = 'RE Agents - Resi'`);
    const result = await pool
      .request()
      .query(
        `SELECT DISTINCT ClientName as clientname FROM [dbo].[ArofloParentChildClient] WHERE ClientType = 'Businesses - Builders'`
      );
    return result?.recordset;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return error;
  }
}
