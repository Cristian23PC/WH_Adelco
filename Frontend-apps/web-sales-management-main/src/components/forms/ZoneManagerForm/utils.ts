import { UserRelated } from '@/types/User';
import { OptionObject } from '@/app/(management)/sales-entities/supervised-area/partials/SupervisedAreaForm/utils';

export const getUserLabel = (user?: UserRelated): string => {
  return user ? [user?.firstName, user?.lastName].join(' ') : '';
};

export const getUserDefaultOption = (user?: UserRelated): OptionObject[] => {
  if (!user) return [];
  const label = getUserLabel(user);
  return [{ label, value: user.username }];
};
