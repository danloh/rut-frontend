<template>
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
                :autosize="{minRows:5}" 
                placeholder="or Text Content">
      </el-input>
    </el-form-item>
    <el-form-item prop="spoiler" v-if="itemid && headlineForm.content.trim()">
      <el-radio-group v-model="headlineForm.spoiler" size="mini">
        <el-radio-button label="No Spoiler"></el-radio-button>
        <el-radio-button label="Spoiler Ahead"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" 
                 @click="submitHeadline('headlineForm', headlineForm)" 
                 :disabled="!headlineForm.title.trim()">
                Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { checkAuth } from '@/util/auth'

export default {
  name: 'headline-form',
  props: {
    itemid: Number  // for review
  },
  data () {
    return {
      headlineForm: {
        title: '',
        url: '',
        content: '',
        spoiler: 'No Spoiler'
      },
      rules: {
        title: [
          { min: 1, max: 255, message: 'Required, Max 255 Characters', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitHeadline (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let url = form.url.trim()
          let content = form.content.trim()
          if (!url && !content) {
            this.$message('Either of URL and Text Content is requied')
            return
          }
          let data = {
            itemid: this.itemid,
            title: form.title.trim(),
            url: url,
            content: content,
            spoiler: form.spoiler
          }
          this.$store.dispatch('postHeadline', data).then(resp => {
            if (this.itemid) {
              let headlineid = resp.data.id
              this.$router.push(`/headline/${headlineid}`)
            }
            this.$refs[formName].resetFields()
            this.$emit('update:show', false)
          })
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
