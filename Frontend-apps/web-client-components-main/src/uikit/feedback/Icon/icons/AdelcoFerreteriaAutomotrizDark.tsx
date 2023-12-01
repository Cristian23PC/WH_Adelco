import React, { type FC } from 'react';
import { ADELCO_FERRETERIA_AUTOMOTRIZ_DARK } from '../iconNames';
import type Props from './IconPropType';

const AdelcoFerreteriaAutomotrizDarkIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ADELCO_FERRETERIA_AUTOMOTRIZ_DARK}`,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      {...props}
      className={className}
      data-testid={dataTestId}
    >
      <g clipPath="url(#clip0_6518_23584)">
        <path
          d="M10.2667 15.6661C12.6231 15.6661 14.5333 13.7559 14.5333 11.3995C14.5333 9.04306 12.6231 7.13281 10.2667 7.13281C7.91025 7.13281 6 9.04306 6 11.3995C6 13.7559 7.91025 15.6661 10.2667 15.6661Z"
          fill="#999999"
        />
        <path
          d="M10.3377 18.0005C9.96994 18.0005 9.61521 17.8672 9.33998 17.6251C9.31331 17.6015 9.28815 17.5779 9.2635 17.5532C8.97519 17.2629 8.8187 16.8769 8.82323 16.4674L8.94248 6.33121C8.94349 6.2351 8.99582 6.14906 9.07683 6.10076L9.06928 4.74524C9.06928 4.73619 9.06576 4.73065 9.06374 4.72814L8.22598 4.73266C8.22145 4.7382 8.22045 4.74524 8.22045 4.74977C8.22095 4.89871 8.16611 5.0401 8.06547 5.14777C7.96082 5.25897 7.82043 5.32086 7.66949 5.32187L6.29334 5.32941C6.22491 5.32941 6.16001 5.30526 6.10969 5.26098C6.10566 5.25746 6.10214 5.25394 6.09812 5.25042C6.04528 5.19809 6.0161 5.12916 6.0156 5.05519L6 2.3185C6 2.24454 6.02818 2.1751 6.08 2.12277C6.13183 2.07044 6.20126 2.04126 6.27473 2.04076L7.65087 2.03321C7.79779 2.03321 7.93566 2.09107 8.04233 2.19623C8.15 2.30592 8.21038 2.45637 8.20837 2.61033C8.2129 2.61436 8.21944 2.61637 8.22145 2.61687L9.05469 2.61235C9.05569 2.60782 9.0567 2.60077 9.0562 2.59524C9.05569 2.43423 9.10903 2.29183 9.21117 2.18265C9.31532 2.07145 9.45621 2.00956 9.60716 2.00855L11.1775 2C11.3048 2 14.3097 2.02868 15.5329 4.53744C15.5852 4.64461 15.5626 4.77292 15.4775 4.85644C15.4257 4.90726 15.3573 4.93494 15.2848 4.93494C15.2405 4.93494 15.1968 4.92437 15.1575 4.90374C14.5693 4.59782 13.2148 4.01969 12.2986 4.01969C12.0832 4.01969 11.9061 4.05239 11.7728 4.1173C11.6047 4.19931 11.5056 4.33165 11.4618 4.53442L11.4704 6.08063C11.5589 6.12541 11.6183 6.21498 11.6208 6.31712L11.8528 16.4508C11.8618 16.8603 11.7099 17.2478 11.4246 17.5416C11.1393 17.8355 10.7564 17.9985 10.3468 18.0005H10.3377ZM9.3752 16.4739C9.37168 16.7346 9.4713 16.9796 9.65496 17.1643C9.8376 17.3474 10.0801 17.4485 10.3382 17.4485H10.3433C10.6034 17.447 10.8469 17.3434 11.0281 17.1567C11.2092 16.97 11.3058 16.724 11.2998 16.4633L11.0744 6.6009L9.49143 6.60945L9.3752 16.4739ZM9.06576 4.17567C9.37017 4.17567 9.61923 4.42976 9.62125 4.74222L9.62829 6.05598L10.9179 6.04893L10.9093 4.50876C10.9093 4.48913 10.9113 4.47152 10.9144 4.45492C10.9878 4.06447 11.1956 3.7832 11.5317 3.62018C11.7385 3.51954 11.9972 3.46873 12.3011 3.46873C13.011 3.46873 13.8553 3.73842 14.5326 4.01315C13.2848 2.57411 11.1966 2.55247 11.1745 2.55247L9.61169 2.56102C9.61118 2.56555 9.61018 2.5731 9.61018 2.57813C9.61068 2.73914 9.55734 2.88154 9.4552 2.99072C9.35055 3.10192 9.21016 3.16381 9.05922 3.16482L8.22548 3.16935C8.07252 3.16935 7.92459 3.10746 7.81691 2.99928C7.71125 2.8921 7.65489 2.75172 7.65741 2.60379C7.65741 2.59574 7.6554 2.5897 7.65137 2.58518L6.55549 2.59172L6.56756 4.77543L7.66395 4.7694C7.66898 4.76386 7.66949 4.75682 7.66949 4.75178C7.66898 4.60235 7.72383 4.46146 7.82446 4.35378C7.92861 4.24259 8.0695 4.1807 8.22045 4.17969L9.06727 4.17516L9.06576 4.17567Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_6518_23584">
          <rect
            width="9.56106"
            height="16"
            fill="white"
            transform="translate(6 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AdelcoFerreteriaAutomotrizDarkIcon;
