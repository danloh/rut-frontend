<template>
  <div class="review-page">
    <b class="title"> Post New Review:</b>&nbsp;&nbsp;
    <router-link :to="'/item/' + itemId" target="_blank"
                 rel="noopener noreferrer" style="font-size:14px"
                 :title="currentItem.title || ''">
                 {{ (currentItem.title || ':::').slice(0, 72) }}
    </router-link>
    <el-form class="review-form" size="mini" 
             :model="reviewForm" :rules="rules" ref="reviewForm">
      <el-form-item prop="title">
        <el-input type="textarea" autosize v-model="reviewForm.title" placeholder="Title"></el-input>
      </el-form-item>
      <el-form-item prop="review">
        <el-input type="textarea" :autosize="{minRows:16}" 
                  v-model="reviewForm.review" 
                  placeholder="Compose review..., Support #hashtag">
        </el-input>
        <md-tool :pretext="reviewForm.review" @insertmd="updateM"></md-tool>
      </el-form-item>
      <el-form-item prop="spoiler">
        <el-radio-group v-model="reviewForm.spoiler">
          <el-radio-button label="No Spoiler"></el-radio-button>
          <el-radio-button label="Spoiler Ahead"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain size="mini" class="blockbtn" 
                   @click="onSubmit('reviewForm', reviewForm)">
                   Submit
        </el-button>
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
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' },
          { max: 255, message: 'Max Length should be 255', trigger: 'change' }
        ],
        review: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' }
        ]
      },
      currentItem: this.$store.getters.currentItem,
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