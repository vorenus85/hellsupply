<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-simple-table
      thead
        tr
          th(v-for="usersTitle in usersTable" :key="usersTitle") {{usersTitle}}
      tbody
        tr(v-for="user in activeUsers" :key="user._id")
          td {{user.email}}
          td {{user.name}}
          td
            v-btn(color="warning" class="mx-2" outlined title="Inactivate" @click="inactiveUser(user._id)")
              v-icon mdi-cancel
            v-btn(color="red" class="mx-2" outlined title="Delete" @click="deleteUser(user._id)")
              v-icon mdi-delete
</template>
<script>
export default {
  head: () => ({
    title: 'Active Users'
  }),
  data: () => ({
    pageTitle: 'Active Users',
    usersTable: ['E-mail address', 'Name', ''],
    activeUsers: null
  }),
  async asyncData({ $axios }) {
    const { data: response } = await $axios.get('/users/listActiveUsers')
    return {
      activeUsers: response
    }
  },
  methods: {
    async inactiveUser(userId) {
      try {
        await this.$axios.put(`/users/${userId}`, {
          active: false
        })
        this.activeUsers = this.activeUsers.filter(
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
