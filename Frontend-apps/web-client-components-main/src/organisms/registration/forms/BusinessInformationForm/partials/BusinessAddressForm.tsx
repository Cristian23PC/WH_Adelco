import React, { useEffect, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Dropdown, OptionCheck, TextField } from '../../../../../uikit/input';
import { type FormValues } from '../types';
import { handleErrors } from './utils';
import classNames from 'classnames';

export const DEFAULT_LITERALS = {
  secondSectionTitle: 'Información de despacho',
  regionLabel: 'Región',
  communeLabel: 'Comuna',
  localityLabel: 'Localidad',
  streetLabel: 'Calle',
  streetNumberLabel: 'Número',
  noStreetNumberLabel: 'Sin Número',
  apartmentLabel: 'Nº de oficina / depto / casa (opcional)',
  additionalInformationLabel: 'Información adicional (opcional)'
};

interface BusinessAddressFormProps {
  onRegionChange: (value: string) => void;
  onCommuneChange: (value: string) => void;
  regionList: Array<{ value: string; label: string }>;
  communeList: Array<{ value: string; label: string }>;
  localityList: Array<{ value: string; label: string }>;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
}
const BusinessAddressForm: FC<BusinessAddressFormProps> = ({
  regionList,
  onRegionChange,
  onCommuneChange,
  communeList,
  localityList,
  literals
}) => {
  const {
    setValue,
    register,
    formState: { errors },
    watch
  } = useFormContext<FormValues>();

  useEffect(() => {
    if (localityList.length === 1) {
      setValue('locality', localityList[0].value);
    }
  }, [localityList]);

  return (
    <>
      {literals.secondSectionTitle && (
        <h2 className="pt-6 text-center font-semibold">
          {literals.secondSectionTitle}
        </h2>
      )}
      <div>
        <Dropdown
          data-testid="adelco-region-dropdown"
          label={literals.regionLabel}
          options={regionList}
          value={watch('region')}
          onChange={(value) => {
            onRegionChange(value);
            setValue('region', value);
          }}
          helperText={handleErrors(errors, 'region').helperText}
          variant={handleErrors(errors, 'region').variant}
        />
      </div>
      <div>
        <Dropdown
          data-testid="adelco-commune-dropdown"
          label={literals.communeLabel}
          options={communeList}
          disabled={!watch('region')}
          value={watch('commune')}
          onChange={(value) => {
            onCommuneChange(value);
            setValue('commune', value);
          }}
          helperText={handleErrors(errors, 'commune').helperText}
          variant={handleErrors(errors, 'commune').variant}
        />
      </div>
      {localityList.length > 1 && (
        <div>
          <Dropdown
            label={literals.localityLabel}
            options={localityList}
            value={watch('locality')}
            onChange={(value) => {
              setValue('locality', value);
            }}
            helperText={handleErrors(errors, 'locality').helperText}
            variant={handleErrors(errors, 'locality').variant}
          />
        </div>
      )}
      <TextField
        id="streetLabel"
        label={literals.streetLabel}
        {...handleErrors(errors, 'street')}
        {...register('street')}
      />
      <div
        className={classNames('grid grid-cols-[1fr_minmax(130px,auto)] gap-2', {
          'items-center': !errors.streetNumber,
          'items-start': errors.streetNumber
        })}
      >
        <div>
          <TextField
            id="streetNumberLabel"
            label={literals.streetNumberLabel}
            {...handleErrors(errors, 'streetNumber')}
            {...register('streetNumber')}
          />
        </div>
        <OptionCheck
          label={literals.noStreetNumberLabel}
          checked={Boolean(watch('noStreetNumber'))}
          onChange={(ev) => {
            const value = ev.target.checked;
            if (value) {
              setValue('streetNumber', '');
            }
            setValue('noStreetNumber', value);
          }}
        />
      </div>
      <TextField
        id="apartment"
        label={literals.apartmentLabel}
        {...register('apartment')}
      />
      <TextField
        id="additionalInformation"
        label={literals.additionalInformationLabel}
        {...register('additionalInformation')}
      />
    </>
  );
};

export default BusinessAddressForm;
