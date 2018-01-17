<template>
  <div class="review-list">
    <b>NOTES / REVIEWS {{reviewCount}}</b>
    <review-sum v-for="review in reviews" :key="review.id" :review="review" :less="true"></review-sum>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="loadmoreReviews" :disabled="!hasMore">More</el-button>
    </div>
  </div>
</template>

<script>
import ReviewSum from '@/components/Item/ReviewSum.vue'
import { fetchProfileReviews } from '@/api/api'

export default {
  name: 'profile-review',
  components: { ReviewSum },
  data () {
    return {
      reviews: [],
      currentPage: 1,
      reviewCount: 0
    }
  },
  computed: {
    hasMore () {
      return this.reviews.length < this.reviewCount
    }
  },
  created () {
    this.loadReviews()
  },
  methods: {
    loadmoreReviews () {
      let userid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchProfileReviews(userid, params)
      .then(resp => {
        this.reviews.push(...resp.data.reviews)
        this.currentPage += 1
      })
    },
    loadReviews () {
      let userid = this.$route.params.id
      fetchProfileReviews(userid)
      .then(resp => {
        let data = resp.data
        this.reviews = data.reviews
        this.reviewCount = data.reviewcount
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.review-list
  padding auto
</style>
