<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-simple-table
      thead
        tr
          th(v-for="usersTitle in usersTable" :key="usersTitle") {{usersTitle}}
      tbody
        tr(v-for="user in inactiveUsers" :key="user.id")
          td {{user.email}}
          td {{user.lastName}} {{user.firstName}}
          td
            v-btn(color="green" class="mx-2" outlined title="Engedélyezés" @click="activeUser(user._id)")
              v-icon mdi-check
            v-btn(color="red" class="mx-2" outlined title="Törlés" @click="deleteUser(user._id)")
              v-icon mdi-delete
</template>
<script>
export default {
  head: () => ({
    title: 'Inaktív regisztrálók'
  }),
  data: () => ({
    pageTitle: 'Inaktív regisztrálók',
    usersTable: ['E-mail cím', 'Név', 'Műveletek'],
    inactiveUsers: null
  }),
  async asyncData({ $axios }) {
    const { data: response } = await $axios.get('/users/listInactiveUsers')
    return {
      inactiveUsers: response
    }
  },
  methods: {
    async activeUser(userId) {
      try {
        await this.$axios.put(`/users/doActiveUser/${userId}`)
        this.inactiveUsers = this.inactiveUsers.filter(
          (user) => user._id !== userId
        )
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    async deleteUser(userId) {
      try {
        await this.$axios.delete(`/users/${userId}`)
        this.activeUsers = this.activeUsers.filter(
          (user) => user._id !== userId
        )
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    }
  }
}
</script>
