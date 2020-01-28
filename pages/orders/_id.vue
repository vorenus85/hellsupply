<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
        v-chip(class="ma-2" small color="primary") {{orderId}}
    div(class="row")
      div(class="col-md-2")
      div(class="col-md-8 row")
        v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
          v-card-title Email
          v-card-text
            v-icon(class="mr-3" color="primary") mdi-account-card-details
            span {{orderSummary.email}}
        v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
          v-card-title Date
          v-card-text
            v-icon(class="mr-3" color="primary") mdi-calendar-clock
            span {{orderSummary.timestamp | moment("YYYY. MM. Do hh:mm:ss")}}
        v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
          v-card-title Status
          v-card-text
            v-icon(class="mr-3" color="primary") mdi-cart
            span {{orderSummary.status}}
        v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
          v-card-title Total
          v-card-text
            v-icon(class="mr-3" color="primary") mdi-cash
            span {{orderSummary.orderTotal | currency }}
        v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
          v-card-title Quantity
          v-card-text
            v-icon(class="mr-3" color="primary") mdi-bottle-wine
            span {{orderItemsQuantity }}
      div(class="col-md-2")
    div(class="row")
      div(class="col-md-2")
      div(class="col-md-8")
        v-simple-table
          thead
            tr
              th(v-for="orderTitle in orderTable" :key="orderTitle") {{orderTitle}}
          tbody
            tr(v-for="order in orderItems" :key="order._id")
              td
                v-img(:src="order.orderItemImage" width="30px")
              td {{ order.orderItemName }}
              td
                v-chip(class="ma-2" small color="primary") {{ order.orderItemPrice | currency }}
              td {{ order.orderItemQuantity }} QTY
              td
                v-chip(class="ma-2" small color="secondary") {{ (order.orderItemQuantity * order.orderItemPrice) | currency }}
      div(class="col-md-2")
</template>
<script>
export default {
  head: () => ({
    title: 'Order'
  }),
  data: () => ({
    pageTitle: 'Order No.: ',
    orderTable: ['Image', 'Name', 'Price', 'Quantity', 'Subtotal'],
    orderSummary: '',
    orderItems: []
  }),
  computed: {
    orderId() {
      return this.$route.params.id
    },
    orderItemsQuantity() {
      let quantity = 0
      let n
      for (n in this.orderItems) {
        let qty = this.orderItems[n].orderItemQuantity
        qty = parseInt(qty)
        console.log(qty)
        console.log(typeof qty)
        quantity += qty
      }
      console.log(quantity)
      return quantity
    }
  },
  mounted() {
    const orderId = this.orderId
    try {
      this.$axios
        .get(`/orders/${orderId}`)
        .then((response) => (this.orderSummary = response.data[0]))
    } catch (e) {
      console.error(e)
    }
    try {
      this.$axios
        .get(`/orderItems/${orderId}`)
        .then((response) => (this.orderItems = response.data))
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
