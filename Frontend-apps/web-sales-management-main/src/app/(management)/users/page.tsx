'use client';
import { Paginator, Button, Spinner } from '@adelco/web-components';
import Header from '@/components/Header';
import Table from '@/components/Table';
import useUsersList from '@/hooks/users/useUsersList';
import { User } from '@/types/User';
import { mapRoleName } from '@/utils/mappers/users/users';
import { useState } from 'react';
import UserDataModal from './partials/UserDataModal';
import CreateUserDataModal from './partials/CreateUserDataModal';

const UsersPage = () => {
  const { users, isLoading, error, page, setPage, search, totalPages } =
    useUsersList();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false);

  const mapTableRows = (results: User[] | undefined) => {
    return results?.map((user: User, index) => [
      `${user.firstName} ${user.lastName}`,
      user.username,
      mapRoleName(user.role),
      `${user.reportsTo?.firstName || ''} ${user.reportsTo?.lastName || ''}`,
      <Button
        key={index}
        size="xs"
        variant="tertiary"
        onClick={() => setSelectedUser(user)}
      >
        Ver más
      </Button>
    ]);
  };

  return (
    <main>
      {isLoading && <Spinner />}

      <Header
        headerLabel="Listado de Usuarios"
        placeholder="Buscar usuario"
        ctaLabel="Crear usuario"
        ctaOnClick={() => setIsCreatedModalOpen(true)}
        onSearch={(term) => {
          search(term);
        }}
      />

      {!isLoading && users?.results && users?.results.length > 0 && (
        <div className="mt-6 flex w-m-[999px] flex-col items-center rounded-2xl bg-white p-4">
          <Table
            gridSizes={[3, 3, 2, 3, 1]}
            headerLabels={[
              'Nombre',
              'Correo electrónico',
              'Rol',
              'Reporta a',
              ''
            ]}
            tableRows={mapTableRows(users?.results)}
          />
          <div className="mb-4 mt-14 flex justify-center">
            <Paginator
              totalPages={totalPages}
              currentPage={page}
              onClick={(page: number) => {
                setPage(page);
              }}
            />
          </div>
        </div>
      )}

      {!isLoading && users?.results.length == 0 && (
        <div className="mt-6 flex w-[999px] rounded-2xl bg-white p-4 justify-center">
          <p className="text-sm">No hay resultados para su búsqueda</p>
        </div>
      )}

      {selectedUser && (
        <UserDataModal
          userData={selectedUser}
          onClose={() => setSelectedUser(undefined)}
        />
      )}
      {isCreatedModalOpen && (
        <CreateUserDataModal
          open={isCreatedModalOpen}
          onClose={() => setIsCreatedModalOpen(false)}
        />
      )}
    </main>
  );
};

export default UsersPage;
