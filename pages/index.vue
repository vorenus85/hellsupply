<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    div(v-if="orders.length" class="row")
      div(class="col-md-3")
      div(class="col-md-6")
        v-card(tile)
          v-simple-table
            thead
              tr
                th Kép
                th Név
                th Tálca
                th Részösszeg
                th
            tbody
              tr(v-for="order in orders" :key="order.id")
                td
                  v-img(:src="order.item.image" width="30px")
                td {{ order.item.name }}
                td {{ order.quantity }} db
                td {{ (order.quantity * order.item.price) | currency }}
                td
                  v-btn(color="red" class="mx-2" small outlined title="Törlés" @click="deleteFromCart")
                    v-icon mdi-delete
              tr
                td
                td
                td
                  strong Végösszeg:
                td
                td
      div(class="col-md-3")
    v-form(ref="form" class="base-bg" v-model="valid" lazy-validation)
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
        v-text-field(placeholder="Mennyiség (db)" type="number" class="col mx-3" v-model="quantity" :rules="quantityRules" required)
        v-btn(color="primary" class="mx-3" fab @click="addToCart")
          v-icon(light) mdi-plus-circle-outline
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
    title: 'Termékek hozzáadása'
  }),
  data: () => ({
    pageTitle: 'Rendelés',
    selectedProduct: null,
    activeProducts: null,
    orders: [],
    valid: false,
    quantity: '',
    quantityRules: [
      (v) => !!v || 'Quantity is required',
      (v) => (v && v.length >= 1) || 'Name must be more than 1 characters'
    ]
  }),
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
    validate() {
      if (this.$refs.form.validate()) {
        this.valid = true
      }
    },
    deleteFromCart() {
      console.log('deleteFromCart')
    },
    addToCart() {
      this.validate()
      const valid = this.valid
      if (valid) {
        console.log(typeof this.selectedProduct)
        console.log(this.selectedProduct.length)
        const orderItem = {
          item: this.selectedProduct,
          quantity: this.quantity
        }
        this.orders.push(orderItem)
        this.quantity = ''
        this.valid = false
      } else {
        return false
      }
    }
  }
}
</script>
