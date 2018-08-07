<template>
  <div class="item-sum">
    <div>
      <img class="thumb" :src="cover" alt="Cover" referrerPolicy="no-referrer">
    </div>
    <div class="info">
      <span class="title">
        {{item.cate}} 
        <template v-if="out"><!--in itemview page, no out to resource link-->
          <!-- <a v-if="item.resurl" 
             :href="item.resurl" target="_blank" rel="nofollow noopener noreferrer">
             {{ item.title }}
          </a>
          <b v-else style="color:#337ab7">{{ item.title }}</b> -->
          <b style="color:#337ab7">{{ item.title }}</b>
        </template>
        <template v-else>
          <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
        </template>
      </span>
      <table style="border-spacing:0px;">
        <tr>
          <td><small class="indicator">Byline</small></td>
          <td>{{ item.byline }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Publish&nbsp;</small></td>
          <td>{{ item.publisher }} - {{ item.pubdate }} - {{ item.language }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Edition</small></td>
          <td>{{ item.uid }} - {{ item.binding }} - {{ item.page }} </td>
        </tr>
        <tr>
          <td><small class="indicator">Listed</small></td>
          <td>
            {{ item.rutcount }} 
            <a :href="item.resurl" v-if="item.resurl" 
              target="_blank" rel="nofollow noopener noreferrer"> 
              &nbsp; &nbsp; &nbsp; --> {{ item.resurl | host }}
            </a> 
          </td>
        </tr>
        <tr v-if="flagNote || flagTime">
          <!-- <td><small class="indicator">Note</small></td> -->
          <td colspan="2">
            <span class="flag-note">
              <b>"</b>{{ flagNote ? flagNote : 'at' }}
            </span>&nbsp;
            <span class="flag-note" v-if="flagTime">    {{ flagTime | toMDY }}</span>
          </td>
        </tr>
      </table>
      <!-- <span><small class="indicator">Byline&nbsp; &nbsp;:</small> {{ item.byline }} </span><br>
      <span><small class="indicator">Publish&nbsp;:</small> 
        {{ item.publisher }} - {{ item.pubdate }} - {{ item.language }}
      </span><br>
      <span><small class="indicator">UID&nbsp; &nbsp; &nbsp; &nbsp;:</small>
        {{ item.uid }} - {{ item.binding }} - {{ item.page }} 
      </span><br>
      <span>
        <small class="indicator">Listed&nbsp; &nbsp;&nbsp;:</small> {{ item.rutcount }} 
        <a :href="item.resurl" v-if="item.resurl" 
           target="_blank" rel="nofollow noopener noreferrer"> 
           &nbsp; &nbsp; &nbsp; {{ item.resurl | host }}
        </a>
      </span><br>
      <span v-if="flagNote || flagTime"><small class="indicator">Note&nbsp; &nbsp; &nbsp;&nbsp;:</small> 
        <span class="flag-note" v-if="flagNote">
          <b>'</b>{{ flagNote }}
        </span>&nbsp;
        <span class="flag-note" v-if="flagTime"> - {{ flagTime | toMDY }}</span>
      </span> -->
    </div>
    <div class="operate">
      <el-dropdown>
        <el-button type="primary" size="mini" plain>
          {{flagAction}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="flagAction!=='Done'">
            <el-button @click="showAndloadRoads" 
                       type="text" style="color:orange">
                       Add to Map
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item v-if="flagAction=='Done'">
            <el-button @click="showAndloadRuts" 
                       type="text" style="color:green">
                       Add to List
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="openToFlag('Todo')">Todo</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="openToFlag('Doing')">Doing</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="openToFlag('Done')">Done</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- addtolist dialog -->
    <el-dialog title="Add Item to one of my Shared Read Lists" width="520px" 
               :visible.sync="showAddtoRut">
      <el-form :model="intoForm" ref="intoForm" size="medium">
        <el-form-item prop="rut">
          <el-select v-model="intoForm.selectRutID"
                     filterable remote 
                     :remote-method="storeKey"
                     :loading="searching"
                     @keyup.enter.native="searchCreatedRuts" 
                     placeholder="Select a List, Can search">
            <el-option v-for="r in createdRuts" 
                       :key="r.id" 
                       :label="r.title" 
                       :value="r.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tips">
          <el-input type="textarea" v-model="intoForm.tips" 
                    :autosize="{minRows:3}" placeholder="Tips"></el-input>
          <md-tool :pretext="intoForm.tips" @insertmd="updateT"></md-tool>
        </el-form-item>
        <el-form-item prop="spoiler" size="mini">
          <el-radio-group v-model="intoForm.spoiler">
            <el-radio-button label="No Spoiler"></el-radio-button>
            <el-radio-button label="Spoiler Ahead"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" 
                   @click="addtoRut('intoForm', intoForm)">
                   Add
        </el-button>
      </div>
    </el-dialog>
    <!-- end addtolist dialog -->
    <!-- redirect dialog -->
    <el-dialog :visible.sync="showRedirect" width="270px">
      <router-link :to="'/readlist/' + intoForm.selectRutID">
        <b>Go To The List Page?</b>
      </router-link>
    </el-dialog>
    <!-- end redirect dialog-->
    <!-- addnote dialog -->
    <el-dialog :title="'Track and Note ' + flagTo"  width="450px" 
               :visible.sync="showNoteDialog">
      <el-form :model="noteForm" :rules="noteRules" ref="noteForm">
        <el-form-item prop="note">
          <el-input v-model="noteForm.note" 
                    placeholder="Optional, Max 42 words">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" 
                   @click="flagAddnote('noteForm', noteForm)">
                   Done
        </el-button>
      </div>
    </el-dialog>
    <!-- end addnote dialog -->
    <!-- addtoroad dialog -->
    <el-dialog title="Add Item to one of my Road Maps" width="520px" 
               :visible.sync="showAddtoRoad">
      <el-form :model="toRoadForm" ref="toRoadForm" size="medium">
        <el-form-item prop="road">
          <el-select v-model="toRoadForm.selectRoadID" placeholder="Select a Roadmap">
            <el-option v-for="r in roads" 
                       :key="r.id" 
                       :label="r.title" 
                       :value="r.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="mark">
          <el-input type="textarea" v-model="toRoadForm.mark" 
                    :autosize="{minRows:3}" placeholder="Mark"></el-input>
          <md-tool :pretext="toRoadForm.mark" @insertmd="updateR"></md-tool>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" 
                   @click="addtoRoad('toRoadForm', toRoadForm)">
                   Add
        </el-button>
      </div>
    </el-dialog>
    <!-- end addtolist dialog -->
    <!-- redirect dialog -->
    <el-dialog :visible.sync="showRedtoRoad" width="270px">
      <router-link :to="'/roadmap/' + toRoadForm.selectRoadID">
        <b>Go To The RoadMap Page?</b>
      </router-link>
    </el-dialog>
    <!-- end redirect dialog-->
  </div>
</template>

<script>
import {
  flagItem, checkFlag, fetchProfileRuts, searchRuts, itemToRut, fetchRoads, itemToRoad
} from '@/api/api'
import { checkAuth } from '@/util/auth'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'item-sum',
  props: ['item', 'out'], // out for  link to resource
  components: { MdTool },
  data () {
    return {
      flagAction: 'Options',
      flagNote: '',
      flagTime: '',
      showAddtoRut: false,
      showRedirect: false,
      intoForm: {
        tips: '',
        spoiler: 'No Spoiler',
        selectRutID: null
      },
      showNoteDialog: false,
      flagTo: '',
      noteForm: {
        note: ''
      },
      noteRules: {
        note: [
          { max: 42, message: 'Max Length should be 42', trigger: 'change' }
        ]
      },
      searchKey: '', // store the keyword, then search once enter press
      searching: false,
      createdRuts: [],
      roads: [],
      showAddtoRoad: false,
      toRoadForm: {
        mark: '',
        selectRoadID: null
      },
      showRedtoRoad: false
    }
  },
  computed: {
    cover () {
      return this.item.cover
    }
  },
  methods: {
    checkFlaging () {
      if (checkAuth()) {
        let itemid = this.item.id || this.$route.params.id // why?? liftcycle timing??: in list or in view
        checkFlag(itemid).then(resp => {
          this.flagAction = resp.data.label
          this.flagNote = resp.data.note
          this.flagTime = resp.data.time
          this.noteForm.note = resp.data.note
        })
      } else {
        this.flagAction = 'Options'
        this.flagNote = ''
      }
    },
    openToFlag (to) {
      if (checkAuth()) {
        this.showNoteDialog = true
        this.flagTo = to
      } else {
        this.$message({
          showClose: true,
          message: 'Should Log in to Access'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    flagTodo (note) {
      let params = {'note': note || 'todo'}
      flagItem('todo', this.item.id, params)
      .then(() => {
        this.flagAction = 'Todo'
        this.flagNote = note
      })
    },
    flagDoing (note) {
      let params = {'note': note || 'doing'}
      flagItem('doing', this.item.id, params)
      .then(() => {
        this.flagAction = 'Doing'
        this.flagNote = note
      })
    },
    flagDone (note) {
      let params = {'note': note || 'done'}
      flagItem('done', this.item.id, params)
      .then(() => {
        this.flagAction = 'Done'
        this.flagNote = note
      })
    },
    flagAddnote (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (checkAuth()) {
          let note = form.note.trim()
          let to = this.flagTo
          switch (to) {
            case 'Todo':
              this.flagTodo(note)
              break
            case 'Doing':
              this.flagDoing(note)
              break
            case 'Done':
              this.flagDone(note)
              break
          }
          this.showNoteDialog = false
        } else {
          this.$message({
            showClose: true,
            message: 'Should Log in to Access'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    },
    // store keyword to search created rut
    // :flow: pre-load -> or input key then search -> select
    storeKey (query) {
      if (query.trim() !== '') {
        this.searchKey = query.trim()
      }
    },
    // search created rut
    searchCreatedRuts () {
      if (checkAuth()) {
        this.searching = true
        if (this.searchKey.length < 6) return // least keyword length
        let param = {'title': this.searchKey}
        searchRuts(param).then(resp => {
          this.createdRuts = resp.data
          this.searching = false
        })
      }
    },
    // pre-load created ruts before add item to one of
    showAndloadRuts () {
      if (checkAuth() && this.flagAction === 'Done') {
        // Check store first, reduce api call
        let preRuts = this.$store.getters.createdRuts
        if (preRuts.length === 0) {
          let userid = this.$store.getters.currentUserID
          fetchProfileRuts('created', userid).then(resp => {
            this.createdRuts = resp.data.ruts
            // call api ,then store
            this.$store.commit('SET_RUTS', resp.data.ruts)
          })
        } else {
          this.createdRuts = preRuts
        }
        this.showAddtoRut = true
      } else if (!checkAuth()) {
        this.showAddtoRut = false
        this.$message({
          showClose: true,
          message: 'Should Log in to Access'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    addtoRut (formName, form) {
      if (!form.selectRutID) {
        this.$message({
          showClose: true,
          message: 'Please Select a List'
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let rutid = form.selectRutID
          let itemid = this.item.id
          let data = {'tips': form.tips, 'spoiler': form.spoiler}
          itemToRut(itemid, rutid, data).then(() => {
            this.showAddtoRut = false
            this.showRedirect = true
          })
        } else if (!checkAuth()) {
          this.showAddtoRut = false
          this.$message({
            showClose: true,
            message: 'Should Log in to Access'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    },
    // get roadmap before add item to one of
    showAndloadRoads () {
      if (checkAuth() && this.flagAction !== 'Done') {
        // Check store first, reduce api call
        let preRoads = this.$store.getters.onRoads
        if (preRoads.length === 0) {
          let userid = this.$store.getters.currentUserID
          let param = {'rf': 'on', 'userid': userid}
          fetchRoads(param).then(resp => {
            this.roads = resp.data.roads
            this.$store.commit('SET_ROADS', resp.data.roads)
          })
        } else {
          this.roads = preRoads
        }
        this.showAddtoRoad = true
      } else if (!checkAuth()) {
        this.showAddtoRoad = false
        this.$message({
          showClose: true,
          message: 'Should Log in to Access'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    addtoRoad (formName, form) {
      if (!form.selectRoadID) {
        this.$message({
          showClose: true,
          message: 'Please Select one'
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let roadid = form.selectRoadID
          let itemid = this.item.id
          let data = {'mark': form.mark}
          itemToRoad(itemid, roadid, data).then(() => {
            this.showAddtoRoad = false
            this.showRedtoRoad = true
          })
        } else if (!checkAuth()) {
          this.showAddtoRoad = false
          this.$message({
            showClose: true,
            message: 'Should Log in to Access'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    },
    updateT (data) {
      this.intoForm.tips += data
    },
    updateR (data) {
      this.toRoadForm.mark += data
    }
  },
  created () {
    this.checkFlaging()
  }
}
</script>

<style lang="stylus" scoped>
.item-sum
  background-color lighten(#f6f6f1, 65%)
  min-height 135px
  padding 10px 115px 10px 115px
  border-bottom 1px solid #eee
  position relative
  .thumb
    max-width 100px
    max-height 135px
    position absolute
    top 10px
    left 2px
  .info
    font-size 14px
    line-height 1.6em
    .title
      font-size 18px
    .indicator
      font-size 14px
      color: #777
    .flag-note
      color grey
  .operate
    position absolute
    top 10px
    right 2px
.el-select
  width 100%
</style>