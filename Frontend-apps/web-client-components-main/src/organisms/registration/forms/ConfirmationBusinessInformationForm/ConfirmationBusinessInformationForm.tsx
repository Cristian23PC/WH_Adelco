import React, { type ReactNode, type FC } from 'react';
import { Stepper } from '../../../../uikit/navigation';
import { type Step } from '../../../../uikit/navigation/Stepper/Stepper';
import { Button } from '../../../../uikit/actions';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import classNames from 'classnames';

const DEFAULT_LITERALS = {
  title: 'Confirma los datos ingresados',
  customerInformationTitle: 'Información de Cliente',
  billingAddressTitle: 'Dirección de facturación',
  previousButtonLabel: 'Atrás',
  nextButtonLabel: 'Siguiente'
};

interface SectionProps {
  title: string;
  children: ReactNode;
}
const Section: FC<SectionProps> = ({ title, children }) => (
  <section className="text-sm flex flex-col gap-1">
    <h2 className="font-bold mt-4">{title}</h2>
    {children}
  </section>
);

export interface Props {
  steps?: Step[];
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]: string;
  };
  customerInformation: {
    name: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    region: string;
    commune: string;
    locality?: string;
    street: string;
    number?: string;
  };
  onNext: VoidFunction;
  onPrevious: VoidFunction;
}
const ConfirmationBusinessInformationForm: FC<Props> = ({
  steps,
  literals,
  customerInformation,
  billingAddress,
  onNext,
  onPrevious
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <>
      {steps && <Stepper steps={steps} currentStep={3} />}
      <div className="tablet:max-w-[300px] m-auto">
        <h1
          className={classNames('font-semibold mb-4 text-center', {
            'mt-10': !!steps
          })}
        >
          {l.title}
        </h1>
        <div
          data-testid="confirmation-business-information-form"
          className="text-corporative-03 mb-16 tablet:mb-2 flex flex-col gap-2"
        >
          <Section title={l.customerInformationTitle}>
            <p>{customerInformation.name}</p>
            <p>{customerInformation.email}</p>
            <p>{customerInformation.phone}</p>
          </Section>
          <Section title={l.billingAddressTitle}>
            <p>{billingAddress.region}</p>
            <p>{billingAddress.commune}</p>
            {billingAddress.locality && <p>{billingAddress.locality}</p>}
            <p>{billingAddress.street}</p>
            {billingAddress.number && <p>{billingAddress.number}</p>}
          </Section>
        </div>
        <div className="flex justify-between gap-2.5 py-4">
          <Button
            size={isMobile ? 'md' : 'sm'}
            variant="tertiary"
            onClick={onPrevious}
            block
          >
            {l.previousButtonLabel}
          </Button>
          <Button
            size={isMobile ? 'md' : 'sm'}
            variant="secondary"
            onClick={onNext}
            block
          >
            {l.nextButtonLabel}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationBusinessInformationForm;
