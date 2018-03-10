<template>
  <div class="item-sum">
    <div>
      <img class="thumb" :src="cover" alt="Cover">
    </div>
    <div class="info">
      <span class="title">
        {{item.cate}} 
        <template v-if="out"><!--in itemview page, out to resource link-->
          <a v-if="item.resurl" 
             :href="item.resurl" target="_blank" rel="nofollow noopener noreferrer">
             {{ item.title }}
          </a>
          <b v-else style="color:#337ab7">{{ item.title }}</b>
        </template>
        <template v-else>
          <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
        </template>
      </span><br>
      <span><b>Byline:</b> {{ item.byline }} </span><br>
      <span><b>Publish:</b> 
        {{ item.publisher }} - {{ item.pubdate }} - {{ item.language }}
      </span><br>
      <span><b>UID:</b> 
        {{ item.uid }} - {{ item.binding }} - {{ item.page }} &nbsp;
        <a :href="item.resurl" v-if="item.resurl" 
           target="_blank" rel="nofollow noopener noreferrer"> 
           :::
        </a>
      </span><br>
      <span><b>Listed:</b> {{ item.rutcount }} </span><br>
      <span v-if="flagNote || flagTime"><b>Note: </b>
        <span class="flag-note" v-if="flagNote">
          <b>'</b>{{ flagNote }}
        </span>&nbsp;
        <span class="flag-note" v-if="flagTime"> - {{ flagTime | toMDY }}</span>
      </span>
    </div>
    <div class="operate">
      <el-dropdown>
        <el-button type="primary" size="mini" plain>
          {{flagAction}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="flagAction!=='Have Done'">
            <el-button @click="showAndloadRoads" 
                       type="text" style="color:orange">
                       Add to Map
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item v-if="flagAction=='Have Done'">
            <el-button @click="showAndloadRuts" 
                       type="text" style="color:green">
                       Add to List
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="openToFlag('schedule')">Schedule</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="openToFlag('working')">Working On</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="openToFlag('done')">Have Done</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- addtolist dialog -->
    <el-dialog title="Add Item to one of my Shared Read Lists" :visible.sync="showAddtoRut" width="45%">
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
        <el-button size="mini" @click="showAddtoRut = false">Cancel</el-button>
        <el-button size="mini" type="success" 
                   @click="addtoRut('intoForm', intoForm)">
                   Add
        </el-button>
      </div>
    </el-dialog>
    <!-- addtolist dialog end -->
    <!-- redirect dialog -->
    <el-dialog :visible.sync="showRedirect" width="30%">
      <router-link :to="'/readuplist/' + intoForm.selectRutID">
        <b>Go To The List Page You Just Add Item To?</b>
      </router-link>
    </el-dialog>
    <!-- redirect dialog end-->
    <!-- addnote dialog -->
    <el-dialog title="Add Note and Flag It" :visible.sync="showNoteDialog" width="35%">
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
    <!-- addnote dialog end -->
    <!-- addtoroad dialog -->
    <el-dialog title="Add Item to one of my Road Maps" :visible.sync="showAddtoRoad" width="45%">
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
        <el-button size="mini" @click="showAddtoRoad = false">Cancel</el-button>
        <el-button size="mini" type="success" 
                   @click="addtoRoad('toRoadForm', toRoadForm)">
                   Add
        </el-button>
      </div>
    </el-dialog>
    <!-- addtolist dialog end -->
    <!-- redirect dialog -->
    <el-dialog :visible.sync="showRedtoRoad" width="30%">
      <router-link :to="'/roadmap/' + toRoadForm.selectRoadID">
        <b>Go To The Roadmap Page?</b>
      </router-link>
    </el-dialog>
    <!-- redirect dialog end-->
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
      flagAction: 'Flag It',
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
          { max: 42, message: 'Max Length should be 42', trigger: 'blur' }
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
        this.flagAction = 'Flag It'
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
    flagSchedule (note = '') {
      let params = {'note': note}
      flagItem('todo', this.item.id, params)
      .then(() => {
        this.flagAction = 'Scheduled'
        this.flagNote = note
      })
    },
    flagWorking (note = '') {
      let params = {'note': note}
      flagItem('doing', this.item.id, params)
      .then(() => {
        this.flagAction = 'Working On'
        this.flagNote = note
      })
    },
    flagDone (note = '') {
      let params = {'note': note}
      flagItem('done', this.item.id, params)
      .then(() => {
        this.flagAction = 'Have Done'
        this.flagNote = note
      })
    },
    flagAddnote (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (checkAuth()) {
          let note = form.note
          let to = this.flagTo
          switch (to) {
            case 'schedule':
              this.flagSchedule(note)
              break
            case 'working':
              this.flagWorking(note)
              break
            case 'done':
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
      if (checkAuth() && this.flagAction === 'Have Done') {
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
      if (checkAuth() && this.flagAction !== 'Have Done') {
        // Check store first, reduce api call
        let preRoads = this.$store.getters.onRoads
        if (preRoads.length === 0) {
          let userid = this.$store.getters.currentUserID
          fetchRoads(userid).then(resp => {
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
  background-color lighten(#deecec, 85%)
  min-height 135px
  padding 10px 115px 10px 115px
  border-bottom 1px solid #eee
  position relative
  .thumb
    width 100px
    height 135px
    position absolute
    top 10px
    left 2px
  .info
    font-size 13px
    line-height 1.6em
    .title
      font-size 1.2em
      font-weight 700
      a
        &:hover
          color red
    .flag-note
      color grey
  .operate
    position absolute
    top 10px
    right 2px
.el-select
  width 100%
</style>