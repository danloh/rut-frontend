<template>
<div class="sign-page">
  <h3 class="title">Welcome to Join</h3>
  <el-form class="sign-form" :model="regForm" :rules="rules" ref="regForm">
    <el-form-item prop="username">
      <el-input v-model="regForm.username" placeholder="Username: a-z_0-9{3,20}"></el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="regForm.email" placeholder="Email"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input :type="pwdType" v-model="regForm.password" 
                placeholder="Password, at least 6 characters">
      </el-input>
    </el-form-item>
    <el-form-item prop="repassword">
      <el-input :type="pwdType" v-model="regForm.repassword" 
                placeholder="Confirm Password">
      </el-input>
    </el-form-item>
    <p style="font-size:0.75em">
      Notice: Will use email address for account confirmation and password resetting only, 
      will never send you any spams;
      Will Use Cookies to keep you logged in for a limited period, 
      Never collect any Private Information. 
      The service may not function properly if disable cookies.
    </p>
    <el-form-item>
      <el-button class="blockbtn" type="primary" 
                 @click="onReg('regForm', regForm)">
                 Sign Up
      </el-button>
    </el-form-item>
    <router-link :to="'/login'">Have an Account?  Login</router-link>
  </el-form>
</div>
</template>

<script>
import { checkName, checkEmail } from '@/api/api'

export default {
  name: 'register',
  title: 'Register',
  data () {
    var validateName = (rule, value, callback) => {
      let regName = /^[a-z][0-9a-z_]{2,19}$/
      if (regName.test(value.trim())) {
        this.validName().then(resp => { // call Promise here
          if (resp.data) {
            callback()
          } else {
            callback(new Error('Please Try again, The username has been used'))
          }
        })
      } else {
        callback(new Error('Please check Username'))
      }
    }
    var validateEmail = (rule, value, callback) => {
      let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value.trim())) {
        this.validEmail().then(resp => {
          if (resp.data) {
            callback()
          } else {
            callback(new Error('The Email has been registered, Please log in directly'))
          }
        })
      } else {
        callback(new Error('Please Input Email'))
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.regForm.repassword !== '') {
          this.$refs.regForm.validateField('repassword')
        }
        callback()
      }
    }
    var validaterePass = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.regForm.password) {
        callback(new Error('Two inputs do not match!'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        email: '',
        password: '',
        repassword: ''
      },
      rules: {
        username: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, message: 'At Least 6 characters', trigger: 'blur' }
        ],
        repassword: [
          { required: true, validator: validaterePass, trigger: 'blur' },
          { min: 6, message: 'At Least 6 characters', trigger: 'blur' }
        ]
      },
      pwdType: 'password'
    }
  },
  methods: {
    onReg (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let incode = this.$route.query.refcode
          let data = {
            username: form.username,
            email: form.email.trim(),
            password: form.password,
            incode: incode || ''
          }
          this.$store.dispatch('registerUser', data)
          .then(() => {
            this.$router.push('/challenge')
            this.$message({
              showClose: true,
              message: 'Welcome! A confirmation email has been sent to you by email.'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    validName () {
      let name = this.regForm.username
      return checkName(name) // return a Promise
    },
    validEmail () {
      let email = this.regForm.email
      return checkEmail(email)
    }
  }
}
</script>

<style lang="stylus" scoped>
.sign-page
  padding 10px 250px 10px 250px
  position relative
  .sign-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>