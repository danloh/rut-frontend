<template>
  <div class="tag-page">
    <div class="tag-side">
      <h4 class="sidetitle">Related Tags</h4>
      <div class="sidebody" v-for="(tag, index) in relatedTags" :key="index">
        <router-link :to="'/tag/' + tag.tagname">{{tag.tagname}}</router-link>
      </div>
    </div>
    <div class="tagmeta" :style="{ 'color': ftcolor, 'background-color': bgcolor }">
      <h4>
        <b style="font-size:1.6em">{{ tagDetail.tagname }}</b>
        <el-button type="text" @click="toEditTag">
          <small style="font-size:0.65em">...Edit</small>
        </el-button>
      </h4>
      <div>
        <div v-html="detailContent || '...'"></div>
        <el-button type="text" size="mini" @click="short=false" v-if="less">
          ...More
        </el-button>
        <el-button type="text" size="mini" @click="short=true" v-if="!short">
          ...Less
        </el-button>
      </div>
      <div class="fobtn">
        <el-button type="success" size="mini" plain 
                   @click="favTag">{{action}} {{favCount}}
        </el-button><br>
        <img v-if="tagLogo" style="max-width:65px;max-height:65px;margin-top:10px" 
             :src="tagLogo" alt="Logo" referrerPolicy="no-referrer">
      </div>
    </div>
    <div class="submenu">
      <router-link :to="'/tag/' + tagname +'/readlist'">List</router-link>
      <router-link :to="'/tag/' + tagname +'/demand'">Ask</router-link>
      <router-link :to="'/tag/' + tagname +'/item'">Item</router-link>
      <router-link :to="'/tag/' + tagname +'/comment'">Discuss</router-link>
    </div>
    <div class="tag-view">
      <router-view></router-view>
    </div>
    <!-- edit tag dialog -->
    <el-dialog title="Edit Tag Description" width="640px" 
               :visible.sync="openDialog" 
               :before-close="cancelOnClose">
      <el-form :model="tagForm" :rules="rules" ref="tagForm" size="mini">
        <el-form-item label="Tag Name" prop="name">
          <el-input v-model="tagForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Parent Tag" prop="parent">
          <el-input v-model="tagForm.parent"></el-input>
        </el-form-item>
        <el-form-item label="Logo" prop="logo">
          <el-input type="textarea" autosize v-model="tagForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input type="textarea" v-model="tagForm.description" 
                    :autosize="{minRows:3}">
          </el-input>
        </el-form-item>
        <el-form-item label="Background Color" prop="bgcolor">
          <el-input v-model="tagForm.bgcolor" placeholder="like: #3e7cae"></el-input>
        </el-form-item>
        <el-form-item label="Font Color" prop="ftcolor">
          <el-input v-model="tagForm.ftcolor" placeholder="like: #ffdf58"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="onEditTag('tagForm', tagForm)">
          Submit
        </el-button>
      </div>
    </el-dialog>
    <!-- end edit tag dialog -->
  </div>
</template>

<script>
import {
  editTag, checkFav, favTag, fetchTag, checkTagLocked, lockTag, unlockTag
} from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid, showLess } from '@/util/filters'
import marked from '@/util/marked'

export default {
  name: 'tag-view',
  title () {
    return '#' + this.tagname
  },
  data () {
    return {
      action: 'Follow',
      favCount: 0,
      openDialog: false,
      tagDetail: {},
      short: true, // for btn show more or less
      less: true,  // for content more or less
      tagid: null,
      tagname: '',
      tagLogo: '',
      ftcolor: '',
      bgcolor: '',
      tagForm: {
        name: '',
        parent: '',
        logo: '',
        ftcolor: '',
        bgcolor: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' },
          { max: 120, message: 'Max Length should be 120', trigger: 'change' }
        ],
        parent: [
          { max: 120, message: 'Max Length should be 120', trigger: 'change' }
        ],
        logo: [
          { max: 500, message: 'Max Length should be 500', trigger: 'change' }
        ],
        ftcolor: [
          { max: 60, message: 'Max Length should be 60', trigger: 'change' }
        ],
        bgcolor: [
          { max: 60, message: 'Max Length should be 60', trigger: 'change' }
        ],
        description: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'change' }
        ]
      },
      relatedTags: []
    }
  },
  computed: {
    detailContent () {
      let content = marked(this.tagDetail.descript)
      let least = 128
      this.less = content.length > least && this.short
      if (this.less) {
        return showLess(content, least)
      } else {
        // this.short = false // due to sync get tagDetail?
        return content
      }
    }
  },
  methods: {
    loadData () {
      let tg = this.$route.params.name
      fetchTag(tg).then(resp => {
        this.setData(resp.data)
        this.relatedTags = resp.data.tags.slice(0, 16)
        this.action = this.checkFavor() // || 'Follow'
      })
    },
    setData (data) {
      this.tagDetail = data
      this.tagid = data.id
      this.tagname = this.tagForm.name = data.tagname
      this.tagLogo = this.tagForm.logo = data.logo
      this.ftcolor = this.tagForm.ftcolor = data.ftcolor
      this.bgcolor = this.tagForm.bgcolor = data.bgcolor
      this.tagForm.description = data.descript
      this.favCount = data.favcount
    },
    toEditTag () {
      let currentUserID = this.$store.getters.currentUserID
      if (!currentUserID || !checkAuth()) { // utilize short-circle to set default auth
        this.openDialog = false
        this.$message('Please Log in to Continue')
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      } else {
        checkTagLocked(currentUserID, this.tagid).then(resp => {
          if (!resp.data) {
            this.openDialog = true
            lockTag(this.tagid)
          } else {
            this.$message('in Editing...Please Try Later')
          }
        })
      }
    },
    cancelEditTag () {
      this.openDialog = false
      unlockTag(this.tagid)
    },
    cancelOnClose (done) {
      this.cancelEditTag()
      done()
    },
    onEditTag (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            name: form.name.trim(),
            parent: form.parent.trim(),
            logo: form.logo.trim(),
            ftcolor: form.ftcolor.trim(),
            bgcolor: form.bgcolor.trim(),
            description: form.description.trim()
          }
          editTag(this.tagid, data).then(resp => {
            this.openDialog = false
            unlockTag(this.tagid)
            this.setData(resp.data)
            this.$message({
              showClose: true,
              message: 'Tag Info Updated, Thanks',
              type: 'success'
            })
          })
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Please Log in to Continue'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    },
    checkFavor () {
      if (checkAuth()) {
        checkFav(this.tagid).then(resp => {
          this.action = resp.data
        })
      } else {
        return 'Follow' // work incorrectly when non-login if no return
      }
    },
    favTag () {
      if (checkAuth()) {
        let tagid = this.tagid
        if (this.action === 'Follow') {
          favTag('fav', tagid).then(() => {
            this.action = 'UnFollow'
            this.favCount += 1
          })
        } else {
          favTag('unfav', tagid).then(() => {
            this.action = 'Follow'
            this.favCount -= 1
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
  watch: {
    '$route.params.name': 'loadData' // watch to render re-used component
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="stylus" scoped>
.tag-page
  padding 10px 230px 10px 0px
  position relative
  .tag-side
    position absolute
    right 0
    width 220px
    background-color lighten(#e5ebe4, 80%)
    .sidetitle
      background-color #e5ebe4
      padding 5px 10px
    .sidebody
      padding 5px 10px
  .tagmeta
    background-color white
    min-height: 120px
    padding 5px 75px 5px 10px
    margin-bottom 5px
    position relative
    .fobtn
      position absolute
      top 15px
      right 5px
      text-align right
</style>
