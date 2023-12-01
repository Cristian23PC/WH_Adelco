import React, { type FC } from 'react';
import { ADELCO_BEBESTIBLES } from '../iconNames';
import type Props from './IconPropType';

const AdelcoBebestiblesIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ADELCO_BEBESTIBLES}`,
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
      <g clipPath="url(#clip0_6465_24231)">
        <path
          d="M10.077 13.8103C12.1734 13.8103 13.8728 12.1109 13.8728 10.0145C13.8728 7.91818 12.1734 6.21875 10.077 6.21875C7.98068 6.21875 6.28125 7.91818 6.28125 10.0145C6.28125 12.1109 7.98068 13.8103 10.077 13.8103Z"
          fill="#FCF297"
        />
        <path
          d="M15.8796 12.5267C15.7298 12.5267 15.6084 12.4047 15.6084 12.2554V10.2705H13.3952C13.2454 10.2705 13.1239 10.1485 13.1239 9.9992C13.1239 9.8499 13.2459 9.72793 13.3952 9.72793H15.6084V8.33361C15.6084 8.10586 15.5284 7.88318 15.3837 7.70705L14.5744 6.7242C14.4008 6.51265 14.3052 6.24593 14.3046 5.97263V5.82536H13.6872V5.97263C13.6872 6.24593 13.591 6.51315 13.4174 6.7242L12.7155 7.57648C12.6639 7.63924 12.5874 7.67517 12.5059 7.67517C12.4432 7.67517 12.382 7.65341 12.3334 7.61342C12.2772 7.56737 12.2428 7.50208 12.2357 7.43021C12.2286 7.35835 12.2504 7.28749 12.2964 7.23182L12.386 7.1225L12.9979 6.37954C13.092 6.26516 13.1436 6.12092 13.1436 5.97263V5.73831C13.1016 5.71148 13.0637 5.67909 13.0303 5.64215C12.9078 5.50449 12.8486 5.32128 12.8673 5.13857L12.8946 4.73065C12.928 4.37182 13.1983 4.10156 13.5237 4.10156H14.4661C14.7915 4.10156 15.0613 4.36879 15.0942 4.72357L15.123 5.14262C15.1407 5.32279 15.081 5.50499 14.9595 5.64113C14.9256 5.67859 14.8877 5.71098 14.8457 5.7378V5.97213C14.8457 6.11991 14.8978 6.26465 14.9914 6.37853L15.8012 7.36189C16.0254 7.63519 16.1494 7.97984 16.1494 8.33311V12.2549C16.1494 12.4047 16.0274 12.5262 15.8781 12.5262L15.8796 12.5267ZM14.5536 5.28281C14.5536 5.28281 14.5552 5.28129 14.5567 5.27876C14.5774 5.25346 14.5871 5.22157 14.583 5.19019C14.583 5.18868 14.5612 5.01154 14.5612 5.01154L14.5719 5.0252L14.5542 4.76709C14.5476 4.69826 14.5015 4.64411 14.4666 4.64411H13.5242C13.4883 4.64411 13.4433 4.69978 13.4362 4.77367L13.4088 5.18159C13.4038 5.21854 13.4129 5.25194 13.4341 5.27775C13.4362 5.28028 13.4387 5.2818 13.4417 5.28231H14.5542L14.5536 5.28281Z"
          fill="#1D1D1B"
        />
        <path
          d="M13.3416 17.9992C13.2702 17.9992 13.2004 17.9704 13.1498 17.9198C13.0987 17.8686 13.0703 17.8003 13.0703 17.7279C13.0703 17.5781 13.1918 17.4567 13.3416 17.4567H15.3032C15.4733 17.4567 15.6115 17.318 15.612 17.148V13.3785H14.499C14.3492 13.3785 14.2278 13.2565 14.2278 13.1072C14.2278 12.9579 14.3497 12.8359 14.499 12.8359H15.8832C15.9546 12.8359 16.0244 12.8648 16.0751 12.9154C16.1262 12.9665 16.1545 13.0348 16.1545 13.1072V17.148C16.1545 17.3752 16.0659 17.5888 15.905 17.7497C15.7441 17.9101 15.5305 17.9992 15.3032 17.9992H13.3416Z"
          fill="#1D1D1B"
        />
        <path
          d="M5.76226 18.001C5.61245 18.001 5.49099 17.8795 5.49099 17.7297C5.49099 17.5799 5.61296 17.4585 5.76226 17.4585H6.39337V13.4967C5.83918 13.4395 5.32549 13.2153 4.90593 12.8463C4.47473 12.4673 4.1822 11.9703 4.06023 11.409L4.05921 11.4039C4.02024 11.2207 4 11.0335 4 10.8472V9.77023C4 9.62042 4.12197 9.49896 4.27127 9.49896H9.05649C9.12887 9.49896 9.19719 9.5273 9.24831 9.57841C9.29942 9.62953 9.32777 9.69735 9.32777 9.77023V10.8467C9.32827 11.4282 9.13393 12.0011 8.77965 12.4622L8.66983 17.0166C8.6673 17.132 8.71133 17.2449 8.7918 17.3274C8.87227 17.4099 8.98412 17.4569 9.09951 17.4569H11.9934C12.1088 17.4569 12.2207 17.4099 12.3011 17.3274C12.3816 17.2449 12.4261 17.1315 12.4231 17.0166L12.2601 10.2713H11.6467C11.4504 10.2713 11.2813 10.417 11.251 10.6104L10.7762 14.1718C10.7611 14.2852 10.7955 14.3996 10.8709 14.4856C10.9463 14.5716 11.0551 14.6207 11.1695 14.6207H11.7444C11.8942 14.6207 12.0157 14.7427 12.0157 14.892C12.0157 15.0413 11.8937 15.1633 11.7444 15.1633H11.1695C10.8987 15.1633 10.6411 15.0464 10.463 14.8429C10.2848 14.6395 10.2028 14.3687 10.2382 14.1005L10.712 10.5476C10.7428 10.3209 10.8542 10.1134 11.0263 9.96305C11.1978 9.81223 11.4185 9.72923 11.6467 9.72873H12.247L12.2414 9.49491C12.2358 9.25501 12.1655 9.02018 12.0395 8.81622L11.1806 7.43253C11.048 7.21794 10.9711 6.97197 10.9584 6.72044L10.8112 3.72885C10.8081 3.66407 10.8279 3.6003 10.8678 3.54868L11.0551 3.30828C11.0986 3.2521 11.1184 3.17922 11.1087 3.10888L11.045 2.64225C11.0369 2.58607 10.9883 2.54305 10.9311 2.54305H10.1618C10.1051 2.54305 10.0561 2.58607 10.048 2.64225L9.98418 3.10888C9.97507 3.1772 9.99329 3.24805 10.0343 3.30322L10.2251 3.54868C10.2651 3.5998 10.2853 3.66407 10.2818 3.72885L10.1345 6.72044C10.1218 6.97197 10.0449 7.21845 9.91232 7.43253L9.05346 8.81622C9.00133 8.90023 8.95831 8.99083 8.92541 9.08496C8.90264 9.15278 8.85253 9.21048 8.78775 9.24185C8.75081 9.26007 8.70931 9.26969 8.66781 9.26969C8.63744 9.26969 8.60758 9.26463 8.57873 9.25451C8.51041 9.23072 8.45372 9.18011 8.42285 9.11482C8.39198 9.05004 8.38793 8.97362 8.41273 8.9058C8.45777 8.77523 8.5185 8.6487 8.59189 8.52976L9.45075 7.14607C9.53527 7.00993 9.58386 6.85355 9.59195 6.69362L9.73467 3.80224L9.60916 3.64079C9.47707 3.46973 9.41735 3.24907 9.44619 3.03498L9.50996 2.56836C9.53173 2.41096 9.60967 2.26672 9.72961 2.16246C9.84956 2.0582 10.0029 2.00051 10.1613 2H10.9306C11.0895 2 11.2429 2.0582 11.3628 2.16246C11.4828 2.26672 11.5607 2.41096 11.5825 2.56836L11.6462 3.03498C11.6705 3.21617 11.6316 3.40242 11.5389 3.5588H11.547L11.3583 3.80173L11.501 6.69311C11.5091 6.85304 11.5582 7.00943 11.6427 7.14607L12.501 8.52976C12.6787 8.81571 12.7769 9.14468 12.785 9.48175L12.9667 17.0035C12.9727 17.2636 12.872 17.5202 12.6903 17.7065C12.5081 17.8927 12.2546 17.9995 11.9944 17.9995H9.10052C8.83786 17.9995 8.58531 17.8927 8.40463 17.7065C8.22193 17.5202 8.12121 17.2641 8.1283 17.0035L8.22496 13.0037C7.84589 13.2791 7.40355 13.4481 6.93642 13.4957V17.4569H7.56703C7.71683 17.4569 7.8383 17.5789 7.8383 17.7282C7.8383 17.8775 7.71683 17.9995 7.56703 17.9995H5.76226V18.001ZM4.69033 11.6216C4.84216 12.0077 5.10027 12.3377 5.44088 12.5781C5.80072 12.8327 6.22382 12.9673 6.66515 12.9678C7.23148 12.9673 7.7639 12.7461 8.16423 12.3458C8.56456 11.9455 8.78522 11.413 8.78623 10.8467V10.0415H4.54305V10.8472C4.54305 10.9241 4.54761 11.0021 4.55621 11.0795H6.20004C6.34984 11.0795 6.47131 11.2015 6.47131 11.3508C6.47131 11.5001 6.34934 11.6221 6.20004 11.6221H4.69033V11.6216Z"
          fill="#1D1D1B"
        />
      </g>
      <defs>
        <clipPath id="clip0_6465_24231">
          <rect
            width="12.1506"
            height="16"
            fill="white"
            transform="translate(4 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AdelcoBebestiblesIcon;
