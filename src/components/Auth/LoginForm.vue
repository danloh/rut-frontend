<template>
  <div>
    <h3 class="title">Please Log in</h3>
    <v-form ref="form" class="login-form">
      <v-text-field
        v-model="username"
        label="Username"
        :rules="inRule"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        :type="'password'"
        :rules="inRule"
      ></v-text-field>
      <v-btn @click="onLogin">Login</v-btn>
    </v-form>
    <v-btn flat small @click="toNext('/register')">
      No Account? Sign Up
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'login-form',
  props: ['next'],
  data () {
    return {
      username: '',
      password: '',
      inRule: [ v => !!v || 'required' ]
    }
  },
  methods: {
    onLogin() {
      if (!this.$refs.form.validate()) {
        console.log("Error")
        return
      }
      // this.$axios.defaults.auth = {
      //   uname: this.username,
      //   password: this.password
      // }
      let data = {
        uname: this.username,
        password: this.password
      }
      this.$store.dispatch('login', data).then(() => {
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

<style scoped>
.login-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>