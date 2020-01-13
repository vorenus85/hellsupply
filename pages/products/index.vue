<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-container(style="background: white;")
      v-row
        v-col
          v-simple-table
            thead
              tr
                th(v-for="tableTitle in tableTitles" :key="tableTitle") {{tableTitle}}
            tbody
              tr(v-for="product in products" :key="product._id")
                td
                  v-img(:src="product.image" :alt="product.name" style="width: 50px")
                td {{product.name}}
                td {{product.price}} Ft
                td
                  v-btn(color="primary" class="mx-2" outlined title="Szerkesztés" @click="editProduct(product._id)")
                    v-icon mdi-square-edit-outline
                  v-btn(color="red" class="mx-2" outlined title="Törlés" @click="deleteProduct(product._id)")
                    v-icon mdi-delete
        v-col
</template>
<script>
export default {
  head: () => ({
    title: 'Termékek'
  }),
  data: () => ({
    pageTitle: 'Termékek',
    tableTitles: ['Kép', 'Név', 'Ár', 'Műveletek'],
    products: null
  }),
  async asyncData({ $axios }) {
    const { data: response } = await $axios.get('/products')
    return {
      products: response
    }
  },
  method: {
    editProduct() {
      console.log('edit')
    },
    async deleteProduct(productId) {
      try {
        await this.$axios.delete(`/products/${productId}`)
        this.products = this.products.filter(
          (product) => product._id !== productId
        )
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    }
  }
}
</script>
