<template>
  <div class="review-list">
    <review-sum v-for="review in reviews" :key="review.id" :review="review" :less="true"></review-sum>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="loadmoreReviews" :disabled="!hasMore">More</el-button>
    </div>
  </div>
</template>

<script>
import ReviewSum from './ReviewSum.vue'
import { fetchItemReviews } from '@/api/api'

export default {
  name: 'review-list',
  components: { ReviewSum },
  props: {
    param: Object // {ref: new|hot, page:, itemid: }
  },
  data () {
    return {
      reviews: [],
      reviewCount: 0,
      currentPage: 1
    }
  },
  computed: {
    hasMore () {
      return this.reviews.length < this.reviewCount
    }
  },
  methods: {
    loadmoreReviews () {
      let itemid = this.param.itemid
      let page = { 'page': this.currentPage }
      let params = Object.assign(page, this.param)
      fetchItemReviews(itemid, params)
      .then(resp => {
        this.reviews.push(...resp.data.reviews)
        this.currentPage += 1
      })
    },
    loadReviews () {
      let itemid = this.param.itemid
      let params = this.param
      fetchItemReviews(itemid, params)
      .then(resp => {
        this.reviews = resp.data.reviews
        this.reviewCount = resp.data.reviewcount
      })
    }
  },
  created () {
    this.loadReviews()
  }
}
</script>

<style lang="stylus" scoped>
.review-list
  padding 5px
</style>
