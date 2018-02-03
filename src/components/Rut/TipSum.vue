<template>
  <div class="tip-sum">
    <div v-html="md(tip.tip)" v-show="!tip.spoiler || !short"></div>
    <el-button type="text" size="mini" 
               @click="short = !short" 
               v-if="tip.spoiler && short">
      ... Spoilers Ahead! Continue?
    </el-button>
  </div>
</template>

<script>
import marked from '@/util/marked'

export default {
  name: 'tip-sum',
  props: ['tip'],
  // to isolate the short in component
  data () {
    return {
      short: true
    }
  },
  methods: {
    md (content) {
      return marked(content)
    }
  }
}
</script>
