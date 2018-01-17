<template>
  <div class="reply" v-show="show">
    <el-form :model="commentForm" :rules="rules" ref="commentForm">
      <el-form-item prop="comment" style="margin-bottom:4px">
        <el-input type="textarea" v-model="commentForm.comment" autosize placeholder="Post a Comment"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="reply('commentForm', commentForm)" :disabled="!commentForm.comment.trim()">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { newComment } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'reply',
  props: {
    refer: Object,  // for comment, demand, rut..
    show: {default: false} // sync, hide input once submit
  },
  data () {
    return {
      commentForm: {
        comment: ''
      },
      rules: {
        comment: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reply (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && form.comment.trim() && checkAuth()) {
          let data = { comment: form.comment.trim() }
          let re = this.refer.re // demand or rut or review or comment
          let id = this.refer.id // id of above
          newComment(re, id, data)
          .then(resp => {
            this.$emit('newreply', resp.data)
          })
          this.resetForm(formName)
          this.$emit('update:show', false)
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Should Log in to post Comment'
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
.reply
  padding 5px 0
</style>
