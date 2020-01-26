<template lang="pug">
  v-app
    v-navigation-drawer(
      permanent
      clipped
      app
      elevation="2")
      v-list
        v-list-group(v-for="item in items" :key="item.title" v-model="item.active" :prepend-icon="item.action" no-action)
          template(v-slot:activator)
            v-list-item-content
              v-list-item-title(v-text="item.title")
          v-list-item(v-for="subItem in item.items" :key="subItem.title" :to="subItem.to" nuxt exact)
            v-list-item-content
              v-list-item-title(v-text="subItem.title")
      v-list
        v-list-item(@click="logoutAction")
          v-list-item-action
            v-icon mdi-logout
          v-list-item-content
            v-list-item-title Logout
    v-app-bar(:clipped-left="true" fixed app elevation="1")
      v-toolbar-title.py-2.pr-2.d-flex.align-center
        v-img.mr-2(src="/favicon.ico" width="32")
        span {{title}}
      div(style="margin-left: auto") Hi, {{loggedInName}}
    v-content
      v-container(fluid)
        nuxt
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { names } from '@/store'
export default {
  // TODO arminRole
  data() {
    return {
      items: [
        {
          action: 'mdi-home',
          title: 'Order',
          active: true,
          items: [
            {
              title: 'Make Order',
              to: '/'
            },
            {
              title: 'My Previous Orders',
              to: '/orders/myPreviousOrders'
            }
          ]
        },
        {
          action: 'mdi-account-badge-horizontal',
          title: 'Administrations',
          items: [
            {
              title: 'Inactive Users',
              to: '/users/inactiveUsers'
            },
            {
              title: 'Active Users',
              to: '/users/activeUsers'
            },
            {
              title: 'Products',
              to: '/products'
            },
            {
              title: 'Order Periods',
              to: '/orders'
            }
          ]
        }
      ],
      title: 'Hell Supply'
    }
  },
  computed: {
    ...mapState(['loggedIn']),
    loggedInName() {
      return this.$store.state.user.name
    }
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
<style>
.base-title h1 {
  font-size: 2.5rem;
  font-weight: 300;
}
.base-title {
  padding: 1rem 16px;
  background-color: #fff;
  height: initial;
}
.base-bg {
  padding: 1rem 16px;
  background-color: #fff;
}
</style>
