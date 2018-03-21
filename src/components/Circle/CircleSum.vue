<template>
  <div class="circle-sum">
    <b>{{ circle.name }}</b>&nbsp;&nbsp;
    <el-button type="text" @click="openDialog=true" v-if="canEdit">
      <small>...Edit</small>
    </el-button>
    <div>
      {{ circle.note }}
      <span class="meta">
        <router-link :to="'/profile/' + circle.facilitator.id" style="font-size:0.85em">
          ...By {{ circle.facilitator.name.slice(0, 12) }}
        </router-link>
      </span>
    </div>
    <div class="info">
      <p><i class="el-icon-location-outline"></i> {{ circle.area }}</p>
      <p><i class="el-icon-location"></i> {{ circle.address }}</p>
      <p><i class="el-icon-time"></i> {{ circle.time }}</p>
    </div>
    <!-- edit dialog -->
    <el-dialog title="Edit Circle" :visible.sync="openDialog" width="40%">
    <el-form :model="editForm" :rules="rules" ref="editForm" size="mini">
        <el-form-item prop="name">
        <el-input v-model="editForm.name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item prop="address">
        <el-input v-model="editForm.address" 
                    placeholder="Detail Address">
        </el-input>
        </el-form-item>
        <el-form-item prop="area">
        <el-input v-model="editForm.area" 
                    placeholder="Area, like: BayArea SF">
        </el-input>
        </el-form-item>
        <el-form-item prop="time">
        <el-input v-model="editForm.time" 
                    placeholder="Time, like: Every Sat. 2PM - 4PM">
        </el-input>
        </el-form-item>
        <el-form-item prop="note">
        <el-input type="textarea" v-model="editForm.note" 
                    :autosize="{minRows:3}" 
                    placeholder="Can provide more info by linking to a detail page">
        </el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="confirm=true">Delete</el-button>
        <el-button @click="openDialog=false">Cancel</el-button>
        <el-button type="success" 
                    @click="onEditCircle('editForm', editForm)">
                    Done
        </el-button>
    </div>
    </el-dialog>
    <!-- edit dialog end -->
    <!-- confirm delete dialog -->
    <el-dialog title="Confirm Delete?" :visible.sync="confirm" width="30%">
      <span>Confirm Delete? Can not recover</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="confirm = false">Cancel</el-button>
        <el-button type="danger" size="mini" 
                   @click="onDelCircle">
                   Confirm Delete
        </el-button>
      </span>
    </el-dialog>
    <!-- confirm dialog end -->
  </div>
</template>

<script>
import { editCircle, delCircle } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'

export default {
  name: 'circle-sum',
  props: ['circleObj'],
  data () {
    return {
      circle: this.circleObj,  // will alter here
      canEdit: this.ifCanEdit(),
      openDialog: false,
      confirm: false,
      editForm: {
        name: this.circle.name,
        address: this.circle.address,
        area: this.circle.area,
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
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ],
        area: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        time: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        note: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 120, message: 'Max Length should be 200', trigger: 'blur' }
        ]
      }
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
            area: form.area.trim(),
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
  background-color lighten(#f1f8f9, 75%)
  padding 10px
  border-bottom 2px solid #eee
  .meta
    font-size 0.75em
  .info
    font-size 0.85em
    color green
</style>
