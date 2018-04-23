<template>
  <div>
    <b>ROADMAPS {{totalRoads}}</b>
    <div class="r-list">
      <div class="r-sum" v-for="road in currentRoads" :key="road.id">
        <router-link :to="'/roadmap/' + road.id">
          <span>
            <img class="cover" :src="road.cover" referrerPolicy="no-referrer" 
                 style="width:80px; height:100px" alt="Cover">
          </span>
          <span class="title">
            <router-link :to="'/roadmap/' + road.id"> {{ road.title }}</router-link>
          </span>
          <div class="intro" v-html="md(road.intro)"></div>
        </router-link>
        <span class="meta">
          <span>
            including {{ road.itemcount | pluralise('item') }}
            | Due By <span style="color:orange">{{ road.deadline | toMDY(rep=false) }}</span>
              &nbsp; {{ road.done ? '✔' : '...'  }} 
          </span>
        </span>
      </div>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreRoads" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchAllRoads } from '@/api/api'
import { showLess } from '@/util/filters'
import marked from '@/util/marked'

export default {
  name: 'profile-roads',
  data () {
    return {
      totalRoads: 0,
      currentRoads: [],
      currentPage: 0
    }
  },
  computed: {
    hasMore () {
      return this.currentRoads.length < this.totalRoads
    }
  },
  methods: {
    loadmoreRoads () {
      let userid = this.$route.params.id
      let param = {'page': this.currentPage}
      // let params = {'action': action, 'userid': userid, 'param': param}
      fetchAllRoads(userid, param).then(resp => {
        this.currentRoads.push(...resp.data.roads)
        this.currentPage += 1
      })
    },
    md (content) {
      let c = marked(content)
      return showLess(c)
    }
  },
  created () {
    let userid = this.$route.params.id
    fetchAllRoads(userid).then(resp => {
      this.currentRoads = resp.data.roads
      this.totalRoads = resp.data.total
      this.currentPage = 1
    })
  }
}
</script>

<style lang="stylus" scoped>
.r-list
  width 100%
  margin-top 5px
  .r-sum
    background-color lighten(#e5ebe4, 90%)
    min-height 120px
    padding 5px 30px 5px 100px
    border-bottom 1px dashed #ddd
    position relative
    &:hover
      background-color lighten(#f3f3ed, 60%)
    .cover
      position absolute
      top 10px
      left 5px
    .title
      font-size 1.2em
      font-weight 700
      padding-top 10px
      a
        &:hover
          color #ff6600
    .intro
      color #828282
    .meta
      font-size .85em
      color #337ab7
</style>