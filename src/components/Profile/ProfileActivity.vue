<template>
  <div>
    <b>What's Happening</b>
    <div class="activity-list" 
         v-for="(act, index) in activity" :key="index" 
         v-if="act.event.type">
      <span>{{act.action}} {{ act.event.type }}</span>
      <router-link :to="'/' + act.event.type + '/' + act.event.id">
        {{ act.event.content }}
      </router-link>
      <br><span class="act-time">{{ act.timestamp | timeAgo }}</span>
      <img v-if="act.event.cover" class="act-cover"
           :src="act.event.cover" 
           style="width:50px;height:60px">
    </div>
    <div v-if="activity.length === 0">Nothing Happened</div>
  </div>
</template>

<script>
import { fetchMyActivity } from '@/api/api'

export default {
  name: 'profile-activity',
  data () {
    return {
      activity: []
    }
  },
  methods: {
    loadActivity () {
      let userid = this.$route.params.id
      fetchMyActivity(userid).then(resp => {
        this.activity = resp.data
      })
    }
  },
  watch: {
    '$route.params.id': 'loadActivity'
  },
  created () {
    this.loadActivity()
  }
}
</script>

<style lang="stylus" scoped>
.activity-list
  min-height 60px
  margin-top 5px
  border-top 1px solid #eee
  background-color #eceff1
  padding 10px 10px 10px 65px
  position relative
  .act-cover
    position absolute
    top 10px
    left 5px
  .act-time
    font-size 0.8em
    color green
</style>