<template>
  <div class="tag-page">
    <div class="tag-side">
      <h4 class="sidetitle">Related Tags</h4>
      <div class="sidebody" v-for="(tag, index) in relatedTags" :key="index">
        <router-link :to="'/tag/' + tag">{{ tag }}</router-link>
      </div>
    </div>
    <div class="tagmeta">
      <h4>
        <b style="font-size:1.6em">{{ tname }}</b>
        <el-button type="text" @click="toEditTag">
          <small style="font-size:0.65em">...Edit</small>
        </el-button>
      </h4>
      <div>
        <div v-html="detailIntro || '...'"></div>
        <el-button type="text" size="mini" @click="short=false" v-if="less">
          ...More
        </el-button>
        <el-button type="text" size="mini" @click="short=true" v-if="!short">
          ...Less
        </el-button>
      </div>
      <div class="fobtn">
        <el-button type="success" size="mini" plain 
                   >{{action}} {{starCount}}
        </el-button><br>
        <img v-if="logo" style="max-width:65px;max-height:65px;margin-top:10px" 
             :src="logo" alt="Logo" referrerPolicy="no-referrer">
      </div>
    </div>
    <div class="submenu">
      <router-link :to="'/tag/' + tname +'/r'">List</router-link>
      <!-- <router-link :to="'/tag/' + tname +'/i'">Item</router-link> -->
      <!-- <router-link :to="'/tag/' + tname +'/c'">Discuss</router-link> -->
    </div>
    <div class="tag-view">
      <router-view></router-view>
    </div>
    <!-- edit tag dialog -->
    <el-dialog title="Edit Tag Description" width="640px" 
               :visible.sync="show" 
               :before-close="cancelOnClose">
      <v-form ref="form" class="tag-form">
        <v-text-field
          v-model="tname"
          label="Tag Name"
          :counter = "20"
          :rules="nameRule"
        ></v-text-field>
        <v-textarea
          v-model="logo"
          label="Logo Image Url"
          :counter = "120"
          :rules="lenRule"
          :rows= "1"
          auto-grow
        ></v-textarea>
        <v-text-field
          v-model= "parent"
          label= "Parent Tag"
        ></v-text-field>
        <v-textarea
          v-model="intro"
          label="Description Tag"
          counter
          :rows= "5"
          auto-grow
        ></v-textarea>
      </v-form>
      <el-button type="success" @click="onEditTag">Submit</el-button>
    </el-dialog>
    <!-- end edit tag dialog -->
  </div>
</template>

<script>
import { fetchTag, updateTag } from '../api'
import { checkAuth } from '../util/auth'
import { trimValid, showLess } from '../util/filters'
import marked from '../util/marked'

export default {
  name: 'tag-view',
  title () { return this.tname },
  data () {
    return {
      action: 'Follow',
      starCount: 0,
      show: false,
      short: true, // for btn show more or less
      less: true,  // for content more or less
      tag: {},
      tname: '',
      parent: '',
      logo: '',
      intro: '',
      relatedTags: [],
      lenRule: [ v => v.length <= 120 || 'Must be less than 120 characters' ],
      nameRule:[
        v => !!v || 'required',
        v => v.length <= 20 || 'Must be less than 20 characters'
      ]
    }
  },
  computed: {
    detailIntro () {
      let content = marked(this.intro)
      let least = 128
      this.less = content.length > least && this.short
      if (this.less) {
        return showLess(content, least)
      } else {
        // this.short = false // due to sync get tag?
        return content
      }
    }
  },
  methods: {
    loadTag () {
      let tg = this.$route.params.tname
      fetchTag(tg).then(resp => {
        this.setData(resp.data.tag)
      })
    },
    setData (data) {
      this.tag = data
      this.tname = data.tname
      this.logo = data.logo
      this.intro = data.intro
      this.starCount = data.satr_count
    },
    toEditTag () {
      if (!checkAuth()) {
        this.$message("Need to Log in")
        return
      }
      this.show = true
    },
    cancelOnClose (done) {
      done()
    },
    onEditTag (formName, form) {
      if (!this.$refs.form.validate()) {
        console.log("Invalid")
        return
      }
      if (checkAuth()) {
        let data = {
          tname: this.tname.trim(),
          intro: this.intro.trim(),
          logo: this.logo.trim(),
          pname: this.parent.trim(),
        }
        updateTag(this.tname, data).then(resp => {
          this.show = false
          this.setData(resp.data.tag)
        })
      } else {
        this.$message({
          showClose: true,
          message: 'Please Log in to Continue'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    }
  },
  watch: {
    '$route.params.name': 'loadTag' // watch to render re-used component
  },
  created () {
    this.loadTag()  // tag data and ruts can be cache?? 
  }
}
</script>

<style scoped>
.tag-page {
  padding: 10px 230px 10px 0px;
  position: relative;
}
.tag-side {
  position: absolute;
  right: 0;
  width: 220px;
  background-color: #fafbfa;
}
.tagmeta {
  background-color: white;
  min-height: 120px;
  padding: 5px 75px 5px 10px;
  margin-bottom: 5px;
  position: relative;
}
.fobtn {
  position: absolute;
  top: 15px;
  right: 5px;
  text-align: right;
}
</style>
