<template>
  <div class="rut-page">
    <div class="rut-view">
      <div class="tagbar">
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag.id">{{tag.tagname}}</router-link>
        </span>
        <el-button class="editlink" type="text" @click="toEdit('tag')" v-show="canTag">
          ..Edit
        </el-button>
      </div>
      <!-- edit tag dialog -->
      <el-dialog title="Edit Tag" width="30%" 
                 :visible.sync="showDialog.tag" 
                 :before-close="cancelOnClose">
        <el-input size="mini" v-model="newTag" 
                  @keyup.enter.native="addNewTag" 
                  placeholder="Input a Tag, Press Enter to Add">
        </el-input>
        <div v-for="(tag, index) in newTags" :key="index">
          <p><el-button type="text" size="mini" 
                        @click="newTags.splice(index, 1)">
                        &times;
              </el-button>&nbsp;&nbsp; 
              {{ tag }} 
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" size="mini" @click="onEditTags">Done</el-button>
        </div>
      </el-dialog>
      <!-- edit tag dialog end -->
      <div class="title">
        <h2>{{ rutDetail.title }}</h2>
        <p class="meta">
          <span v-if="!isEveryone">By 
            <router-link :to="'/profile/' + creatorid">
              {{ creatorname }}
            </router-link> | 
          </span> 
          {{ rutDetail.createat | toMDY }} 
          | include {{ rutDetail.itemcount | pluralise('item') }} 
          | <router-link :to="'/commenton/rut/' + rutid">
              {{ rutDetail.commentcount | pluralise('comment') }}
            </router-link>
        </p>
      </div>
      <div class="intro">
        <b class="indicator">Preface:&nbsp;</b>
        <div v-html="md(rutDetail.intro)"></div>
      </div>
      <div class="toolbar">
        <router-link class="editlink" :to="'/profile/' + whoEdit.editorid" 
                     v-if="whoEdit.editorid && rutid === whoEdit.rutid">
                     In Editing
        </router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="editlink" 
                     :to="'/edit/readuplist/' + rutid" v-if="canEdit">
                      <b>Edit </b>
        </router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="editlink" 
                     :to="'/additemto/readuplist/' + rutid" v-if="canEdit">
                      <b>Add Item </b>
        </router-link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button size="mini" plain @click="starRut">
          <b>{{ starAction }}&nbsp;{{ starCount }}</b>
        </el-button>
        <el-button size="mini" plain @click="challengeRut">
          <b>{{ challengeAction }}&nbsp;{{ challengeCount }}</b>
        </el-button>
      </div>
      <div class="itemtip" v-for="tip in tips" :key="tip.cid">
        <item-sum class="itemsum" :item="tip.item" :key="tip.itemid"></item-sum>
        <b class="indicator">&nbsp;&nbsp;#{{tip.order}}&nbsp;&nbsp;</b> 
        <router-link class="editlink" 
                     :to="'/edit/readuptips/' + tip.cid" 
                     v-if="canEdit">
                     ...Edit
        </router-link>
        <tip-sum class="tip" :tip="tip"></tip-sum>
      </div>
      <div v-if="hasMoreTips">
        <el-button class="blockbtn" size="mini" 
                   @click="loadmoreTips" 
                   :disabled="!hasMoreTips">
                   Show More Items
        </el-button>
      </div>
      <div class="epilog">
        <b class="indicator">Epilog:&nbsp;&nbsp;</b>
        <el-button class="editlink" type="text" @click="toEdit('epi')" v-show="canEdit">
          ..Edit
        </el-button>
        <div v-html="md(epiForm.epilog)"></div>
      </div>
      <!-- edit epilog dialog -->
      <el-dialog title="Add or Edit Epilog" width="45%" 
                 :visible.sync="showDialog.epi"
                 :before-close="cancelOnClose">
        <el-form :model="epiForm" ref="epiForm">
          <el-form-item prop="epilog">
            <el-input type="textarea" :autosize="{minRows:5}" v-model="epiForm.epilog"></el-input>
            <md-tool :pretext="epiForm.epilog" @insertmd="updateE"></md-tool>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="success" @click="onEditEpi('epiForm', epiForm)">
            Done
          </el-button>
        </div>
      </el-dialog>
      <!-- edit epilog dialog end -->
      <div class="bottombar">
        <share-bar></share-bar>
      </div>
    </div>
    <div class="rut-side">
      <div class="credential">
        <p class="credential-title"><b>Creator's Credential</b></p>
        <div class="credential-body">
          <div>{{ creForm.credential || aboutcreator || '...' }}</div>
          <el-button class="editlink" type="text" @click="toEdit('cre')" v-show="canEdit">
            ..Edit
          </el-button>
        </div>
      </div>
      <!-- edit credential dialog -->
      <el-dialog title="Add or Edit Credential" width="40%" 
                 :visible.sync="showDialog.cre"
                 :before-close="cancelOnClose">
        <el-form :model="creForm" ref="creForm">
          <el-form-item prop="credential">
            <el-input type="textarea" autosize v-model="creForm.credential"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="success" @click="onEditCre('creForm', creForm)">
            Done
          </el-button>
        </div>
      </el-dialog>
      <!-- edit credential dialog end -->
      <div class="demands" v-if="demandCount">
        <b>As Answer to Request:</b>
        <p class="demand-title" 
           v-for="(demand, index) in demands" 
           :key="index" 
           :demand="demand">
          - <router-link :to="'/demand/' + demand.id">
               {{ demand.demand.slice(0, 42) }}...
            </router-link>
        </p>
        <div v-if="hasMoreDemand">
          <el-button size="mini" 
                     @click="loadmoreDemand" 
                     :disabled="!hasMoreDemand">
                     Show More
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'
import TipSum from '@/components/Rut/TipSum.vue'
import MdTool from '@/components/Misc/MdTool.vue'
// sc: star and challenge
import {
  scRut, checkSC, editTags, editRutce, fetchRutDemands,
  fetchRutTips, checkRutLocked, lockRut, unlockRut
} from '@/api/api'
import { checkAuth } from '@/util/auth'
import { mapGetters } from 'vuex'
import marked from '@/util/marked'

