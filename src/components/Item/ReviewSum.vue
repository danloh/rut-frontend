<template>
  <div class="review-main" v-if="creator">
    <h3 class="title">
      <router-link :to="'/review/' + review.id">{{ review.heading }}</router-link>
    </h3>
    <p class="meta">
      By <router-link :to="'/profile/' + creator.id">{{ creator.name }}</router-link>
      | {{ review.timestamp | toMDY }}
      | on <router-link :to="'/item/' + review.item.id">{{ review.item.title.slice(0, 42) }}..</router-link>
    </p>
    <div class="review-body">
      <div v-html="reviewContent"></div>
      <el-button type="text" size="mini" @click="showFull" v-if="spoiler || short">{{ readMore }}</el-button>
    </div>
    <div class="bar">
      <router-link :to="'/editreview/' + review.id" v-if="canEdit">...Edit |</router-link> <!--if not show edit in list, && !less-->
      <el-button type="text" @click="upReview">Helpful</el-button>&nbsp;{{ vote }}
    </div>
  </div>
</template>

<script>
import { upvoteReview } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { showLess } from '@/util/filters'
import marked from '@/util/marked'

export default {
  name: 'review-sum',
  props: {
    review: Object,
    less: Boolean
  },
  data () {
    return {
      vote: this.review.vote,
      spoiler: this.review.spoiler,
      short: this.less // not directly mutate prop less
    }
  },
  computed: {
    creator () {
      return this.review.creator
    },
    reviewContent () {
      let content = marked(this.review.body)
      let least = this.spoiler ? 0 : 255
      return this.short || this.spoiler ? showLess(content, least) : content
    },
    readMore () {
      return this.spoiler ? 'Spoilers Ahead! Continue?' : 'Read More ...'
    },
    canEdit () {
      return Number(this.review.creator.id) === Number(this.$store.getters.currentUserID)
    }
  },
  methods: {
    showFull () {
      this.spoiler = false
      this.short = false
    },
    upReview () {
      if (checkAuth()) {
        let reviewid = this.review.id
        return upvoteReview(reviewid)
        .then(resp => {
          this.vote = resp.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.review-main
  background-color lighten(#f4f7f3, 50%)
  padding 5px
  border-bottom 1px solid #eee
  position relative
  .title
    font-weight 700
    a
      &:hover
        color #ff6600
  .meta
    font-size 0.75em
  .bar
    font-size 0.7em
    text-align right
  .review-body
    background-color #f4f7f3
    padding 0 5px
    font-size 1.05em
</style>
