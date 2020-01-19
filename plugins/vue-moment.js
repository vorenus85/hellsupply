// plugins/vue-moment.js

// vue-moment 4.0.0
// nuxt 1.0.0
// nuxt-i18n 1.1.0

import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment'
import 'moment/locale/hu' // whatever you import here will be set as default, no need to import all locales you intend to use

Vue.use(VueMoment, { moment })
