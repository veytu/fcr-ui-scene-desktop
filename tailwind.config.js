const { colorDepth, colorAlpha } = require('./webpack/utils/color-palette');

module.exports = {
  prefix: 'fcr-',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      // Fixed colors: not change along with theme
      brand: colorDepth('#4262FF'),
      red: colorDepth('#F5655C'),
      purple: colorDepth('#7C79FF'),
      pink: colorDepth('#EE4878'),
      white: '#ffffff',
      black: '#000000',
      green: '#16D1A4',
      yellow: '#FFC700',
      yellowwarm: '#FFB554',
      transparent: 'transparent',
      'custom-1': '#4262FF',
      'custom-2': '#7C79FF',
      'custom-3': '#64BB5C',
      'custom-4': '#C2CC55',
      // Theme colors: change along with theme
      'block-1': '#000000',
      'block-2': '#2F2F2FF2',
      'block-3': '#202020',
      'block-4': '#43434E',
      'block-5': '#4C5462',
      'block-6': '#8E8E93',
      'block-7': '#3B3E3C',
      'block-8': '#3D404B',
      'line-1': '#4A4C5F',
      'text-1': '#FFFFFF',
      'text-2': '#FFFFFFCC',
      'text-3': '#BDBEC6',
      // icon
      'icon-1': '#FFFFFF',
      'icon-2': '#FFFFFF',
      // hover
      hover: '#4262FF',
      // shadow
      'shadow-1': 'rgba(255, 255, 255, 0.1)',
      'shadow-2': 'rgba(255, 255, 255, 0.2)',
      'shadow-3': 'rgba(255, 255, 255, 0.3)',
      // outline
      'brand-a50': colorAlpha('#4262FF', 0.5),
      // button
      'btn-gray': colorDepth('#555B69'),
      //
      notsb: '#000000',
      'notsb-inverse': '#ffffff',
    },
    backgroundImage: (theme) => ({
      // progress
      'gradient-1': `linear-gradient(90deg, ${theme('colors.custom-1')} 0%, ${theme(
        'colors.custom-2',
      )} 100%)`,
      'gradient-2': `linear-gradient(90deg, ${theme('colors.custom-3')} 2.67%, ${theme(
        'colors.custom-4',
      )} 100%)`,
      // divider
      'gradient-3': `linear-gradient(${colorAlpha(theme('colors.notsb-inverse'), 0)} 0%, ${theme(
        'colors.notsb-inverse',
      )} 52.6%, ${colorAlpha(theme('colors.notsb-inverse'), 0)} 97.92%)`,
    }),
    backgroundColor: (theme) => ({
      1: theme('colors.block-1'),
      2: theme('colors.block-2'),
      3: theme('colors.block-3'),
      4: theme('colors.block-4'),
      5: theme('colors.block-5'),
      6: theme('colors.block-6'),
      7: theme('colors.block-7'),
      8: theme('colors.block-8'),
      brand: theme('colors.brand'),
      red: theme('colors.red'),
      yellowwarm: theme('colors.yellowwarm'),
      purple: theme('colors.purple'),
      notsb: theme('colors.notsb'),
      'notsb-inverse': theme('colors.notsb-inverse'),
      'btn-gray': theme('colors.btn-gray'),
      transparent: theme('colors.transparent'),
    }),
    borderColor: (theme) => ({
      1: theme('colors.line-1'),
      brand: theme('colors.brand'),
      red: theme('colors.red'),
      purple: theme('colors.purple'),

      'btn-gray': theme('colors.btn-gray'),

      'notsb-inverse': theme('colors.notsb-inverse'),
    }),
    textColor: (theme) => ({
      1: theme('colors.text-1'),
      2: theme('colors.text-2'),
      3: theme('colors.text-3'),
      brand: theme('colors.brand'),
      red: theme('colors.red'),
      notsb: theme('colors.notsb'),
      'notsb-inverse': theme('colors.notsb-inverse'),
    }),
    boxShadow: (theme) => ({
      1: `10px 2px 8px 5px ${theme('colors.shadow-1')}`,
      2: `0px 4px 50px ${theme('colors.shadow-2')}`,
      3: `0px 4px 50px -8px ${theme('colors.shadow-3')}`,
    }),
    borderRadius: {
      2: '2px',
      4: '4px',
      8: '8px',
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      24: '24px',
      50: '50px',
      full: '9999px',
      none: '0',
    },
    fontWeight: {
      title: 800,
      medium: 600,
      regular: 400,
    },
    fontFamily: {
      scenario: ['helvetica neue', 'arial', 'PingFangSC', 'microsoft yahei'],
    },
  },
  corePlugins: [
    'preflight',
    'fontWeight',
    'backgroundImage',
    'backgroundColor',
    'borderColor',
    'textColor',
    'boxShadow',
    'borderRadius',
    'fontFamily',
  ],
};
