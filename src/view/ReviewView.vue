<template>
  <div class="review-page">
    <div class="review-main">
      <review-sum :review="review" :key="review.id"></review-sum> <!--Note :key to render-->
    </div>
    <div class="share">
      <share-bar></share-bar>
    </div>
    <div v-for="comment in comments" :key="comment.id">
      <comment :comment="comment"></comment>
    </div>
    <div v-if="hasMoreComment">
      <el-button class="blockbtn" size="mini" @click="loadmoreComment" :disabled="!hasMoreComment">Show More Comments</el-button>
    </div>
    <div class="comment">
      <reply class="reply" :refer="refer" :show="true" @newreply="updateNew"></reply>
    </div>
  </div>
</template>

<script>
import { fetchReviewComments } from '@/api/api'
import ReviewSum from '@/components/Item/ReviewSum.vue'
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'

export default {
  name: 'review-view',
  title () {
    return this.review.heading
  },
  components: { ReviewSum, Comment, Reply, ShareBar },
  data () {
    return {
      review: {},
      comments: [],
      commentCount: 0,
      currentPage: 1,
      refer: { re: 'review', id: this.$route.params.id }
    }
  },
  computed: {
    hasMoreComment () {
      return this.comments.length < this.commentCount
    }
  },
  methods: {
    loadReviewData () {
      let reviewid = this.$route.params.id
      this.$store.dispatch('getReview', reviewid)
      .then(resp => {
        let data = resp.data
        this.review = data
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    loadmoreComment () {
      let reviewid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchReviewComments(reviewid, params)
      .then(resp => {
        this.comments.push(...resp.data)
        this.currentPage += 1
      })
    },
    updateNew (data) {
      this.comments.unshift(data)
    }
  },
  created () {
    this.loadReviewData()
  }
}
</script>

<style lang="stylus" scoped>
.review-page
  padding 10px 235px 10px 0px
  position relative
  .review-main
    padding auto
  .review-side
    position absolute
    top 10px
    right 0
    width 225px
</style>