export default {
  name: 'rut-view',
  components: { ItemSum, TipSum, ShareBar, MdTool },
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
      canEdit: false,
      canTag: true,
      showDialog: {
        tag: false,
        epi: false,
        cre: false
      },
      newTag: '',
      newTags: [],
      epiForm: {
        epilog: ''
      },
      creForm: {
        credential: ''
      }
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
        this.creForm.credential = data.credential
        this.epiForm.epilog = data.epilog
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
      fetchRutTips(rutid, params).then(resp => {
        this.tips.push(...resp.data)
        this.currentTP += 1
      })
    },
    loadmoreDemand () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentDP}
      fetchRutDemands(rutid, params).then(resp => {
        this.demands.push(...resp.data)
        this.currentDP += 1
      })
    },
    checkStar () {
      if (checkAuth()) {
        let rutid = this.$route.params.id // ?? liftcycle timing
        checkSC(rutid, 'star').then(resp => {
          this.starAction = resp.data
        })
      } else {
        this.starAction = 'Star'
      }
    },
    checkChallenge () {
      if (checkAuth()) {
        let rutid = this.$route.params.id // ?? liftcycle timing
        checkSC(rutid, 'challenge').then(resp => {
          this.challengeAction = resp.data
        })
      } else {
        this.challengeAction = 'Challenge'
      }
    },
    starRut () {
      if (checkAuth()) {
        if (this.starAction === 'Star') {
          scRut('star', this.rutid).then(() => {
            this.starAction = 'Unstar'
            this.starCount += 1
          })
        } else {
          scRut('unstar', this.rutid).then(() => {
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
          scRut('challenge', this.rutid).then(() => {
            this.challengeAction = 'Endchallenge'
            this.challengeCount += 1
          })
        } else {
          scRut('unchallenge', this.rutid).then(() => {
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
    onEditTags () {
      if (checkAuth()) {
        let oldTags = this.tags.map(t => t.tagname)
        let newTags = this.newTags
        let data = {'old': oldTags, 'new': newTags}
        editTags(this.rutid, data).then(resp => {
          unlockRut(this.rutid)
          this.$store.commit('NEW_TAGS', resp.data)
          this.showDialog.tag = false
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
    onEditEpi (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            epilog: form.epilog.trim()
          }
          editRutce(this.rutid, data).then(resp => {
            let id = this.rutid
            unlockRut(id)
            this.showDialog.epi = false
            form.epilog = resp.data.epilog
          })
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    onEditCre (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            credential: form.credential.trim()
          }
          editRutce(this.rutid, data).then(resp => {
            let id = this.rutid
            unlockRut(id)
            this.showDialog.cre = false
            form.credential = resp.data.credential
          })
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    toEdit (to) {
      let currentUserID = this.$store.getters.currentUserID
      if (!currentUserID || !checkAuth()) { // utilize short-circuit to set default auth
        this.$message('Please Log in to Continue')
      } else {
        checkRutLocked(currentUserID, this.rutid).then(resp => {
          if (!resp.data) {
            this.showDialog[to] = true
            lockRut(this.rutid)
          } else {
            this.$message('in Editing...Please Try Later')
          }
        })
      }
    },
    cancelOnClose (done) {
      unlockRut(this.rutid)
      done()
    },
    updateE (data) {
      this.epiForm.epilog += data
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
