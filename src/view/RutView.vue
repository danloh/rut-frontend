<template>
  <div class="rut-page">
    <div class="rut-view">
      <div class="tagbar">
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag.id">{{tag.tagname}}</router-link>
        </span>
        <el-button type="text" @click="toEditTag" v-show="canTag">..Edit</el-button>
      </div>
      <!-- edit tag dialog -->
      <el-dialog title="Edit Tag" :visible.sync="showDialog" :before-close="cancelOnClose" width="30%">
        <el-input size="mini" v-model="newTag" @keyup.enter.native="addNewTag" placeholder="Input a Tag, Press Enter to Add"></el-input>
        <div v-for="(tag, index) in newTags" :key="index">
          <p><el-button type="text" size="mini" @click="newTags.splice(index, 1)">X</el-button>&nbsp;&nbsp; {{ tag }} </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelEditTag">Cancel</el-button>
          <el-button type="success" size="mini" @click="editTag">Done</el-button>
        </div>
      </el-dialog>
      <!-- dialog end -->
      <div class="title">
        <h2>{{ rutDetail.title }}</h2>
        <p class="meta">
          <span v-if="!isEveryone">By <router-link :to="'/profile/' + creatorid">{{ creatorname }}</router-link> | </span> 
          {{ rutDetail.createat | toMDY }} | include {{ rutDetail.itemcount | pluralise('item') }} 
          | <router-link :to="'/commenton/rut/' + rutid">{{ rutDetail.commentcount | pluralise('comment') }}</router-link>
        </p>
      </div>
      <div class="intro">
        <b class="indicator">Preface:&nbsp;</b>
        <div v-html="md(rutDetail.intro)"></div>
      </div>
      <div class="toolbar">
        <router-link class="editlink" :to="'/profile/' + whoEdit.editorid" v-if="whoEdit.editorid && rutid === whoEdit.rutid">In Editing</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="editlink" :to="'/edit/readuplist/' + rutid" v-if="canEdit"> EDIT </router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="editlink" :to="'/additemto/readuplist/' + rutid" v-if="canEdit"> ADD ITEM </router-link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button size="mini" plain @click="starRut"><b>{{ starAction }}&nbsp;{{ starCount }}</b></el-button>
        <el-button size="mini" plain @click="challengeRut"><b>{{ challengeAction }}&nbsp;{{ challengeCount }}</b></el-button>
      </div>
      <div class="itemtip" v-for="tip in tips" :key="tip.cid">
        <item-sum class="itemsum" :item="tip.item" :key="tip.itemid"></item-sum>
        <b class="indicator">&nbsp;&nbsp;#{{tip.order}}&nbsp;&nbsp;</b> 
        <router-link class="editlink" :to="'/edit/readuptips/' + tip.cid" v-if="canEdit">...Edit</router-link>
        <div class="tip">
          <div v-html="md(tip.tip)" v-show="!tip.spoiler || !short"></div>
          <el-button type="text" size="mini" @click="short = !short" v-if="tip.spoiler && short">... Spoilers Ahead! Continue?</el-button>
        </div>
      </div>
      <div v-if="hasMoreTips">
        <el-button class="blockbtn" size="mini" @click="loadmoreTips" :disabled="!hasMoreTips">Show More Items</el-button>
      </div>
      <div class="epilog">
        <b class="indicator">Epilog:&nbsp;&nbsp;</b>
        <router-link class="editlink" :to="'/edit/readuplist/' + rutid" v-if="canEdit">...Edit</router-link>
        <div v-html="md(rutDetail.epilog)"></div>
      </div>
      <div class="bottombar">
        <share-bar></share-bar>
      </div>
    </div>
    <div class="rut-side">
      <div class="credential">
        <p class="credential-title"><b>Creator's Credential</b></p>
        <div class="credential-body">
          <div>{{ rutDetail.credential || aboutcreator || '...'}}</div>
          <router-link class="editlink" :to="'/edit/readuplist/' + rutid" v-if="canEdit">...Edit</router-link> 
        </div>
      </div>
      <div class="demands" v-if="demandCount">
        <b>As Answer to Request:</b>
        <p class="demand-title" v-for="(demand, index) in demands" :key="index" :demand="demand">
          - <router-link :to="'/demand/' + demand.id"> {{ demand.demand.slice(0, 42) }}...</router-link>
        </p>
        <div v-if="hasMoreDemand">
          <el-button size="mini" @click="loadmoreDemand" :disabled="!hasMoreDemand">Show More</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import Comment from '@/components/Comment/Comment.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'
