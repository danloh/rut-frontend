<template>
  <div class="demand-page">
    <div class="demand-main">
      <div>
        <el-form :model="demandForm" :rules="rules" ref="demandForm">
          <el-form-item prop="demand" style="margin-bottom:8px">
            <el-input type="textarea" v-model="demandForm.demand" autosize placeholder="Request something #Tag"></el-input>
          </el-form-item>
          <el-form-item v-show="demandForm.demand.trim()">
            <el-button type="primary" size="mini" @click="submitDemand('demandForm', demandForm)" :disabled="!demandForm.demand.trim()">Send Request</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="submenu">
        <router-link to="/demands/popular">Hot</router-link>
        <router-link to="/demands/new">New</router-link>
      </div>
      <div class="demand-view">
        <router-view></router-view>
      </div>
    </div>
    <div class="demand-side">
      <p class="right-item">What is Your Question? Send Request Here, May Someone can Help</p>
    </div>
  </div>
</template>

<script>
import { checkAuth } from '@/util/auth'

export default {
  name: 'demands',
  title: 'Readup.Tips - Request',
  data () {
    return {
      demandForm: {
        demand: ''
      },
      rules: {
        demand: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ]
      },
      items: null,
      dueDate: ''
    }
  },
  methods: {
    submitDemand (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && form.demand.trim() && checkAuth()) {
          let data = { demand: form.demand.trim() }
          this.$store.dispatch('postDemand', data)
          this.resetForm(formName)
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Should Log in to Continue'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
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
.demand-page
  padding 10px 200px 10px 0px
  position relative
  .demand-main
    padding auto
    .submenu
      margin-bottom 5px
      a
        color grey
        margin-right 0.85em
        &:hover
          color darkgreen
        &.router-link-active
          color orange
          font-weight 800
  .demand-side
    position absolute
    top 10px
    right 0
    width 180px
    background-color lighten(#e5ebe4, 50%)
    padding 5px
    .right-title
      padding 2px 5px
    .right-item
      padding 2px 5px
      font-size 0.8em
</style>