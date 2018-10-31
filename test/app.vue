<template>
  <div>
    <div class="test" ref="test">小崔2</div>
  </div>
</template>

<script>
import { bind } from '../dist/dom-size-monitor.esm.js'
export default {
  name: 'APP',
  mounted () {
    setTimeout(() => {
      bind(this.$refs.test, result => {
        console.error(result)
      })
    }, 1000)
  }
}
</script>

<style lang="stylus" scoped>
.test
  color red
  width 20px
</style>
