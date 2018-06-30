<template>
  <div class="article-page">
    <b class="title"> Edit Article</b>
    <el-form class="article-form" size="mini" 
             :model="articleForm" :rules="rules" ref="articleForm">
      <el-form-item label="Title" prop="title">
        <el-input type="textarea" autosize v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input type="textarea" autosize v-model="articleForm.url"></el-input>
      </el-form-item>
      <el-form-item label="Content" prop="content">
        <el-input type="textarea" :autosize="{minRows:16}" 
                  v-model="articleForm.content">
        </el-input>
        <md-tool :pretext="articleForm.article" @insertmd="updateM"></md-tool>
      </el-form-item>
      <el-form-item prop="spoiler" v-if="showSpoiler">
        <el-radio-group v-model="articleForm.spoiler">
          <el-radio-button label="No Spoiler"></el-radio-button>
          <el-radio-button label="Spoiler Ahead"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain size="mini" class="blockbtn"
                   @click="onEdit('articleForm', articleForm)" :disabled="!canEdit">
                   Edit and Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editArticle, fetchHeadline } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'edit-article',
  title: 'Edit Article',
  components: { MdTool },
  data () {
    return {
      articleForm: {
        title: '',
        url: '',
        content: '',
        spoiler: 'No Spoiler'
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' },
          { max: 255, message: 'Max Length should be 255', trigger: 'change' }
        ]
      },
      canEdit: false,
      showSpoiler: false
    }
  },
  methods: {
    onEdit (formName, form) {
      if (!this.canEdit) {
        this.$message({
          showClose: true,
          message: 'No Permission'
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth() && this.canEdit) {
          let url = form.url.trim()
          let content = form.content.trim()
          if (!url && !content) {
            this.$message('Either of URL and Text Content is requied')
            return
          }
          let data = {
            title: form.title.trim(),
            url: url,
            content: content,
            spoiler: form.spoiler
          }
          let articleid = this.$route.params.id
          editArticle(articleid, data).then(resp => {
            this.$store.commit('SET_HEADLINE', resp.data)
            this.$router.push(`/headline/${articleid}`)
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
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    setFormData (article) {
      this.articleForm.title = article.title
      this.articleForm.url = article.url
      this.articleForm.content = article.content
      this.articleForm.spoiler = article.spoiler ? 'Spoiler Ahead' : 'No Spoiler'
      let submitorID = article.submitor.id
      let currentUserID = this.$store.getters.currentUserID
      this.canEdit = Number(submitorID) === Number(currentUserID)
      this.showSpoiler = Boolean(article.item.id)
    },
    loadArticleData () {
      let articleid = this.$route.params.id
      let articleG = this.$store.getters.currentHeadline
      if (articleG.id === Number(articleid)) {
        this.setFormData(articleG)
      } else {
        fetchHeadline(articleid).then(resp => {
          this.setFormData(resp.data)
        })
      }
    },
    updateM (data) {
      this.articleForm.content += data
    }
  },
  created () {
    this.loadArticleData()
  }
}
</script>

<style lang="stylus" scoped>
.article-page
  padding 10px 120px
  position relative
  .article-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 20px
</style>