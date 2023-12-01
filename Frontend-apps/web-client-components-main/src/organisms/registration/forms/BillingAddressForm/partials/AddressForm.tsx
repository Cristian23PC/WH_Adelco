import React, { useEffect, type FC } from 'react';
import classNames from 'classnames';
import {
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormClearErrors
} from 'react-hook-form';
import { Dropdown, OptionCheck, TextField } from '../../../../../uikit/input';
import { type FormValues } from '../types';
import { handleErrors } from '../../BusinessInformationForm/partials/utils';
import { type FormValues as BusinessAddressFormValues } from '../../BusinessInformationForm/types';

export const DEFAULT_LITERALS = {
  sectionTitle: 'Datos de facturación',
  useBusinessAddressLabel: 'Usar misma dirección de despacho',
  regionLabel: 'Región',
  communeLabel: 'Comuna',
  localityLabel: 'Localidad',
  streetLabel: 'Calle',
  streetNumberLabel: 'Número',
  noStreetNumberLabel: 'Sin Número',
  apartmentLabel: 'Nº de oficina / depto / casa (opcional)',
  additionalInformationLabel: 'Información adicional (opcional)'
};

interface AddressFormProps {
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  watch: UseFormWatch<FormValues>;
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
  onRegionChange: (value: string) => void;
  onCommuneChange: (value: string) => void;
  regionList: Array<{ value: string; label: string }>;
  communeList: Array<{ value: string; label: string }>;
  localityList: Array<{ value: string; label: string }>;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
  businessAddressValues: BusinessAddressFormValues;
  defaultValues?: FormValues;
}

type FormKey =
  | 'region'
  | 'commune'
  | 'locality'
  | 'street'
  | 'streetNumber'
  | 'noStreetNumber'
  | 'apartment'
  | 'additionalInformation';

const AddressForm: FC<AddressFormProps> = ({
  setValue,
  getValues,
  watch,
  register,
  clearErrors,
  regionList,
  onRegionChange,
  communeList,
  onCommuneChange,
  localityList,
  literals,
  errors,
  businessAddressValues,
  defaultValues
}) => {
  const populateDropdowns = (): void => {
    onRegionChange(businessAddressValues.region);
    onCommuneChange(businessAddressValues.commune);
  };

  useEffect(() => {
    if (defaultValues) {
      populateValues(defaultValues);
    }
  }, []);

  useEffect(() => {
    if (localityList.length === 1) {
      setValue('locality', localityList[0].value);
    }
  });

  const overwriteValues = (): void => {
    const { RUT, socialReason, localName, coordinates, ...commonFields } =
      businessAddressValues;

    populateValues(commonFields);
  };

  const populateValues = (data: FormValues): void => {
    Object.keys(data).forEach((key) => {
      setValue(key as FormKey, data[key as FormKey]);
    });
  };

  return (
    <>
      <h2 className="py-4 text-center font-semibold">
        {literals.sectionTitle}
      </h2>
      <div>
        <OptionCheck
          id="useBusinessAddress"
          className="w-full"
          label={literals.useBusinessAddressLabel}
          checked={Boolean(watch('useBusinessAddress'))}
          onChange={(e) => {
            clearErrors();
            populateDropdowns();
            overwriteValues();
            setValue('useBusinessAddress', e.target.checked);
          }}
        />
      </div>
      <div>
        <Dropdown
          label={literals.regionLabel}
          options={regionList}
          value={
            getValues('useBusinessAddress')
              ? businessAddressValues.region
              : watch('region')
          }
          onChange={(value) => {
            onRegionChange(value);
            setValue('region', value);
            setValue('commune', '');
          }}
          disabled={getValues('useBusinessAddress')}
          helperText={handleErrors(errors, 'region').helperText}
          variant={handleErrors(errors, 'region').variant}
        />
      </div>
      <div>
        <Dropdown
          label={literals.communeLabel}
          options={communeList}
          value={
            getValues('useBusinessAddress')
              ? businessAddressValues.commune
              : watch('commune')
          }
          onChange={(value) => {
            onCommuneChange(value);
            setValue('commune', value);
            setValue('locality', '');
          }}
          disabled={
            Boolean(getValues('useBusinessAddress')) || !watch('region')
          }
          helperText={handleErrors(errors, 'commune').helperText}
          variant={handleErrors(errors, 'commune').variant}
        />
      </div>
      {localityList?.length > 1 && (
        <div>
          <Dropdown
            label={literals.localityLabel}
            options={localityList}
            value={
              getValues('useBusinessAddress')
                ? businessAddressValues.locality
                : watch('locality')
            }
            onChange={(value) => {
              setValue('locality', value);
            }}
            disabled={getValues('useBusinessAddress')}
          />
        </div>
      )}
      <TextField
        id="street"
        label={literals.streetLabel}
        {...handleErrors(errors, 'street')}
        {...register('street')}
        disabled={getValues('useBusinessAddress')}
        value={
          getValues('useBusinessAddress')
            ? businessAddressValues.street
            : watch('street')
        }
      />
      <div
        className={classNames('grid grid-cols-[1fr_auto] gap-2', {
          'items-center': !errors.streetNumber,
          'items-start': errors.streetNumber
        })}
      >
        <div>
          <TextField
            id="streetNumber"
            label={literals.streetNumberLabel}
            {...handleErrors(errors, 'streetNumber')}
            {...register('streetNumber')}
            disabled={
              Boolean(getValues('useBusinessAddress')) ||
              Boolean(getValues('noStreetNumber'))
            }
            value={
              getValues('useBusinessAddress')
                ? businessAddressValues.streetNumber
                : watch('streetNumber')
            }
          />
        </div>
        <OptionCheck
          id="noStreetNumber"
          label={literals.noStreetNumberLabel}
          checked={Boolean(
            getValues('useBusinessAddress')
              ? businessAddressValues.noStreetNumber
              : Boolean(watch('noStreetNumber'))
          )}
          onChange={(ev) => {
            const value = ev.target.checked;
            if (value) {
              setValue('streetNumber', '');
            }
            setValue('noStreetNumber', value);
          }}
          disabled={getValues('useBusinessAddress')}
        />
      </div>
      <TextField
        id="apartment"
        label={literals.apartmentLabel}
        {...register('apartment')}
        disabled={getValues('useBusinessAddress')}
        helperText={handleErrors(errors, 'apartment').helperText}
        variant={handleErrors(errors, 'apartment').variant}
      />
      <TextField
        id="additionalInformation"
        label={literals.additionalInformationLabel}
        {...register('additionalInformation')}
        disabled={getValues('useBusinessAddress')}
        helperText={handleErrors(errors, 'additionalInformation').helperText}
        variant={handleErrors(errors, 'additionalInformation').variant}
      />
    </>
  );
};

export default AddressForm;
