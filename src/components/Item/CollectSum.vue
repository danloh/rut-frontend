<template>
  <div class="collect-sum">
    <div class="item-info">
      <b class="indicator">#{{collect.item_order}}&nbsp;</b> 
      <router-link :to="'/item/' + collect.id">{{ collect.title }}</router-link>
      <small style="color:#aaa;font-size:14px">
        <br> &nbsp; {{collect.uiid}}&nbsp;&nbsp;{{collect.authors}}
      </small>
      <span>
        <img class="thumb" :src="collect.cover" referrerPolicy="no-referrer">
      </span>
    </div>
    <div class="content" v-html="md(content)" v-if="showCtn"></div>
    <el-button type="text" size="mini" @click="showCtn=!showCtn" v-if="canEdit">
      <small class="hiden" v-if="showCtn">Edit</small><b v-else>Cancel</b>
    </el-button>
    <div v-if="!showCtn">
      <v-form ref="form" class="collect-form">
        <v-textarea
          v-model="content"
          counter
          :rules="mustRule"
          auto-grow
        ></v-textarea>
      </v-form>
      <el-button type="text" size="mini" @click="editContent">
        Done
      </el-button>
      <!--need to re-oder after del-->
      <!-- <el-button type="text" size="mini" @click="showCfm=true">
        Delete
      </el-button> -->
      <!-- confirm delete dialog -->
      <el-dialog title="Confirm Delete?" width="270px" :visible.sync="showCfm">
        <span>Confirm Delete? Cannot Recover</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showCfm=false">Cancel</el-button>
          <el-button type="danger" size="mini" @click="delContent">
            Confirm Delete
          </el-button>
        </span>
      </el-dialog>
      <!-- end confirm delete dialog -->
    </div>
  </div>
</template>

<script>
import marked from '../../util/marked'
import { updateCollect, delCollect } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'collect-sum',
  props: ['collect', 'canEdit'], // {cid, content..}
  data () {
    return {
      showCtn: true,
      showCfm: false,
      content: '',
      mustRule: [ v => !!v || 'required' ],
    }
  },
  methods: {
    md (content) { return marked(content) },
    editContent () {
      let currID = this.$store.getters.actID
      if (!this.$refs.form.validate() || currID !== this.collect.uname || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let data = {
        id: this.collect.cid,
        content: this.content.trim(),
        uname: currID,
      }
      updateCollect(this.collect.cid, data).then(resp => {
        this.content = resp.data.collect.content
        this.showCtn = true
      })
    },
    delContent() {
      let currID = this.$store.getters.actID
      if (currID !== this.collect.uname || !checkAuth()) {
        this.showCfm = false
        this.$message('No Permission')
        return
      }
      let data = {
        collect_id: this.collect.cid,
        rut_id: this.collect.rutid,
        item_id: this.collect.id,
        uname: currID,
      }
      delCollect(this.collect.cid, data).then(() => {
        this.showCfm = false
        this.$router.push(`/r/${this.collect.rutid}`)  // how to reload?
      })
    }
  },
  created () {
    this.content = this.collect.content
  }
}
</script>

<style scoped>
.item-info {
  padding-right: 40px;
  position: relative;
}
.item-info .thumb {
  position: absolute;
  max-width: 40px;
  max-height: 40px;
  top: 0px;
  right: 0px;
}
.hiden {
  cursor: pointer;
  color: transparent;
}
.hiden:hover {
  color: orangered;
  font-size: 15px;
}
</style>
