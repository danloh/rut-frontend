<template>
  <div class="profile-page">
    <div class="profile-head">
      <b style="font-size:1.6em">{{user.name}}</b>
      <p class="aboutme">{{user.about || '...'}}</p>
      <div class="fobar">
        <span>Following 
          <router-link :to="'/profile/' + userid + '/followeds'">{{ followedCount }} </router-link>
        </span> &nbsp;&nbsp;&nbsp;
        <el-button size="mini" @click="followUser" :disabled="showSetting">{{ action }}</el-button>
      </div>
    </div>
    <div class="profile-view" :key="userid">
      <router-view></router-view>
    </div>
    <div class="profile-side">
      <div class="right-avatar">
        <img class="avatar" :src="user.avatar" alt="Avatar">
        <p class="user-info">From: {{user.location || '...'}}</p>
      </div>
      <div class="right-nav">
        <router-link :to="'/profile/' + userid + '/created/'"><b style="color:royalblue">&</b> Created</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/challenge/'"><b style="color:royalblue">&</b> Challenge</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/star/'"><b style="color:royalblue">&</b> Starred</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/working/'"><b style="color:coral">#</b> Working On</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/scheduled/'"><b style="color:coral">#</b> scheduled</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/havedone/'"><b style="color:coral">#</b> Have Done</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/reviews/'"><b style="color:teal">></b> Notes / Reviews</router-link>
        <br>
        <router-link :to="'/profile/' + userid + '/demands/'"><b style="color:teal">></b> Requests</router-link>
        <br><br>
        <router-link :to="'/setting/' + userid" v-if="showSetting">
          <small style="outline: dotted 1px; background-color: #d5d5be">~Setting~</small>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUser, checkFollowing, followOne } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'profile',
  title () {
    return this.user.name
  },
  data () {
    return {
      user: {},
      userid: this.$route.params.id,
      showSetting: false,
      action: this.checkFollow(),
      followedCount: 0 // this user following other
    }
  },
  methods: {
    loadUser () {
      let userid = this.$route.params.id
      return fetchUser(userid)
      .then(resp => {
        let data = resp.data
        this.user = data
        this.userid = data.id
        this.followedCount = data.followedcount
        this.action = this.checkFollow()
        let currentUserID = this.$store.getters.currentUserID
        if (Number(userid) === Number(currentUserID)) {
          this.$store.commit('SET_INFO', resp.data)
          this.showSetting = true
        }
      })
    },
    checkFollow () {
      if (checkAuth()) {
        let userid = this.$route.params.id
        return checkFollowing(userid)
        .then(resp => {
          this.action = resp.data
        })
      } else {
        return 'Follow' // work incorrectly when non-login if no return
      }
    },
    followUser () {
      if (checkAuth()) {
        let userid = this.$route.params.id
        if (this.action === 'Follow') {
          return followOne('follow', userid)
          .then(() => {
            this.action = 'UnFollow'
          })
        } else {
          return followOne('unfollow', userid)
          .then(() => {
            this.action = 'Follow'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: 'Should Log in to Continue'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    }
  },
  created () {
    this.loadUser()
  },
  watch: {
    '$route': 'loadUser'
  }
}
</script>

<style lang="stylus" scoped>
.profile-page
  padding 10px 240px 10px 0px
  position relative
  .profile-head
    background-color #f6f6f1
    border-bottom 1px dotted orange
    min-height 40px
    padding 10px 215px 10px 10px
    margin-bottom 10px
    position relative
    .fobar
      position absolute
      top 10px
      right 0
      width 210px
  .profile-view
    padding auto
  .profile-side
    position absolute
    top 10px
    right 0
    width 220px
    background-color lighten(#e5ebe4, 75%)
    .right-avatar
      background-color #e5ebe4
      min-height 80px
      padding 5px
      position relative
      .avatar
        width 60px
        height 80px
      .user-info
        position absolute
        top 10px
        right 0
        width 145px
    .right-nav
      padding 5px 20px
      a
        color grey
        line-height 28px
        font-weight 400
        &:hover
          color darkgreen
        &.router-link-active
          color green
          font-weight 800
.aboutme, .user-info, .fobar
  font-size 0.85em
</style>
