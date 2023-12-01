import React, { type FC } from 'react';
import { Checkbox } from '../../../../../../uikit/input';
import { useFormContext } from 'react-hook-form';
import { InputMessage } from '../../../../../../uikit/feedback/InputMessage';

export const DEFAULT_LITERALS = {
  acceptLabel: 'Acepto los ',
  termsLabel: 'Términos y Condiciones'
};

export interface Values {
  acceptTerms: boolean;
}

interface TermsFormProps {
  termsUrl: string;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
}

const TermsForm: FC<TermsFormProps> = ({ termsUrl, literals }) => {
  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<Values>();

  return (
    <div className="grid gap-1">
      <div
        className={`flex gap-2 border rounded-[10px] p-2 items-center ${
          errors.acceptTerms ? 'border-failure' : 'border-snow'
        }`}
      >
        <Checkbox
          id="accept-terms"
          checked={watch('acceptTerms')}
          onChange={(e) => {
            setValue('acceptTerms', e.target.checked);
          }}
        />
        <label htmlFor="accept-terms" className="text-sm line-clamp-[19px]">
          {literals.acceptLabel}
          <a
            href={termsUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {literals.termsLabel}
          </a>
        </label>
      </div>
      {errors.acceptTerms && (
        <InputMessage iconName="error" variant="failure">
          {errors.acceptTerms.message}
        </InputMessage>
      )}
    </div>
  );
};

export default TermsForm;
