import React, { type FC } from 'react';
import { ADELCO_MASCOTAS_DARK } from '../iconNames';
import type Props from './IconPropType';

const AdelcoMascotasDarkIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ADELCO_MASCOTAS_DARK}`,
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
      <g clipPath="url(#clip0_6518_23542)">
        <path
          d="M10.3476 13.7968C12.4424 13.7968 14.1405 12.0986 14.1405 10.0038C14.1405 7.90908 12.4424 6.21094 10.3476 6.21094C8.25283 6.21094 6.55469 7.90908 6.55469 10.0038C6.55469 12.0986 8.25283 13.7968 10.3476 13.7968Z"
          fill="#999999"
        />
        <path
          d="M5.95423 18C5.8455 18 5.75801 17.9929 5.68772 17.9788C4.72027 17.7648 3.99608 17.0442 3.70023 16.0024L3.69922 15.9994V15.9963C3.459 14.3745 4.65251 13.1896 5.70592 12.1438C5.77268 12.0775 5.83943 12.0113 5.90467 11.9455C6.37449 11.4008 6.78867 10.9123 7.22764 10.395C7.46988 10.1097 7.71566 9.81996 7.97661 9.514C8.49295 8.92079 8.96479 8.56527 9.46242 8.39484C9.55598 8.36096 9.65156 8.33466 9.74613 8.31747C9.96763 8.27499 10.1957 8.27499 10.4162 8.27499C10.6367 8.27499 10.8638 8.27499 11.0767 8.30887C11.1723 8.32606 11.2678 8.35236 11.3619 8.38675C11.857 8.55667 12.3531 8.92888 12.8371 9.49377L12.8472 9.5054C13.3196 10.0526 13.7337 10.5411 14.1727 11.0585C14.4149 11.3437 14.6607 11.634 14.9222 11.9399C14.9844 12.0021 15.0506 12.0679 15.1174 12.1336C16.1708 13.18 17.3653 14.3654 17.1175 15.9958V15.9989L17.116 16.0019C16.9744 16.495 16.497 17.6753 15.129 17.9783C15.0602 17.9914 14.9778 17.9975 14.8757 17.9975C14.5606 17.9975 14.1085 17.9383 13.536 17.864C12.6732 17.7512 11.6001 17.6116 10.4835 17.6116H10.3328C9.22574 17.6116 8.15918 17.7517 7.30198 17.8645C6.74973 17.9373 6.27334 18 5.95423 18ZM4.36121 15.8562C4.59688 16.6416 5.11625 17.1605 5.82477 17.3173L5.83084 17.3188C5.87534 17.3279 5.90417 17.334 5.96081 17.334C6.11202 17.334 6.46299 17.2895 7.62564 17.1418L7.67318 17.1357C8.78728 16.9941 9.55749 16.9365 10.3328 16.9365H10.4835C11.2633 16.9365 12.0375 16.9936 13.1557 17.1347L13.2993 17.1529C14.4316 17.2955 14.7361 17.3335 14.8671 17.3335C14.9116 17.3335 14.9343 17.3289 14.9692 17.3223L14.9849 17.3193C15.6949 17.162 16.2178 16.6421 16.456 15.8547C16.5835 14.9191 16.189 14.1641 14.8954 12.8649C14.8403 12.8098 14.7012 12.6712 14.5904 12.561C14.5211 12.4922 14.463 12.434 14.4428 12.4138L14.4104 12.3789C14.2511 12.1918 14.0923 12.0052 13.8981 11.7766L13.3742 11.1591C12.9428 10.6514 12.6419 10.2994 12.3369 9.94538C11.9222 9.45837 11.5283 9.15595 11.1333 9.02042C11.0762 8.99968 11.018 8.9835 10.97 8.9744C10.8815 8.96024 10.7748 8.95265 10.6261 8.95012C10.5694 8.94911 10.5229 8.94911 10.4172 8.94911C10.2564 8.94911 10.1917 8.95012 10.1163 8.95366C10.0202 8.95821 9.94184 8.96681 9.86851 8.98097C9.80985 8.99159 9.75118 9.00778 9.68342 9.03256C9.3016 9.16354 8.92281 9.45584 8.49093 9.95196C8.33365 10.136 8.17586 10.3221 7.98217 10.5502L7.45774 11.1682C7.02636 11.6765 6.72394 12.0305 6.41393 12.389L6.3841 12.4214L6.27132 12.5337C6.15601 12.6485 5.98963 12.8133 5.92844 12.8755C4.63481 14.1742 4.23933 14.9272 4.36172 15.8568L4.36121 15.8562ZM4.14223 9.63032C2.96138 9.63032 2 8.66945 2 7.48808C2 6.30672 2.96087 5.34585 4.14223 5.34585C5.3236 5.34585 6.28447 6.30672 6.28447 7.48808C6.28447 8.66945 5.3236 9.63032 4.14223 9.63032ZM4.14223 6.02099C3.33308 6.02099 2.67514 6.67893 2.67514 7.48808C2.67514 8.29724 3.33308 8.95518 4.14223 8.95518C4.95139 8.95518 5.60933 8.29724 5.60933 7.48808C5.60933 6.67893 4.95139 6.02099 4.14223 6.02099ZM16.6912 9.62981C15.5098 9.62981 14.549 8.66894 14.549 7.48758C14.549 6.30621 15.5098 5.34534 16.6912 5.34534C17.8726 5.34534 18.8334 6.30621 18.8334 7.48758C18.8334 8.66894 17.8726 9.62981 16.6912 9.62981ZM16.6912 6.02048C15.882 6.02048 15.2241 6.67842 15.2241 7.48758C15.2241 8.29673 15.882 8.95468 16.6912 8.95468C17.5003 8.95468 18.1583 8.29673 18.1583 7.48758C18.1583 6.67842 17.5003 6.02048 16.6912 6.02048ZM12.9266 6.28346C11.7457 6.28346 10.7849 5.32259 10.7849 4.14122C10.7849 2.95986 11.7452 2 12.9261 2C14.107 2 15.0683 2.96087 15.0683 4.14223C15.0683 5.3236 14.1075 6.28447 12.9261 6.28447L12.9266 6.28346ZM12.9266 2.67413C12.1175 2.67413 11.4595 3.33207 11.4595 4.14122C11.4595 4.95038 12.1175 5.60832 12.9266 5.60832C13.7358 5.60832 14.3937 4.94987 14.3937 4.14122C14.3937 3.33257 13.7358 2.67413 12.9266 2.67413ZM7.90733 6.28346C6.72647 6.28346 5.76509 5.32259 5.76509 4.14122C5.76509 2.95986 6.72546 2 7.90682 2C9.08819 2 10.0485 2.96087 10.0485 4.14223C10.0485 5.3236 9.08768 6.28447 7.90682 6.28447L7.90733 6.28346ZM7.90733 2.67413C7.09817 2.67413 6.44023 3.33207 6.44023 4.14122C6.44023 4.95038 7.09817 5.60832 7.90733 5.60832C8.71648 5.60832 9.37442 4.94987 9.37442 4.14122C9.37442 3.33257 8.71648 2.67413 7.90733 2.67413Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_6518_23542">
          <rect
            width="16.8329"
            height="16"
            fill="white"
            transform="translate(2 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AdelcoMascotasDarkIcon;
