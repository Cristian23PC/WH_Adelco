import React from 'react';
import useStep, { STEPS } from './useStep';
import DeliveryAddressInformationStep from './steps/DeliveryAddressInformationStep';
import ContactInformationStep from './steps/ContactInformationStep';

const AddDeliveryAddressForm = () => {
  const { step, onChangeStep, values } = useStep();

  const stepComponents = {
    [STEPS.DELIVERY_ADDRESS_INFORMATION]: (
      <DeliveryAddressInformationStep
        onChangeStep={onChangeStep}
        values={values}
      />
    ),
    [STEPS.CONTACT_INFORMATION]: (
      <ContactInformationStep onChangeStep={onChangeStep} values={values} />
    )
  };

  if (!stepComponents[step]) {
    throw new Error(`Step "${step}" not found`);
  }

  return stepComponents[step];
};

export default AddDeliveryAddressForm;
