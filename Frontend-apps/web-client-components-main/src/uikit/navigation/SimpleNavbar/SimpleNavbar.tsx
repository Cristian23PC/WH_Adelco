import React, { type FC } from 'react';
import classnames from 'classnames';
import { Logo } from '../../../foundation';
import { Button } from '../../actions';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import { type LinkRenderer } from '../../../utils/types';

export interface Props {
  'data-testid'?: string;
  linkRenderer: LinkRenderer;
  showLoginButton?: boolean;
  onClickUser?: VoidFunction;
  centered?: boolean;
}

const SimpleNavbar: FC<Props> = ({
  'data-testid': dataTestId = 'simple-navbar',
  linkRenderer,
  showLoginButton = false,
  onClickUser = () => {},
  centered = false
}) => {
  const { isMobile } = useScreen();
  return (
    <div
      className="relative bg-white grid desktop:place-items-center tablet:border-b z-30"
      data-testid={dataTestId}
    >
      <div
        className={classnames(
          'flex gap-0 py-2 px-4 w-100 justify-between items-center',
          'tablet:px-6',
          'desktop:py-4 desktop:w-[1340px]'
        )}
      >
        <div
          className={classnames('flex items-center h-8 tablet:h-9', {
            'mx-auto': centered
          })}
        >
          <div className={classnames({ 'pl-9': centered && showLoginButton })}>
            {linkRenderer(
              '/',
              <div className="cursor-pointer">
                <Logo />
              </div>
            )}
          </div>
        </div>
        {showLoginButton && (
          <Button
            onClick={onClickUser}
            iconName="person_outline"
            variant="tertiary"
            size={isMobile ? 'md' : 'sm'}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleNavbar;
