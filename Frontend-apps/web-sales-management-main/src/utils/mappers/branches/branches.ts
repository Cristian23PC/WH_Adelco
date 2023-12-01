import { type Branch } from '@/types/Branch';
import { type Option } from '@/types/Option';

export const mapBranchesOptions = (branch: Branch): Option => ({
  value: String(branch.id),
  label: branch.name
});

export const getBranchesOptions = (branches: Branch[]): Option[] =>
  branches.map(mapBranchesOptions);
