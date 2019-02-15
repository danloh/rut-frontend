<template>
  <div class="create-page">
    <div class="title">
      <span>Create: </span>
      <small style="color:green;font-size:0.8em;">collection of books, courses, etc.</small> 
    </div>
    <v-form ref="form" class="create-form">
      <v-text-field
        v-model="title"
        label="Title"
        :counter = "120"
        :rules="titleRule"
      ></v-text-field>
      <v-text-field
        v-model="url"
        label="URL"
        :counter = "120"
        :rules="lenRule"
      ></v-text-field>
      <v-textarea
        v-model="content"
        label="Content"
        counter
        auto-grow
        :rules="mustRule"
      ></v-textarea>
    </v-form>
    <v-btn @click="onCreate">Create</v-btn>
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
        user_id: '1fa',
        user_intro: 'hello'
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
  border-bottom: 1px dotted;
}
.create-form {
  padding: 10px;
}
</style>