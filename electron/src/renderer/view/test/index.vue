<template>
  <div class="test">
    url:<el-input style="width:60vw;margin:0 25px" v-model="url"></el-input>
    <el-button  type="success" @click="getdata">确定</el-button>
    <textarea class="texts" v-if="textshow">{{ textdata }}</textarea>
  </div>
</template>

<script>
import setting from '../../../setting'
export default {
  name: 'test',
  data() {
    return {
      url: '172.16.18.147:8080/zephyr_jzfp/dev/queryYSKQS?bsds00=35',
      textdata: '',
      textshow: true,
    }
  },
  methods: {
    getdata() {
      this.$http(`${setting.ip}${this.url}`).then((res) => {
        console.log('返回res', res)
        this.textshow = false
        this.textdata = JSON.stringify(res)
        this.$nextTick(() => {
          this.textshow = true
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.test{
  width: 80vw;
  display: flex;
  justify-content:flex-end ;
  align-items: center;
  font-size: 18px;
}
.texts {
  position: absolute;
  width: 800px;
  height: 420px;
  overflow: auto;
  padding: 15px;
  white-space: pre-wrap;
  margin-left:-200px;
  margin-top: 20vw;
}
</style>
