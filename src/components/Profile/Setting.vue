<template>
  <div class="setting-page" v-if="userid">
    <div class="setting-view">
      <router-view></router-view>
    </div>
    <div class="setting-side">
      <div class="right-info">
        <b>Setting: 
          <router-link :to="'/profile/' + userid">{{currentUser.name}}</router-link>
        </b>
      </div>
      <div class="right-nav">
        <router-link :to="'/setting/' + userid + '/setting'">Edit Profile</router-link>
        <br>
        <router-link :to="'/setting/' + userid + '/change'">
          Change Password
        </router-link>
        <br>
        <el-button type="text" @click="reconfirm" v-if="!confirmed">
          Confirm My Email
        </el-button>
        <br>
        <el-button type="text" @click="showDialog=true">Invite Friends</el-button>
        <!-- share to invite dialog -->
        <el-dialog title="Share Link To Invite Your Friends" width="420px"
                   :visible.sync="showDialog">
          <b>Send this Link to Invite Your Friend To RutHub</b>
          <p style="color: green">{{invitelink}}</p>
          <share-bar :passTitle="'Invite You To RutHub'" 
                     :passUrl="invitelink">
          </share-bar>
        </el-dialog>
        <!-- end share to invite dialog -->
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
      return 'https://ruthub.com/register?refcode=' + this.currentUser.recode
    }
  },
  methods: {
    loadAuthedUser () {
      let userG = this.currentUser
      let userid = this.$route.params.id
      if (userG.id === Number(userid)) {
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
    .right-info
      background-color #e5ebe4
      padding 5px
    .right-nav
      padding 5px 10px
      a
        color grey
        line-height 28px
        font-weight 400
        &.router-link-active
          color green
          font-weight 800
</style>
