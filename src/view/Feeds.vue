<template>
  <div class="feed-page">
    <div>
      <b>The Feed shows events from people you follow</b>
      <div class="activity-list" v-for="(act, index) in activity" :key="index" v-if="act.event.type">
        <router-link :to="'/profile/' + act.actor.id">
          <img class="avatar" :src="act.actor.avatar" style="width:30px; border-radius:50%" alt="Avatar">
          <b>{{ act.actor.name }}</b>
        </router-link>
        <b>{{act.action}} {{act.event.type}}</b>
        <router-link :to="'/' + act.event.type + '/' + act.event.id">{{act.event.content}}</router-link>
        <br><span class="act-time">{{act.timestamp | timeAgo}}</span>
      </div>
      <div v-if="activity.length === 0">Nothing Happened</div>
    </div>
    <div class="tag-side">
      <h4 class="sidetitle">Favorite Topics</h4>
      <div class="sidebody" v-for="(tag, index) in showTags" :key="index">
        <router-link :to="'/tag/' + tag.id">{{tag.tagname}}</router-link>
      </div>
      <div v-if="hasMore">
        <el-button class="blockbtn" type="text" size="mini" @click="loadMoreTags" :disabled="!hasMore">Show More</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchFeeds, fetchFavTags } from '@/api/api'

export default {
  name: 'feeds',
  title: 'Feeds',
  data () {
    return {
      activity: [],
      showTags: [],
      tagCount: '',
      currentPage: 0
    }
  },
  computed: {
    hasMore () {
      return this.showTags.length < this.tagCount
    }
  },
  methods: {
    loadFeeds () {
      fetchFeeds().then(resp => {
        this.activity = resp.data
      })
    },
    loadTags () {
      let userid = this.$store.getters.currentUserID
      fetchFavTags(userid).then(resp => {
        this.showTags = resp.data.tags
        this.tagCount = resp.data.total
      })
    },
    loadMoreTags () {
      let userid = this.$store.getters.currentUserID
      let params = {'page': this.currentPage}
      fetchFavTags(userid, params).then(resp => {
        this.showTags.push(...resp.data.tags)
        this.currentPage += 1
      })
    }
  },
  created () {
    this.loadFeeds()
    this.loadTags()
  }
}
</script>

<style lang="stylus" scoped>
.feed-page
  margin-top 5px
  position relative
  padding 10px 240px 10px 0px
  .activity-list
    margin-top 5px
    border-top 1px solid #eee
    background-color #eceff1
    position relative
    padding 5px 5px 5px 50px
    .avatar
      position absolute
      top 5px
      left 5px
    .act-time
      font-size 0.8em
      color green
  .tag-side
    position absolute
    top 40px
    right 0
    width 220px
    background-color lighten(#e5ebe4, 80%)
    .sidetitle
      background-color #e5ebe4
      padding 5px 10px
    .sidebody
      padding 5px 10px
      a
        &:hover
          color #ff6600
</style>