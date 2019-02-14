<template>
  <div>
    <h3 class="title">Please Log in</h3>
    <form class="login-form">
      <v-text-field
        v-model="username"
        label="Username"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        :type="'password'"
        required
      ></v-text-field>
      <v-btn @click="onLogin">Login</v-btn>
    </form>
    <v-btn flat small @click="toNext('/register')">
      No Account? Sign Up
    </v-btn>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'login-form',
  props: ['next'],
  data () {
    return {
      username: '',
      password: ''
    }
  },
  validations: {
    username: { required },
    password: { required }
  },
  methods: {
    onLogin() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log("Error")
        return
      }
      this.$axios.defaults.auth = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('login').then(() => {
        let currentPath = this.$route.path
        let nextUrl = this.next === 'current' && currentPath !== '/login'
                      ? this.$route.fullPath
                      : this.$route.query.redirect || '/'
        this.$router.push(nextUrl)
        this.$emit('close')
      })
    },
    toNext (next) {
      this.$router.push(next)
      this.$emit('close')
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-form
  padding 20px
  border 1px dotted #689f38
.title
  text-align center
  margin-bottom 20px
</style>