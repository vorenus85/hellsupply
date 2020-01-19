import Vue from 'vue'
import VueCurrencyFilter from 'vue-currency-filter'

Vue.use(VueCurrencyFilter, {
  symbol: 'Ft',
  thousandsSeparator: ' ',
  fractionCount: 0,
  fractionSeparator: '.',
  symbolPosition: 'end',
  symbolSpacing: true
})
