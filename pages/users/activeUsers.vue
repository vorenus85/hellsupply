<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
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
</template>
<script>
export default {
  head: () => ({
    title: 'Aktív felhasználók'
  }),
  data: () => ({
    pageTitle: 'Aktív felhasználók',
    usersTable: ['E-mail cím', 'Műveletek'],
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
