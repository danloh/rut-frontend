<template>
  <div class="review-page">
    <h3 class="title"> Edit Review</h3>
    <el-form class="review-form" :model="reviewForm" :rules="rules" ref="reviewForm" size="mini">
      <el-form-item prop="title">
        <el-input v-model="reviewForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="review">
        <el-input type="textarea" v-model="reviewForm.review" :autosize="{minRows:12}"></el-input>
        <md-tool :pretext="reviewForm.review" @insertmd="updateM"></md-tool>
      </el-form-item>
      <el-form-item prop="spoiler">
        <el-radio-group v-model="reviewForm.spoiler">
          <el-radio-button label="No Spoiler"></el-radio-button>
          <el-radio-button label="Spoiler Ahead"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onEdit('reviewForm', reviewForm)" :disabled="!canEdit">Done and Submit</el-button>
        <!-- <el-button @click="resetForm('reviewForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editReview, fetchReview } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'edit-review',
  title: 'Edit Review',
  components: { MdTool },
  data () {
    return {
      reviewForm: {
        title: '',
        review: '',
        spoiler: ''
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' },
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        review: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' }
        ]
      },
      canEdit: false
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
          let data = {
            title: form.title.trim(),
            review: form.review.trim(),
            spoiler: form.spoiler
          }
          let reviewid = this.$route.params.id
          editReview(reviewid, data)
          .then(() => {
            this.$router.push(`/review/${reviewid}`)
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    setFormData (review) {
      this.reviewForm.title = review.heading
      this.reviewForm.review = review.body
      this.reviewForm.spoiler = review.spoiler ? 'Spoiler Ahead' : 'No Spoiler'
      let creatorID = review.creator.id
      let currentUserID = this.$store.getters.currentUserID
      this.canEdit = Number(creatorID) === Number(currentUserID)
    },
    loadReviewData () {
      let reviewid = this.$route.params.id
      let reviewG = this.$store.getters.reviewDetail
      if (reviewG && reviewG.id === Number(reviewid)) {
        let review = reviewG
        this.setFormData(review)
      } else {
        fetchReview(reviewid).then(resp => {
          let review = resp.data
          this.setFormData(review)
        })
      }
    },
    updateM (data) {
      this.reviewForm.review += data
    }
  },
  created () {
    this.loadReviewData()
  }
}
</script>

<style lang="stylus" scoped>
.review-page
  padding 10px 120px
  position relative
  .review-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 20px
</style>