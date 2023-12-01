import React, { type FC } from 'react';
import CustomIcon from './CustomIcon';
import { Button } from '../../../uikit';
import { type DEFAULT_LITERALS } from '../LoginCard';
import useScreen from '../../../utils/hooks/useScreen/useScreen';

interface LoggedContentProps {
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onCloseSession: VoidFunction;
  username?: string;
}
const LoggedContent: FC<LoggedContentProps> = ({
  literals: l,
  onCloseSession,
  username = ''
}) => {
  const { isMobile } = useScreen();

  return (
    <div className="pb-px bg-snow text-corporative-02 text-xs">
      <div className="px-4 py-2">
        <div className="p-2 bg-white rounded-lg flex gap-2 justify-around items-center">
          <div className="flex gap-2">
            <CustomIcon variant="primary" iconName="user_active" />
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-bold text-sm">{`${l.salutation} ${username}`}</p>
                <p>{l.subtitle}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={onCloseSession}
                  size={isMobile ? 'sm' : 'xs'}
                  variant="tertiary"
                  block={isMobile}
                >
                  <span className="tablet:px-2.5">{l.closeSessionLabel}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedContent;
