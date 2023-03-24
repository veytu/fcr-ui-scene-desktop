import '@onlineclass/preflight.css';

const themes = {
  light: {
    iconPrimary: '#eee',
  },
  dark: {
    iconPrimary: '#fff',
  },
};

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
      ],
    },
  },
};

export const parameters = {};

export const argTypes = {
  theme: {
    control: 'select',
    options: ['dark', 'light'],
  },
};
export const args = {
  theme: 'dark',
};

export const decorators = [];
