<template>
  <div class="feed-page">
    <div>
      <b>The Feed shows events from people you follow</b>
      <div class="activity-list" 
           v-for="(act, index) in activity" 
           :key="index" 
           v-if="act.event.type">
        <router-link :to="'/profile/' + act.actor.id">
          <img class="avatar" 
               :src="act.actor.avatar" referrerPolicy="no-referrer" 
               style="width:40px;height:40px;border-radius:50%" 
               alt="Avatar">
          <b>{{ act.actor.name }}</b>
        </router-link>
        <span class="act-line">{{act.action}}&nbsp;{{act.event.type}}</span>
        <router-link :to="'/' + act.event.type + '/' + act.event.id">
          {{act.event.content}}
        </router-link>
        <br>
        <span class="act-time">{{act.timestamp | timeAgo}}</span>
        <img v-if="act.event.cover" class="act-cover"
           :src="act.event.cover" referrerPolicy="no-referrer" 
           style="max-width:50px;max-height:60px">
      </div>
      <div v-if="activity.length === 0">Nothing Happened</div>
    </div>
    <div class="tag-side">
      <h4 class="sidetitle">Favorite Topics</h4>
      <div class="sidebody" v-for="(tag, index) in showTags" :key="index">
        <router-link :to="'/tag/' + tag.id" :title="tag.tagname">
          {{ tag.tagname.slice(0,18) }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchFeeds, fetchFavTags } from '@/api/api'

export default {
  name: 'feeds',
  title: 'Feeds From Readers',
  data () {
    return {
      activity: [],
      showTags: []
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
    min-height 60px
    margin-top 5px
    border-top 1px solid #eee
    background-color #eceff1
    position relative
    padding 5px 65px 5px 55px
    .avatar
      position absolute
      top 10px
      left 5px
    .act-time
      font-size 0.8em
      color green
    .act-cover
      position absolute
      top 5px
      right 5px
  .tag-side
    position absolute
    top 5px
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
