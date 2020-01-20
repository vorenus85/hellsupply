<template lang="pug">
  v-form(ref="form" @submit="tryRegister" v-model="valid" lazy-validation)
    v-card(tile)
      v-card-title Create account
      v-card-text
        v-text-field(v-model="name" :counter="5" :rules="nameRules" label="Name" required)
        v-text-field(v-model="email" :rules="emailRules" label="E-mail" required)
        v-text-field(v-model="password" :counter="6" :rules="passwordRules" label="Password" type="password" required)
      v-card-actions
        v-btn(text tile :to="{ name: 'login' }" nuxt x-small) Back to login
        v-spacer
        v-btn(tile color="success" type="submit") register
</template>

<script>
import { names as coreNames } from '../store'
export default {
  layout: 'centered',
  head: () => ({
    title: 'Register'
  }),
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length >= 5) || 'Name must be more than 5 characters'
    ],
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 6) || 'Name must be more than 6 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.valid = true
      }
    },
    async register() {
      try {
        await this.$axios.post(`/users/`, {
          firstname: this.lastname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          role: 'user',
          active: false
        })
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    async tryRegister(e) {
      e.preventDefault()
      if (!this.valid) return
      const valid = this.validate()
      if (!valid) return
      this.loading = this.sent = true
      this.error = false
      this.register()
      const success = await this[coreNames.LOGIN]({
        email: this.email,
        password: this.password
      })
      if (success) this.$router.push({ name: 'index' })
      this.error = !success
      this.loading = false
    }
  }
}
</script>
