<template>
  <div class="profile-page" v-if="username">
    <div class="profile-head">
      <router-link :to="'/p/' + userid">
        <b style="font-size:1.6em">{{ username }}</b>
      </router-link>
      <router-link :to="'/updateuser/' + userid" v-if="showSetting">
        <small style="font-size:0.75em"> ...</small>
      </router-link>
      <p class="aboutme">{{user.intro || '...'}}</p>
    </div>
    <div class="profile-view">
      <router-view></router-view>
    </div>
    <div class="profile-side">
      <div class="right-avatar">
        <avatar :username="username" :size="210" :rounded="false" :src="user.avatar"></avatar>
        <p class="user-info"> &nbsp;{{user.join_at | toMDY}} Joined</p>
      </div>
      <div class="right-nav">
        <router-link :to="'/p/' + userid + '/star/'">
          <b style="color:royalblue">*</b> Star
        </router-link>
        <br>
        <router-link :to="'/p/' + userid + '/created/'">
          <b style="color:royalblue">*</b> Created
        </router-link>
        <router-link to="/new">
          <small style="color:orange"> +New</small>
        </router-link>
        <br>
        <router-link :to="'/setting/' + userid" v-if="showSetting">
          <small class="small-setting">~Setting~</small>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUser } from '../api'
import Avatar from '../components/User/Avatar.vue'

export default {
  name: 'profile',
  title () {
    return this.username
  },
  components: { Avatar },
  data () {
    return {
      user: {},
      username: '',
      userid: this.$route.params.id,
      showSetting: false,
    }
  },
  methods: {
    loadUser () {
      let pathid = this.$route.params.id
      let currID = this.$store.state.actID
      let userdata = this.$store.state.actUser
      if (pathid === userdata.id) {
        this.showSetting = true
        this.setData(userdata)
      } else {
        fetchUser(pathid).then(resp => {
          let data = resp.data.user
          this.setData(data)
          if (pathid === currID) {
            this.showSetting = true
            this.$store.commit('SET_INFO', data)
          } 
        })
      }
    },
    setData (data) {
      this.user = data
      this.username = data.uname
      this.userid = data.id
    }
  },
  created () {
    this.loadUser()
  },
  watch: {
    '$route.params.id': 'loadUser'
  }
}
</script>

<style scoped>
.profile-page {
  padding: 10px 240px 10px 0px;
  position: relative;
}
.profile-head {
  background-color: #f6f6f1;
  border-bottom: 1px dashed orange;
  min-height: 60px;
  padding: 5px 215px 5px 10px;
  margin-bottom: 5px;
  position: relative;
}
.profile-view {
  padding: auto;
  min-height: 400px;
}
.profile-side {
  position: absolute;
  top: 10px;
  right: 0;
  width: 220px;
  background-color: #f8faf8;
}
.right-avatar {
  background-color: #e5ebe4;
  min-height: 60px;
  padding: 5px;
  position: relative;
}
.avatar {
  width: 210px;
  height: 210px;
}
.right-nav {
  padding: 5px 10px;
}
.right-nav a {
  color: grey;
  line-height: 28px;
  font-weight: 400;
}
.right-nav a.router-link-active {
  color: green;
  font-weight: 800;
}
.small-setting {
  outline: dotted 1px;
  background-color: #d5d5be;
}
.aboutme, .user-info, .fobar {
  font-size: 0.85em;
}
</style>
