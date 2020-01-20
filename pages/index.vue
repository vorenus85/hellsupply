<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-form(ref="addProductToOrder" class="base-bg")
      v-row(class="justify-center align-center no-gutters")
        multiselect(
          v-model="defaultProduct",
          class="col col-md-6 mx-3",
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
        v-text-field(placeholder="Mennyiség (db)" type="number" class="col mx-3" required)
        v-btn(color="primary" class="mx-3" fab )
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
    pageTitle: 'Termékek hozzáadása',
    selectedProduct: null,
    defaultProduct: null,
    activeProducts: null
  }),
  async asyncData({ $axios }) {
    const activeProductsResponse = await $axios.get('/products/activeProducts')
    const defaultProductResponse = await $axios.get('/products/defaultProduct')
    return {
      activeProducts: activeProductsResponse.data,
      defaultProduct: defaultProductResponse.data
    }
  }
}
</script>
