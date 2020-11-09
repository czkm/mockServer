<template>
  <div class="login">
    <!-- <Zfitem label='Content-Type'  v-model="test" > -->
       <!-- <el-select class="esfirst" v-model="all.method" placeholder="请求方式">
          <el-option
            v-for="item in methods"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select> -->
        <!-- <el-input v-model="all.method"></el-input> -->
    <!-- </Zfitem> -->
    <el-form ref="form" :model="form" class="elforms">
      <el-form-item label="请求方式:" class="efi">
        <el-select class="esfirst" v-model="all.method" placeholder="请求方式">
          <el-option
            v-for="item in methods"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="efi" label="路径url:">
        <el-autocomplete
          class="esecond"
          v-model="all.url"
          clearable
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @change="autochange"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item class="efi">
        <el-button class="eltfirst" type="primary" @click="getData"
          >确定</el-button
        >
      </el-form-item>
      <el-form-item class="efi">
        <el-button class="eltfirst" type="success" @click="reload"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item class="efi">
        <el-button class="elthird" type="danger" @click="del"
          >删除该接口</el-button
        >
      </el-form-item>
      <!-- 第二行 -->
      <el-form-item v-if="finalshow" class="efi" label="method:">
        <!-- <el-input
          class="teif"
          v-model="entryData.method"
          clearable
          placeholder=""
        ></el-input> -->
        <el-select class="teif" v-model="entryData.method">
          <el-option
            v-for="item in methods"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 第三行 -->
      <el-form-item v-if="finalshow" class="efi" label="url:">
        <el-input class="teif" v-model="entryData.url" clearable></el-input>
      </el-form-item>
      <!-- next -->
      <DeepItem
        v-if="deepshow"
        ref="deppcp"
        :data="configOther"
        ml="true"
      ></DeepItem>
      <!-- data -->
      <el-form-item v-if="finalshow && teshow" class="efi" label="textData:">
        <textarea class="textdata" @change="change">{{ textData }}</textarea>
      </el-form-item>
      <el-form-item v-if="finalshow" class="efi">
        <div class="buf">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
        <!-- <pre>{{configOther}}</pre> -->
      </el-form-item>
      <!-- 莫寒 -->
    </el-form>
       <!-- <DeepItem
        v-if="deepshow"
        ref="deppcp"
        :data="configOther"
        ml="true"
      ></DeepItem> -->
  </div>
</template>

<script>
import { Message } from 'element-ui'
import DeepItem from '@/components/deepItem'
import Zfitem from '@/components/zfitem'
export default {
  name: 'login',
  components: {
    DeepItem,
    Zfitem
  },
  data() {
    return {
      finalshow: false,
      test:"ppp",
      deepshow: false,
      teshow: true,
      configOther: {},
      textData: {},
      entryData: { url: '', method: '' },
      entryDatacopy: { url: '', method: '' },
      form: {},
      all: {
        method: 'GET',
        url: '',
      },
      mrall: {
        method: 'GET',
        url: '',
      },
      urls: [],
      methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS',
        'HEAD',
        'TRACE',
        'CONNECT',
        'PATCH',
      ],
    }
  },
  watch: {
    all: {
      handler(newName, oldName) {
        console.log('watch-.all', newName.url)
        // if(!newName.url){
        //   this.reload()
        // }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    save() {
      console.log('entryData', this.entryData)
      this.configOther.url = this.entryData.url
      this.configOther.method = this.entryData.method
      let save = {
        data: { ...this.textData },
        config: { ...this.entryData, ...this.configOther },
      }
      console.log('save', save)
      this.$elstore.set(this.entryData.url.toString(), save)
      if (this.entryData.url && this.entryData.url != this.entryDatacopy.url) {
        this.$elstore.del(this.entryDatacopy.url)
      }
      this.urls = this.$elstore.all()
      console.log('allvalue', this.$elstore.allvalue())
    },
    reset() {},
    change(e) {
      try {
        this.textData = JSON.parse(e.target.value)
      } catch (error) {
        this.$message.error('格式错误')
        this.teshow = false
        this.$nextTick(() => {
          this.teshow = true
        })
      }
    },
    getData() {
      if (this.all.url) {
        this.deepshow = false
        this.$nextTick(() => {
          let val = this.$elstore.get(this.all.url)
          this.entryData.url = val.config.url
          this.entryData.method = val.config.method
          this.entryDatacopy.url = val.config.url
          this.textData = val.data
          Object.entries(val.config).forEach((val, index) => {
            if (!['url', 'method'].includes(val[0].toString())) {
              this.$set(this.configOther, val[0], val[1])
            }
          })
          this.deepshow = true
          this.finalshow = true
        })

        // this.$refs.deppcp.getdata(this.configOther)
        // this.deepshow=true
      } else {
        this.$message({
          message: 'url不能为空!',
          type: 'warning',
        })
      }
    },
    del() {
      let url=this.all.url
      if (url && this.$elstore.has(url)) {
        let rs = confirm('确定删除该接口?')
        if (rs) {
          console.log('删除了')
          this.$elstore.del(url)
          this.reload()
        }
      } else {
        this.$message({
          message: 'url不能为空!',
          type: 'warning',
        })
      }
    },
    reload() {
      this.urls = this.$elstore.all()
      this.finalshow = false
      this.deepshow=false
        this.all = JSON.parse(JSON.stringify(this.mrall))
    },
    querySearch(queryString, cb) {
      let rest = [...this.urls]
      let restaurants = rest.map((val) => (val = { value: val }))
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      cb(results)
    },
    autochange(e){
      if(!e){
        this.reload()
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
  },
  created() {
    this.urls = this.$elstore.all()
  },
}
</script>

<style lang="scss" scoped>
.elforms {
  display: flex;
  width: 100%;
  // justify-content: flex-end;
  flex-wrap: wrap;
}
.efi {
  display: flex;
  &:nth-child(2) {
    margin-left: 25px;
  }
}
.esfirst {
  width: 10vw;
}
.esecond {
  width: 50vw;
}
.eltfirst {
  margin-left: 20px;
  width: 4vw;
  display: flex;
  justify-content: center;
  align-content: center;
}
.telf {
  width: 100vw;
}
.teif {
  width: 60vw;
}
.textdata {
  width: 800px;
  height: 420px;
  overflow: auto;
  padding: 15px;
  white-space: pre;
}
.buf {
  width: 80vw;
  display: flex;
  justify-content: center;
  align-content: center;
  button {
    margin: 25px 15px;
  }
}
.elthird {
  margin: 0 15px;
}
</style>
<style  lang='scss'>
.login {
  .el-form-item__label {
    min-width: 100px;
  }
}
</style>
