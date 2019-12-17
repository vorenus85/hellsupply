<template lang="pug">
  div ITS DA REG
    br
    v-btn(outlined :to="{ name: 'login' }" nuxt) Login
</template>

<script>
export default {
  layout: 'centered',
  head: () => ({
    title: 'Register'
  })
}
</script>
