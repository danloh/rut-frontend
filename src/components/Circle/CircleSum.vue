<template>
  <div class="circle-sum">
    <b style="font-size:21px">{{ circle.name }}</b>
    <el-button type="text" @click="openDialog=true" v-if="canEdit">
      <small style="font-size:0.75em">...Edit</small>
    </el-button>
    <!-- <div class="meta">
      <a :href="'/profile/' + circle.facilitator.id">
        <img :src="circle.facilitator.avatar" referrerPolicy="no-referrer" 
              style="width:14px;height:14px;border-radius:50%">
        {{ circle.facilitator.name.slice(0,12) }}
      </a>
    </div> -->
    <div class="info">
      <p><a :href="'https://www.google.com/maps/place/' + circle.address" 
            target="_blank"><i class="el-icon-location"></i>
          </a> {{ circle.address }}</p>
      <p><i class="el-icon-time"></i> {{ circle.time }}</p>
    </div>
    <div class="detail">
      <div v-html="noteContent"></div>
      <el-button type="text" size="mini" @click="less=false" v-if="less">
                 ...more
      </el-button>
    </div>
    <!-- edit dialog -->
    <el-dialog title="Edit Circle Information" :visible.sync="openDialog" width="480px">
      <el-form :model="editForm" :rules="rules" ref="editForm" size="mini">
        <el-form-item prop="name">
          <el-input type="textarea" autosize v-model="editForm.name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item prop="address">
          <el-input type="textarea" autosize v-model="editForm.address" placeholder="Address"></el-input>
        </el-form-item>
        <el-form-item prop="time">
          <el-input v-model="editForm.time" placeholder="Time, like: Every Sat. 2PM - 4PM"></el-input>
        </el-form-item>
        <el-form-item prop="note">
          <el-input type="textarea" :autosize="{minRows:3}" v-model="editForm.note" 
                    placeholder="Can provide more info by linking to a detail page">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="mini" @click="confirm=true">Delete?</el-button>
        <el-button type="success" 
                   @click="onEditCircle('editForm', editForm)">
                   Edit  Done
        </el-button>
      </div>
    </el-dialog>
    <!-- end edit dialog -->
    <!-- confirm delete dialog -->
    <el-dialog title="Confirm Delete?" :visible.sync="confirm" width="320px">
      <span>Confirm Delete? Can not recover</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="confirm = false">Cancel</el-button>
        <el-button type="danger" size="mini" 
                   @click="onDelCircle">
                   Confirm Delete
        </el-button>
      </span>
    </el-dialog>
    <!-- end confirm del dialog -->
  </div>
</template>

<script>
import { editCircle, delCircle } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid, showLess } from '@/util/filters'
import marked from '@/util/marked'

export default {
  name: 'circle-sum',
  props: ['circleObj'],
  data () {
    return {
      circle: this.circleObj,  // will alter here
      canEdit: this.ifCanEdit(),
      openDialog: false,
      confirm: false,
      less: this.circleObj.note.length > 255,
      editForm: {
        name: this.circle.name,
        address: this.circle.address,
        time: this.circle.time,
        note: this.circle.note
      },
      rules: {
        name: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        address: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 200, message: 'Max Length should be 200', trigger: 'blur' }
        ],
        time: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        note: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    noteContent () {
      let content = marked(this.circle.note)
      return this.less ? showLess(content, 255) : content
    }
  },
  methods: {
    ifCanEdit () {
      if (checkAuth()) {
        this.circle = this.circleObj
        return this.circleObj.facilitator.id === this.$store.getters.currentUserID
      }
    },
    onEditCircle (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            name: form.name.trim(),
            address: form.address.trim(),
            time: form.time.trim(),
            note: form.note.trim()
          }
          let cid = this.circle.id
          editCircle(cid, data).then(resp => {
            this.openDialog = false
            this.circle = resp.data
          })
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Please Log in to Continue'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    },
    onDelCircle () {
      let cid = this.circle.id
      delCircle(cid).then(() => {
        this.confirm = false
        this.openDialog = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.circle-sum
  background-color lighten(#ecf7ef, 75%)
  padding 20px
  border-bottom 1px dashed #ddd
  .meta
    font-size 10px
  .info
    font-size 14px
    color green
</style>
