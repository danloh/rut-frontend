<template>
<div class="sign-page">
  <h3 class="title">Welcome to Join</h3>
  <form class="sign-form">
    <v-text-field
      v-model="username"
      label="Username"
      counter
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      :type="'password'"
    ></v-text-field>
    <v-text-field
      v-model="repassword"
      label="Confirm Password"
      :type="'password'"
    ></v-text-field>
    <v-btn @click="onReg">Register</v-btn>
  </form>
  <router-link :to="'/login'">Have an Account? Login</router-link>
</div>
</template>

<script>
import { checkName, checkEmail } from '../../api'
import { regName, regEmail, regPsw } from '../../util/constant'
import { required, email, maxLength, between, sameAs} from 'vuelidate/lib/validators'

export default {
  name: 'register',
  title: 'Register',
  data () {
    return {
      username: '',
      password: '',
      repassword: ''
    }
  },
  validations: {
    username: { required, maxLength: maxLength(12) }
    // password: { between: between(7, 16) },
    // repassword: { sameAsPassword: sameAs('password') }
  },
  methods: {
    onReg() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log("Invalid")
        return
      }
      let data = {
        uname: this.username,
        password: this.password,
        confirm_password: this.repassword
      }
      this.$store.dispatch('register', data)
      .then(() => { this.$router.push('/')})
    },
  }
}
</script>

<style lang="stylus" scoped>
.sign-page
  padding 10px 210px 10px 210px
  position relative
  .sign-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>