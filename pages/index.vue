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
    defaultProduct: {
      id: 2,
      image:
        'https://fw.photos/QKelCjjirgnk6PS0P3g624XgAuM=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-ic-guava-yuzu-250-ed-5dc28951e9c63.png',
      name: 'Ice Cool Guava-Yuzu',
      price: 3520
    },
    activeProducts: null
  }),
  async asyncData({ $axios }) {
    const { data: response } = await $axios.get('/products/activeProducts')
    return {
      activeProducts: response
    }
  }
}
</script>
