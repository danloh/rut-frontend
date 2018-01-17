<template>
  <div class="login-page">
    <h3 class="title">Please Log in</h3>
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="Username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input :type="pwdType" v-model="loginForm.password" placeholder="Password"></el-input>
      </el-form-item>
      <p style="font-size:0.75em">Notice: Just Use Cookies Here to keep you logged in for a limited period, 
        Never collect any Private Information. The service may not function properly if disable cookies.</p>
      <el-form-item>
        <el-button class="blockbtn" type="primary" @click="onLogin('loginForm', loginForm)">Log in</el-button>
      </el-form-item>
      <router-link :to="'/register'">No Account? Sign Up</router-link>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <router-link :to="'/forget'"> Forget Password?</router-link>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  title: 'Log in',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
        password: [{ required: true, message: 'Please enter password', trigger: 'blur' }]
      },
      pwdType: 'password'
    }
  },
  methods: {
    onLogin (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.defaults.auth = {
            username: form.username,
            password: form.password
          }
          this.$store.dispatch('loginUser').then(() => {
            let nextUrl = this.$route.query.redirect || '/challenge' // uncompletely tackled!!
            this.$router.push(nextUrl)
          }).catch(() => {
            // this.$router.go(0)
            this.$message({
              showClose: true,
              duration: 0,
              message: 'oops...Please Check Account or Password',
              type: 'error'
            })
          })
        } else {
          this.$message('error!! Please Check')
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-page
  padding 10px 250px 10px 250px
  position relative
  .login-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>