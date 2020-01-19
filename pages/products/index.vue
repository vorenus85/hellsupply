<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="products"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Hell termékek</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" color="primary" dark class="mb-2"
                >Új termék</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.image" label="Kép" />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.name" label="Név" />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.price" label="Ár" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="close" color="blue darken-1" text>Mégse</v-btn>
                <v-btn @click="save" color="blue darken-1" text>Mentés</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.price="{ item }">
        <v-chip class="ma-2" small color="primary">
          {{ item.price | currency }}
        </v-chip>
      </template>
      <template v-slot:item.image="{ item }">
        <v-img :src="item.image" :alt="item.name" width="30px" />
      </template>
      <template v-slot:item.action="{ item }">
        <v-row class="align-center">
          <v-switch
            v-model="item.active"
            @change="modifyItemState(item)"
            color="success"
            inset
          />
          <v-btn @click="editItem(item)" outlined class="mr-2" color="primary">
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn @click="deleteItem(item._id)" outlined color="red">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  head: () => ({
    title: 'Termékek'
  }),
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Kép',
        align: 'left',
        sortable: false,
        value: 'image'
      },
      { text: 'Név', value: 'name' },
      { text: 'Ár', value: 'price' },
      { text: 'Műveletek', value: 'action', sortable: false }
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      image: '',
      name: 0,
      price: 0
    },
    defaultItem: {
      image: '',
      name: 0,
      price: 0
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Új termék' : 'Termék szerkesztése'
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  async asyncData({ $axios }) {
    const { data: response } = await $axios.get('/products')
    return {
      products: response
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async listItems() {
      try {
        const { data: response } = await this.$axios.get('/products')
        this.products = response
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    async deleteItem(productId) {
      try {
        await this.$axios.delete(`/products/${productId}`)
        this.products = this.products.filter(
          (product) => product._id !== productId
        )
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    modifyItemState(product) {
      const productId = product._id
      try {
        this.$axios.put(`/products/${productId}`, {
          active: product.active
        })
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.products[this.editedIndex], this.editedItem)
      } else {
        this.products.push(this.editedItem)
      }
      const productId = this.editedItem._id
      try {
        this.$axios.put(`/products/${productId}`, {
          name: this.editedItem.name,
          price: this.editedItem.price,
          image: this.editedItem.image,
          active: this.editedItem.active
        })
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
      this.close()
    }
  }
}
</script>
