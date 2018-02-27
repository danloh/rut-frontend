<template>
  <div>
    <h3 class="title">Please Log in</h3>
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="Username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input :type="pwdType" v-model="loginForm.password" 
                  placeholder="Password">
        </el-input>
      </el-form-item>
      <p style="font-size:0.75em">
        Notice: Just Use Cookies Here to keep you logged in for a limited period, 
        Never collect any Private Information. 
        The service may not function properly if disable cookies.
      </p>
      <el-form-item>
        <el-button class="blockbtn" type="primary" 
                    @click="onLogin('loginForm', loginForm)">
                    Log in
        </el-button>
      </el-form-item>
      <el-button type="text" @click="toNext('/register')">
        No Account? Sign Up
      </el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="text" @click="toNext('/forget')">
         Forget Password?
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login-form',
  props: ['next'],
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
            let nextUrl = this.next === 'current'
                          ? this.$route.fullPath
                          : this.$route.query.redirect || '/challenge'
            this.$router.push(nextUrl)
            this.$emit('close')
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