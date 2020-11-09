<template>
  <div class="parm">
    <div class="key-value">
      <div class="key">key</div>
      <div class="value">value</div>
    </div>
    <div class="foript" v-for="(item, index) in vmobj" :key="index">
      <!-- {{ item.key }}:{{ item.value }} -->
      <el-input
        class="keyipt"
        v-model="item.key"
        @change="getchange"
      ></el-input>
      <span>:</span>
      <el-input
        class="valueipt"
        v-model="item.value"
        @change="getchange"
      ></el-input>
      <el-button
        class="delbut el-icon-minus"
        type="danger"
        size="small"
        @click="delone(index)"
      ></el-button>
    </div>
    <el-button
      class="delbut el-icon-plus"
      type="success"
      size="small"
      @click="addone"
    ></el-button>
  </div>
</template>

<script>
export default {
  name: 'parm',
  props: {
    eparams: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      vmobj: [
        {
          key: '',
          value: '',
        },
      ],
    }
  },
  methods: {
    delone(index) {
      this.vmobj = [
        ...this.vmobj.slice(0, index),
        ...this.vmobj.slice(index + 1),
      ]
      this.getchange()
    },
    addone() {
      this.vmobj.push({ key: '', value: '' })
    },
    getchange() {
      console.log(this.vmobj)
      let obj = {}
      this.vmobj.some((val) => {
        if (!val.key) {
          this.$message({
            message: 'key不能为空,否则将删除改项!',
            type: 'warning',
          })
        }
      })
      this.vmobj.forEach((val) => {
        if (val.key) {
          obj[val.key] = val.value
        }
      })
      this.$emit('getparams', obj)
    },
    obj_arr(params) {
      this.vmobj = []
      Object.entries(params).forEach((val) => {
        console.log('val', val[0], val[1])
        this.vmobj.push({ key: val[0], value: val[1] })
      })
      this.$emit('getparams', params)
    },
  },
  mounted() {
    if (this.eparams) {
      this.obj_arr(this.eparams)
    }
  },
}
</script>

<style lang="scss" scoped>
.parm {
  width: 60vw;
}
.keyipt {
  width: 100px;
}
.valueipt {
  width: 300px;
}
.key-value {
  display: flex;
  align-items: center;
  color: #555;
  > div {
    width: 100px;
    text-align: center;
    font-size: 18px;
  }
}
.foript {
  margin: 5px 0;
}
.delbut {
  padding: 5px 8px;
  margin-left: 12px;
}
</style>