// sc: star and challenge
import { scRut, checkSC, editTags, fetchRutDemands, fetchRutTips, checkRutLocked, lockRut, unlockRut } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { mapGetters } from 'vuex'
import marked from '@/util/marked'

export default {
  name: 'rut-view',
  components: { ItemSum, Comment, ShareBar },
  data () {
    return {
      starAction: 'Star',
      challengeAction: 'Challenge',
      starCount: 0,
      challengeCount: 0,
      tips: [],
      currentTP: 1,
      tipsCount: 0,
      demands: [],
      currentDP: 1,
      demandCount: 0,
      creatorid: null,
      creatorname: '',
      aboutcreator: '',
      isEveryone: false,
      showDialog: false,
      newTag: '',
      newTags: [],
      canEdit: false,
      canTag: true,
      short: true
    }
  },
  computed: {
    ...mapGetters([
      'rutDetail',
      'whoEdit'
    ]),
    rutid () {
      return this.rutDetail.id
    },
    tags () {
      return this.rutDetail.tags
    },
    // contributors () {
    //   return this.rutDetail.contributors
    // },
    // contributorIDList () {
    //   return this.rutDetail.contributoridlist
    // },
    hasMoreTips () {
      return this.tips.length < this.tipsCount
    },
    hasMoreDemand () {
      return this.demands.length < this.demandCount
    }
  },
  title () {
    return this.rutDetail.title
  },
  methods: {
    loadRutData () {
      let crutid = this.$route.params.id
      this.$store.dispatch('getRut', crutid)
      .then(resp => {
        let data = resp.data
        this.starCount = data.starcount
        this.challengeCount = data.challengecount
        this.creatorid = data.creator.id
        this.creatorname = data.creator.name
        this.aboutcreator = data.creator.about
        this.isEveryone = data.editable === 'Everyone'
        this.newTags = data.tags.map(t => t.tagname)
        this.tips = data.tips
        this.tipsCount = data.itemcount
        this.demands = data.demands
        this.demandCount = data.demandcount
        // check if show edit button
        let currentUserID = this.$store.getters.currentUserID
        if (!currentUserID) {
          this.canTag = false
        } else if (currentUserID === this.creatorid || this.isEveryone) {
          this.canEdit = true
        }
      })
    },
    loadmoreTips () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentTP}
      fetchRutTips(rutid, params)
      .then(resp => {
        this.tips.push(...resp.data)
        this.currentTP += 1
      })
    },
    loadmoreDemand () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentDP}
      fetchRutDemands(rutid, params)
      .then(resp => {
        this.demands.push(...resp.data)
        this.currentDP += 1
      })
    },
    checkStar () {
      if (checkAuth()) {
        let rutid = this.$route.params.id // ?? liftcycle timing
        return checkSC(rutid, 'star')
        .then(resp => {
          this.starAction = resp.data
        })
      } else {
        this.starAction = 'Star'
      }
    },
    checkChallenge () {
      if (checkAuth()) {
        let rutid = this.$route.params.id // ?? liftcycle timing
        return checkSC(rutid, 'challenge')
        .then(resp => {
          this.challengeAction = resp.data
        })
      } else {
        this.challengeAction = 'Challenge'
      }
    },
    starRut () {
      if (checkAuth()) {
        if (this.starAction === 'Star') {
          return scRut('star', this.rutid)
          .then(() => {
            this.starAction = 'Unstar'
            this.starCount += 1
          })
        } else {
          return scRut('unstar', this.rutid)
          .then(() => {
            this.starAction = 'Star'
            this.starCount -= 1
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
    },
    challengeRut () {
      if (checkAuth()) {
        if (this.challengeAction === 'Challenge') {
          return scRut('challenge', this.rutid)
          .then(() => {
            this.challengeAction = 'Endchallenge'
            this.challengeCount += 1
          })
        } else {
          return scRut('unchallenge', this.rutid)
          .then(() => {
            this.challengeAction = 'Challenge'
            this.challengeCount -= 1
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
    },
    toEditTag () {
      let currentUserID = this.$store.getters.currentUserID
      if (!currentUserID || !checkAuth()) { // utilize short-circle to set default auth
        this.showDialog = false
        this.$message('Please Log in to Continue')
      } else {
        checkRutLocked(currentUserID, this.rutid).then(resp => {
          if (!resp.data) {
            this.showDialog = true
            lockRut(this.rutid)
          } else {
            this.$message('in Editing...Please Try Later')
          }
        })
      }
    },
    cancelEditTag () {
      this.showDialog = false
      unlockRut(this.rutid)
    },
    cancelOnClose (done) {
      this.cancelEditTag()
      done()
    },
    addNewTag () {
      let newT = this.newTag.trim()
      if (newT) {
        this.newTags.push(newT)
        this.newTag = ''
      } else {
        this.$message({
          showClose: true,
          message: 'Invalid Input'
        })
      }
    },
    editTag () {
      if (checkAuth()) {
        let oldTags = this.tags.map(t => t.tagname)
        let newTags = this.newTags
        let data = {'old': oldTags, 'new': newTags}
        return editTags(this.rutid, data)
        .then(resp => {
          unlockRut(this.rutid)
          this.$store.commit('NEW_TAGS', resp.data)
          this.showDialog = false
        })
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
    },
    md (content) {
      return marked(content)
    }
  },
  watch: {
    '$route': 'loadRutData' // render re-used component for addtorut
  },
  created () {
    this.loadRutData()
    this.checkStar()
    this.checkChallenge()
  }
}
</script>

<style lang="stylus" scoped>
$bgcolor = lighten(#f6f6f1, 50%)
.rut-page
  padding 10px 250px 10px 0px
  position relative
  .rut-view
    background-color lighten(#eceef1, 50%)
    padding auto
    .title
      padding 0 10px
      .meta 
        color #828282
        font-size 0.8em
    .intro
      background-color $bgcolor
      padding 5px 10px
      border-bottom 1px dotted #f3bc59
    .itemtip
      background-color $bgcolor
      .itemsum
        top 5px
        margin 5px
      .tip
        padding 5px 10px
    .epilog
      background-color $bgcolor
      padding 10px
      margin-top 5px
      border-top 1px dotted orange
    .tagbar
      display inline-blcok
      .tag
        padding-left 10px
        a
          color green
          background-color #eef4fa
          font-size 0.85em
          font-weight 700
    .toolbar
      display flex
      align-items center
      justify-content flex-end
    .bottombar
      font-size 0.85em
      padding 5px
      text-align right
  .indicator
    font-size 0.7em
    color #668e66
  .editlink
    font-size 0.7em
    font-weight 600
  .rut-side
    position absolute
    right 0
    top 10px
    width 240px
    .credential
      background-color #f5f9f5
      .credential-title
        background-color #dff0d8
        padding 10px
        color #3c763d
      .credential-body
        padding 0 10px
        min-height 45px
        font-size 0.85em
    .demands
      background-color white
      padding 5px
      margin-bottom 5px
      .demand-title
        font-size 0.85em
        a
          &:hover
            color #ff6600
</style>
