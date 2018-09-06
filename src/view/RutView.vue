<template>
  <div class="rut-page">
    <div class="rut-view">
      <div class="tagbar">
        <span class="tag" v-for="(tag, index) in tags" :key="index">
          <router-link :to="'/tag/' + tag.tagname"><b>{{tag.tagname}}</b></router-link>
        </span>
        <el-button class="indicator" type="text" @click="toEdit('tag')" v-show="canTag">
          ..Edit
        </el-button>
      </div>
      <!-- edit tag dialog -->
      <el-dialog title="Edit Tag" width="350px" 
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
      <!-- end edit tag dialog -->
      <div class="title">
        <h2>{{ rutDetail.title }}</h2>
        <p class="meta">
          Created: {{ rutDetail.createat | toMDY }} 
          <span v-if="rutDetail.renewat"> | Updated: {{ rutDetail.renewat | toMDY }}</span>
          | including {{ rutDetail.itemcount | pluralise('item') }} 
          | <router-link :to="'/commenton/rut/' + rutid">
              {{ rutDetail.commentcount | pluralise('comment') }}
            </router-link>
        </p>
      </div>
      <div class="intro">
        <b class="indicator">Preface:&nbsp;</b>
        <div v-html="md(rutDetail.intro)"></div>
        <span v-if="convertfrom.id" style="color:grey;font-size:10px">
          Converted from RoadMap: 
          <a :href="'/roadmap/' + convertfrom.id" :title="convertfrom.title">
            {{convertfrom.title.slice(0, 42)}}
          </a>
        </span>
      </div>
      <div class="toolbar">
        <router-link class="indicator" :to="'/profile/' + whoEdit.editorid" 
                     v-if="whoEdit.editorid && rutid === whoEdit.rutid">
                     In Editing
        </router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="indicator" 
                     :to="'/edit/readlist/' + rutid" v-if="canEdit">
                      <b>Edit </b>
        </router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="indicator" :to="'/additemto/readlist/' + rutid" 
                     v-if="canEdit && rutDetail.itemcount<=42">
                     <b>Add Item </b>
        </router-link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link :to="'/readlist/' + rutid + '/readmode'" 
                     title="Reader Mode, w/o Spoiler-Warning">
                     <b style="font-size:12px">ReaderMode</b>
        </router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button size="mini" plain @click="starRut">
          <b><i class="el-icon-star-on"></i> {{ starAction }}&nbsp;{{ starCount }}</b>
        </el-button>
      </div>
      <div class="itemtip" v-for="tip in tips" :key="tip.cid">
        <item-sum class="itemsum" :item="tip.item" :key="tip.itemid"></item-sum>
        <b class="indicator">&nbsp;&nbsp;#{{tip.order}}&nbsp;&nbsp;</b> 
        <router-link class="indicator" 
                     :to="'/edit/readuptips/' + tip.cid" 
                     v-if="canEdit">
                     ...Edit
        </router-link>
        <tip-sum class="tip" :tip="tip"></tip-sum>
      </div>
      <div class="epilog">
        <b class="indicator">Epilog:&nbsp;&nbsp;</b>
        <el-button class="indicator" type="text" @click="toEdit('epi')" v-show="canEdit">
          ..Edit
        </el-button>
        <div v-html="md(epiForm.epilog)"></div>
      </div>
      <!-- edit epilog dialog -->
      <el-dialog title="Add or Edit Epilog" width="520px" 
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
      <!-- end edit epilog dialog -->
      <div class="sharebar">
        <share-bar></share-bar>
      </div>
    </div>
    <div class="rut-side">
      <div class="credential">
        <p class="credential-title">Creator's Credential</p>
        <div class="credential-body">
          <span> 
            <a :href="crediturl">{{ creditto }}</a> 
          </span>
          <div v-html="md(creForm.credential || aboutcreator || '...')"></div>
          <el-button class="indicator" type="text" @click="toEdit('cre')" v-show="canEdit">
            ..Edit
          </el-button>
        </div>
      </div>
      <!-- edit credential dialog -->
      <el-dialog title="Add or Edit Credential" width="450px" 
                 :visible.sync="showDialog.cre"
                 :before-close="cancelOnClose">
        <el-form :model="creForm" ref="creForm">
          <el-form-item prop="credential">
            <el-input type="textarea" autosize v-model="creForm.credential"></el-input>
          </el-form-item>
          <small>Max 255 characters</small>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="success" @click="onEditCre('creForm', creForm)">
            Done
          </el-button>
        </div>
      </el-dialog>
      <!-- end edit credential dialog -->
      <div class="demands" v-if="rutDetail.demandcount">
        <b>As Answer to Request:</b>
        <p class="demand-title" 
           v-for="(demand, index) in demands" :key="index" :demand="demand">
          - <router-link :to="'/demand/' + demand.id">
               {{ demand.demand.slice(0, 42) }}...
            </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'
