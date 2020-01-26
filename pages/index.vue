<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    div(v-if="orders.length" class="row")
      div(class="col-md-3")
      div(class="col-md-6")
        v-card(tile)
          v-card-title Cart
          v-simple-table
            thead
              tr
                th Image
                th Name
                th Quantity
                th Subtotal
                th
            tbody
              tr(v-for="(order, index) in orders" :key="order.id")
                td
                  v-img(:src="order.item.image" width="30px")
                td {{ order.item.name }}
                td {{ order.quantity }} QTY
                td {{ (order.quantity * order.item.price) | currency }}
                td
                  v-btn(color="red" class="mx-2" small outlined title="Delete" @click="deleteFromCart(index)")
                    v-icon mdi-delete
              tr
                td(colspan="2")
                td
                  strong Total:
                td
                  strong  {{ orderTotal | currency }}
                td
                  v-btn(color="success" class="mx-2" @click="submitOrder") Checkout
      div(class="col-md-3")
    div(class="row")
      div(class="col-md-2")
      div(class="col-md-8")
        v-form(ref="form" @submit="addToCart" v-model="valid" lazy-validation)
          v-row(class="justify-center align-center no-gutters")
            multiselect(
              v-model="selectedProduct",
              class="col col-lg-6 col-12 mt-5 mb-5",
              :options="activeProducts",
              :option-height="30",
              :show-labels="false"
            )
              template(slot="singleLabel", slot-scope="props")
                img.option__image(:src="props.option.image", :alt="props.option.name")
                span.option__desc
                  span.option__title.mx-2 {{ props.option.name }}
                  span.option__small
                    v-chip(class="ma-2" small color="primary") {{ props.option.price | currency }}
              template(slot="option", slot-scope="props")
                img.option__image(:src="props.option.image", :alt="props.option.name")
                .option__desc
                  span.option__title.mx-2 {{ props.option.name }}
                  span.option__small
                    v-chip(class="ma-2" small color="primary") {{ props.option.price | currency }}
            v-text-field(placeholder="Quantity (qty)" type="number" class="col mx-3" min="1" v-model="quantity" :rules="quantityRules" required)
            v-btn(color="primary" class="mx-3" fab type="submit")
              v-icon(light) mdi-plus-circle-outline
      div(class="col-md-2")
</template>
<style lang="scss">
.option__image {
  max-height: 50px;
}
.multiselect__option,
.multiselect__single {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.v-application ul,
.v-application ol {
  &.multiselect__content {
    padding: 0;
    margin: 0;
  }
}
</style>
<script>
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
// register locally
Vue.component('multiselect', Multiselect)
export default {
  head: () => ({
    title: 'Add to cart'
  }),
  data: () => ({
    pageTitle: 'Make Order',
    selectedProduct: null,
    activeProducts: null,
    orders: [],
    valid: false,
    quantity: '',
    quantityRules: [(v) => !!v || 'Quantity is required']
  }),
  computed: {
    orderTotal() {
      let orderTotal = 0
      let n
      for (n in this.orders) {
        const orderItemPrice = this.orders[n].item.price
        const orderItemQuantity = this.orders[n].quantity
        const orderItemSubTotal = orderItemPrice * orderItemQuantity
        orderTotal += orderItemSubTotal
      }
      return orderTotal
    }
  },
  async asyncData({ $axios }) {
    const activeProductsResponse = await $axios.get('/products/activeProducts')
    const selectedProductResponse = await $axios.get(
      '/products/selectedProduct'
    )
    return {
      activeProducts: activeProductsResponse.data,
      selectedProduct: selectedProductResponse.data[0]
    }
  },
  methods: {
    deleteFromCart(index) {
      this.orders.splice(index, 1)
    },
    makeOrderId(length) {
      let result = ''
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      return result
    },
    submitOrder() {
      const orderId = this.makeOrderId(15)
      const orderTimestamp = new Date().getTime()
      try {
        this.$axios.post(`/orders/`, {
          orderId,
          email: this.$store.state.user.email,
          orderTotal: this.orderTotal,
          status: 'RAW', // TODO STATUS TYPES:  'RAW', 'UNDER PROCESS', 'COMPLETED'
          timestamp: orderTimestamp
        })
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }

      const orderItems = []

      let n, orderItem
      for (n in this.orders) {
        const orderItemId = this.orders[n].item._id
        const orderItemName = this.orders[n].item.name
        const orderItemPrice = this.orders[n].item.price
        const orderItemImage = this.orders[n].item.image
        const orderItemQuantity = this.orders[n].quantity

        orderItem = {
          orderItemId,
          orderItemName,
          orderItemPrice,
          orderItemImage,
          orderItemQuantity,
          orderId
        }

        orderItems.push(orderItem)
      }

      try {
        this.$axios.post(`/orderItems/`, orderItems)
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
      console.dir(orderItems)
      this.orders = []
      // TODO snackbar for checkout verification!
    },
    async addToCart(e) {
      e.preventDefault()
      if (!this.valid) {
        return false
      }
      const valid = this.$refs.form.validate()
      if (!valid) {
        return false
      }
      try {
        const orderItem = {
          item: this.selectedProduct,
          quantity: this.quantity
        }
        await this.orders.push(orderItem)
        this.quantity = 0
        this.valid = false
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
