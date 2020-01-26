import Vue from 'vue'
import VueCurrencyFilter from 'vue-currency-filter'

Vue.use(VueCurrencyFilter, {
  symbol: 'HUF',
  thousandsSeparator: ' ',
  fractionCount: 0,
  fractionSeparator: '.',
  symbolPosition: 'end',
  symbolSpacing: true
})
