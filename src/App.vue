<template>
  <div id="app">
    <header class="header">
      <nav class="nav-menu">
        <router-link to="/">
            <b style="color:darkorange;font-size:1.2em;letter-spacing:0.0005em">
              Readup.Tips<sup style="font-size:0.5em;color:grey"> alpha</sup>
            </b>
        </router-link>
        <router-link to="/feeds" v-if="authed">
          <b>Feed</b>
        </router-link>
        <router-link to="/headlines">
          <b>Headline</b>
        </router-link>
        <router-link to="/demands">
          <b>Request</b>
        </router-link>
        <!-- <router-link to="/circles">
          <b>Circle</b>
        </router-link> -->
        <router-link to="/challenge">
          <b>Challenge</b>
        </router-link>
        <div class="right-menu">
          <div v-if="authed">
            <el-dropdown>
              <el-button type="success" size="small">
                <i class="el-icon-menu"></i>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link to="/newroad">
                    <b style="color:orange">+ RoadMap</b>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link :to="'/profile/' + currentUserID">> My Profile</router-link>
                </el-dropdown-item>
                <!-- <el-dropdown-item>
                  <router-link to="/create">+ ReadList</router-link>
                </el-dropdown-item> -->
                <el-dropdown-item divided>
                  <el-button type="text" @click="onLogout">Log out</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <el-button type="text" @click="toLogin=true">
              <b>Log in</b>
            </el-button>
          </div>
        </div>
      </nav>
    </header>
    <div class="view">
      <router-view></router-view>
      <!-- login dialog -->
      <el-dialog :visible.sync="toLogin" width="450px" class="loginDialog">
        <login-form :next="'current'" @close="toLogin=false"></login-form>
      </el-dialog>
      <!-- end login dialog -->
    </div>
    <footer class="footer">
      <div class="bottom">
        ©Readup.Tips - since 2018
        | <a href="/newitem">submit</a>
        | <a href="/about">About</a>
        | <a href="/about">Terms</a>
        <!--google site search -->&nbsp;&nbsp;&nbsp;
        <!-- <el-input size="mini" style="width:16em"
                  v-model="searchWord"
                  @keyup.enter.native="siteSearch" 
                  placeholder="Search Readup.Tips">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input> -->
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginForm from '@/components/Auth/LoginForm.vue'

export default {
  name: 'app',
  components: { LoginForm },
  data () {
    return {
      searchWord: '',
      toLogin: false
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
  line-height 1.2em
p
  margin 5px 0
pre
  background-color #f0f0f0
  padding 5px
blockquote
  border-left: 3px solid lighten(orange, 80%)
  margin: 5px
  padding-left: 12px
.el-input__inner, .el-textarea__inner
  font-size 14px
.header
  background-color #fafafa
  position fixed
  z-index 999
  height 40px
  top 0
  left 0
  right 0
  .nav-menu
    max-width 960px
    min-width 800px
    box-sizing border-box
    margin 0px auto
    padding 8px 0px
    .right-menu
      float right
  a
    color #080400
    line-height 24px
    display inline-block
    vertical-align middle
    font-weight 600
    letter-spacing .075em
    margin-right 0.85em
    &:hover
      color orange
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
  min-height 42em
  width 100%
  margin 0 auto
  position relative
.footer
  border-top 2px dotted #cfc0cf
  margin-top 3em
  .bottom
    max-width 960px
    margin 5px auto
    font-size 0.75em
</style>
