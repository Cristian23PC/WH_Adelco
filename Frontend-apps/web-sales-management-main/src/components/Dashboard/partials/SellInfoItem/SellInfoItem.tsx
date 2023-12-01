import { Icon } from '@adelco/web-components';
import { FC } from 'react';

export interface SellInfoItemProps {
  count?: number | string;
  isLoading?: boolean;
  label: string;
}

const SellInfoItem: FC<SellInfoItemProps> = ({
  count = 'N/A',
  label,
  isLoading
}) => {
  return (
    <div className="flex flex-col text-center w-[150px] items-center">
      {isLoading ? (
        <Icon name="loader_animated" />
      ) : (
        <span className="font-title text-xl font-bold">{count}</span>
      )}
      <span className="text-xs text-corporative-02-hover">{label}</span>
    </div>
  );
};

export default SellInfoItem;
