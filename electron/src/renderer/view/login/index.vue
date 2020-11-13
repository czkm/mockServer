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
    </el-select>-->
    <!-- <el-input v-model="all.method"></el-input> -->
    <!-- </Zfitem> -->
    <el-form ref="form" :rules="rules" :model="form" class="elforms">
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
      </el-form-item>-->
      <el-form-item class="efi" label="路径url:" prop="url">
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
        <el-button class="eltfirst" type="primary" :disabled="disabled" @click="getData">确定</el-button>
      </el-form-item>
      <el-form-item class="efi">
        <el-button class="eltfirst" type="success" :disabled="disabled" @click="reload">重置</el-button>
      </el-form-item>
      <el-form-item class="efi">
        <el-button class="elthird" type="danger" :disabled="disabled" @click="del">删除该接口</el-button>
      </el-form-item>
      <el-form-item class="efi">
        <el-button class="elfifht" type="danger" @click="delalls">删除所有接口</el-button>
      </el-form-item>
      <!-- 第二行 -->
      <el-form-item v-if="finalshow" class="efi" label="Method:">
        <!-- <el-input
          class="teif"
          v-model="entryData.method"
          clearable
          placeholder=""
        ></el-input>-->
        <el-select class="teif" v-model="entryData.method">
          <el-option v-for="item in methods" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!-- 第三行 -->
      <el-form-item v-if="finalshow" class="efi" label="URL:">
        <el-input class="teif" @change="Urlchange" v-model="entryData.url" clearable></el-input>
      </el-form-item>
      <!-- 第四行 -->
      <el-form-item v-if="finalshow" class="efi" label="是否走缓存:">
        <el-switch class="teif" v-model="normal"></el-switch>
      </el-form-item>
      <!-- 第五行 -->
      <el-form-item v-if="finalshow" class="efi" label="Parm:">
        <Parm v-if="parmsif" ref="parmref" @getparams="getparams" :eparams="entryData.params"></Parm>
      </el-form-item>

      <!-- next -->
      <DeepItem v-if="parmsif && deepshow" ref="deppcp" :data="configOther" ml="true"></DeepItem>
      <!-- data -->
      <el-form-item v-if="finalshow && teshow" class="efi" label="textData:">
        <textarea class="textdata" @change="change">{{ textData }}</textarea>
      </el-form-item>
      <el-form-item v-if="finalshow" class="efi">
        <div class="buf">
          <el-button type="primary" @click="save">保存(重新发送请求)</el-button>
          <el-button type="primary" @click="save2">保存(仅是修改本地data)</el-button>
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
    ></DeepItem>-->
    <transition name="siderbef" mode="out-in">
      <div class="urlprov" v-if="testar.length && urlshow">
        <div class="irbef">
          <transition-group name="sider" mode="out-in">
            <div class="dispps" v-for="(item, index) in testar" :key="item.url">
              <span>
                {{ item.url }}
                <i
                  :class="`${
                    !item.type ? 'el-icon-warning' : 'el-icon-loading'
                  }`"
                ></i>
              </span>
              <el-button
                class="elbut"
                v-if="!item.type"
                type="primary"
                size="small"
                @click="UpdateApi([item.url])"
              >重新发送</el-button>
            </div>
          </transition-group>
        </div>

        <div class="lstbut">
          <el-button type="primary" @click="urlshow = false">返回</el-button>
        </div>
      </div>
    </transition>
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
  data () {
    const validatePass = (rule, value, callback) => {
      this.disabled = true
      if (this.all.url == '') {
        callback(new Error('请输入ttp路径!'))
      } else {
        if (!this.IsURL(this.all.url)) {
          callback(new Error('请输入正确http路径!'))
        } else {
          this.disabled = false
          // console.log('ture')
          callback()
        }
      }
    }

    return {
      urlshow: true,
      testar: [],
      rules: {
        url: [{ validator: validatePass, trigger: 'change' }],
      },
      parmsif: true,
      disabled: true,
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
      handler (newName, oldName) { },
      immediate: true,
      deep: true,
    },
    // 'all.url': {
    //   handler(newName, oldName) {
    //     console.log('newName', newName)
    //     console.log('oldName', oldName)
    //   },
    // },
  },
  methods: {
    getFatherUrl (url) {
      console.log('getfather', url)
      if (url) {
        this.reload()
        this.all.url = url
        this.$nextTick(() => {
          if (!this.disabled) {
            this.getData()
          }
        })
      }
      // this.reload()
    },
    delalls () {
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
    GetRequest (name) {
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
    Urlchange () {
      this.$refs.parmref.obj_arr(this.GetRequest(this.entryData.url) || {})
    },
    getparams (e) {
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
    formatDate () {
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
    save () {
      let save = {
        data: JSON.stringify(this.textData),
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
            this.teshow = false
            this.textData = res
            this.$nextTick(() => {
              this.teshow = true
            })
          })
          .catch((err) => {
            this.$message({
              message: '失败!',
            })
            // console.log('err', err)
          })
      } else {
        // console.log('get')
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
            // console.log('err', err)
          })
      }
    },
    save2 () {
      try {
        let save = {
          data: JSON.stringify(this.textData),
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
        // console.log('err', error)
      }
    },
    reset () {
      this.finalshow = false
      Object.entries(this.resetcopy).forEach((val) => {
        this[val[0]] = JSON.parse(JSON.stringify(val[1]))
      })
      this.$nextTick(() => {
        this.finalshow = true
      })
    },
    change (e) {
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
    getData () {
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
            // console.log('this', this.GetRequest(this.entryData.url))
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
            let rs = confirm('此接口不存在本地,确定创建新接口?')
            if (rs) {
              this.finalshow = false
              this.parmsif = false
              this.normal = true
              this.entryData = { url: this.all.url, method: 'GET', params: {} }
              this.entryDatacopy = {
                url: this.all.url,
                method: 'GET',
                params: {},
              }
              this.getparams(this.GetRequest(this.entryData.url))
              this.textData = {}
              this.$nextTick(() => {
                this.finalshow = true
                this.parmsif = true
              })
            } else {
              this.$message({
                type: 'info',
                message: '已取消添加',
              })
            }
          }
          this.deepshow = true
          this.finalshow = true
        })

        this.$emit('handleHistoryAdd', this.all.url)
      } else {
        this.$message({
          message: 'url不能为空!',
          type: 'warning',
        })
      }
    },
    del () {
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
    reload () {
      this.urls = this.$elstore.all()
      this.finalshow = false
      this.deepshow = false
      this.entryData = { url: '', method: '', params: {} }
      this.textData = {}
      this.all = JSON.parse(JSON.stringify(this.mrall))
    },
    querySearch (queryString, cb) {
      let rest = [...this.urls]
      let restaurants = rest.map((val) => (val = { value: val }))
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      cb(results)
    },
    IsURL (str_url) {
      const strRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
      // '^(?=^.{3,255}$)(http(s)?://)?(www.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:d+)*(/w+.w+)*([?&]w+=w*)*$'
      let re = new RegExp(strRegex)
      if (re.test(str_url)) {
        return true
      } else {
        return false
      }
    },
    autochange (e) {
      // console.log('isuls', this.IsURL(e))
      console.log('ee', e)
      if (!e) {
        this.reload()
      }
    },
    UpdateApi (
      ar = [
        // 'http://172.16.18.147:8080/zephyr_jzfp/dev/queryjGXXDS?bsds00=35',
        // 'http://172.16.18.67:8888/ces/web/sys/login/dologin?bindPassword=admin&bindUsername=admin&password=admin&username=admin',
      ]
    ) {
      // let PaData = []
      this.urlshow = true
      let num = 0
      let ReturnAr = []
      ar.forEach((val) => {
        let isaf = false
        this.testar.some((v, index) => {
          if (v.url == val) {
            isaf = true
            this.testar.splice(index, 1, { url: val, type: 'loading' })
            return true
          }
          return false
        })
        if (!isaf) {
          this.testar.push({ url: val, type: 'loading' })
        }
        let obj = this.$elstore.get(val)
        if (obj && obj != {}) {
          // console.log('objjj',val);
          let dr = this.Getaxios(obj.config)
          ReturnAr.push(dr)
          // console.log('ret', ReturnAr)
        }
        // PaData.push(obj)
      })
      // console.log('pard',PaData);
    },
    setTestAr (url, type) {
      let arindex = -1
      this.testar.some((val, index) => {
        if (val.url == url) {
          arindex = index
          return true
        }
        return false
      })
      type
        ? this.testar.splice(arindex, 1)
        : this.testar.splice(arindex, 1, { url, type })
      // console.log('arrrrr', this.testar)
    },
    Getaxios (args) {
      let url = setting.ip + args.url.substring(7)
      let urlbf = url.split('?')[0]
      let urlaf = this.GetRequest(url)
      let { method, headers } = args
      if ('post' == args.method.toLowerCase()) {
        this.$http
          .post(urlbf, urlaf, { headers })
          .then((res) => {
            console.log('post-res', res)
            this.setTestAr(args.url, true)
          })
          .catch((err) => {
            console.log('post-err', err)
            this.setTestAr(args.url, true)
          })
      } else {
        this.$http
          .get(url, { headers })
          .then((res) => {
            console.log('get-res', res)
            this.setTestAr(args.url, true)
          })
          .catch((err) => {
            console.log('get-err', err)
            this.setTestAr(args.url, false)
          })
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        // return (
        //   restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
        //   0
        // )
        return restaurant.value.toLowerCase().match(queryString.toLowerCase())
      }
    },
    // getone() {
    //   return this.$http(
    //     'http://192.168.91.1:3001/mock/172.16.18.147:8080/zephyr_jzfp/dev/queryYSKQS?bsds00=35'
    //   )
    // },
    // gettwo() {
    //   return this.$http(
    //     'http://192.168.91.1:3001/mock/172.16.18.147:8080/Ysjgxt/web/Af05Manage/Af05/getOrgCountLogOutOrNoActive?type=2&aaa027=359900'
    //   )
    // },
  },

  created () {
    this.urls = this.$elstore.all()
    this.UpdateApi()
  },
}
</script>

<style lang="scss" scoped>
.login {
  padding-top: 3rem;
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
    margin-left: 2.5rem;
  }
}
.esfirst {
  width: 10vw;
}
.esecond {
  width: 50vw;
}
.eltfirst {
  margin-left: 2rem;
  width: 4vw;
  display: flex;
  justify-content: center;
  align-content: center;
}
.telf {
  width: 100vw;
}
.teif {
  width: 50vw;
}
.textdata {
  width: 80rem;
  height: 42rem;
  overflow: auto;
  padding: 1.5rem;
  white-space: pre;
}
.buf {
  width: 80vw;
  display: flex;
  justify-content: center;
  align-content: center;
  button {
    margin: 25px 1.5rem;
  }
}
.elthird {
  margin: 0 1.5rem;
}
.elfifht {
  position: fixed;
  z-index: 522;
  bottom: 3rem;
  right: 0rem;
}
.urlprov {
  position: fixed;
  min-width: 100rem;
  padding: 0.8rem;
  height: 65rem;
  border-radius: 1rem;
  background-color: #fff;
  top: 15vh;
  left: 30vw;
  box-shadow: 12px 12px 20px 25px rgba(11, 23, 134, 0.2);
  .irbef {
    height: 90%;
    overflow: auto;
  }
  .lstbut {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  .dispps {
    height: 5rem;
    border: 1px solid rgb(226, 222, 222);
    border-radius: 0.5rem;
    display: flex;
    margin: 2px auto;
    align-items: center;
    justify-content: space-between;
    > span {
      font-size: 1.4rem;
      color: #555;
      margin: 0 2rem;
      > i {
        margin: 0.5rem;
        color: rgb(238, 142, 142);
      }
    }
    .elbut {
      margin: 0 2rem;
    }
  }
}
</style>
<style  lang='scss'>
.login {
  .el-form-item__label {
    min-width: 10rem;
  }
}
.sider-enter-active,
.sider-leave-active {
  transition: all 1s;
}

.sider-enter {
  transform: translateY(-30px);
  opacity: 0;
}

.sider-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.siderbef-enter-active,
.siderbef-leave-active {
  transition: all 2s;
}

.siderbef-enter {
  transform: translateY(-30px);
  opacity: 0;
}

.siderbef-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
