<template>
<div class="sign-page">
  <h3 class="title">Welcome to Join in</h3>
  <el-form class="sign-form" :model="regForm" :rules="rules" ref="regForm" size="mini">
    <el-form-item label="Username" prop="username">
      <el-input v-model="regForm.username"></el-input>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="regForm.email"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input :type="pwdType" v-model="regForm.password"></el-input>
    </el-form-item>
    <el-form-item label="Confirm Password" prop="repassword">
      <el-input :type="pwdType" v-model="regForm.repassword"></el-input>
    </el-form-item>
    <p style="font-size:0.75em">Notice: Will Use Cookies to keep you logged in for a limited period, 
      Never collect any Private Information. The service may not function properly if disable cookies.</p>
    <el-form-item>
      <el-button class="blockbtn" type="primary" @click="onReg('regForm', regForm)">Sign Up</el-button>
      <br>
      <el-button @click="resetForm('regForm')">Reset</el-button>
    </el-form-item>
    <router-link :to="'/login'">Have an Account? Login</router-link>
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
      if (value.trim() !== '') {
        this.validName().then(resp => { // call Promise here
          if (resp.data) {
            callback()
          } else {
            callback(new Error('Please Try again, The username has been used'))
          }
        })
      } else {
        callback(new Error('Please Input Username'))
      }
    }
    var validateEmail = (rule, value, callback) => {
      let regEmail = /^[a-zA-Z0-9_-]+([-_.][A-Za-z0-9]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+$/
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
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
          { required: true, validator: validaterePass, trigger: 'blur' }
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
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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