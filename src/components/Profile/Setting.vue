<template>
  <div class="setting-page" v-if="userid">
    <div class="setting-view">
      <router-view></router-view>
    </div>
    <div class="setting-side">
      <div class="right-avatar">
        <img class="avatar" :src="currentUser.avatar" alt="Avatar">
        <p class="user-info">From: {{currentUser.location || 'Unknown'}}</p>
      </div>
      <div class="right-nav">
        <router-link :to="'/setting/' + userid + '/setting'">Edit Profile</router-link>
        <br>
        <router-link :to="'/setting/' + userid + '/change'">Change Password</router-link>
        <br>
        <el-button type="text" @click="reconfirm" v-if="!confirmed">Confirm My Email</el-button>
        <br>
        <el-button type="text" @click="showDialog=true">Invite Friends</el-button>
        <!-- dialog -->
        <el-dialog title="Share Link To Invite Your Friends" :visible.sync="showDialog">
          <b>Send this Link to Invite Your Friend To Readup.Tips</b>
          <p style="color: green">{{invitelink}}</p>
          <share-bar :passTitle="'Invite You To Readup.Tips'" :passUrl="invitelink"></share-bar>
        </el-dialog>
        <!-- dialog end -->
      </div>
    </div>
  </div>
</template>

<script>
import ShareBar from '@/components/Misc/ShareBar.vue'
import { reConfirmEmail } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'setting',
  title: 'Setting',
  components: { ShareBar },
  data () {
    return {
      showDialog: false,
      userid: '',
      confirmed: true
    }
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ]),
    invitelink () {
      return 'https://readup.tips/register?refcode=' + this.currentUser.recode
    }
  },
  methods: {
    loadAuthedUser () {
      let userG = this.currentUser
      let userid = this.$route.params.id
      if (userG && userG.id === Number(userid)) {
        this.userid = userG.id
        this.confirmed = userG.confirmed
      } else {
        this.$store.dispatch('getCurrentUser')
        .then(resp => {
          this.userid = resp.data.id
          this.confirmed = resp.data.confirmed
        })
      }
    },
    reconfirm () {
      reConfirmEmail().then(resp => {
        this.$message({
          showClose: true,
          message: resp.data
        })
      })
    }
  },
  created () {
    this.loadAuthedUser()
  }
}
</script>

<style lang="stylus" scoped>
.setting-page
  padding 10px 240px 10px 0px
  position relative
  .setting-view
    padding auto
  .setting-side
    position absolute
    top 10px
    right 0
    width 220px
    background-color white
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
</style>
