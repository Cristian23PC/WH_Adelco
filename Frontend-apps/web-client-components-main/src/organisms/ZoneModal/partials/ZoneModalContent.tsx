import React, { useState, type FC, useEffect } from 'react';
import classNames from 'classnames';
import { Button, Modal, Dropdown } from '../../../uikit';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import type { OptionObject } from '../../../uikit/input/Dropdown/Dropdown';

export const DEFAULT_LITERALS = {
  title: 'Ingresa la zona en la que te encuentres',
  regionPlaceholder: 'Región',
  communePlaceholder: 'Comuna',
  localityPlaceholder: 'Localidad',
  submit: 'Guardar mi ubicación',
  alreadyAccount: '¿Ya tienes cuenta?',
  alreadyAccountLink: 'Ingresa aquí'
};

export interface Values {
  region?: string;
  commune?: string;
  locality?: string;
}

export interface DropdownController {
  regionOpen: boolean;
  communeOpen: boolean;
  localityOpen: boolean;
}

export interface Props {
  open?: boolean;
  onClose: VoidFunction;
  values?: Values;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onSubmit: (values: Values) => void;
  regionOptions: OptionObject[];
  communeOptions?: OptionObject[];
  localityOptions?: OptionObject[];
  onRegionChange: (value: string) => void;
  onCommuneChange?: (value: string) => void;
  onLocalityChange?: (value: string) => void;
  onLoginClick?: () => void;
  isValid?: boolean;
  isLoading?: boolean;
}

const ZoneModalContent: FC<Props> = ({
  open = false,
  onClose,
  values,
  literals = {},
  onSubmit,
  onRegionChange,
  onCommuneChange,
  onLocalityChange,
  regionOptions,
  communeOptions = [],
  localityOptions = [],
  isValid = true,
  isLoading = false,
  onLoginClick
}) => {
  const { isMobile } = useScreen();
  const displayLiterals = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const [dropdownController, setDropdownController] =
    useState<DropdownController>({
      regionOpen: false,
      communeOpen: false,
      localityOpen: false
    });

  const localityValid = Boolean(
    localityOptions.length === 0 ||
      (localityOptions.length > 0 && values?.locality)
  );

  useEffect(() => {
    setDropdownController({
      regionOpen: false,
      communeOpen: false,
      localityOpen: false
    });
  }, []);

  return (
    <Modal
      id="zone-modal"
      open={open}
      onClose={() => {
        setDropdownController(() => ({
          regionOpen: false,
          communeOpen: false,
          localityOpen: false
        }));
        onClose();
      }}
    >
      <div className="flex flex-col items-center gap-4 tablet:gap-8">
        <div className="pt-8 tablet:pt-0 font-semibold desktop:text-sm">
          {displayLiterals.title}
        </div>
        <div className="grid gap-2 tablet:gap-4 text-left w-[256px] tablet:w-[300px]">
          {/* Region dropdown */}
          <Dropdown
            options={regionOptions}
            value={values?.region}
            label={displayLiterals.regionPlaceholder}
            onChange={(value) => {
              setDropdownController((prevState) => ({
                ...prevState,
                regionOpen: false
              }));
              onRegionChange?.(value);
            }}
            onOpen={() => {
              setDropdownController((prevState) => ({
                ...prevState,
                regionOpen: true,
                communeOpen: false,
                localityOpen: false
              }));
            }}
            isOpen={dropdownController.regionOpen}
          />
          {/* Commune dropdown */}
          <Dropdown
            options={communeOptions}
            value={values?.commune}
            label={displayLiterals.communePlaceholder}
            disabled={!values?.region}
            onChange={(value) => {
              setDropdownController((prevState) => ({
                ...prevState,
                communeOpen: false
              }));
              onCommuneChange?.(value);
            }}
            onOpen={() => {
              setDropdownController((prevState) => ({
                ...prevState,
                regionOpen: false,
                communeOpen: true,
                localityOpen: false
              }));
            }}
            isOpen={dropdownController.communeOpen}
          />
          {/* Locality dropdown */}
          {localityOptions.length > 0 && (
            <Dropdown
              options={localityOptions}
              value={values?.locality}
              label={displayLiterals.localityPlaceholder}
              onChange={(value) => {
                setDropdownController((prevState) => ({
                  ...prevState,
                  localityOpen: false
                }));
                onLocalityChange?.(value);
              }}
              onOpen={() => {
                setDropdownController((prevState) => ({
                  ...prevState,
                  regionOpen: false,
                  communeOpen: false,
                  localityOpen: true
                }));
              }}
              isOpen={dropdownController.localityOpen}
            />
          )}
          <Button
            className="my-4 tablet:my-0"
            variant="secondary"
            type="submit"
            disabled={!isValid || isLoading}
            size={isMobile ? 'md' : 'sm'}
            onClick={() => {
              if (values?.commune && isValid && !isLoading && localityValid) {
                onSubmit(values);
              }
            }}
          >
            {displayLiterals.submit}
          </Button>
        </div>
        <div
          className={classNames(
            'text-sm tablet:text-xs leading-6 tablet:leading-[19px]',
            'desktop:w-full desktop:flex desktop:justify-center gap-1'
          )}
        >
          <div>{displayLiterals.alreadyAccount}</div>
          <div
            className="font-bold underline cursor-pointer"
            onClick={() => {
              onLoginClick?.();
            }}
          >
            {displayLiterals.alreadyAccountLink}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ZoneModalContent;
