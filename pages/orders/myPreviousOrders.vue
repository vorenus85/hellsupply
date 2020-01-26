<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    div(class="row")
      div(class="col-md-2")
      div(class="col-md-8")
        v-simple-table
          thead
            tr
              th(v-for="orderTitle in orderTable" :key="orderTitle") {{orderTitle}}
          tbody
            tr(v-for="order in orders" :key="order._id")
              td {{order.timestamp | moment("YYYY. MM. DD HH:MM:SS") }}
              td
                v-chip(class="ma-2" small color="primary") {{order.orderTotal | currency }}
              td {{order.status}}
              td
                v-btn(color="primary" class="mx-2" outlined title="Inspect" :to="`/orders/${order.orderId}`")
                  v-icon mdi-card-search
                v-btn(color="red" class="mx-2" outlined title="Delete" v-if="order.status === 'RAW' ")
                  v-icon mdi-delete
      div(class="col-md-2")
</template>
<script>
export default {
  head: () => ({
    title: 'My Previous Orders'
  }),
  data: () => ({
    pageTitle: 'My Previous Orders',
    orderTable: ['Date', 'Total', 'Status', ''],
    orders: []
  }),
  computed: {
    loggedInEmail() {
      return this.$store.state.user.email
    }
  },
  mounted() {
    this.$axios
      .get(`/orders/byEmail/${this.loggedInEmail}`)
      .then((response) => (this.orders = response.data))
  }
}
</script>
