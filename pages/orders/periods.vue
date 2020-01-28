<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    div(class="row")
      div(class="col-md-6")
        div(class="col-md-12")
          v-card
            v-card-title Add new period
            v-card-text
              .red--text(v-if="invalid") {{errorMessage}}
            v-form(ref="form" @submit="addNewPeriod" v-model="valid" lazy-validation)
              v-card-actions
                v-text-field(type="date" class="mx-3" v-model="newPeriodStart" :rules="newPeriodStartRules" required)
                v-text-field(type="date" class="mx-3" v-model="newPeriodEnd" :rules="newPeriodEndRules" required)
                v-btn(color="primary" class="mx-3" type="submit") Add new period
      div(class="col-md-6")
        div(class="col-md-12")
          v-card
            v-card-title All periods
          div
            v-simple-table
              thead
                tr
                  th Start
                  th End
                  th Status
              tbody
                tr(v-for="period in periods" :key="period._id")
                  td {{ period.periodStart | moment("YYYY. MM. DD.") }}
                  td {{ period.periodEnd | moment("YYYY. MM. DD.") }}
                  td
                    //TODO DELETE periods
                    //TODO activate/deactivate periods
                    v-btn(color="primary" class="mx-2" outlined title="Inspect" @click="showOrdersByPeriod(period.periodStart, period.periodEnd), showAggregatedOrderItemsByPeriod(period.periodStart, period.periodEnd)")
                      v-icon mdi-card-search
    div(class="row")
      div(class="col-md-12")
        v-card
          v-card-title
            span Orders of period:
            v-chip(class="ma-2" small color="primary") {{ selectedPeriodStart | moment("YYYY. MM. DD.") }} - {{ selectedPeriodEnd | moment("YYYY. MM. DD.") }}
        div
          v-simple-table
            thead
              tr
                th(v-for="orderTitle in orderTable" :key="orderTitle") {{orderTitle}}
            tbody
              tr(v-for="order in ordersByPeriod" :key="order._id")
                td {{order.timestamp | moment("YYYY. MM. DD HH:MM:SS") }}
                td {{order.email}}
                td
                  v-chip(class="ma-2" small color="primary") {{order.orderTotal | currency }}
                td
                  v-select(class="mt-4" :items="orderStatuses" v-model="order.status" label="Solo field" solo) //TODO modify orderState
                td
                  v-btn(color="primary" class="mx-2" outlined title="Inspect" :to="`/orders/${order.orderId}`")
                    v-icon mdi-card-search
                  v-btn(color="red" class="mx-2" outlined title="Delete" v-if="order.status === 'RAW' " @click="deleteOrder(order)")
                    v-icon mdi-delete
      div(class="col-md-12")
        v-card(class="mt-3")
          v-card-title
            span Ordered products of period:
            v-chip(class="ma-2" small color="primary") {{ selectedPeriodStart | moment("YYYY. MM. DD.") }} - {{ selectedPeriodEnd | moment("YYYY. MM. DD.") }}
        div
          v-data-table(:headers="headers" :items="calculatedSumOrderItems" :search="search")
            template(v-slot:item.image="{ item }")
              v-img( :src="item.image" :alt="item.name" width="30px")
            template(v-slot:item.trayQty="{ item }")
              strong {{ item.trayQty }}
            template(v-slot:item.trayPrice="{ item }")
              v-chip(class="ma-2" small color="secondary") {{ item.trayPrice | currency }}
            template(v-slot:item.orderItemPrice="{ item }")
              v-chip(class="ma-2" small color="secondary") {{ item.orderItemPrice | currency }}
            template(v-slot:item.payedByCompany="{ item }")
              v-chip(class="ma-2" small color="error") {{ item.payedByCompany | currency }}
            template(v-slot:item.subTotal="{ item }")
              v-chip(class="ma-2" small color="primary") {{ item.subTotal | currency }}
