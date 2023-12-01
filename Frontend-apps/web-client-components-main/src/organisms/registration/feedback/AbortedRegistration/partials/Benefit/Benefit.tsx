import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../../../../../../uikit';
import { type IconName } from '../../../../../../utils/types';

export interface Props {
  'data-testid'?: string;
  iconName: IconName;
  iconSize: number;
  message: string;
}

const Benefit: FC<Props> = ({
  'data-testid': dataTestId = 'registration-benefit',
  iconName,
  iconSize,
  message
}) => {
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'flex tablet:flex-col items-center justify-center',
        'border rounded-2xl border-snow',
        'p-4 gap-2 text-xs'
      )}
    >
      <Icon
        name={iconName}
        width={iconSize}
        height={iconSize}
        className="fill-corporative-01 shrink-0"
      />
      <p className="font-sans text-xs tablet:text-center">{message}</p>
    </div>
  );
};

export default Benefit;
