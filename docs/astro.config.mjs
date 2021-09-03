export default {
  renderers: ['@astrojs/renderer-vue'],
  buildOptions: {
    site: 'https://bang.benbrown.dev',
    // sitemap: true,      // Generate sitemap (set to "false" to disable)
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js',
  },
}
