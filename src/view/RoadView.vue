<template>
  <div class="road-page">
    <div class="road-view">
      <div class="title">
        <h2><b style="color:grey">RoadMap:&nbsp;</b>{{ introForm.title }}</h2>
        <div class="meta">
          <span>By 
            <router-link :to="'/profile/' + ownerid">
              {{ ownername }}
            </router-link> 
          </span> 
          | include {{ roadObj.itemcount | pluralise('item') }} 
          | Start: {{ roadObj.createat | toMDY }} 
          ~ Due: <b style="color:orange">{{ roadObj.deadline | toMDY(rep=false) }}</b>
            &nbsp; {{ roadObj.done ? '✔' : '...'  }}
          <span v-if="canEdit">
            <el-button v-if="roadObj.done && !roadObj.converted"
                       type="text" size="mini" @click="convertRoadToRut">
                       Convert
            </el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="text" size="mini" @click="showEdit=true">
                      ..Edit
            </el-button>
            <el-button type="text" size="mini" @click="showAdd=true">
                      ..Add
            </el-button>
          </span>
        </div>
      </div>
      <div class="intro">
        <div v-html="md(introForm.intro)"></div>
      </div>
      <!-- edit intro dialog -->
      <el-dialog title="Edit RoadMap" width="50%" 
                 :visible.sync="showEdit">
        <el-form :model="introForm" ref="introForm">
          <el-form-item prop="title">
            <el-input type="textarea" autosize v-model="introForm.title"></el-input>
          </el-form-item>
          <el-form-item prop="intro">
            <el-input type="textarea" :autosize="{minRows:5}" v-model="introForm.intro"></el-input>
            <md-tool :pretext="introForm.intro" @insertmd="updateE"></md-tool>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="success" @click="onEditRoad('introForm', introForm)">
            Done
          </el-button>
        </div>
      </el-dialog>
      <!-- edit intro dialog end -->
      <!-- add item dialog -->
      <el-dialog title="Add Item to  RoadMap" width="50%" 
                 :visible.sync="showAdd">
        <el-form :model="addForm" :rules="addRules"  ref="addForm">
          <el-form-item prop="itemID">
            <el-select v-model="addForm.itemID"
                       filterable remote 
                       :remote-method="storeKey"
                       :loading="searching"
                       @keyup.enter.native="queryItems"
                       placeholder="input: UID or Title, then Press Enter to Search"
                       style="width:100%">
              <el-option v-for="i in sItems" 
                        :key="i.id" 
                        :label="i.title" 
                        :value="i.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mark">
            <el-input type="textarea" :autosize="{minRows:5}" v-model="addForm.mark"></el-input>
            <md-tool :pretext="addForm.mark" @insertmd="updateM"></md-tool>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="success" @click="onAddItem('addForm', addForm)">
            Add
          </el-button>
        </div>
        <p>If no result, Would you help <a href="/newitem">submit</a> the item?</p>
      </el-dialog>
      <!-- add item dialog end -->
      <div class="itemmark" v-for="mark in marks" :key="mark.gid">
        <item-sum class="itemsum" :item="mark.item" :key="mark.itemid"></item-sum>
        <mark-sum :mark="mark" :canEdit="canEdit"></mark-sum>
      </div>
      <div class="bottombar">
        <share-bar></share-bar>
      </div>
    </div>
    <div class="road-side">
      <b class="countdown">{{ roadObj.deadline | timeGap(rep=false) }}</b><br>
      <b class="complete">{{
        roadObj.itemcount > 0 
          ? Math.round(roadObj.donenum / roadObj.itemcount * 100) + '%' 
          : '0%' 
        }} Completed
      </b>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import MarkSum from '@/components/Road/MarkSum.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'
import MdTool from '@/components/Misc/MdTool.vue'
import { fetchRoad, editRoad, roadToRut, searchItems, itemToRoad } from '@/api/api'
import { checkAuth } from '@/util/auth'
import marked from '@/util/marked'

export default {
  name: 'road-view',
  title () {
    return this.roadObj.title
  },
  components: { ItemSum, MarkSum, ShareBar, MdTool },
  data () {
    return {
      roadObj: {},
      marks: [],
      ownerid: null,
      ownername: '',
      canEdit: false,
      showEdit: false,
      introForm: {
        title: '',
        intro: '',
        deadline: ''
      },
      showAdd: false,
      addForm: {
        mark: '',
        itemID: null
      },
      addRules: {
        itemID: [
          { required: true, message: 'Required', trigger: 'change' }
        ]
      },
      searchKey: '',
      searching: false,
      sItems: []
    }
  },
  computed: {
    roadid () {
      return this.roadObj.id
    }
  },
  methods: {
    loadRoadData () {
      let roadid = this.$route.params.id
      fetchRoad(roadid).then(resp => {
        let data = resp.data
        this.roadObj = data
        this.ownerid = data.owner.id
        this.ownername = data.owner.name
        this.marks = data.marks
        this.introForm.intro = data.intro
        this.introForm.title = data.title
        this.introForm.deadline = data.deadline
        // check if show edit button
        let currentUserID = this.$store.getters.currentUserID
        if (currentUserID === this.ownerid) {
          this.canEdit = true
        } else {
          this.canEdit = false
        }
      })
    },
    onEditRoad (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            title: form.title.trim(),
            intro: form.intro.trim()
          }
          editRoad(this.roadid, data).then(resp => {
            this.showEdit = false
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
    convertRoadToRut () {
      let roadid = this.roadid
      roadToRut(roadid).then(resp => {
        if (resp.data) {
          let id = resp.data.id
          this.$router.push(`/readuplist/${id}`)
        }
      })
    },
    storeKey (query) {
      if (query.trim() !== '') {
        this.searchKey = query.trim()
      }
      this.sItems = this.$store.getters.seItems
    },
    queryItems () {
      if (checkAuth()) {
        this.searching = true
        if (this.searchKey.length < 6) return  // least keyword length
        let param = {'uid_or_title': this.searchKey}
        searchItems(0, param).then(resp => {
          let resItems = resp.data.items
          this.sItems = resItems
          this.$store.commit('ADD_ITEMS', resItems)
          this.searching = false
        })
      }
    },
    onAddItem (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let itemid = form.itemID
          let mark = form.mark
          let data = {
            'mark': mark,
            'alter': this.roadObj.done, // if done, alt to not-done once add item
            'load': true           // if load added-item info
          }
          itemToRoad(itemid, this.roadid, data).then(resp => {
            this.marks.push(resp.data)
            this.showAdd = false
          })
        }
      })
    },
    updateE (data) {
      this.introForm.intro += data
    },
    updateM (data) {
      this.addForm.mark += data
    },
    md (content) {
      return marked(content)
    }
  },
  watch: {
    '$route': 'loadRoadData' // render re-used component for addtoroad
  },
  created () {
    this.loadRoadData()
  }
}
</script>

<style lang="stylus" scoped>
$bgcolor = lighten(#f6f6f1, 50%)
.road-page
  padding 10px 250px 10px 0px
  position relative
  .road-view
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
      border-bottom 2px solid #eee
    .itemmark
      background-color $bgcolor
      .itemsum
        margin 5px
    .bottombar
      font-size 0.85em
      padding 5px
      text-align right
  .road-side
    position absolute
    right 0
    top 10px
    width 240px
    color grey
</style>
