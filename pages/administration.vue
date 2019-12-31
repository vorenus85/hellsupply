<template lang="pug">
  v-layout(column justify-center align-center)
    v-tabs(v-model="tab" grow)
      v-tab(v-for="item in tabItems" :key="item") {{item}}
    v-tabs-items(v-model="tab" class="container")
      v-tab-item
        v-container
          v-col
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
      v-tab-item
        v-container
          v-col
            v-simple-table
              thead
                tr
                  th(v-for="usersTitle in usersTable" :key="usersTitle") {{usersTitle}}
              tbody
                tr(v-for="user in activeUsers" :key="user.id")
                  td {{user.email}}
                  td
                    v-btn(color="warning" class="mx-2" outlined title="Inaktiválás")
                      v-icon mdi-cancel
                    v-btn(color="red" class="mx-2" outlined title="Törlés")
                      v-icon mdi-delete
      v-tab-item
        v-container
          v-col
      v-tab-item
        v-container
          v-col
</template>
<script>
export default {
  head: () => ({
    title: 'Adminisztráció'
  }),
  data: () => ({
    tab: null,
    tabItems: [
      'Inaktív regisztrálók',
      'Aktív felhasználók',
      'Termékek hozzáadása',
      'Rendelési időszakok'
    ],
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
    ],
    activeUsers: [
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
  })
}
</script>
<style>
.v-tab a {
  text-decoration: none;
}
</style>
