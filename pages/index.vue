<template lang="pug">
  v-layout(column justify-center align-center)
    v-tabs(v-model="tab" grow)
      v-tab(v-for="item in tabItems" :key="item") {{item}}
    v-tabs-items(v-model="tab" class="container")
      v-tab-item
        v-container(class="pl-0 pr-0")
          v-col(class="pl-0 pr-0")
            v-form(ref="addProductToOrder")
              v-row(class="justify-center align-center no-gutters")
                multiselect(
                  v-model="defaultProduct",
                  class="col col-md-6 mx-3",
                  :options="products",
                  :option-height="30",
                  :show-labels="false"
                )
                  template(slot="singleLabel", slot-scope="props")
                    img.option__image(:src="props.option.img", :alt="props.option.name")
                    span.option__desc
                      span.option__title.mx-2 {{ props.option.name }}
                      span.option__small {{ props.option.price }}
                  template(slot="option", slot-scope="props")
                    img.option__image(:src="props.option.img", :alt="props.option.name")
                    .option__desc
                      span.option__title.mx-2 {{ props.option.name }}
                      span.option__small {{ props.option.price }}
                v-text-field(placeholder="Mennyiség (db)" type="number" class="col mx-3" required)
                v-btn(color="primary" class="mx-3" fab )
                  v-icon(light) mdi-plus-circle-outline
      v-tab-item
        v-container
          v-col
            v-simple-table
              thead
                tr
                  th(v-for="orderTitle in orderTable" :key="orderTitle") {{orderTitle}}
              tbody
                tr(v-for="order in orders" :key="order.datetime")
                  td {{order.datetime}}
                  td {{order.price}}
                  td
                    v-btn(color="primary" class="mx-2" outlined)
                      v-icon mdi-square-edit-outline
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
  data: () => ({
    tab: null,
    selectedProduct: null,
    defaultProduct: {
      id: 2,
      img:
        'https://fw.photos/QKelCjjirgnk6PS0P3g624XgAuM=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-ic-guava-yuzu-250-ed-5dc28951e9c63.png',
      name: 'Ice Cool Guava-Yuzu',
      price: 3520
    },
    tabItems: ['Rendelés leadása', 'Korábbi rendeléseim'],
    orderTable: ['Dátum', 'Összeg', 'Megnéz'],
    orders: [
      {
        datetime: 1553885400,
        price: 159
      },
      {
        datetime: 1560365400,
        price: 250
      }
    ],
    products: [
      {
        id: 2,
        img:
          'https://fw.photos/QKelCjjirgnk6PS0P3g624XgAuM=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-ic-guava-yuzu-250-ed-5dc28951e9c63.png',
        name: 'Ice Cool Guava-Yuzu',
        price: 3520
      },
      {
        id: 3,
        img:
          'https://fw.photos/Ed9a2KlIXrMH1fuAHo76gJF-hJE=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-ic-cherry-grape-250-ed-5dc288853bb62.png',
        name: 'Ice Cool Cherry-Grape',
        price: 3850
      },
      {
        id: 4,
        img:
          'https://fw.photos/qQahGtSn2pUX-4tjOURbQw6bkC8=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fhell-classic-250-ed-02-5cb7358da4c00.png',
        name: 'Classic',
        price: 3960
      },
      {
        id: 5,
        img:
          'https://fw.photos/tmTf-7ysT13dUGK2dTdgHr_sjNU=/fit-in/450x296/https%3A%2F%2Fwww.hellenergystore.com%2Fuploads%2Ffiles%2Fbf34f881552fbc2bfee74519ab59793a-5cb5cb1a4024e.png',
        name: 'Zero',
        price: 3680
      }
    ]
  }),
  methods: {}
}
</script>
