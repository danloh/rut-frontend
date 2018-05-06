<template>
  <div class="tip-sum">
    <div v-html="md(tip.tip)"></div>
    <el-button type="text" size="mini" @click="short = spoiler = false" 
               v-if="spoiler || short">
      {{ spoiler ? '... Spoilers Ahead! Continue?' : 'Read More' }}
    </el-button>
    <a :href="'/readlist/' + tip.postid" v-if="!(spoiler || short) && less">:::</a>
  </div>
</template>

<script>
import marked from '@/util/marked'
import { showLess } from '@/util/filters'

export default {
  name: 'tip-sum',
  props: ['tip', 'less'],
  // to isolate the short in component
  data () {
    return {
      short: this.less,
      spoiler: this.tip.spoiler
    }
  },
  methods: {
    md (content) {
      let least = this.spoiler ? 0 : 128
      let mContent = marked(content)
      return this.short || this.spoiler ? showLess(mContent, least) : mContent
    }
  }
}
</script>
