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
                    v-btn(color="primary" class="mx-2" outlined title="Inspect" @click="showPeriodOrders(period.periodStart, period.periodEnd)")
                      v-icon mdi-card-search
      div(class="col-md-6")
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
                td {{order.status}}
                td
                  v-btn(color="primary" class="mx-2" outlined title="Inspect" :to="`/orders/${order.orderId}`")
                    v-icon mdi-card-search
                  v-btn(color="red" class="mx-2" outlined title="Delete" v-if="order.status === 'RAW' ")
                    v-icon mdi-delete
        v-card(class="mt-3")
          v-card-title
            span Ordered products of period:
            v-chip(class="ma-2" small color="primary") {{ selectedPeriodStart | moment("YYYY. MM. DD.") }} - {{ selectedPeriodEnd | moment("YYYY. MM. DD.") }}
</template>
<script>
export default {
  head: () => ({
    title: 'Order periods'
  }),
  data: () => ({
    valid: false,
    orderTable: ['Date', 'E-mail', 'Total', 'Status', ''],
    pageTitle: 'Order periods',
    newPeriodStart: '2020-01-01',
    newPeriodStartRules: [(v) => !!v || 'Starting date is required'],
    newPeriodEnd: '2020-01-01',
    newPeriodEndRules: [(v) => !!v || 'Ending date is required'],
    errorMessage: 'Unknown error',
    invalid: false,
    ordersByPeriod: [],
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
    showPeriodOrders(periodStart, periodEnd) {
      this.selectedPeriodStart = periodStart
      this.selectedPeriodEnd = periodEnd
      try {
        this.$axios
          .get(`/orders/byPeriod/${periodStart}/${periodEnd}`)
          .then((response) => (this.ordersByPeriod = response.data))
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
        this.showPeriodOrders(this.selectedPeriodStart, this.selectedPeriodEnd)
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
