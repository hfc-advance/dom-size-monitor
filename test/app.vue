<template>
  <div>
    <div class="test">小崔2</div>
  </div>
</template>

<script>
import { monitor } from '../src/main.js'
export default {
  name: 'APP',
  created () {
    let monitor1 = monitor(document.body, this.test)
    monitor1.unMonitor()
    setTimeout(() => {
      monitor(document.querySelector('.test'), this.test1)
      monitor(document.querySelector('.test'), this.test1)
    }, 100)
  },
  methods: {
    test () {
      console.log('test')
    },
    test1 () {
      console.log('test1')
    }
  }
}
</script>

<style lang="stylus" scoped>
.test
  color red
  width 20px
</style>
