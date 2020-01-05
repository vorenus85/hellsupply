<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-simple-table
      thead
        tr
          th(v-for="orderTitle in orderTable" :key="orderTitle") {{orderTitle}}
      tbody
        tr(v-for="order in orders" :key="order.datetime")
          td {{order.datetime}}
          td {{order.price}}
          td
            v-btn(color="primary" class="mx-2" outlined title="Megnéz")
              v-icon mdi-square-edit-outline
            v-btn(color="red" class="mx-2" outlined title="Törlés")
              v-icon mdi-delete
</template>
<script>
export default {
  head: () => ({
    title: 'Korábbi rendeléseim'
  }),
  data: () => ({
    pageTitle: 'Korábbi rendeléseim',
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
    ]
  })
}
</script>
