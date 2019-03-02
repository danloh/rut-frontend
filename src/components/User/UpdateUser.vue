<template>
<div class="update-page">
  <h3 class="title">Update My Profile</h3>
  <v-form ref="form" class="update-form">
    <v-text-field
      v-model="username"
      label="Username"
      :counter= "16"
      :rules="nameRule"
    ></v-text-field>
    <v-textarea
      v-model="avatar"
      label="Avatar"
      :counter = "120"
      :rules="lenRule"
      :rows= "1"
      auto-grow
    ></v-textarea>
    <v-text-field
      v-model="email"
      label="Email"
      :counter= "120"
      :rules="lenRule"
    ></v-text-field>
    <v-textarea
      v-model="intro"
      label="Intro"
      counter
      :rows= "10"
      auto-grow
    ></v-textarea>
  </v-form>
  <el-button class="blockbtn" type="primary" size="small"
            @click="onUpdate">Update My Profile
  </el-button>
</div>
</template>

<script>
import { updateUser, fetchUser } from '../../api'
import { regName, regEmail, regPsw } from '../../util/constant'
import { checkAuth } from '../../util/auth'

export default {
  name: 'update-profile',
  title: 'Update My Profile',
  data () {
    return {
      userid: '',
      username: '',
      avatar: '',
      email: '',
      intro: '',
      nameRule: [
        v => !!v || 'required',
        v => v.length <= 16 || 'Must be less than 16 characters'
      ],
      lenRule: [
        v => v.length <= 120 || 'Must be less than 120 characters'
      ],
      emailRule: [
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
    }
  },
  methods: {
    onUpdate() {
      let currID = this.$store.getters.actID
      if (!this.$refs.form.validate() || !checkAuth() || this.userid !== currID) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let data = {
        id: this.userid,
        uname: this.username.trim(),
        email: this.email.trim(),
        avatar: this.avatar.trim(),
        intro: this.intro.trim(),
      }
      updateUser(this.userid, data).then(resp => {
        let id = resp.data.user.id
        this.$router.push(`/p/${id}`)  // relaod??
      })
    },
    loadUser () {
      let pathid = this.$route.params.id
      fetchUser(pathid).then(resp => {
        let data = resp.data.user
        this.userid = data.id
        this.username = data.uname
        this.avatar = data.avatar
        this.email = data.email
        this.intro = data.intro
      })
    }
  },
  created () {
    this.loadUser()
  }
}
</script>

<style scoped>
.update-page {
  padding: 10px 210px 10px 210px;
  position: relative;
} 
.update-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
