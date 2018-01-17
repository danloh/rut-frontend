<template>
  <div id="app">
    <header class="header">
      <nav class="inner">
        <router-link to="/">
            <b style="color:darkorange;font-size:1.6em;letter-spacing:0.0005em">Readup.Tips</b>
        </router-link>
        <router-link to="/feeds" v-if="authed">
          <b>Feed</b>
        </router-link>
        <router-link to="/challenge">
          <b>Challenge</b>
        </router-link>
        <router-link to="/demands">
          <b>Request</b>
        </router-link>
        <router-link to="/create">
          <b>Create Now</b>
        </router-link>
        <div class="rightmenu">
          <el-dropdown v-if="authed">
            <el-button type="success" size="small">
              <i class="el-icon-menu"></i>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="'/profile/' + currentUserID">Profile</router-link>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <el-button type="text" size="mini" @click="onLogout">Log out</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div v-else>
            <router-link to="/register"><b class="login">SIGNUP</b></router-link>
            <router-link to="/login"><b class="login">LOGIN</b></router-link>
          </div>
        </div>
      </nav>
    </header>
    <div class="view">
      <router-view></router-view>
    </div>
    <footer class="bottom">
      ©Readup.Tips - since 2018
      <!-- | <router-link to="/about">About</router-link>
      | <router-link to="/terms">Terms</router-link>
      | <router-link to="/help">Help</router-link> | -->
      <!--google site search -->
      <div style="width:160px">
        <el-input size="mini" v-model="searchWord" @keyup.enter.native="siteSearch" placeholder="Search Readup.Tips"></el-input>
      </div>
    </footer>
  </div>
</template>

<script>
// import store from './store'
// import { getToken } from '@/util/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      searchWord: ''
    }
  },
  computed: {
    ...mapGetters([
      'currentUserID',
      'authed'
    ])
  },
  methods: {
    onLogout () {
      this.$store.commit('DEL_TOKEN')
      this.$router.push('/')
    },
    siteSearch () {
      let keyword = this.searchWord
      if (keyword !== '') {
        window.open('https://www.google.com/search?q=site:readup.tips/%20' + keyword, '_blank')
        return false
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="stylus">
body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 16px
  line-height 1.6em
  background-color lighten(#eceef1, 30%)
  margin 0
  padding-top 42px
  color #34495e
  overflow-y scroll
  overflow-x scroll
  overflow-wrap break-word
a
  color #337ab7
  text-decoration none
h2, h3, h4
  margin 8px 0
p
  margin 5px 0
pre
  background-color #f0f0f0
  padding 5px
blockquote
  border-left: 4px solid #ccc
  margin: 5px
  padding-left: 12px
.header
  background-color #fafafa
  position fixed
  z-index 999
  height 40px
  top 0
  left 0
  right 0
  .inner
    max-width 960px
    min-width 800px
    box-sizing border-box
    margin 0px auto
    padding 8px 0px
    .rightmenu
      float right
      .login
        color green
        font-size 1.0em
        font-weight 700
  a
    color #080400
    line-height 24px
    display inline-block
    vertical-align middle
    font-weight 600
    letter-spacing .075em
    margin-right 0.85em
    &:hover
      color darkgreen
    &.router-link-active
      color green
      font-weight 800
.blockbtn
  display block
  margin 5px 0
  width 100%
  text-align center
.view
  max-width 960px
  min-width 800px
  width 100%
  margin 0 auto
  position relative
.bottom
  max-width 960px
  box-sizing border-box
  margin 5px auto
  padding 8px 0px
  font-size 0.75em
</style>
