<template>
  <div class="item-sum">
    <div>
      <img class="thumb" :src="cover" alt="Cover">
    </div>
    <div class="info">
      <span class="title">
        {{item.cate}} <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
      </span><br>
      <span><b>Byline:</b> {{ item.byline }} </span><br>
      <span><b>Published:</b> {{ item.publisher }} - {{ item.pubdate }} - {{ item.language }}</span><br>
      <span><b>UID/ISBN:</b> {{ item.uid }} <a :href="item.resurl" v-if="item.resurl" target="_blank"> &nbsp;:::</a> </span><br>
      <span><b>Listed:</b> {{ item.rutcount }} </span>
    </div>
    <div class="flag-note" v-if="flagNote"><b>"</b>{{ flagNote }}<b>"</b></div>
    <div class="operate">
      <el-dropdown>
        <el-button type="primary" size="mini" plain>{{flagAction}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><span @click="openToFlag('schedule')">Schedule</span></el-dropdown-item>
          <el-dropdown-item><span @click="openToFlag('working')">Working On</span></el-dropdown-item>
          <el-dropdown-item><span @click="openToFlag('done')">Have Done</span></el-dropdown-item>
          <el-dropdown-item divided><span @click="showAndloadData">Add to List</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- addtolist dialog -->
    <el-dialog title="Add Item to Created List" :visible.sync="showDialog" width="45%">
      <el-form :model="intoForm" ref="intoForm">
        <el-form-item prop="rut">
          <el-select v-model="intoForm.selectRutID">
            <el-option v-for="r in createdRuts" :key="r.id" :label="r.title" :value="r.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showDialog = false">Cancel</el-button>
        <el-button size="mini" type="success" @click="addtoRut('intoForm', intoForm)">Add</el-button>
      </div>
    </el-dialog>
    <!-- addtolist dialog end -->
    <!-- addnote dialog -->
    <el-dialog title="Add Note and Flag It" :visible.sync="showNoteDialog" width="35%">
      <el-form :model="noteForm" :rules="noteRules" ref="noteForm">
        <el-form-item prop="note">
          <el-input v-model="noteForm.note" placeholder="Optional, Max 42 words"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" @click="flagAddnote('noteForm', noteForm)">Done</el-button>
      </div>
    </el-dialog>
    <!-- addnote dialog end -->
  </div>
</template>

<script>
import { flagItem, checkFlag, fetchProfileRuts, itemToRut } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'item-sum',
  props: ['item'],
  data () {
    return {
      flagAction: 'Flag It',
      flagNote: '',
      showDialog: false,
      intoForm: {
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
      createdRuts: []
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
        return checkFlag(itemid)
        .then(resp => {
          this.flagAction = resp.data.label
          this.flagNote = resp.data.note
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
      return flagItem('todo', this.item.id, params)
      .then(() => {
        this.flagAction = 'Scheduled'
        this.flagNote = note
      })
    },
    flagWorking (note = '') {
      let params = {'note': note}
      return flagItem('doing', this.item.id, params)
      .then(() => {
        this.flagAction = 'Working On'
        this.flagNote = note
      })
    },
    flagDone (note = '') {
      let params = {'note': note}
      return flagItem('done', this.item.id, params)
      .then(() => {
        this.flagAction = 'Have Done'
        this.flagNote = note
      })
    },
    flagAddnote (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (checkAuth()) {
          let note = form.note.trim()
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
    // get created ruts before add item to one
    showAndloadData () {
      if (checkAuth()) {
        let userid = this.$store.getters.currentUserID
        return fetchProfileRuts('created', userid)
        .then(resp => {
          this.createdRuts = resp.data.ruts
          this.showDialog = true
        })
      } else {
        this.showDialog = false
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
          message: 'Please Select One'
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let rutid = form.selectRutID
          let itemid = this.item.id
          return itemToRut(itemid, rutid)
          .then(() => {
            this.showDialog = false
            this.$message({
              showClose: true,
              message: 'Done, and Now You can add Tips',
              type: 'success'
            })
            this.$router.push(`/readuplist/${rutid}`) // why not work from rut page: re-sued component issue
          })
        } else if (!checkAuth()) {
          this.showDialog = false
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
  min-height 180px
  padding 10px 110px 10px 135px
  border-bottom 1px solid #eee
  position relative
  .thumb
    width 120px
    height 160px
    position absolute
    top 10px
    left 2px
  .info
    font-size 0.9em
    .title
      font-size 1.2em
      font-weight 700
      a
        &:hover
          color red
  .operate
    position absolute
    top 10px
    right 2px
  .flag-note
    font-size 0.75em
    color grey
    text-align right
.el-select
  width 100%
</style>