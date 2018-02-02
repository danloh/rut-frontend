<template>
  <div class="headline-list">
    <headline v-for="headline in currentHeadlines" :key="headline.id" :headline="headline" :showCon="false"></headline>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" @click="loadmoreHeadline" :disabled="!hasMore">Show More</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from '@/components/Headline/Headline.vue'

export default {
  name: 'headline-list',
  props: { type: String },
  components: { Headline },
  computed: {
    ...mapGetters([
      'currentHeadlines',
      'currentH',
      'maxH'
    ]),
    hasMore () {
      return this.currentH < this.maxH
    }
  },
  methods: {
    loadData () {
      let param = {'ref': this.type}
      this.$store.dispatch('getHeadlines', param)
    },
    loadmoreHeadline () {
      let params = {'ref': this.type, 'page': this.currentH}
      this.$store.dispatch('moreHeadlines', params)
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="stylus" scoped>
.headline-list
  padding auto
</style>