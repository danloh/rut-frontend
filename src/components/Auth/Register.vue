<template>
<div class="sign-page">
  <h3 class="title">Welcome to Join</h3>
  <v-form ref="form" class="sign-form">
    <v-text-field
      v-model="username"
      label="Username"
      :counter= "16"
      :rules="nameRule"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      :type="'password'"
      :rules="pswRule"
    ></v-text-field>
    <v-text-field
      v-model="repassword"
      label="Confirm Password"
      :type="'password'"
      :rules="repswRule"
    ></v-text-field>
    <el-button class="blockbtn" type="primary" size="small"
               @click="onReg">Register
    </el-button>
  </v-form>
  <router-link :to="'/login'">Have an Account? Login</router-link>
</div>
</template>

<script>
import { signup } from '../../api'
import { regName, regEmail, regPsw } from '../../util/constant'

export default {
  name: 'register',
  title: 'Register',
  data () {
    return {
      username: '',
      nameRule: [
        v => !!v || 'required',
        v => v.length <= 16 || 'Must be less than 16 characters'
      ],
      password: '',
      pswRule: [
        v => v.length >= 8 || 'Must be more than 8 characters'
      ],
      repassword: '',
      repswRule: [
        v => (!!v && v) === this.password || 'Not Match'
      ]
    }
  },
  methods: {
    onReg() {
      if (!this.$refs.form.validate()) {
        console.log("Invalid")
        return
      }
      let data = {
        uname: this.username,
        password: this.password,
        confirm_password: this.repassword
      }
      signup(data).then(resp => {
        // console.log(resp.data)
        if (resp.data.status == 200) {
          this.$router.push('/login')
        } else if (resp.data.status == 409) {
          alert("duplicated user")
        } else {
          this.$router.push('/register')
        }
      })
    },
  }
}
</script>

<style scoped>
.sign-page {
  padding: 10px 210px 10px 210px;
  position: relative;
} 
.sign-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
