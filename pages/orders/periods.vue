<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    div(class="row")
      div(class="col-lg-6")
        div(class="col-md-12")
          v-card
            v-card-title Add new period
            v-card-text
              .red--text(v-if="addNewPeriodValid") {{errorMessage}}
            v-form(ref="form" @submit="addNewPeriod" v-model="valid" lazy-validation)
              v-card-actions
                v-text-field(type="date" class="mx-3" v-model="newPeriodStart" :rules="newPeriodStartRules" required)
                v-text-field(type="date" class="mx-3" v-model="newPeriodEnd" :rules="newPeriodEndRules" required)
                v-btn(color="primary" class="mx-3" type="submit") Add new period
      div(class="col-lg-6")
        div(class="col-md-12")
          v-card
            v-card-title All periods
          div
            v-simple-table
              thead
                tr
                  th Start
                  th End
                  th Actions
              tbody
                tr(v-for="period in periods" :key="period._id")
                  td {{ period.periodStart | moment("YYYY. MM. DD.") }}
                  td {{ period.periodEnd | moment("YYYY. MM. DD.") }}
                  td
                    v-row(class="align-center no-gutters")
                      v-switch(v-model="period.status" @change="modifyPeriodState(period)" color="success" inset title="Switch Status")
                      v-btn(color="primary" class="mx-2" outlined title="Inspect" @click="showOrdersByPeriod(period.periodStart, period.periodEnd), showAggregatedOrderItemsByPeriod(period.periodStart, period.periodEnd)")
                        v-icon mdi-card-search
                      v-btn(@click="deletePeriod(period)" outlined color="red" title="Delete")
                        v-icon mdi-delete
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
        div(class="row")
          div(class="col-md-3")
          div(class="col-md-6 row")
            v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
              v-card-title Sum Payed by Company
              v-card-text
                v-icon(class="mr-3" color="error") mdi-cash
                v-chip(class="ma-2" small color="error") {{ sumPayedByCompany | currency }}
            v-card(class="mx-auto mb-3 mt-3" max-width="344" min-width="200")
              v-card-title Sum Payed by Persons
              v-card-text
                v-icon(class="mr-3" color="primary") mdi-cash
                v-chip(class="ma-2" small color="primary") {{ sumPayedByPerson | currency }}
          div(class="col-md-3")
        div(class="row")
          div(class="col-md-12")
            v-btn(color="success" class="mx-2 mb-3")
              download-csv(:data="calculatedSumOrderItems" :name="fullListCsv" :delimiter="csvDelimiter") Export full list
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
              template(v-slot:item.payedByPerson="{ item }")
                v-chip(class="ma-2" small color="primary") {{ item.payedByPerson | currency }}
</template>
<script>
import Vue from 'vue'
import JsonCSV from 'vue-json-csv'
Vue.component('downloadCsv', JsonCSV)
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
      { text: 'Plus Qty', value: 'plusQty' },
      { text: 'Payed by Company', value: 'payedByCompany' },
      { text: 'Ordered Qty by Persons', value: 'orderItemQuantity' },
      { text: 'Payed by Persons', value: 'payedByPerson' }
    ],
    orderTable: ['Date', 'E-mail', 'Total', 'Status', ''],
    orderStatuses: ['RAW', 'UNDER PROCESS', 'COMPLETED'],
    pageTitle: 'Order periods',
    newPeriodStart: '2020-01-01',
    newPeriodStartRules: [(v) => !!v || 'Starting date is required'],
    newPeriodEnd: '2020-01-01',
    newPeriodEndRules: [(v) => !!v || 'Ending date is required'],
    errorMessage: 'Unknown error',
    addNewPeriodValid: false,
    ordersByPeriod: [],
    calculatedSumOrderItems: [],
    aggregatedOrderItemsByPeriod: [],
    periods: [],
    selectedPeriodStart: 0,
    selectedPeriodEnd: 0,
    actualPeriod: 0
  }),
  computed: {
    sumPayedByCompany() {
      let n
      let sumPayedByCompany = 0
      for (n in this.calculatedSumOrderItems) {
        sumPayedByCompany += this.calculatedSumOrderItems[n].payedByCompany
      }
      return sumPayedByCompany
    },
    fullListCsv() {
      let start = new Date(this.selectedPeriodStart)
      let end = new Date(this.selectedPeriodEnd)

      const startYear = start.getFullYear()
      const startMonth = start.getMonth() + 1
      const startDate = start.getDate()
      const endYear = end.getFullYear()
      const endMonth = end.getMonth() + 1
      const endDate = end.getDate()
      start = startYear + '-' + startMonth + '-' + startDate
      end = endYear + '-' + endMonth + '-' + endDate
      return 'hell_supply_' + start + '_' + end + '.csv'
    },
    csvDelimiter() {
      return ';'
    },
    sumPayedByPerson() {
      let n
      let sumPayedByPerson = 0
      for (n in this.calculatedSumOrderItems) {
        sumPayedByPerson += this.calculatedSumOrderItems[n].payedByPerson
      }
      return sumPayedByPerson
    }
  },
  mounted() {
    this.listPeriods()
    this.findOrderPeriod()
  },
  methods: {
    async modifyPeriodState(item) {
      const periodId = item._id
      try {
        await this.$axios.put(`/periods/${periodId}`, {
          status: item.status
        })
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    async deletePeriod(item) {
      const periodId = item._id
      try {
        await this.$axios.delete(`/periods/${periodId}`)
        this.periods = this.periods.filter((period) => period._id !== periodId)
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
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
        if (calculatedSumOrderItems[n].orderItemQuantity <= 24) {
          calculatedSumOrderItems[n].plusQty =
            24 - calculatedSumOrderItems[n].orderItemQuantity
        } else {
          calculatedSumOrderItems[n].plusQty =
            24 - (calculatedSumOrderItems[n].orderItemQuantity % 24)
        }
        calculatedSumOrderItems[n].payedByCompany =
          calculatedSumOrderItems[n].plusQty *
          calculatedSumOrderItems[n].orderItemPrice
        calculatedSumOrderItems[n].payedByPerson =
          calculatedSumOrderItems[n].orderItemPrice *
          calculatedSumOrderItems[n].orderItemQuantity
        calculatedSumOrderItems[n].trayPrice =
          calculatedSumOrderItems[n].orderItemPrice * 24
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
      this.showAggregatedOrderItemsByPeriod(
        this.selectedPeriodStart,
        this.selectedPeriodEnd
      )
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
      const periodStart = new Date(this.newPeriodStart).getTime()
      const periodEnd = new Date(this.newPeriodEnd).getTime()
      if (periodEnd <= periodStart) {
        this.addNewPeriodValid = true
        this.errorMessage = 'Start date must earlier than End date!'
        return false
      }
      if (!this.valid) {
        return false
      }
      const valid = this.$refs.form.validate()
      if (!valid) {
        return false
      }
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
