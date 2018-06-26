<template>
  <div class="headline-page">
    <div class="headline-main">
      <div class="submenu">
        <b>News For Readers&nbsp;&nbsp;</b>
        <router-link to="/headlines/top">Top</router-link>
        <router-link to="/headlines/new">New</router-link>
        <el-button type="text" style="float:right" v-if="canSub"
                   @click="showForm=!showForm">
                   Submit
        </el-button>
      </div>
      <div v-show="showForm">
        <el-form :model="headlineForm" :rules="rules" ref="headlineForm">
          <el-form-item prop="title" style="margin-bottom:10px">
            <el-input type="textarea" v-model="headlineForm.title" autosize 
                      placeholder="Title">
            </el-input>
          </el-form-item>
          <el-form-item prop="url" style="margin-bottom:8px">
            <el-input type="textarea" v-model="headlineForm.url" autosize 
                      placeholder="either URL">
            </el-input>
          </el-form-item>
          <el-form-item prop="content" style="margin-bottom:5px">
            <el-input type="textarea" v-model="headlineForm.content" 
                      :autosize="{minRows:2}" 
                      placeholder="or Text Content">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" 
                       @click="submitHeadline('headlineForm', headlineForm)" 
                       :disabled="!headlineForm.title.trim()">
                       Submit
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="headline-view">
        <router-view></router-view>
      </div>
    </div>
    <div class="headline-side">
      <p class="right-item">
        On-Topic: Anything About Reading/Learning
      </p>
    </div>
  </div>
</template>

<script>
import { checkAuth } from '@/util/auth'

export default {
  name: 'headlines',
  title: 'News For Readers',
  data () {
    return {
      canSub: checkAuth(),
      headlineForm: {
        title: '',
        url: '',
        content: ''
      },
      rules: {
        title: [
          { min: 1, max: 255, message: 'Required, Max 255 Characters', trigger: 'change' }
        ]
      },
      showForm: false
    }
  },
  methods: {
    submitHeadline (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let url = form.url.trim()
          let content = form.content.trim()
          if (!url && !content) {
            this.$message({
              showClose: true,
              message: 'Either of URL and Text Content is requied'
            })
            return false
          } else {
            let data = {
              title: form.title.trim(),
              url: url,
              content: content
            }
            this.$store.dispatch('postHeadline', data)
            this.$refs[formName].resetFields()
            this.showForm = false
          }
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.headline-page
  padding 10px 200px 10px 0px
  position relative
  .headline-main
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
  .headline-side
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