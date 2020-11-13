<template>
  <div id="app">
    <!-- <div class="path_route">当前路由:{{ $route.path }}</div> -->
    <!-- <button @click="retoken">first</button>
    <button @click="test">add</button>-->
    <!-- <router-link to="login">tologin</router-link>
    <router-link to="test">totest</router-link>-->
    <!-- <ul v-for="(item, index) in proutes" :key="index">
      <li @click="$router.push(`/${item.path}`)">{{ item.name }}</li>
    </ul>-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'my-project',
  data () {
    return {
      token: '',
      proutes: [
        {
          item: 'login',
          name: '修改本地缓存',
        },
        {
          item: 'test',
          name: '测试接口',
        },
      ],
    }
  },
  methods: {
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
    async retoken () {
      console.log('555')
      await this.$http
        .post(
          'http://192.168.91.1:3001/mock/172.17.1.50:8080/fpb-bs/user/login',
          {
            password: 'YbDpta2&K(a@',
            username: 'ybdp',
          }
        )
        .then((res) => {
          console.log('tok', res)
          this.token = res.data.data
        })
    },
    async req1 () {
      await this.retoken()
      return this.$http.post(
        'http://192.168.91.1:3001/mock/172.17.1.50:8080/fpb-bs/bs/ybznjgpt/dpsy/queryToday',
        { page: 1, pageSize: 100 },
        { headers: { Authorization: this.token } }
      )
      // .then((res) => {
      //   console.log('res', res)
      // })
    },
    async req2 () {
      await this.retoken()
      return this.$http.post(
        'http://192.168.91.1:3001/mock/172.17.1.50:8080/fpb-bs/bs/ybznjgpt/dpsy/queryBdqk',
        { page: 1, pageSize: 100 },
        { headers: { Authorization: this.token } }
      )
      // .then((res) => {
      //   console.log('res', res)
      // })
    },
    test () {
      Promise.all([this.req1(), this.req2()]).then(res => {
        console.log('56565', res);
      })
    },
  },
  mounted () {
    // this.retoken()
    // console.log('88888888')
    // console.log(
    //   this.GetRequest(
    //     'http://172.16.18.147:8080/zephyr_jzfp/dev/queryYSKQS?bsds00=35&bfs=66'
    //   )
    // )
    // console.log('55555');
  },
}
</script>

<style>
/* CSS */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html{
  font-size: 0.5208333333333vw;
}
#app {
  width: 100%;
  min-height: 100vh;
  background-color: rgb(147, 157, 248);
  font-weight: 800;
  /* padding: 1.5rem; */
}
.path_route {
  position: fixed;
  width: 100%;
  height: 3.0rem;
  background-color: rgb(120, 138, 240);
  bottom: 0;
  z-index: 999;
  font-weight: 800;
  color: #fff;
  font-size: 1.8rem;
  text-align: right;
  padding-right: 2.5rem;
  line-height: 3.0rem;
}
</style>
