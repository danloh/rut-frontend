<template>
  <div id="app">
    <header class="header">
      <nav class="nav-menu">
        <router-link to="/">
            <small style="color:darkorange;font-size:1.2em;letter-spacing:0.005em">
              RutHub<sup style="font-size:0.5em;color:grey"> alpha</sup>
            </small>
        </router-link>
        <div class="right-menu">
          <div v-if="authed">
            <router-link to="/new">New</router-link>
            <router-link to="/profile">:::</router-link>
            <v-btn small flat @click="onLogout"><small>Log Out</small></v-btn>
          </div>
          <div v-else>
            <v-btn small flat @click="toLogin=true">Log in</v-btn>
            <!-- login dialog -->
            <v-dialog v-model="toLogin" width="450px">
              <v-card>
                <!-- .sync: parent sync value from child component -->
                <login-form :next="'current'" :show.sync="toLogin"></login-form>
              </v-card>
            </v-dialog> <!--warn: Unable to locate target [data-app], why?-->
            <!-- end login dialog -->
          </div>
        </div>
      </nav>
    </header>
    <div class="view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/Auth/LoginForm.vue'

export default {
  name: 'app',
  components: { LoginForm },
  data () {
    return {
      toLogin: false
    }
  },
  computed: {
    authed () { 
      return this.$store.state.authed
    },
    currID () { 
      return this.$store.state.actID
    }
  },
  methods: {
    onLogout () {
      this.$store.commit('DEL_TOKEN')
      this.$router.push('/')
    }
  }
}
</script>

<style>
body {
  font-family: Lato,Roboto,Open Sans,sans-serif;
  font-size: 18px;
  line-height: 1.6em;
  color: #34495e;
  overflow-wrap: break-word;
}
.header {
  background-color: #f5f5f5;
  border-bottom: 2px solid #eee;
  z-index: 999;
  height: 42px;
  top: 0;
  left: 0;
  right: 0;
}
.header .nav-menu {
  max-width: 960px;
  min-width: 800px;
  box-sizing: border-box;
  margin: 0px auto;
  padding: 6px 0px;
}
.header .nav-menu .right-menu {
  float: right;
}
.header .nav-menu a {
  color: #080400;
  line-height: 24px;
  display: inline-block;
  vertical-align: middle;
  letter-spacing: 0.075em;
  margin-right: 0.85em;
}
.header .nav-menu a:hover {
  color: orange;
}
.header .nav-menu a.router-link-active {
  color: green;
}

.view {
  max-width: 960px;
  min-width: 800px;
  min-height: 42em;
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.submenu {
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
}
.submenu a {
  color: grey;
  margin-right: 0.85em;
}
.submenu a:hover {
  color: darkgreen;
}
.submenu a.router-link-active {
  color: orange;
  font-weight: 800;
}

a {
  color: #37a;
  text-decoration: none;
}
a:hover {
  color: green;
}
h2, h3, h4 {
  margin: 8px 0;
  line-height: 1.2em;
  font-family: Pontano Sans, Lato, Roboto, Open Sans, serif;
}
p {
  margin: 5px 0;
}
pre {
  background-color: #f0f0f0;
  padding: 5px;
}
blockquote {
  border-left: 3px solid lighten(orange, 80%);
  margin: 5px;
  padding-left: 12px;
}
.blockbtn {
  display: block;
  margin: 5px 0;
  width: 100%;
  text-align: center;
}
</style>
