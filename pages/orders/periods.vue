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
            v-card-actions
              v-text-field(type="date" class="mx-3" v-model="newPeriodStart")
              v-text-field(type="date" class="mx-3" v-model="newPeriodEnd")
              v-btn(color="primary" class="mx-3" @click="addNewPeriod") Add new period
        div(class="col-md-12")
          v-card
            v-card-title All period
      div(class="col-md-6")
        v-card
          v-card-title Orders of current period
</template>
<script>
export default {
  head: () => ({
    title: 'Order periods'
  }),
  data: () => ({
    pageTitle: 'Order periods',
    newPeriodStart: '2020-01-01',
    newPeriodEnd: '2020-01-01',
    errorMessage: 'Unknow error',
    invalid: true
  }),
  methods: {
    addNewPeriod() {
      console.log(this.newPeriodStart)
      console.log(this.newPeriodEnd)
    }
  }
}
</script>
