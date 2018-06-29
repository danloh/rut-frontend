<template>
  <div class="headline-list">
    <headline v-for="headline in currentHeadlines" 
              :key="headline.id" 
              :headline="headline" 
              :showCon="false">
    </headline>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreHeadline" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from '@/components/Headline/Headline.vue'

export default {
  name: 'headline-list',
  props: { param: Object },
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
      let params = this.param
      this.$store.dispatch('getHeadlines', params)
    },
    loadmoreHeadline () {
      let params = Object.assign({'page': this.currentH}, this.param)
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