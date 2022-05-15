export default {
  baseUrl: 'https://yaroshenko.tools',
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      file: 'en.js',
    },
    {
      code: 'ru',
      iso: 'ru-RU',
      file: 'ru.js',
    },
  ],
  defaultLocale: 'ru',
  vueI18n: {
    fallbackLocale: 'ru',
  },
  lazy: true,
  langDir: '~/locales/',
}
