import { connectDB } from "@/lib/db";
import JobForm from './JobUI';
import { cookies } from 'next/headers';
import JobUI_Dark from "./JobUI_Dark";

export default async function Job() {
    const cookieStore = await cookies();
    const payload = cookieStore.get('payload')?.value;
    const { organizationName, name, email } = JSON.parse(payload);

    return <JobUI_Dark res={organizationName} name={name} email={email} />;
    
    // <JobForm res={organizationName} name={name} email={email} />;
}
