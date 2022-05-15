export default {
  __dangerouslyDisableSanitizers: ['script'],
  htmlAttrs: {
    lang: 'rut',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: '' },
    { name: 'format-detection', content: 'telephone=no' },
    { rel: 'msapplication-TileColor', content: '#da532c' },
    { rel: 'theme-color', content: '#ffffff' },
  ],

  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicons/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/favicons/site.webmanifest' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicons/apple-touch-icon.png',
    },
  ],
  script: [
    {
      hid: 'yandex-metrika',
      innerHTML: `
      ;(function (m, e, t, r, i, k, a) {
        m[i] =
          m[i] ||
          function () {
            ;(m[i].a = m[i].a || []).push(arguments)
          }
        m[i].l = 1 * new Date()
        ;(k = e.createElement(t)),
          (a = e.getElementsByTagName(t)[0]),
          (k.async = 1),
          (k.src = r),
          a.parentNode.insertBefore(k, a)
      })(
        window,
        document,
        'script',
        'https://mc.yandex.ru/metrika/tag.js',
        'ym'
      )

      ym(83422171, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      })
        `,
      type: 'text/javascript',
    },
    {
      hid: 'gtm',
      innerHTML: `
        ;(function (w, d, s, l, i) {
          w[l] = w[l] || []
          w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js',
          })
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l !== 'dataLayer' ? '&l=' + l : ''
          j.async = true
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
          f.parentNode.insertBefore(j, f)
        })(window, document, 'script', 'dataLayer', 'GTM-TJBKTWH')
        `,
      type: 'text/javascript',
    },
  ],
}
