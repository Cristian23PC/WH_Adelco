import React, { type FC } from 'react';
import { type DEFAULT_LITERALS, type LoginCardProps } from '../LoginCard';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import CustomIcon from './CustomIcon';
import { Button } from '../../../uikit';

interface NotLoggedContentProps
  extends Omit<LoginCardProps, 'literals' | 'onLogoutClick'> {
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
}
const NotLoggedContent: FC<NotLoggedContentProps> = ({
  literals: l,
  createAccountCallback,
  onLoginClick
}) => {
  const { isMobile, isTablet } = useScreen();
  return (
    <>
      <div className="p-4">
        <div className="p-2 bg-white rounded-lg flex gap-2 justify-around items-center">
          <div className="flex items-center gap-2">
            <CustomIcon variant="primary" iconName="user_add" />
            {isMobile && <p>{l.createAccountLabel}</p>}
            {isTablet && (
              <div>
                <p className="font-bold text-sm">
                  {l.createAccountTitleTablet}
                </p>
                <p>{l.createAccountSubtitleTablet}</p>
              </div>
            )}
          </div>
          <Button
            size={isMobile ? 'sm' : 'xs'}
            variant="primary"
            onClick={createAccountCallback}
          >
            {l.createAccountButton}
          </Button>
        </div>
      </div>

      <div className="px-6 py-2 bg-white flex items-center gap-2">
        <CustomIcon variant="secondary" iconName="user_inactive" />
        <p>
          {l.hasAccountLabel}{' '}
          <span
            onClick={onLoginClick}
            className="font-semibold underline cursor-pointer"
          >
            {l.hasAccountLink}
          </span>
        </p>
      </div>
    </>
  );
};

export default NotLoggedContent;
