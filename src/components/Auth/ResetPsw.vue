<template>
<div class="reset-page">
  <h3 class="title">Reset Password</h3>
  <el-form class="reset-form" size="mini" 
           :model="resetpswForm" :rules="rules" 
           ref="resetpswForm">
    <el-form-item label="New Password" prop="password">
      <el-input :type="pwdType" v-model="resetpswForm.password"
                placeholder="6 - 18 in length, at least 1 number, 1 letter, 1 special(#@!~%^$&*-)">
      </el-input>
    </el-form-item>
    <el-form-item label="Confirm Password" prop="repassword">
      <el-input :type="pwdType" v-model="resetpswForm.repassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="blockbtn" type="primary" 
                 @click="onReset('resetpswForm', resetpswForm)" 
                 :disabled="Expired">
                 Reset Password
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { reset, checkExpired } from '@/api/api'
import { regPsw } from '@/util/constant'

export default {
  name: 'resetpsw',
  title: 'Reset Password',
  data () {
    var validatePass = (rule, value, callback) => {
      if (!regPsw.test(value.trim())) {
        callback(new Error('Please input or check the password'))
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
      pwdType: 'password',
      Expired: true
    }
  },
  methods: {
    onReset (formName, form) {
      this.$store.commit('DEL_TOKEN')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = { newpsw: form.password }
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
    checkExpire () {
      let token = this.$route.params.token
      checkExpired(token).then(resp => {
        this.Expired = !resp.data
        if (!resp.data) {
          this.$message({
            showClose: true,
            duration: 0,
            message: 'The Link is expired or invalid, Please get a new reset link'
          })
        }
      })
    }
  },
  mounted () {
    this.checkExpire()
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