<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
    v-simple-table
      thead
        tr
          th(v-for="usersTitle in usersTable" :key="usersTitle") {{usersTitle}}
      tbody
        tr(v-for="user in inactiveUsers" :key="user.id")
          td {{user.email}}
          td
            v-btn(color="green" class="mx-2" outlined title="Engedélyezés")
              v-icon mdi-check
            v-btn(color="red" class="mx-2" outlined title="Törlés")
              v-icon mdi-delete
    div {{fromMongoInactiveUsers}}
</template>
<script>
export default {
  head: () => ({
    title: 'Inaktív regisztrálók'
  }),
  data: () => ({
    pageTitle: 'Inaktív regisztrálók',
    usersTable: ['E-mail cím', 'Műveletek'],
    inactiveUsers: [
      {
        email: 'asd@asd.hu',
        id: 1
      },
      {
        email: 'hakapeszi@asd.com',
        id: 2
      },
      {
        email: 'hakapeszi@dfgdfg.com',
        id: 3
      }
    ]
  }),
  async asyncData({ req, res }) {
    const returnRes = await res
    console.log(returnRes)
    return {
      fromMongoInactiveUsers: returnRes
    }
  }
}
</script>
