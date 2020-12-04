module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  },
  plugins: [],
  purge: {
    mode: 'all',
    content: [
      './public/index.html',
      './src/App.vue'
    ]
  },
  theme: {
    extend: {}
  },
  variants: {}
};
