<template>
  <div class="zfitem">
    <div v-if="!isipt" class="zf_label">{{ label }}</div>
    <el-input
      v-else
      class="elpit"
      :style="{width:`${value.toString().length*12}px`}"
      v-bind:value="value"
      v-on:input="geton"
      clearable
    ></el-input>
    <div class="centerpt">:</div>
    <div class="zf_value"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: 'zfitem',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    label: {
      type: [String, Number],
      default: '0',
    },
    isipt: {
      type: [Boolean],
      default: false,
    },
    value:[String,Number]
  },
  data() {
    return {
    }
  },
  methods: {
    geton(e){
      console.log('e',e);
      console.log('e2',this.value);
      this.value=e
      this.label=e
      console.log('e3',this.label);
      this.$emit('input',e)
      // this.$emit('setkey',{nw:e,old:this.value})

      // this.$emit('change',e)
    }
  },
}
</script>

<style lang="scss" scoped>
.zfitem {
  position: relative;
  width: auto;
  // min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  .zf_label {
    min-width: 50px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  .zf_value {
    min-width: 130px;
    // height: 500px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
     flex-wrap: wrap;
  }
}
.centerpt{
  margin: 0 5px;
  color: rgb(61, 60, 60);
  font-size: 18px;
  font-weight: 800;
}
.elpit{
  // max-width: 280px;
  // min-width: 120px;
  min-width: 110px;
}
</style>