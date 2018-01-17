<template>
<div class="change-page">
  <h3 class="title">Change Password</h3>
  <el-form class="change-form" :model="changepswForm" :rules="rules" ref="changepswForm" size="mini">
    <el-form-item label="Current Password" prop="password">
      <el-input :type="pwdType" v-model="changepswForm.password"></el-input>
    </el-form-item>
    <el-form-item label="New Password" prop="newpassword">
      <el-input :type="pwdType" v-model="changepswForm.newpassword"></el-input>
    </el-form-item>
    <el-form-item label="Confirm New Password" prop="repassword">
      <el-input :type="pwdType" v-model="changepswForm.repassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="blockbtn" type="primary" @click="onChange('changepswForm', changepswForm)" :disabled="!canChange">Change Password</el-button>
      <br>
      <!-- <el-button @click="resetForm('changepswForm')">Reset</el-button> -->
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { checkAuth } from '@/util/auth'
import { change } from '@/api/api'

export default {
  name: 'changepsw',
  title: 'Change Password',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the new password'))
      } else {
        if (this.changepswForm.repassword !== '') {
          this.$refs.changepswForm.validateField('repassword')
        }
        callback()
      }
    }
    var validaterePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the new password again'))
      } else if (value !== this.changepswForm.newpassword) {
        callback(new Error('Two inputs do not match!'))
      } else {
        callback()
      }
    }
    return {
      changepswForm: {
        password: '',
        newpassword: '',
        repassword: ''
      },
      rules: {
        password: [
          { required: true, message: 'Please enter Old Password', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
          { required: true, validator: validaterePass, trigger: 'blur' }
        ]
      },
      pwdType: 'password',
      canChange: Number(this.$store.getters.currentUser.id) === Number(this.$route.params.id)
    }
  },
  methods: {
    onChange (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth() && this.canChange) {
          let data = {
            oldpsw: form.password,
            newpsw: form.newpassword
          }
          change(data).then(resp => {
            this.$store.commit('DEL_TOKEN')
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
.change-page
  padding 10px 120px 10px 80px
  position relative
  .change-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>