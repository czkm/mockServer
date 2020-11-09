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
      <!-- <el-form-item label="请求方式:" class="efi">
        <el-select class="esfirst" v-model="all.method" placeholder="请求方式">
          <el-option
            v-for="item in methods"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
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
      <el-form-item class="efi">
        <el-button class="elfifht" type="danger" @click="delalls"
          >删除所有接口</el-button
        >
      </el-form-item>
      <!-- 第二行 -->
      <el-form-item v-if="finalshow" class="efi" label="Method:">
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
      <el-form-item v-if="finalshow" class="efi" label="URL:">
        <el-input
          class="teif"
          @change="Urlchange"
          v-model="entryData.url"
          clearable
        ></el-input>
      </el-form-item>
      <!-- 第四行 -->
      <el-form-item v-if="finalshow" class="efi" label="是否走缓存:">
        <el-switch class="teif" v-model="normal"> </el-switch>
      </el-form-item>
      <!-- 第五行 -->
      <el-form-item v-if="finalshow" class="efi" label="Parm:">
        <Parm
          ref="parmref"
          @getparams="getparams"
          :eparams="entryData.params"
        ></Parm>
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
          <el-button type="primary" @click="save">保存(重新发送请求)</el-button>
          <el-button type="primary" @click="save2"
            >保存(仅是修改本地data)</el-button
          >
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
import Parm from '@/components/parm'
import setting from '../../../setting'
export default {
  name: 'login',
  components: {
    DeepItem,
    Zfitem,
    Parm,
  },
  data() {
    return {
      normal: true,
      finalshow: false,
      test: 'ppp',
      deepshow: false,
      resetcopy: {},
      teshow: true,
      configOther: {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'access-control-allow-credentials': 'true',
        },
      },
      textData: {},
      entryData: { url: '', method: 'GET', params: {} },
      entryDatacopy: { url: '', method: '', params: {} },
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
        // if(!newName.url){
        //   this.reload()
        // }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    delalls() {
      let rs = confirm('此操作将永久删除该文件, 是否继续')
      if (rs) {
        this.$elstore.delall()
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.urls = this.$elstore.all()
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      }
    },
    GetRequest(name) {
      let theRequest = new Object()
      if (name.indexOf('?') != -1) {
        let str = name.split('?')[1]
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest
    },
    Urlchange() {
      this.$refs.parmref.obj_arr(this.GetRequest(this.entryData.url) || {})
    },
    getparams(e) {
      this.entryData.params = e
      this.entryData.url = this.entryData.url.split('?')[0]
      if (e && JSON.stringify(e) != '{}') {
        this.entryData.url += '?'
        Object.entries(e).forEach((val, index) => {
          index == 0 ? '' : (this.entryData.url += '&')
          this.entryData.url += `${val[0]}=${val[1]}`
        })
      }
    },
    formatDate() {
      const date = new Date()
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return myyear + '-' + mymonth + '-' + myweekday
    },
    save() {
      let save = {
        data: { ...this.textData },
        config: { ...this.entryData, ...this.configOther },
        normal: this.normal,
        ctime: this.formatDate(),
      }
      this.$elstore.set(this.entryData.url.toString(), save)
      if (this.entryData.url && this.entryData.url != this.entryDatacopy.url) {
        // if (this.entryData.url) {
        // console.log('dele', this.entryDatacopy.url)
        this.$elstore.del(this.entryDatacopy.url)
      }
      this.urls = this.$elstore.all()
      this.$elstore.del(save.config.url)
      let srr = setting.ip + save.config.url.substring(7)
      let srrbef = setting.ip + save.config.url.substring(7)
      // console.log('555',srr.split('?'));
      srr = srr.split('?')[0]
      if (['post', 'POST'].includes(save.config.method)) {
        console.log('post')
        this.$http
          .post(srr, save.config.params, { headers: save.config.headers })
          .then((res) => {
            console.log('resget', res)
            this.$message({
              message: '保存成功!',
              type: 'success',
            })
          })
          .catch((err) => {
            this.$message({
              message: '失败!',
            })
            console.log('err', err)
          })
      } else {
        console.log('get')
        this.$http
          .get(srrbef, { headers: save.config.headers })
          .then((res) => {
            console.log('resget', res)
            this.$message({
              message: '保存成功!',
              type: 'success',
            })
          })
          .catch((err) => {
            this.$message({
              message: '失败!',
            })
            console.log('err', err)
          })
      }
    },
    save2() {
      try {
        let save = {
          data: { ...this.textData },
          config: { ...this.entryData, ...this.configOther },
          normal: this.normal,
          ctime: this.formatDate(),
        }
        this.$elstore.set(this.entryData.url.toString(), save)
        if (
          this.entryData.url &&
          this.entryData.url != this.entryDatacopy.url
        ) {
          this.$elstore.del(this.entryDatacopy.url)
        }
        this.$message({
          message: '保存成功!',
          type: 'success',
        })
      } catch (error) {
        this.$message({
          message: '失败!',
        })
        console.log('err', error)
      }
    },
    reset() {
      this.finalshow = false
      Object.entries(this.resetcopy).forEach((val) => {
        this[val[0]] = JSON.parse(JSON.stringify(val[1]))
      })
      this.$nextTick(() => {
        this.finalshow = true
      })
    },
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
          if (val) {
            this.normal = val.normal
            this.entryData.url = val.config.url || ''
            this.entryData.method = val.config.method || ''
            this.entryData.params = val.config.params || {}
            this.entryDatacopy.url = val.config.url || ''
            this.entryDatacopy.method = val.config.method || ''
            this.entryDatacopy.params = val.config.params || {}
            this.getparams(this.GetRequest(this.entryData.url))
            this.textData =
              val.data instanceof Object
                ? val.data
                : (function () {
                    try {
                      return JSON.parse(val.data.toString())
                    } catch (error) {
                      return JSON.parse(JSON.stringify(val.data))
                    }
                  })()
            Object.entries(val.config).forEach((vals, index) => {
              if (!['url', 'method', 'params'].includes(vals[0].toString())) {
                this.$set(this.configOther, vals[0], vals[1])
              }
            })
            this.configOther.headers = val.config.headers || {}
            this.resetcopy = {}
            this.resetcopy = {
              entryData: JSON.parse(JSON.stringify(this.entryData)),
              normal: this.normal,
              configOther: JSON.parse(JSON.stringify(this.configOther)),
              textData: this.textData,
            }
          } else {
            this.normal = true
            this.entryData = { url: this.all.url, method: 'GET', params: {} }
            this.entryDatacopy = {
              url: this.all.url,
              method: 'GET',
              params: {},
            }
            this.getparams(this.GetRequest(this.entryData.url))
          }
          this.deepshow = true
          this.finalshow = true
        })
      } else {
        this.$message({
          message: 'url不能为空!',
          type: 'warning',
        })
      }
    },
    del() {
      let url = this.all.url
      if (url && this.$elstore.has(url)) {
        let rs = confirm('确定删除该接口?')
        if (rs) {
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
      this.deepshow = false
      this.entryData = { url: '', method: '', params: {} }
      this.textData = {}
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
    autochange(e) {
      if (!e) {
        this.reload()
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        // return (
        //   restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
        //   0
        // )
        return restaurant.value.toLowerCase().match(queryString.toLowerCase())
      }
    },
    getone() {
      return this.$http(
        'http://192.168.91.1:3001/mock/172.16.18.147:8080/zephyr_jzfp/dev/queryYSKQS?bsds00=35'
      )
    },
    gettwo() {
      return this.$http(
        'http://192.168.91.1:3001/mock/172.16.18.147:8080/Ysjgxt/web/Af05Manage/Af05/getOrgCountLogOutOrNoActive?type=2&aaa027=359900'
      )
    },
  },

  created() {
    this.urls = this.$elstore.all()
  },
}
</script>

<style lang="scss" scoped>
.login {
  padding-top: 30px;
}
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
  width: 60vw;
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
.elfifht {
  position: fixed;
  z-index: 522;
  bottom: 30px;
  right: 0px;
}
</style>
<style  lang='scss'>
.login {
  .el-form-item__label {
    min-width: 100px;
  }
}
</style>
