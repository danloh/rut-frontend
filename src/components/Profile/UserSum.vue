<template>
  <div class="user-sum">
    <div>
      <img class="thumb" :src="avatar" alt="Avatar">
    </div>
    <div class="info">
      <span class="name">
        <router-link :to="'/profile/' + user.id">{{ user.name }}</router-link>
      </span>&nbsp;&nbsp;
      <span class="location">{{ user.location || '' }}</span>
      <br>
      <span>{{ user.about ? user.about.slice(0, 255) : '...' }} </span>
    </div>
    <div class="operate">
      <el-button size="mini" @click="followTa">{{ action }}</el-button>
    </div>
  </div>
</template>

<script>
import { checkFollowing, followOne } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'user-sum',
  props: ['user'],
  data () {
    return {
      action: this.checkFollow()
    }
  },
  computed: {
    avatar () {
      return this.user.avatar
    }
  },
  methods: {
    checkFollow () {
      if (checkAuth()) {
        let userid = this.user.id
        return checkFollowing(userid)
        .then(resp => {
          this.action = resp.data
        })
      } else {
        return 'Follow'
      }
    },
    followTa () {
      if (checkAuth()) {
        let userid = this.user.id
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
  }
}
</script>

<style lang="stylus" scoped>
.user-sum
  background-color #fff
  min-height 65px
  padding 10px 100px 10px 70px
  border-bottom 1px solid #eee
  position relative
  .thumb
    width 50px
    height 60px
    position absolute
    top 10px
    left 10px
  .info
    font-size 0.9em
    .name
      font-size 1.2em
      font-weight 700
      a
        &:hover
          color red
    .location
      font-size 0.95em
      color #9cce83
  .operate
    position absolute
    top 10px
    right 2px
</style>