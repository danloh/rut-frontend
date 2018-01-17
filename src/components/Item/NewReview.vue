<template>
  <div class="review-page">
    <h3 class="title"> Post New Review:</h3>
    <router-link :to="'/item/' + itemId" target="_blank" rel="nofollow noopener noreferrer">Item</router-link>
    <el-form class="review-form" :model="reviewForm" :rules="rules" ref="reviewForm" size="mini">
      <el-form-item prop="title">
        <el-input v-model="reviewForm.title" placeholder="Title"></el-input>
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
        <el-button type="success" size="medium" @click="onSubmit('reviewForm', reviewForm)">Submit</el-button>
        <!-- <el-button @click="resetForm('reviewForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { newReview } from '@/api/api'
import { trimValid } from '@/util/filters'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'new-review',
  title: 'Post New Review',
  components: { MdTool },
  data () {
    return {
      reviewForm: {
        title: '',
        review: '',
        spoiler: 'No Spoiler'
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        review: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' }
        ]
      },
      itemId: this.$route.params.id
    }
  },
  methods: {
    onSubmit (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            title: form.title.trim(),
            review: form.review.trim(),
            spoiler: form.spoiler
          }
          let itemid = this.$route.params.id
          newReview(itemid, data)
          .then(() => {
            this.$router.push(`/item/${itemid}`)
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
    updateM (data) {
      this.reviewForm.review += data
    }
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