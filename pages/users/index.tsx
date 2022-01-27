import { InferGetServerSidePropsType } from 'next';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import DataGrid from '../../src/client/components/common/DataGrid';
import { toLocalDate } from '../../src/lib/util';
import { RowClickHandler } from '../../types';
import { useGetUsers } from '../../src/client/api/users';

export const getServerSideProps = withSessionSsr();

// Home: NextPage
const AllUsersPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error } = useGetUsers();

  const router = useRouter();

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Benutzer', width: 200 },
    { field: 'domain', headerName: 'Domain', width: 150 },
    {
      field: 'access',
      headerName: 'Berechtigung',
      width: 150,
      valueFormatter: (params) => (params.value === null ? '-' : params.value),
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 150,
      valueFormatter: (params) => (params.value === null ? '-' : params.value),
    },
    {
      field: 'stations',
      headerName: 'Stationen',
      width: 150,
      valueFormatter: (params) => (params.value === null ? '-' : params.value),
    },
    {
      field: 'createdAt',
      headerName: 'Erstellt',
      width: 150,
      type: 'date',
      valueFormatter: (params) => toLocalDate(params.value as string),
    },
    {
      field: 'updatedAt',
      headerName: 'Update',
      width: 150,
      type: 'date',
      valueFormatter: (params) => toLocalDate(params.value as string),
    },
  ];

  const rowClickHandler: RowClickHandler = async (e) => {
    const { id } = e;
    // window.location.href = `/users/${id}`;
    router.push(`/users/${id}`);
  };

  return (
    <Layout session={user}>
      <DataGrid
        columns={columns}
        rows={data ?? []}
        error={error !== undefined}
        loading={!data && !error}
        rowClickHandler={rowClickHandler}
      />
    </Layout>
  );
};

export default AllUsersPage;
