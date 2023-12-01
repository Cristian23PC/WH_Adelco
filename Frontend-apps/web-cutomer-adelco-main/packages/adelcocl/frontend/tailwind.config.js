module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './frontastic/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],  
  theme: {
    screens: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1340px'
    },
    fontFamily: {
      sans: ['Manrope', 'sans-serif'],
      body: ['Manrope', 'sans-serif'],
      title: ['Poppins', 'sans-serif']
    },
    extend: {
      colors: {
        'corporative-01': '#FCE300',
        'corporative-01-hover': '#FCF297',
        'corporative-02': '#1D1D1B',
        'corporative-02-hover': '#999999',
        'corporative-03': '#424242',
        black: '#000000',
        nickel: '#666666',
        moon: '#999999',
        silver: '#CCCCCC',
        snow: '#F3F4F9',
        white: '#FFFFFF',
        failure: '#E74C3C',
        success: '#2ECC71',
        warning: '#F1C40F',
        system: '#2287FE',
        backdrop: 'rgba(44, 44, 44, 0.5)',
        'failure-dark': '#D11E00',
        'success-dark': '#03A648',
        'warning-dark': '#C09A01',
        'system-dark': '#004E9A',
        'failure-light': '#FADBD8',
        'success-light': '#D5F5E3',
        'warning-light': '#FCF3CF',
        'system-light': '#D3E7FF'
      },
      fontSize: {
        xxs: '.5rem',
        xl1: '1.375rem'
      },
      borderRadius: {
        sm: '3px',
        md: '5px',
        '2xl': '15px',
        '3xl': '20px',
        '4xl': '32px',
        '5xl': '50px'
      },
      boxShadow: {
        lg: ' 0px 4px 10px rgba(0, 0, 0, 0.13);',
        xl: '0px 13px 25px rgba(0, 0, 0, 0.13);',
        list: 'inset 0px -1px 0px #F4F4F4;'
      },
      dropShadow: {
        sm: '0 1px 1px rgba(204, 204, 204)',
        md: '0 4px 10px rgba(0, 0, 0, 0.13)'
      },
      spacing: {
        'btn-md-desktop': '54px',
        'btn-sm-desktop': '36px',
        'btn-xs-desktop': '24px',

        'btn-md-tablet': '54px',
        'btn-sm-tablet': '36px',
        'btn-xs-tablet': '24px',

        'btn-md-mobile': '32px',
        'btn-sm-mobile': '24px',
        'btn-xs-mobile': '20px',

        'icon-small': '16px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors'))
      });
    }
  ]
};
