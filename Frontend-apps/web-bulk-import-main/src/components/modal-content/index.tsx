import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

import PrimaryButton from '@commercetools-uikit/primary-button';
import { IContentModal } from './interfaces/modal-content.interface';

const ContentModal = ({
  handleAction,
  actionButtonLabel,
  title,
  description,
}: IContentModal) => {
  return (
    <Spacings.Stack>
      <Text.Headline
        as="h1"
        intlMessage={{ id: '0013265', defaultMessage: title }}
      />
      <Text.Body intlMessage={{ id: '0013265', defaultMessage: description }} />
      <div style={{ paddingTop: '30px' }}>
        <Spacings.Inline justifyContent="flex-end">
          {handleAction && (
            <PrimaryButton
              onClick={handleAction}
              label={actionButtonLabel as string}
            />
          )}
        </Spacings.Inline>
      </div>
    </Spacings.Stack>
  );
};

export default ContentModal;
