<template>
  <div class="tag-page">
    <div class="tag-side">
      <h4 class="sidetitle">Related Tags</h4>
      <div class="sidebody" v-for="(tag, index) in relatedTags" :key="index">
        <router-link :to="'/tag/' + tag.tagid">{{tag.tagname}}</router-link>
      </div>
    </div>
    <div class="tagmeta">
      <h4>
        <b style="font-size:1.5em">{{ tagName }}</b>
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
        <img v-if="tagLogo" style="width:65px;height:65px;margin-top:10px" 
             :src="tagLogo" alt="Logo" referrerPolicy="no-referrer">
      </div>
    </div>
    <div class="submenu">
      <router-link :to="'/tag/' + tagid +'/readlist'">ReadList</router-link>
      <router-link :to="'/tag/' + tagid +'/demand'">Request</router-link>
      <router-link :to="'/tag/' + tagid +'/item'">Item</router-link>
    </div>
    <div class="tag-view">
      <router-view></router-view>
    </div>
    <!-- edit tag dialog -->
    <el-dialog title="Edit Tag Description" width="480px" 
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="editTag('tagForm', tagForm)">
          Submit
        </el-button>
      </div>
    </el-dialog>
    <!-- end edit tag dialog -->
  </div>
</template>

<script>
import {
  editTag, checkFav, favTag, fetchTag, fetchTagID,
  checkTagLocked, lockTag, unlockTag
} from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid, showLess } from '@/util/filters'
import marked from '@/util/marked'

export default {
  name: 'tag-view',
  title () {
    return '#' + this.tagDetail.tagname
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
      tagForm: {
        name: '',
        parent: '',
        logo: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, validator: trimValid, message: 'Need a Tag Name', trigger: 'blur' },
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ],
        parent: [
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ],
        logo: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        description: [
          { required: true, validator: trimValid, message: 'Please Descript it', trigger: 'blur' }
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
    },
    tagName () {
      return this.tagDetail.tagname
    },
    tagLogo () {
      return this.tagDetail.logo
    }
  },
  methods: {
    loadData () {
      let tagparam = this.$route.params.id
      if (tagparam.startsWith('@')) {
        fetchTagID(tagparam).then(resp => {
          this.tagid = resp.data
          this.fetchData(this.tagid)
        })
      } else {
        this.tagid = tagparam
        this.fetchData(this.tagid)
      }
    },
    fetchData (tgid) {
      fetchTag(tgid).then(resp => {
        let data = resp.data
        this.relatedTags = data.tags.slice(0, 16)
        this.tagDetail = data
        this.tagForm.name = data.tagname
        this.tagForm.description = data.descript
        this.tagForm.logo = data.logo
        this.favCount = data.favcount
        this.action = this.checkFavor() // || 'Follow'
      })
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
    editTag (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            name: form.name.trim(),
            parent: form.parent.trim(),
            logo: form.logo.trim(),
            description: form.description.trim()
          }
          editTag(this.tagid, data).then((resp) => {
            this.openDialog = false
            unlockTag(this.tagid)
            this.fetchData(this.tagid)  // can be less consumption?
            this.$message({
              showClose: true,
              message: resp.data,
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
    '$route.params.id': 'loadData' // watch to render re-used component
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
      a
        &:hover
          color #ff6600
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
  .submenu
    margin-bottom 10px
    border-bottom 1px solid #eee
    a
      color grey
      margin-right 0.85em
      &:hover
        color darkgreen
      &.router-link-active
        color orange
        font-weight 800
</style>
