<template>
  <div class="update-page">
    <div class="title"> 
      <span><b>Updating: </b><small>{{ title }}</small></span>
    </div>
    <v-form ref="form" class="create-form">
      <v-textarea
        v-model="title"
        label="Title"
        :counter = "256"
        :rules="titleRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="url"
        label="URL"
        :counter = "256"
        :rules="lenRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="content"
        label="Content"
        counter
        :rows= "10"
        auto-grow
        :rules="mustRule"
      ></v-textarea>
      <v-text-field
        v-model= "author"
        label= "Origin Author"
      ></v-text-field>
    </v-form>
    <el-button type="success" size="mini" class="blockbtn" @click="onUpdate">
      Done and Update
    </el-button>
  </div>
</template>

<script>
import { updateRut } from '../../api'
import { checkAuth } from '../../util/auth'

export default {
  name: 'update-rut',
  title: 'Update Collection',
  components: { },
  data () {
    return {
      title: '',
      url: '',
      content: '',
      author: '',
      rut_uname:'', // for check auth
      rutid: '',
      mustRule: [ v => !!v || 'required' ],
      lenRule: [ v => v.length <= 256 || 'Must be less than 256 characters' ]
    }
  },
  computed: {
    titleRule () { 
      return this.mustRule.concat(this.lenRule)
    }
  },
  methods: {
    onUpdate () {
      let currID = this.$store.getters.actID
      if (!this.$refs.form.validate() || !checkAuth() || currID !== this.rut_uname) {
        this.$message("Invalid Input or Auth Failed")
        return
      }
      let data = {
        id: this.rutid.trim(),
        title: this.title.trim(),
        content: this.content.trim(),
        url: this.url.trim(),
        author_id: this.author.trim(),
        credential: '...'
      }
      updateRut(this.ritid, data).then(resp => {
        let id = resp.data.rut.id
        let updateTime = {'rutid':id, 'lastUpdate':0, 'ref':'lastUpdate'}
        this.$store.commit('RENEW_RUT', updateTime)
        this.$router.push(`/r/${id}`)
      })
    },
    loadRut () {
      let rid = this.rutid = this.$route.params.id
      this.$store.dispatch('getRut', rid).then(resp => {
        this.title = resp.title
        this.url = resp.url
        this.author = resp.author_id
        this.content = resp.content
        this.rut_uname = resp.uname
      })
    }
  },
  created () {
    this.loadRut()
  }
}
</script>

<style scoped>
.update-page {
  padding: 10px 180px 10px 120px;
  position: relative;
}
.title {
  margin-bottom: 20px;
}
</style>
