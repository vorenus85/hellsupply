<template lang="pug">
  div Create account
    v-form(ref="form" @submit="tryLogin" v-model="valid")
      v-text-field(v-model="lastname" label="Lastname" :rules="[v => !!v || 'Lastname is required']" required type="text")
      v-text-field(v-model="firstname" label="Firstname" :rules="[v => !!v || 'Firstname is required']" required type="text")
      v-text-field(v-model="email" label="Email" :rules="emailRules" required type="email")
      v-text-field(v-model="password" label="Password" :rules="[v => !!v || 'Username is required']" type="password" required)
      v-btn(tile color="success" type="submit") register
      v-spacer
      br
      br
      v-btn(outlined :to="{ name: 'login' }" nuxt) Login
</template>

<script>
  export default {
    layout: 'centered',
    head: () => ({
      title: 'Register'
    }),
    data: () => ({
      valid: false,
      lastname: '',
      firstname: '',
      email: '',
      password: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    })
  }
</script>
