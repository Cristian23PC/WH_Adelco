'use client';
import useAuthentication from '@/hooks/auth/useAuthentication';
import UserDataItem from './partials/UserDataItem';
import DashboardSection from './partials/DashboardSection';
import SellInfoItem from './partials/SellInfoItem';
import useSupervisedAreas from '@/hooks/supervisedAreas/useSupervisedAreas';
import useTerritory from '@/hooks/territory/useTerritory';
import useBUSalesProfile from '@/hooks/BUSalesProfile/useBUSalesProfile';
import useUsers from '@/hooks/users';
import { Role } from '@/types/User';
import { formatPhone } from '@/utils/phone';

const FETCHING_STATUS = 'fetching';

const enabledFetching = (role = '') =>
  (
    [Role.Supervisor, Role.ZoneManager, Role.GeneralManager] as string[]
  ).includes(role);

const Dashboard = () => {
  const { data } = useAuthentication();
  const { supervisedAreas, fetchStatus: supervisedAreaFetchStatus } =
    useSupervisedAreas(undefined, {
      enabled: enabledFetching(data?.role)
    });
  const { territories, fetchStatus: territoryFetchStatus } = useTerritory({
    enabled: enabledFetching(data?.role)
  });
  const { buSalesProfiles, fetchStatus: BUSalesProfileFetchStatus } =
    useBUSalesProfile({
      enabled: enabledFetching(data?.role)
    });
  const { total, fetchStatus: usersFetchStatus } = useUsers({
    role: Role.SalesRep
  });

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white">
      <div className="text-[32px] font-semibold font-title">
        Hola {data?.givenName}
      </div>
      <div className="flex flex-col gap-8">
        <DashboardSection title="Datos de usuario">
          <div className="flex gap-2 py-4 justify-between">
            <UserDataItem icon="user_active" text={data?.name} />
            <UserDataItem icon="mail" text={data?.email} />
            {data?.phone && (
              <>
                <UserDataItem icon="phone" text={formatPhone(data.phone)} />
              </>
            )}
          </div>
        </DashboardSection>
        <DashboardSection title="Información de ventas">
          <div className="flex gap-14">
            <SellInfoItem
              count={supervisedAreas?.total}
              label="Áreas supervisadas asignadas"
              isLoading={supervisedAreaFetchStatus === FETCHING_STATUS}
            />
            <SellInfoItem
              count={territories?.total}
              label="Territorios asignados"
              isLoading={territoryFetchStatus === FETCHING_STATUS}
            />
            <SellInfoItem
              count={total}
              label="Vendedores asignados"
              isLoading={usersFetchStatus === FETCHING_STATUS}
            />
            <SellInfoItem
              count={buSalesProfiles?.total}
              label="Clientes asignados"
              isLoading={BUSalesProfileFetchStatus === FETCHING_STATUS}
            />
          </div>
        </DashboardSection>
      </div>
    </div>
  );
};

export default Dashboard;
