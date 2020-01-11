<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-simple-table
      thead
        tr
          th(v-for="usersTitle in usersTable" :key="usersTitle") {{usersTitle}}
      tbody
        tr(v-for="user in activeUsers" :key="user.id")
          td {{user.email}}
          td {{user.lastName}} {{user.firstName}}
          td
            v-btn(color="warning" class="mx-2" outlined title="Inaktiválás" @click="inactiveUser(user._id)")
              v-icon mdi-cancel
            v-btn(color="red" class="mx-2" outlined title="Törlés" @click="deleteUser(user._id)")
              v-icon mdi-delete
</template>
<script>
import axios from 'axios'
export default {
  head: () => ({
    title: 'Aktív felhasználók'
  }),
  data: () => ({
    pageTitle: 'Aktív felhasználók',
    usersTable: ['E-mail cím', 'Név', 'Műveletek'],
    activeUsers: null
  }),
  async asyncData({ $axios }) {
    const { data: response } = await $axios.get('/users/activeUsers')
    return {
      activeUsers: response
    }
  },
  methods: {
    inactiveUser(userId) {
      console.log('inactiveUser: ' + userId)
    },
    deleteUser(userId) {
      axios({
        method: 'delete',
        url: `/users/deleteUser/${userId}`,
        data: null,
        headers: { 'Content-Type': 'application/json' }
      })
        .then((result) => {
          this.$router.push({
            path: '/users/activeUsers'
          })
        })
        .catch((e) => {
          this.errors.push(e)
        })
      console.log('deleteUser: ' + userId)
    }
  }
}
</script>
