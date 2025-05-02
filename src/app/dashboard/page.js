import { connectDB } from "@/lib/db";
import DashboardUI from "./DashboardUI";
import DashboardAPI from '../../lib/DashboardApi';
import { cookies } from 'next/headers';
import ActivityTracker from '@/components/ActivityTracker';
import DashboardUI_Dark from "./components/DashboardUI_Dark";

export default async function Document() {
  const cookieStore = await cookies();
  const payload = cookieStore.get('payload')?.value;
  const { organizationName, name, email, id } = JSON?.parse(payload);

  let dashboardData = await DashboardAPI(organizationName);
  let userId = id;
  return (
    <div>
      {/* <DashboardUI res={dashboardData} res1={organizationName} name={name} email={email} />, */}
      <DashboardUI_Dark res={dashboardData} res1={organizationName} name={name} email={email} />,
      <ActivityTracker userId={userId} />
    </div>
  )
}
