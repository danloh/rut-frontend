<template>
<div class="reset-page">
  <h3 class="title">Reset Password</h3>
  <el-form class="reset-form" :model="resetpswForm" :rules="rules" ref="resetpswForm" size="mini">
    <el-form-item label="New Password" prop="password">
      <el-input :type="pwdType" v-model="resetpswForm.password"></el-input>
    </el-form-item>
    <el-form-item label="Confirm Password" prop="repassword">
      <el-input :type="pwdType" v-model="resetpswForm.repassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="blockbtn" type="primary" @click="onReset('resetpswForm', resetpswForm)">Reset</el-button>
      <br>
      <!-- <el-button @click="resetForm('resetpswForm')">Reset</el-button> -->
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { reset } from '@/api/api'

export default {
  name: 'resetpsw',
  title: 'Reset Password',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.resetpswForm.repassword !== '') {
          this.$refs.resetpswForm.validateField('repassword')
        }
        callback()
      }
    }
    var validaterePass = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.resetpswForm.password) {
        callback(new Error('Two inputs do not match!'))
      } else {
        callback()
      }
    }
    return {
      resetpswForm: {
        password: '',
        repassword: ''
      },
      rules: {
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
    onReset (formName, form) {
      this.$store.commit('DEL_TOKEN')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {newpsw: form.password}
          let token = this.$route.params.token
          reset(token, data).then(resp => {
            this.$message({
              showClose: true,
              message: resp.data
            })
            this.$router.push('/login')
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="stylus" scoped>
.reset-page
  padding 10px 250px 10px 250px
  position relative
  .reset-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>