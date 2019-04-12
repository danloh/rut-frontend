<template>
  <div class="profile-page" v-if="uname">
    <div class="profile-head">
      <router-link :to="'/p/' + uname">
        <b style="font-size:1.6em">{{ user.nickname }}</b>
      </router-link>
      <router-link :to="'/updateuser/' + uname" v-if="showSetting">
        <small> @{{uname}}</small>
      </router-link>
      <small class="location"> &nbsp; {{ user.location }}</small>
      <div class="aboutme">{{user.intro || '...'}}</div>
    </div>
    <div class="profile-view">
      <router-view></router-view>
    </div>
    <div class="profile-side">
      <div class="right-avatar">
        <avatar :uname="uname" :size="210" :rounded="false" :src="user.avatar"></avatar>
        <small class="user-info"> &nbsp;{{user.join_at | toMDY}} Joined</small>
      </div>
      <div class="right-nav">
        <router-link :to="'/p/' + uname + '/created'">
          <b style="color:royalblue">*</b> Post
        </router-link>
        <router-link to="/new">
          <small style="color:orange"> +New</small>
        </router-link>
        <br>
        <router-link :to="'/p/' + uname + '/star'">
          <b style="color:royalblue">*</b> Star
        </router-link>
        <br>
        <router-link :to="'/p/' + uname + '/doing'">
          <b style="color:coral">~</b> Doing
        </router-link>
        <br>
        <router-link :to="'/p/' + uname + '/todo'">
          <b style="color:coral">~</b> Todo
        </router-link>
        <br>
        <router-link :to="'/p/' + uname + '/done'">
          <b style="color:coral">~</b> Done
        </router-link>
        <br><br>
        <b># Topic: </b><br>
        <span v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag"><small>{{tag}} &nbsp;</small></router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUser, fetchTags } from '../api'
import Avatar from '../components/User/Avatar.vue'

export default {
  name: 'profile',
  title () {
    return this.uname
  },
  components: { Avatar },
  data () {
    return {
      user: {},
      uname: this.$route.params.id,
      tags: [],
      showSetting: false,
    }
  },
  methods: {
    loadUser () {
      let pathid = this.$route.params.id
      let currID = this.$store.state.actID
      let userdata = this.$store.state.actUser
      if (pathid === userdata.uname) {
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
      this.uname = data.uname
    },
    loadTags () {
      fetchTags('user', this.uname).then(resp => {
        this.tags = resp.data.tags
      })
    }
  },
  created () {
    this.loadUser()
    this.loadTags()
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
.location {
  color: #828282;
  font-size: 10px;
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
.aboutme, .user-info, .fobar {
  font-size: 0.85em;
}
</style>
