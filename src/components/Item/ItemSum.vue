<template>
  <div class="item-sum">
    <div>
      <img v-if="cover" class="thumb" :src="cover" alt="Cover" referrerPolicy="no-referrer">
      <template v-else>
        <avatar class="thumb" :uname="item.title" :size="100" :src="''"></avatar>
      </template>
    </div>
    <div class="info">
      <span class="title">
        {{item.category}} 
        <template v-if="out"><!--in itemview page, no out to resource link-->
          <b style="color:#337ab7">{{ item.title }}</b>
        </template>
        <template v-else>
          <router-link :to="'/item/' + item.slug">{{ item.title }}</router-link>
        </template>
      </span>
      <table style="border-spacing:0px;">
        <tr>
          <td><small class="indicator">Byline</small></td>
          <td>{{ item.authors }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Publish&nbsp;</small></td>
          <td>{{ item.publisher }} &nbsp; {{ item.pub_at }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Edition</small></td>
          <td>{{ item.uiid }} &nbsp; {{ item.edition }}</td>
        </tr>
        <tr>
          <td><small class="indicator">Listed</small></td>
          <td>
            {{ item.rut_count }} &nbsp; 
            <a :href="item.url" v-if="item.url">...src</a>
          </td>
        </tr>
        <tr v-if="flagNote">
          <td><small class="indicator">Note</small></td>
          <td>
            <small class="flag-note">{{ flagNote }}</small>
          </td>
        </tr>
      </table>
    </div>
    <div class="operate">
      <el-dropdown>
        <el-button type="primary" size="mini" plain>
          {{ flagAction | titleCase }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button @click="showAndloadRuts" 
                       type="text" style="color:orange">
                       +Collection
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="toStar('todo')">Todo</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="toStar('doing')">Doing</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="toStar('done')">Done</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- addtolist dialog -->
    <el-dialog title="Add Item to A Collection" width="520px" 
               :visible.sync="showAddtoRut">
      <v-form ref="form" class="add-form">
        <el-select v-model="selectIndex" filterable remote 
                  :remote-method="storeKey"
                  :loading="searching"
                  @keyup.enter.native="searchCreatedRuts"
                  style="width:100%" 
                  placeholder="Search and Select a Collection">
          <el-option v-for=" (r, index) in createdRuts" 
                      :key="r.id" 
                      :label="r.title" 
                      :value="index">
          </el-option>
        </el-select>
        <v-textarea
          v-model="content"
          label="Compose...,like reading tips, introduction, etc."
          counter
          :rule= "mustRule"
          :rows= "5"
          auto-grow
        ></v-textarea>
      </v-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" 
                   @click="addToRut">
                   Add
        </el-button>
      </div>
    </el-dialog>
    <!-- end addtolist dialog -->
    <!-- addnote dialog -->
    <el-dialog width="450px" 
               :visible.sync="showStar">
      <v-form ref="form" class="note-form">
        <v-text-field
          v-model= "flagNote"
          label= "Some Note: Optional, Max 42 words"
          :counter = "42"
          :rules = "lenRule"
        ></v-text-field>
      </v-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" 
                   @click="starAndNote">
                   {{ 'As ' + starAs | titleCase }}
        </el-button>
      </div>
    </el-dialog>
    <!-- end addnote dialog -->
  </div>
</template>

<script>
import { base, checkStarItem, starItem, fetchRuts, collectItem } from '../../api'
import { checkAuth } from '../../util/auth'
import Avatar from '../User/Avatar.vue'

export default {
  name: 'item-sum',
  props: ['item', 'out'], // out for  link to resource
  components: { Avatar },
  data () {
    return {
      showAddtoRut: false,
      createdRuts: [],
      searchKey: '',
      searching: false,
      rutID: null, // selected rut to add item to
      selectIndex: null,  // for to index selected rut in createdruts
      selectedRut: null,  // need the other info of the selected rut
      content: '', // collect content
      flagAction: 'Options',
      flagNote: '',
      flagTime: '',
      showStar: false,
      starAs: '',
      lenRule: [ v => v.length <= 42 || 'Must be less than 42' ],
      mustRule: [ v => !!v || 'required' ],
      flagMap: {'todo': 1, 'doing': 2, 'done': 3},
      mapFlag: {'1': 'todo', '2': 'doing', '3': 'done', 'Options': 'Options'},
    }
  },
  computed: {
    cover () {
      return this.item.cover
    }
  },
  methods: {
    checkStar () {
      if (checkAuth()) {
        let itemid = this.item.id || this.$route.params.id // why?? liftcycle timing??: in list or in view
        checkStarItem(itemid).then(resp => {
          this.flagAction = this.mapFlag[resp.data.message]
          this.flagNote = resp.data.note
          this.flagTime = resp.data.when
        })
      } else {
        this.flagAction = 'Options'
        this.flagNote = ''
      }
    },
    toStar (as) {
      if (checkAuth()) {
        this.showStar = true
        this.starAs = as
      } else {
        this.$message('Should Log in to Access')
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    starAndNote () {
      if (!this.$refs.form.validate() || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let note = this.flagNote.trim()
      let flag = this.flagMap[this.starAs]
      let rate = 0  // to do
      starItem(this.item.id, flag, rate, note || this.starAs)
      .then(resp => {
        this.flagAction = this.mapFlag[resp.data.message]
        this.flagNote = resp.data.note
      })
      this.showStar = false
    },
    // store keyword to search created rut
    // :flow: input key then search -> select
    storeKey (query) {
      if (query.trim() !== '') {
        this.searchKey = query.trim()
      }
    },
    searchCreatedRuts () {
      if (checkAuth()) {
        this.searching = true
        let uname = this.$store.getters.actID
        if (this.searchKey.length < 6) { // least keyword length
          fetchRuts('user',uname,1,'create').then(resp => {
            this.createdRuts = resp.data.ruts
            this.searching = false
          })
        } else {
          this.$http(`${base}/ruts/key/${uname}?page=1&flag=0&kw=${this.searchKey}&fr=user`)
          .then(resp => {
            this.createdRuts = resp.data.ruts
            this.searching = false
          })
        }
        this.searchKey = ''
      }
    },
    showAndloadRuts () {
      if (checkAuth()) {
        this.searchCreatedRuts()
        this.showAddtoRut = true
      }
    },
    addToRut () {
      this.selectedRut = this.createdRuts[this.selectIndex]
      this.rutID = this.selectedRut.id
      if (!this.rutID || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      // or can pass the itemid to AddItem via store
      // this.$router.push('/collect/' + this.rutID)
      //
      let data = { 
        rut_id: this.rutID,
        item_id: this.item.id,
        item_order: 0,  // just a placehoder, cannot pass the real order
        content: this.content,
        uname: '', // can get from cookie
      }
      collectItem(this.rutID, data).then(() => {
        // renew rut's cache updatetime, thus will reload when route to rutview
        let updateTime = {'rutslug':this.selectedRut.slug, 'lastUpdate':0, 'ref':'lastUpdate'}
        this.$store.commit('RENEW_RUT', updateTime)
        this.showAddtoRut = false
        this.$router.push(`/r/${this.selectedRut.slug}`)
      })
    },
  },
  created () {
    this.checkStar()
  }
}
</script>

<style scoped>
.item-sum {
  background-color: #fcfcfa;
  min-height: 145px;
  padding: 5px 115px 5px 115px;
  border-bottom: 1px solid #eee;
  position: relative;
}
.thumb {
  max-width: 110px;
  max-height: 130px;
  position: absolute;
  top: 5px;
  left: 2px;
}
.info {
  font-size: 14px;
  line-height: 1.6em;
}
.info .title {
  font-size: 18px;
}
.info .indicator {
  font-size: 14px;
  color: #777;
}
.info .flag-note {
  color: grey;
}
.operate {
  position: absolute;
  top: 10px;
  right: 2px;
}
</style>