</template>
<script>
export default {
  head: () => ({
    title: 'Order periods'
  }),
  data: () => ({
    valid: false,
    search: '',
    headers: [
      { text: 'Image', value: 'image' },
      { text: 'Name', value: 'name' },
      { text: 'Requested Tray', value: 'trayQty' },
      { text: 'Price / Tray', value: 'trayPrice' },
      { text: 'Price / Qty', value: 'orderItemPrice' },
      { text: 'plusQty', value: 'plusQty' },
      { text: 'Payed by company', value: 'payedByCompany' },
      { text: 'Ordered Qty by person', value: 'orderItemQuantity' },
      { text: 'Payed by person', value: 'subTotal' }
    ],
    orderTable: ['Date', 'E-mail', 'Total', 'Status', ''],
    orderStatuses: ['RAW', 'UNDER PROCESS', 'COMPLETED'],
    pageTitle: 'Order periods',
    newPeriodStart: '2020-01-01',
    newPeriodStartRules: [(v) => !!v || 'Starting date is required'],
    newPeriodEnd: '2020-01-01',
    newPeriodEndRules: [(v) => !!v || 'Ending date is required'],
    errorMessage: 'Unknown error',
    invalid: false,
    ordersByPeriod: [],
    calculatedSumOrderItems: [],
    aggregatedOrderItemsByPeriod: [],
    periods: [],
    selectedPeriodStart: 0,
    selectedPeriodEnd: 0,
    actualPeriod: 0
  }),
  mounted() {
    console.log('mounted')
    this.listPeriods()
    this.findOrderPeriod()
  },
  methods: {
    async showAggregatedOrderItemsByPeriod(periodStart, periodEnd) {
      try {
        await this.$axios
          .get(`/orderItems/aggregated/${periodStart}/${periodEnd}`)
          .then(
            (response) => (this.aggregatedOrderItemsByPeriod = response.data)
          )
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
      const calculatedSumOrderItems = this.aggregatedOrderItemsByPeriod
      let n
      for (n in calculatedSumOrderItems) {
        if (calculatedSumOrderItems[n].orderItemQuantity <= 24) {
          calculatedSumOrderItems[n].trayQty = 1
        } else {
          calculatedSumOrderItems[n].trayQty = Math.ceil(
            calculatedSumOrderItems[n].orderItemQuantity / 24
          )
        }
        calculatedSumOrderItems[n].plusQty =
          calculatedSumOrderItems[n].orderItemQuantity % 24
        calculatedSumOrderItems[n].payedByCompany =
          calculatedSumOrderItems[n].plusQty *
          calculatedSumOrderItems[n].orderItemPrice
        calculatedSumOrderItems[n].subTotal =
          calculatedSumOrderItems[n].orderItemPrice *
          calculatedSumOrderItems[n].orderItemQuantity
        calculatedSumOrderItems[n].trayPrice =
          calculatedSumOrderItems[n].orderItemPrice * 24
        console.dir(calculatedSumOrderItems[n])
      }
      this.calculatedSumOrderItems = calculatedSumOrderItems
    },
    async showOrdersByPeriod(periodStart, periodEnd) {
      this.selectedPeriodStart = periodStart
      this.selectedPeriodEnd = periodEnd
      try {
        await this.$axios
          .get(`/orders/byPeriod/${periodStart}/${periodEnd}`)
          .then((response) => (this.ordersByPeriod = response.data))
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    // TODO kiemelni
    async deleteOrder(order) {
      const orderId = order._id
      try {
        await this.$axios.delete(`/orders/${orderId}`)
        this.ordersByPeriod = this.ordersByPeriod.filter(
          (order) => order._id !== orderId
        )
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
      const orderItemOrderId = order.orderId
      try {
        await this.$axios.delete(`/orderItems/${orderItemOrderId}`)
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    async findOrderPeriod() {
      const currentTime = new Date().getTime()
      try {
        await this.$axios
          .get(`/periods/actual/${currentTime}`)
          .then((response) => (this.actualPeriod = response.data[0]))
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
      if (this.actualPeriod !== undefined) {
        this.selectedPeriodStart = this.actualPeriod.periodStart
        this.selectedPeriodEnd = this.actualPeriod.periodEnd
        this.showOrdersByPeriod(
          this.selectedPeriodStart,
          this.selectedPeriodEnd
        )
        this.showAggregatedOrderItemsByPeriod(
          this.selectedPeriodStart,
          this.selectedPeriodEnd
        )
      }
    },
    listPeriods() {
      try {
        this.$axios
          .get(`/periods`)
          .then((response) => (this.periods = response.data))
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    addNewPeriod(e) {
      e.preventDefault()
      // TODO date validate!
      if (!this.valid) {
        return false
      }
      const valid = this.$refs.form.validate()
      if (!valid) {
        return false
      }

      const periodStart = new Date(this.newPeriodStart).getTime()
      const periodEnd = new Date(this.newPeriodEnd).getTime()

      console.log(periodStart)
      console.log(periodEnd)
      try {
        this.$axios.post(`/periods`, {
          periodStart,
          periodEnd,
          status: true
        })
        this.listPeriods()
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    }
  }
}
</script>
