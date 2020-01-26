<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-simple-table
      thead
        tr
          th(v-for="orderTitle in orderTable" :key="orderTitle") {{orderTitle}}
      tbody
        tr(v-for="order in orders" :key="order._id")
          td {{order.timestamp | moment("YYYY. MM. Do hh:mm:ss") }}
          td
            v-chip(class="ma-2" small color="primary") {{order.orderTotal | currency }}
          td
            v-btn(color="primary" class="mx-2" outlined title="Inspect")
              v-icon mdi-square-edit-outline
            v-btn(color="red" class="mx-2" outlined title="Delete")
              v-icon mdi-delete
</template>
<script>
export default {
  head: () => ({
    title: 'My Previous Orders'
  }),
  data: () => ({
    pageTitle: 'My Previous Orders',
    orderTable: ['Date', 'Total', ''],
    orders: []
  }),
  computed: {
    loggedInEmail() {
      return this.$store.state.user.email
    }
  },
  mounted() {
    this.$axios
      .get('/orders', { user: { email: this.loggedInEmail } })
      .then((response) => (this.orders = response.data))
  }
}
</script>
