import {
  SupervisedArea,
  SupervisedAreaResponse
} from '@/types/SupervisedAreas';

export const mapSupervisedArea = (
  supervisedArea: SupervisedAreaResponse
): SupervisedArea => {
  const {
    id,
    name,
    branch: { name: territory, id: branchId },
    supervisor,
    territoriesCounter
  } = supervisedArea;

  const supervisorName = supervisor
    ? `${supervisor.firstName} ${supervisor.lastName}`
    : '';

  return {
    id,
    name,
    supervisorName,
    supervisorId: supervisor?.username || '',
    territory,
    branchId: String(branchId),
    territoriesCounter
  };
};
