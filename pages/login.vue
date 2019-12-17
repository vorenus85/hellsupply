<template lang="pug">
  v-form(ref="login" @submit="tryLogin" v-model="valid")
    v-card(tile)
      v-card-title AWESOMENESS always starts with a form
      v-card-text
        v-progress-linear(v-if="loading" indeterminate color="yellow darken-2")
        .red--text(v-if="sent && error") Wrong username or password
        .red--text(v-if="invalid") Username and password are required
        v-text-field(v-model="username" label="Username" :rules="[v => !!v || 'Username is required']" type="text" required)
        v-text-field(v-model="password" label="Password" :rules="[v => !!v || 'Password is required']" type="password" required)
      v-card-actions
        v-btn(text tile :to="{ name: 'register' }" nuxt x-small) You don't have an account yet?!
        v-spacer
        v-btn.ml-2(tile color="success" type="submit") Login
</template>

<script>
import { mapActions } from 'vuex'
import { names as coreNames } from '../store'
export default {
  layout: 'centered',
  head: () => ({
    title: 'Login'
  }),
  data: () => ({
    valid: false,
    username: null,
    password: null,
    error: false,
    sent: false,
    invalid: false,
    loading: false
  }),
  methods: {
    ...mapActions([coreNames.LOGIN]),
    validate() {
      const valid = this.$refs.login.validate()
      this.invalid = !valid
      return valid
    },
    async tryLogin(e) {
      e.preventDefault()
      if (!this.valid) return
      const valid = this.validate()
      if (!valid) return
      this.loading = this.sent = true
      this.error = false
      const success = await this[coreNames.LOGIN]({
        username: this.username,
        password: this.password
      })
      if (success) this.$router.push({ name: 'index' })
      this.error = !success
      this.loading = false
    }
  }
}
</script>
