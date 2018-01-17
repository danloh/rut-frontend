<template>
<div class="forget-page">
  <h3 class="title">Request to Reset password</h3>
  <el-form class="forget-form" :model="forgetForm" :rules="rules" ref="forgetForm" size="mini">
    <el-form-item label="Username" prop="username">
      <el-input v-model="forgetForm.username"></el-input>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="forgetForm.email"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="blockbtn" type="primary" @click="onReq('forgetForm', forgetForm)">Request Reset Password</el-button>
      <br>
      <!-- <el-button @click="resetForm('forgetForm')">Reset</el-button> -->
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { reqReset } from '@/api/api'

export default {
  name: 'forget',
  title: 'Request to Reset Password',
  data () {
    return {
      forgetForm: {
        username: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onReq (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            username: form.username,
            email: form.email
          }
          reqReset(data).then(resp => {
            this.$message({
              showClose: true,
              message: resp.data
            })
            this.$router.push('/')
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
.forget-page
  padding 10px 250px 10px 250px
  position relative
  .forget-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>