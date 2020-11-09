<template>
  <div class="deepitems" v-if="data" :style="`${ml ? '' : 'margin-left:55px'}`">
    <el-form-item
      class="efi elcp"
      :label="`${index}:`"
      v-for="(item, index) in ipt"
      :key="index"
    >
      <div class="cfon">
        <div class="cf">
          <el-switch
            v-model="data[index]"
            active-color="#409eff"
            inactive-color="#7fcc59"
            v-if="typeof item == 'boolean'"
          ></el-switch>
          <el-input
            v-if="typeof item == 'number' || typeof item == 'string'"
            class="teif"
            v-model="data[index]"
            clearable
          ></el-input>
        </div>
        <el-button
          class="delbut el-icon-minus"
          type="danger"
          size="small"
          :style="`${typeof item == 'object' ? ' margin-left: 55px;' : ''}`"
          @click="delone(index)"
          ></el-button
        >
      </div>

      <deepitem v-if="typeof item == 'object'" :data="item"></deepitem>
      <el-button
        v-if="typeof item == 'object'"
        class="delbut el-icon-plus"
        type="success"
        size="small"
        @click="addshow(index)"
        style="margin-left: 55px"
        ></el-button
      >
    </el-form-item>
    <el-dialog
      title="添加"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="twdiv">
        <div v-if="!isaddarr">
          key值: <el-input class="elpt" v-model="vmkey"></el-input>
        </div>
        <!-- <el-ra
        dio v-model="radio" label="1">是否为Object</el-ra> -->
        <div>
          类型:
          <el-select class="elpt" v-model="isarr" placeholder="类型">
            <el-option
              v-for="item in methods"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>

        <div v-if="isarr == '其它类型'">
          value值: <el-input class="elpt" v-model="vmvalue"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="disabled" type="primary" @click="addone"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'deepitem',
  props: {
    data: {
      type: [String, Number, Boolean, Object, Array],
      default: function () {
        return []
      },
    },
    ml: {
      type: [Boolean, String, Number],
      default: false,
    },
  },
  data() {
    return {
      disabled: true,
      addindex: '',
      isarr: 'Object',
      methods: ['Object', 'Array', '其它类型'],
      isaddarr: false,
      vmkey: '',
      vmvalue: '',
      radio: false,
      dialogVisible: false,
      ipt: this.data,
    }
  },
  watch: {
    isarr: {
      handler(n, o) {
        this.isshowbut()
      },
      immediate: true,
    },
    vmvalue: {
      handler(n, o) {
        this.isshowbut()
      },
      immediate: true,
    },
    vmkey: {
      handler(n, o) {
        this.isshowbut()
      },
      immediate: true,
    },
  },
  methods: {
    delone(index) {
      let rs = confirm(`确定删除改${index}下的数据?`)
      rs ? this.$delete(this.ipt, index) : ''
    },
    addone() {
      if (this.isaddarr) {
        if (this.isarr == 'Object') {
          this.ipt[this.addindex].push({})
        }
        if (this.isarr == 'Array') {
          this.ipt[this.addindex].push([])
        }
        if (this.isarr == '其它类型') {
          this.ipt[this.addindex].push(this.vmvalue)
        }
      } else {
        if (this.isarr == 'Object' || this.isarr == 'Array') {
          this.$set(
            this.ipt[this.addindex],
            this.vmkey,
            this.isarr == 'Object' ? {} : []
          )
          // this.ipt[this.addindex][this.vmkey] = this.isarr == 'Object' ? {} : []
        } else {
          this.$set(
            this.ipt[this.addindex],
            this.vmkey,
            this.vmvalue
          )
          // this.ipt[this.addindex][this.vmkey] = this.vmvalue
        }
      }
      this.dialogVisible = false
      console.log('data', this.ipt[this.addindex])
      
    },
    clearout(){
      
    },
    handleClose() {
      this.dialogVisible = false
    },
    addshow(index) {
      this.dialogVisible = true
      this.addindex = index
      this.isaddarr = this.ipt[this.addindex] instanceof Array
      this.isarr = this.isaddarr ? 'Array' : 'Object'
    },
    isshowbut() {
      if (this.isaddarr) {
        if (this.isarr == '其它类型') {
          this.disabled = this.vmvalue ? false : true
        } else {
          this.disabled = false
        }
      } else {
        let iscon = this.vmvalue && this.vmkey
        if (this.isaddarr == '其他类型') {
          this.disabled = iscon ? false : true
        } else {
          this.disabled = this.vmkey ? false : true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.elcp {
  display: flex;
  width: 60vw;
  flex-wrap: wrap;
  margin: 6px 0;
}
.cf {
  display: flex;
}
.delbut {
  margin: 10px 0;
  margin-left: 15px;
}
.cfon {
  display: flex;
}
.twdiv {
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.elpt {
  width: 80%;
  margin-left: 20px;
}

</style>
<style lang="scss">
.deepitems{
  .el-button{
    height: 20px;
    padding: 3px 5px;
  }
}
  
</style>