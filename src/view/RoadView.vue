<template>
  <div class="road-page">
    <div class="road-view">
      <div class="title">
        <h2><b style="color:grey">RoadMap:</b> {{ introForm.title }}</h2>
        <div class="meta">
          <span>By 
            <router-link :to="'/profile/' + ownerid">
              {{ ownername }}
            </router-link> 
          </span> 
          | include {{ roadObj.itemcount | pluralise('item') }} 
          | Start: {{ roadObj.createat | toMDY }} 
          -- Due: {{ roadObj.deadline | toMDY(rep=false) }}
            {{ roadObj.done ? '✔' : '..'  }}
          <el-button v-if="roadObj.done && !roadObj.converted"
                     class="editlink" type="text" 
                     @click="convertRoadToRut">
                     Convert
          </el-button>
        </div>
      </div>
      <div class="intro">
        <div v-html="md(introForm.intro)"></div>
        <el-button class="editlink" type="text" v-show="canEdit"
                   @click="showDialog=true">
                   ..Edit
        </el-button>
      </div>
      <!-- edit intro dialog -->
      <el-dialog title="Edit RoadMap" width="45%" 
                 :visible.sync="showDialog">
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
      <div class="itemmark" v-for="mark in marks" :key="mark.gid">
        <item-sum class="itemsum" :item="mark.item" :key="mark.itemid"></item-sum>
        <mark-sum :mark="mark" :canEdit="canEdit"></mark-sum>
      </div>
      <div class="bottombar">
        <share-bar></share-bar>
      </div>
    </div>
    <div class="road-side"></div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import MarkSum from '@/components/Road/MarkSum.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'
import MdTool from '@/components/Misc/MdTool.vue'
import { fetchRoad, editRoad, roadToRut } from '@/api/api'
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
      showDialog: false,
      introForm: {
        title: '',
        intro: '',
        deadline: ''
      }
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
            this.showDialog = false
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
    updateE (data) {
      this.introForm.intro += data
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
  .editlink
    font-size 0.7em
    font-weight 600
  .road-side
    position absolute
    right 0
    top 10px
    width 240px
</style>
