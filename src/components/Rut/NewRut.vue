<template>
  <div class="create-page">
    <div class="title">
      <span>Create: </span>
      <small style="color:green;font-size:0.8em;">collection of books, courses, etc.</small> 
    </div>
    <v-form ref="form" class="create-form">
      <v-textarea
        v-model="title"
        label="Title"
        :counter = "120"
        :rules="titleRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="url"
        label="URL"
        :counter = "120"
        :rules="lenRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-text-field
        v-model= "author"
        label= "Origin Author"
      ></v-text-field>
      <v-textarea
        v-model="content"
        label="Content"
        counter
        :rows= "10"
        auto-grow
        :rules="mustRule"
      ></v-textarea>
    </v-form>
    <el-button class="blockbtn" type="primary" size="small"
               @click="onCreate">Create New
    </el-button>
  </div>
</template>

<script>
import { newRut } from '../../api'
import { trimValid } from '../../util/filters'

export default {
  name: 'new-rut',
  title: 'Create New',
  components: { },
  data () {
    return {
      title: '',
      url: '',
      content: '',
      author: '',
      editable: 'Creator',
      mustRule: [ v => !!v || 'required' ],
      lenRule: [ v => v.length <= 120 || 'Must be less than 120 characters' ]
    }
  },
  computed: {
    titleRule () { 
      return this.mustRule.concat(this.lenRule)
    }
  },
  methods: {
    onCreate () {
      if (!this.$refs.form.validate()) {
        console.log("Invalid")
        return
      }
      let data = {
        title: this.title.trim(),
        content: this.content.trim(),
        url: this.url.trim(),
        user_id: '...',  // should get from cookie
        user_name: '...',
        author_id: this.author.trim(),
        credential: '...'
      }
      newRut(data).then(resp => {
        let id = resp.data.rut.id
        this.$router.push(`/r/${id}`)
      })
    }
  }
}
</script>

<style scoped>
.create-page {
  padding: 20px 120px 20px 120px;
  position: relative;
}
.title {
  padding-bottom: 10px;
}
.create-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
</style>
