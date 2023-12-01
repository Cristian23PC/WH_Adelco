import React, { type FC } from 'react';
import { Logo } from '../../../foundation';
import SocialIconLink from './partials/SocialIconLink';
import Separator from './partials/FooterSeparator';
import Section from './partials/FooterSection';
import { defaultDynamicLink } from '../../../utils/types/DynamicComponent.type';
import type DynamicComponent from '../../../utils/types/DynamicComponent.type';

const DEFAULT_LITERALS = {
  termsAndConditionsLbl: 'Términos y condiciones'
};

export interface FooterProps {
  address?: string;
  email?: string;
  phone?: string;
  instagramLink: string;
  facebookLink: string;
  linkedinLink: string;
  year: string;
  'data-testid'?: string;
  termsLinkComponent?: DynamicComponent;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
}
const Footer: FC<FooterProps> = ({
  'data-testid': dataTestId = 'adelco-footer',
  address,
  email,
  phone,
  instagramLink,
  facebookLink,
  linkedinLink,
  year,
  termsLinkComponent = defaultDynamicLink,
  literals = {}
}) => {
  const { Component, props } = termsLinkComponent;
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div
      data-testid={dataTestId}
      className="bg-corporative-02 text-white px-4 tablet:px-[25px] tablet:py-2.5 tablet:pb-[50px]"
    >
      <div className="max-w-[886px] mx-auto">
        <div className="py-4">
          <Logo variant="white" />
        </div>

        <div className="flex flex-col tablet:flex-row gap-[50px] text-sm font-semibold tablet:text-xs tablet:justify-between tablet:pt-2 tablet:pb-5">
          <div className="flex flex-col gap-2 tablet:gap-5">
            <Section iconName="place">{address}</Section>
            <Separator />
            <Section iconName="mail">{email}</Section>
            <Separator />
            <Section iconName="phone">{phone}</Section>
            <Separator />
          </div>

          <div className="">
            <div>
              <Section>
                <span className="underline">
                  <Component {...props}>{l.termsAndConditionsLbl}</Component>
                </span>
              </Section>
              <Separator />
            </div>
            <div className="flex justify-between items-center py-4 tablet:pt-5 tablet:flex-col tablet:gap-5">
              <div className="flex gap-[30px]">
                <SocialIconLink link={instagramLink} iconName="instagram" />
                <SocialIconLink link={facebookLink} iconName="facebook" />
                <SocialIconLink link={linkedinLink} iconName="linkedin" />
              </div>
              <div className="text-white text-xs text-right font-normal w-full">
                &copy; Adelco {year}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
