<template>
  <div class="reply" v-show="show">
    <el-form :model="etcForm" :rules="rules" ref="etcForm">
      <el-form-item prop="etc" style="margin-bottom:4px">
        <el-input type="textarea" autosize 
                  v-model="etcForm.etc" 
                  placeholder="Post">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" 
                   @click="reply('etcForm', etcForm)" 
                   :disabled="!etcForm.etc.trim()">
                   Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { newEtc } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'reply',
  props: {
    refer: Object,  // for etc, rut..
    tagsuf: { type: String, default: '' },
    show: { default: false } // sync, hide input once submit
  },
  data () {
    return {
      etcForm: {
        etc: ''
      },
      rules: {
        etc: [
          { min: 1, max: 500, message: 'Required, Max 500 Characters', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    reply (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && form.etc.trim() && checkAuth()) {
          let data = { etc: form.etc.trim() + this.tagsuf }
          let re = this.refer.re // demand or rut or etc
          let id = this.refer.id // id of above
          newEtc(re, id, data).then(resp => {
            this.$emit('newreply', resp.data)
          })
          this.$refs[formName].resetFields()
          this.$emit('update:show', false) // with .sync, to hide input once submit
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Should Log in to post'
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
.reply
  padding 5px 0
</style>
