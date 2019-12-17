<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12)
      v-card
        v-card-title(class="headline") Rendelés
        v-card-text
          p Ez a rendelés menüpont
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="logoutAction") Logout
</template>

<script>
import { mapActions } from 'vuex'
import { names } from '@/store/index'
export default {
  methods: {
    ...mapActions([names.LOGOUT]),
    logoutAction() {
      this[names.LOGOUT]()
    }
  }
}
</script>
