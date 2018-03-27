<template>
  <div class="add-page">
    <div class="title"> 
      <b style="font-size:1.2em">Add Item To List:&nbsp;&nbsp;</b>
      {{ rutTitle }}&nbsp;&nbsp;
      <el-button type="text" @click="cancelnReturn">...Cancel and Back</el-button>
    </div>
    <!-- add have-Dones -->
    <div>
      <el-form class="done-form" 
               :model="doneForm" 
               :rules="doneRules" 
               ref="doneForm" 
               size="medium">
        <el-form-item label="Pick one of Your Have-Dones by Searching" 
                      prop="doneItem" style="margin-bottom:8px">
          <el-select v-model="doneForm.doneItemID"
                     filterable remote 
                     :remote-method="storeQuery"
                     :loading="searching"
                     @keyup.enter.native="searchDoneItems"
                     style="width:100%"
                     placeholder="input: UID or Title, then Press Enter, will search from your have-dones only">
            <el-option v-for="i in doneItems" 
                       :key="i.id" 
                       :label="i.title" 
                       :value="i.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Compose Tips" prop="tips" style="margin-bottom:16px">
          <el-input type="textarea" v-model="doneForm.tips" 
                    :autosize="{minRows:6}" 
                    placeholder="start to compose...">
          </el-input>
          <md-tool :pretext="doneForm.tips" @insertmd="updateD"></md-tool>
        </el-form-item>
        <el-form-item prop="spoiler" size="mini">
          <el-radio-group v-model="doneForm.spoiler">
            <el-radio-button label="No Spoiler"></el-radio-button>
            <el-radio-button label="Spoiler Ahead"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" class="blockbtn"
                     @click="addDoneItem('doneForm', doneForm)" 
                     :disabled="!doneForm.doneItemID">
                     ADD to List
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        or if the item you want to add not in your have-dones, Search and track it as done:
        <el-input size="small" v-model="itemKeyword" 
                  @keyup.enter.native="searchItem" 
                  placeholder=" Input keyword then Press Enter">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
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
      this.doneItems = this.$store.getters.seItems  // show options when focus
    },
    // make the search controllable
    searchDoneItems () {
      if (checkAuth()) {
        this.searching = true
        let l = this.inputQuery.length
        if (l < 6 && l !== 0) return  // least keyword length
        let param = {'uid_or_title': this.inputQuery}
        searchItems(3, param).then(resp => {
          let resItems = resp.data.items
          this.doneItems = resItems
          this.$store.commit('ADD_ITEMS', resItems)
          this.searching = false
        })
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
            this.$router.push(`/readlist/${id}`) // how to scoll to bottom? once push
          })
        }
      })
    },
    cancelnReturn () {
      let id = this.rutId
      unlockRut(id)
      this.$router.push(`/readlist/${id}`)
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
  padding 10px 160px 10px 120px
  position relative
  .done-form
    padding 20px
    border 1px dotted #689f38
    margin-bottom 10px
  .title
    margin-bottom 10px
</style>