import TipSum from '@/components/Rut/TipSum.vue'
import MdTool from '@/components/Misc/MdTool.vue'
import {
  starRut, checkStar, editTags, editRutce, checkRutLocked, lockRut, unlockRut
} from '@/api/api'
import { checkAuth } from '@/util/auth'
import { mapGetters } from 'vuex'
import marked from '@/util/marked'

export default {
  name: 'rut-view',
  components: { ItemSum, TipSum, ShareBar, MdTool },
  data () {
    return {
      rutDetail: {},
      rutid: '',
      tags: [],
      starAction: 'Star',
      starCount: 0,
      tips: [],
      demands: [],
      creatorid: null,
      creditto: '',
      crediturl: '',
      aboutcreator: '',
      convertfrom: {},
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
      'whoEdit'
    ])
  },
  title () {
    return this.rutDetail.title
  },
  methods: {
    loadRutData () {
      let crutid = this.$route.params.id
      this.$store.dispatch('getRut', crutid).then(resp => {
        let data = resp.data
        this.rutDetail = data
        this.rutid = data.id
        this.tags = data.tags
        this.starCount = data.starcount
        this.creatorid = data.creator.id
        this.creditto = data.credit_to
        this.crediturl = data.credit_url
        this.convertfrom = data.convertfrom
        this.aboutcreator = data.creator.about
        this.isEveryone = data.editable === 'Everyone'
        this.newTags = data.tags.map(t => t.tagname)
        this.tips = data.tips
        this.demands = data.demands
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
    checkStar () {
      if (checkAuth()) {
        let rutid = this.$route.params.id // ?? liftcycle timing
        checkStar(rutid).then(resp => {
          this.starAction = resp.data
        })
      } else {
        this.starAction = 'Star'
      }
    },
    starRut () {
      if (checkAuth()) {
        if (this.starAction === 'Star') {
          starRut('star', this.rutid).then(() => {
            this.starAction = 'Unstar'
            this.starCount += 1
          })
        } else {
          starRut('unstar', this.rutid).then(() => {
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
    addNewTag () {
      let newT = this.newTag.trim()
      if (newT && newT.length < 64) {
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
          let data = { epilog: form.epilog.trim() }
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
          let cred = form.credential.trim()
          if (cred.length > 255) return
          let data = { credential: cred }
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
        font-size 12px
    .intro
      background-color $bgcolor
      padding 5px 10px
      border-bottom 2px solid #eee
    .itemtip
      background-color $bgcolor
      border-bottom 2px solid #eee
      .itemsum
        margin 5px
      .tip
        padding 5px 10px
    .epilog
      background-color $bgcolor
      padding 10px
      margin-top 5px
    .tagbar
      display inline-blcok
      .tag
        padding 2px 5px
        background-color #eef4fa
        a
          color green
          font-size 0.85em
          &:hover
            background-color #ddd
            padding 2px
    .toolbar
      display flex
      justify-content flex-end
    .sharebar
      font-size 0.85em
      padding 5px
      text-align right
  .indicator
    font-size 10px
    color #668e66
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
</style>
