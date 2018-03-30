<template>
  <div class="edit-page">
    <h3 class="title"> Edit My Profile</h3>
    <b style="color:green;font-size:0.8em">
      Please Note: The Profile Information will be displayed publicly
    </b>
    <el-form class="edit-form" size="mini" 
             :model="settingForm" :rules="rules" 
             ref="settingForm" label-width="90px">
      <el-form-item label="Nickname" prop="nickname">
        <el-input v-model="settingForm.nickname" placeholder="a-zA-Z_0-9{2,20}"></el-input>
      </el-form-item>
      <el-form-item label="Location" prop="location">
        <el-input v-model="settingForm.location"></el-input>
      </el-form-item>
      <el-form-item label="Avatar URL" prop="avatarurl">
        <el-input type="textarea" autosize v-model="settingForm.avatarUrl"></el-input>
      </el-form-item>
      <el-form-item label="About Me" prop="about">
        <el-input type="textarea" v-model="settingForm.about" 
                  :autosize="{minRows:3}">
        </el-input>
      </el-form-item>
      <el-form-item label="Website" prop="url">
        <el-input type="textarea" autosize v-model="settingForm.url" 
                  placeholder="Personal Page or Website Url">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="mini" class="blockbtn"
                   @click="onSetting('settingForm', settingForm)" 
                   :disabled="!canSetting">
                   Update My Profile
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editProfile } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { regNname } from '@/util/constant'

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
        location: [
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        avatarUrl: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        url: [
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ]
      },
      userid: null,
      canSetting: false
    }
  },
  methods: {
    onSetting (formName, form) {
      this.$refs[formName].validate((valid) => {
        let nickName = form.nickname.trim()
        if (valid && checkAuth() && this.canSetting) {
          let data = {
            nickname: regNname.test(nickName) ? nickName : '',
            location: form.location.trim(),
            avatarUrl: form.avatarUrl.trim(),
            about: form.about.trim(),
            url: form.url.trim()
          }
          editProfile(data).then((resp) => {
            this.$router.push(`/profile/${this.userid}`)
            this.$message({
              showClose: true,
              message: resp.data
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: 'Something Wrong, Please Check'
          })
          return false
        }
      })
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
  padding 10px 40px 10px 40px
  position relative
  .edit-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>