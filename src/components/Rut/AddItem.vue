<template>
  <div class="add-page">
    <div class="title"> 
      <b style="font-size:1.2em">Add Item To List:&nbsp;&nbsp;</b>{{ rutTitle }}&nbsp;&nbsp;
      <el-button type="text" @click="cancelnReturn">...Cancel and Back</el-button>
    </div>
    <!-- add have-Dones -->
    <div>
      <el-form class="done-form" :model="doneForm" :rules="doneRules" ref="doneForm" size="medium">
        <el-form-item label="Pick one of Your Have-Dones by Searching" 
                      prop="doneItem" style="margin-bottom:8px">
          <el-select class="select-item" v-model="doneForm.doneItemID"
                     filterable remote 
                     :remote-method="storeQuery"
                     :loading="searching"
                     @keyup.enter.native="getDoneItems"
                     placeholder="input keyword: UID or Title, then Press Enter, will search from your have-dones">
            <el-option v-for="i in doneItems" :key="i.id" :label="i.title" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Compose Tips" prop="tips" style="margin-bottom:16px">
          <el-input type="textarea" v-model="doneForm.tips" 
                    :autosize="{minRows:6}" placeholder="start to compose..."></el-input>
          <md-tool :pretext="doneForm.tips" @insertmd="updateD"></md-tool>
        </el-form-item>
        <el-form-item prop="spoiler" size="mini">
          <el-radio-group v-model="doneForm.spoiler">
            <el-radio-button label="No Spoiler"></el-radio-button>
            <el-radio-button label="Spoiler Ahead"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" 
                     @click="addDoneItem('doneForm', doneForm)" 
                     :disabled="!doneForm.doneItemID">ADD to List</el-button>
        </el-form-item>
      </el-form>
      <div style="width:480px">
        <el-input size="mini" v-model="itemKeyword" @keyup.enter.native="searchItem" 
                  placeholder="or Search item and track it as done: Input keyword then Enter">
        </el-input>
        <b style="font-size:0.8em">or You can 
          <router-link to="/newitem" 
                       target="_blank" rel="noopener noreferrer">Submit New Item
          </router-link> which you have done.
        </b>
      </div>
    </div>
  </div>
</template>

<script>
import { itemToRut, lockRut, unlockRut, searchItems } from '@/api/api'
import { checkAuth } from '@/util/auth'
import Spinner from '@/components/Misc/Spinner.vue'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'add-rut',
  title: 'Add Item to Readup Tips',
  components: { Spinner, MdTool },
  data () {
    return {
      doneForm: {
        tips: '',
        spoiler: 'No Spoiler',
        doneItemID: null
      },
      doneRules: {
        doneItemID: [
          { required: true, message: 'Required', trigger: 'change' }
        ]
      },
      inputQuery: '', // store the query keyword, then search once enter press
      searching: false,
      doneItems: [], // search result from have-dones
      itemKeyword: '', // keyword for search any item
      rutId: null,
      rutTitle: null
    }
  },
  methods: {
    storeQuery (query) {
      if (query.trim() !== '') {
        this.inputQuery = query.trim()
      }
    },
    // make the search controllable
    getDoneItems () {
      if (checkAuth()) {
        this.searching = true
        setTimeout(() => {
          let param = {'uid_or_title': this.inputQuery}
          searchItems(3, param).then(resp => {
            this.doneItems = resp.data
            this.searching = false
          })
        }, 200)
      }
    },
    // add done item
    addDoneItem (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let itemid = form.doneItemID
          let tips = form.tips
          let spoiler = form.spoiler
          let data = { 'tips': tips, 'spoiler': spoiler }
          itemToRut(itemid, this.rutId, data).then(() => {
            let id = this.rutId
            unlockRut(id)
            this.$router.push(`/readuplist/${id}`) // how to scoll to bottom? once push
          })
        }
      })
    },
    cancelnReturn () {
      let id = this.rutId
      unlockRut(id)
      this.$router.push(`/readuplist/${id}`)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    loadRutData () {
      let rut = this.$store.getters.rutDetail
      if (rut.id === Number(this.$route.params.id)) {
        this.rutId = rut.id
        this.rutTitle = rut.title
        lockRut(rut.id)
      }
    },
    updateD (data) {
      this.doneForm.tips += data
    },
    searchItem () {
      if (checkAuth() && this.itemKeyword.trim()) {
        let param = {'uid_or_title': this.itemKeyword.trim()}
        searchItems(0, param).then(resp => {
          this.$store.commit('SET_SEARCH_ITEMS', resp.data)
          this.$router.push('/searchresult/item')
        })
      }
    }
  },
  created () {
    this.loadRutData()
  }
}
</script>

<style lang="stylus" scoped>
.add-page
  padding 10px 120px 10px 80px
  position relative
  .done-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 10px
  .select-item
    width 100%
</style>