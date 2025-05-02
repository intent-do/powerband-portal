import React from 'react';
import UsersTable from '../../components/users/userTable';
import UserListAPI from '../../lib/UserListAPI';
import organizationList from '../../lib/OrganizationList';
import { cookies } from 'next/headers';
import UsersTableDark from '@/components/users/userTable_Dark';

const App = async () => {
  const cookieStore = await cookies();
  const payload = cookieStore.get('payload')?.value;
  const { organizationName, name, email } = JSON?.parse(payload);

  const page = 1;
  const pageSize = 10;

  let userData = await UserListAPI({ page, pageSize });

  let organizationData = await organizationList();

  return (
    <div>
      {/* <UsersTable data={userData} organizationData={organizationData} /> */}
      <UsersTableDark data={userData} organizationData={organizationData} />
    </div>
  );
};

export default App;
