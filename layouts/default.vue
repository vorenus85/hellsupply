<template lang="pug">
  v-app
    v-navigation-drawer(
      permanent
      clipped
      fixed
      app
      elevation="2")
      v-list
        v-list-item(
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          nuxt
          exact)
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text="item.title")
        v-list-item(@click="logoutAction")
          v-list-item-action
            v-icon mdi-logout
          v-list-item-content
            v-list-item-title Kijelentkezés
    v-app-bar(:clipped-left="true" fixed app elevation="1")
      v-toolbar-title.py-2.pr-2.d-flex.align-center
        v-img.mr-2(src="/favicon.ico" width="32")
        span {{title}}
    v-content
      v-container(fluid)
        nuxt
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { names } from '@/store'
export default {
  data() {
    return {
      items: [
        {
          icon: 'mdi-home',
          title: 'Rendelés',
          to: '/'
        }
      ],
      title: 'Hell Supply'
    }
  },
  computed: {
    ...mapState(['loggedIn'])
  },
  watch: {
    loggedIn(v) {
      if (!v) this.$router.replace({ name: 'login' })
    }
  },
  mounted() {
    if (!this.loggedIn) this.$router.replace({ name: 'login' })
  },
  methods: {
    ...mapActions([names.LOGOUT]),
    logoutAction() {
      this[names.LOGOUT]()
    }
  }
}
</script>
