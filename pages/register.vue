<template lang="pug">
  v-form(ref="form" @submit="tryRegister" v-model="valid" lazy-validation)
    v-card(tile)
      v-card-title Create account to login HELLSupply
      v-card-text
        v-progress-linear(v-if="loading" indeterminate color="yellow darken-2")
        v-text-field(v-model="name" :rules="nameRules" label="Name" required)
        v-text-field(v-model="email" :rules="emailRules" label="E-mail" required)
        v-text-field(v-model="password" :rules="passwordRules" label="Password" type="password" required)
      v-card-actions
        v-btn(text tile :to="{ name: 'login' }" nuxt x-small) Back to login
        v-spacer
        v-btn(tile color="success" type="submit") register
    v-snackbar(v-model="snackbar" :color="snackbarColor" :timeout="6000") {{snackbarText}}
      v-btn(color="white" text @click="snackbar = false") Close
</template>

<script>
export default {
  layout: 'centered',
  head: () => ({
    title: 'Register'
  }),
  data: () => ({
    valid: false,
    loading: false,
    snackbar: false,
    snackbarColor: 'info',
    snackbarText: '',
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length >= 6 || 'Name at least 6 or more characters'
    ],
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) =>
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) ||
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail must be valid!'
    ]
  }),
  methods: {
    async register() {
      try {
        const { data: result } = await this.$axios.post(`/users/`, {
          name: this.name,
          email: this.email,
          password: this.password,
          role: 'user',
          active: false
        })
        if (result.success) {
          this.snackbarColor = 'success'
        } else {
          this.snackbarColor = 'error'
        }
        this.snackbarText = result.message
        this.snackbar = true
        this.loading = false
        console.log(result)
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    },
    async tryRegister(e) {
      e.preventDefault()
      this.loading = true
      if (!this.valid) {
        return false
      }
      const valid = this.$refs.form.validate()
      if (!valid) {
        this.loading = false
        return false
      }
      try {
        await this.register()
      } catch (e) {
        this.errors.push(e)
        console.error(e)
      }
    }
  }
}
</script>
