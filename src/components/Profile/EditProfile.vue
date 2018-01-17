<template>
  <div class="edit-page">
    <h3 class="title"> Edit My Profile</h3>
    <el-form class="edit-form" :model="settingForm" :rules="rules" ref="settingForm" label-width="120px" size="mini">
      <el-form-item label="Nickname" prop="nickname">
        <el-input v-model="settingForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="Location" prop="location">
        <el-input v-model="settingForm.location"></el-input>
      </el-form-item>
      <el-form-item label="Avatar URL" prop="avatarurl">
        <el-input v-model="settingForm.avatarUrl"></el-input>
      </el-form-item>
      <el-form-item label="About Me" prop="about">
        <el-input type="textarea" v-model="settingForm.about" :autosize="{minRows:3}"></el-input>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input v-model="settingForm.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onSetting('settingForm', settingForm)" :disabled="!canSetting">Update</el-button>
        <!-- <el-button @click="resetForm('settingForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editProfile } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'edit-profile',
  title: 'Edit My Profile',
  data () {
    return {
      settingForm: {
        nickname: '',
        location: '',
        avatarUrl: '',
        about: '',
        url: ''
      },
      rules: {
        nickname: [
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        location: [
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        avatarUrl: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        url: [
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ]
      },
      userid: null,
      canSetting: false
    }
  },
  methods: {
    onSetting (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth() && this.canSetting) {
          let data = {
            nickname: form.nickname.trim(),
            location: form.location.trim(),
            avatarUrl: form.avatarUrl.trim(),
            about: form.about.trim(),
            url: form.url.trim()
          }
          editProfile(data)
          .then((resp) => {
            this.$router.push(`/profile/${this.userid}`)
            this.$message({
              showClose: true,
              message: resp.data
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    setFormData (user) {
      this.settingForm.nickname = user.nickname
      this.settingForm.location = user.location
      this.settingForm.avatarUrl = user.avatar
      this.settingForm.about = user.about
      this.settingForm.url = user.exlink
      this.canSetting = true
    }
  },
  created () {
    let user = this.$store.getters.currentUser
    this.userid = user.id
    this.setFormData(user)
  }
}
</script>

<style lang="stylus" scoped>
.edit-page
  padding 10px 120px 10px 80px
  position relative
  .edit-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>