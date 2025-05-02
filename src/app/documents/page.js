import { connectDB } from "@/lib/db";
import { cookies } from 'next/headers';
import DocumentsTable_Dark from "@/components/documents/DocumentsTable_Dark";

export default async function Document() {
    const cookieStore = await cookies();
    const payload = cookieStore.get('payload')?.value;
    const { organizationName, name, email } = JSON.parse(payload);

    const page = 1;
    const pageSize = 100;
    // const search = searchParams?.search || "";

    // let documentData = await DocumentAPI({ page, pageSize, organizationName });
    return <DocumentsTable_Dark organizationName={organizationName} name={name} email={email} />;
}
