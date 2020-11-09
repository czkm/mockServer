# mockServer

Build Setup

# install dependencies

npm install

# serve with hot reload at localhost:8099

npm run hot

---

更新了 electron 版本

## cd electron 文件夹 或 查看使用文档 `czkm.github.io/mockserver/dist/`



---

## 前言

不知道各位前端们在日常的开发生产中是否有过像我一样的困扰

1. 公司用的内网或特定网络，离开公司就没办法使用内部接口？
2. 大屏项目或各种向领导演示时担心网络不稳定，导致页面的数据，echart 图表等无法显示？
3. 在没有后端没有开发完的情况下怎样自己实时制造接口数据来保证自己前端开发的进度不落后？
   ..........
   其实总结就是缺少了一个我们前端可以控制的接口服务

## 先看效果～

- node 服务启动前 依赖内网环境的前端项目所有的接口都无法使用
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdac36e61071430e99921cab75b9cbe7~tplv-k3u1fbpfcp-watermark.image)

- node 服务启动后 在内网状态下进行缓存后即可在脱离内网环境下演示和调试页面
  ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06ee4795b23b4eca8acc5e9f4fb61776~tplv-k3u1fbpfcp-watermark.image)

- node 服务在有缓存后可以保证向服务请求时不用等待 ⌛️ 后端数据库的查询，接口往往在 10ms 以内就可以返回，保证演示的时候界面不会出现因为等待某个接口而造成页面图表或文字显示不全
  ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57524c93cd6e40d19fbe70a829e19502~tplv-k3u1fbpfcp-watermark.image)

## 开始手写代码

#### 思路说明

- 其实并不是什么高大尚的东西，本质就是在有网络环境的情况下启动一个 node 服务，请求后将所有请求的数据保存在本地的 json 文件中，之后如果在缺乏网络环境或者需要脱离后端自行调试的时候就可以完全由 node 服务获取接口数据。

#### 目录构建

由于是个简单的项目，在这里我也就不使用 koa，egg 等框架了，有需要的小伙伴可以自行引入

- 先执行`npm init` 初始化一下文件夹 📁
- 在文件夹新建`index.js`作为入口文件，新建 utils 文件夹和其下的`store.js`,新建 json 文件夹和其下的`test.json`至此简单的目录结构就已经搭建成功啦。

```
├── index.js        	 //主入口文件
├── json
│   └── test.json	 //存储返回数据
├── package.json
└── utils
    └── store.js	 //处理相关逻辑
```

##### 代码编写

1. store.js

```JavaScript
// const fs = require('fs');
const date = new Date()
const path = require('path')
const defalutpath = path.resolve(__dirname, '../json/test.json')
const { promises: { readFile, writeFile } } = require('fs');
async function getStuff (path = defalutpath) {
  let result = await readFile(path, 'utf8');
  return result
}
async function setStuff (value, path = defalutpath) {
  let result = await writeFile(path, value, 'utf8');
  return result
}
const getJson = ((key, callback) => {
  getStuff().then(res => {
    const json = res ? JSON.parse(res) : {}
    // console.log('读取数据', json[key])
    // console.log(json[key])
    if (typeof (json[key]) !== "undefined") {
      // console.log('有数据', json[key])
      callback(json[key])
    } else {
      callback(false)
    }
  })
})
const setJson = ((key, value = {}) => {
  getStuff().then(res => {
    const json = res ? JSON.parse(res) : {}
    json[key] = value
    if (json !== undefined) {
      setStuff(JSON.stringify(json))
      console.log('写入成功')
    }
  })
})
//如果有需要还可以在存储的key值后面加上今天的日期，保证数据的有效期。过了有效期重新请求
const formatDate = ((date) => {
  let myyear = date.getFullYear()
  let mymonth = date.getMonth() + 1
  let myweekday = date.getDate()
  if (mymonth < 10) {
    mymonth = "0" + mymonth
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday
  }
  return myyear + "-" + mymonth + "-" + myweekday
})
const store = {
  getJson,
  setJson
}
module.exports = store
```

- `getStuff`和`setStuff`来异步读写文件内容，避免造成 node 堵塞
- `getJson`和`setJson`则是对文件读取写入的逻辑处理

2. index.js

```JavaScript
// 1、加载模块
const http = require('http');
const server = new http.Server()
const axios = require('axios');
const store = require('./utils/store')
const md5 = require('md5-node')
// const querystring = require('querystring')
const Url = require('url')
//定义请求头，解决跨域
const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  "Access-Control-Allow-Origin": "*",
  "access-control-allow-credentials": "true"
}
// 2、监听请求事件
server.on('request', function (request, response) {
  // 监听到请求之后所做的操作
  // request 对象包含：用户请求报文的所有内容
  // response 响应对象,用来响应一些数据
  // 当服务器想要向客户端响应数据的时候，就必须使用response对象
  // const { method, url, headers } = request;
  // console.log(method, url, headers)
  if (request.url !== '/favicon.ico') {
    const index = request.url.indexOf('/mock/') //与前端约定用mock来识别
    const reurl = 'http://' + request.url.substr(index + 6)
    // 3、通过method来做不同的判断
    if (request.method === 'OPTIONS') {
      response.writeHead(200, {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "authorization,content-type,token",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "authorization,content-type,token",
        "Access-Control-Max-Age": "3600",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "Server": 'openresty/1.15.8.2'
      })
      // res.write('')
      response.end()
      console.log('options go api... ')
    }
    if (request.method === 'GET') {
      store.getJson(reurl, ((res) => {
        // console.log('GET-res', res)
        if (res) {//如果命中缓存🎯
          console.log('get请求命中缓存🎯')
          response.writeHead(200, headers)
          response.end(JSON.stringify(res))
        } else {
          console.log('get请求命中发送······')
          axios.get(reurl)
            .then(res => {
              store.setJson(reurl, res.data)
              response.writeHead(200, headers);
              response.end(JSON.stringify(res.data));
            })
            .catch(err => {
              console.log('geterr', err);
            })
        }
      }))
    } else {//post 请求
      const newURL = Url.parse(reurl)
      parseJSON(request, response, ((res) => {
        const key = reurl + md5(res)//post请求用Md5加密保证参数独立性
        const postData = res
        store.getJson(key, (res => {
        //这里是如果请求头中带有token或各种自定义请求头时的配置
          const opheaders = {
            // 'Content-Length': length,
            // 'token': request.headers.token !== undefined ? request.headers.token : '',
            'Content-Type': 'application/json;charset=UTF-8'

          }
          // store.getJson(reurl)
          if (res) {//如果命中缓存🎯
            console.log('post请求命中缓存🎯')
            response.writeHead(200, headers)
            response.end(JSON.stringify(res))
          } else {
            console.log('post请求命中....')
            axios.post(reurl, postData, { headers: opheaders })
              .then(function (res) {
                store.setJson(key, res.data)
                response.writeHead(200, headers);
                response.end(JSON.stringify(res.data));
              })
              .catch(function (err) {
                console.log('posterr', err);
              });
          }
        }))
      }))
    }
  }
})

function parseJSON (req, res, next) {
  let data = ''
  // const length = req.headers['content-length']
  req.on('data', function (chunk) {
    // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
    data += chunk;
  });
  //注册end事件，所有数据接收完成会执行一次该方法
  //如果需要可以使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象
  req.on('end', function () {
    // console.log(data)
    if (data) {
      data = JSON.parse(data)
    }
    next(data)
  })
}

// 4、监听端口，开启服务
server.listen(8099, function () {
  console.log("服务器已经启动，可访问以下地址：");
  console.log('http://localhost:8099');
})
```

- 安装依赖`axios,md5-node`,入口文件的思路很简单，在收到请求后先截取`/mock/`后的 url 用来作为`store`的 key 值。
- 在本地 json 中读取到这个 key 值则直接返回 value 值不去请求后端接口，如果没有 key 值则请求后端接口并将后端的返回值写入本地的 json 文件中，之后再返回给前端。

## 服务的启动与使用

1. `npm install supervisor -g`安装这个依赖可以使我们服务热更新便于调试。
   ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48d5e07cf3ab4fd3b5f1f62985a312d4~tplv-k3u1fbpfcp-watermark.image)

2. 运行`npm run hot` 此时项目已经启动
3. 前端服务在原先的地址上加入此时 node 地址,例如原先前端请求地址为`172.16.18.147:8080/xxx/xxxx`则此时在前端 axios 请求配置为
   `http://node服务ip:8099/mock/172.16.18.147:8080/xxx/xxxx`
   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/268c3a95ae7c4ee3a04900ca87247699~tplv-k3u1fbpfcp-watermark.image)

4. 页面正常的接口请求后，所有的返回数据会保存在本地的 json 文件中
   ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2678ee2ee0c452792d5c7ef2925b290~tplv-k3u1fbpfcp-watermark.image)

5. 服务开启时，如果请求命中 🎯 缓存则不会再走网络请求，而是直接获取本地 json 中的值
   ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6638b5c92b504dbf90f63cf64ec73433~tplv-k3u1fbpfcp-watermark.image)

## 小结

至此 node 服务的功能大致已经介绍完毕啦。以后再有演示或者脱离后端的情况下只要你开启 node 服务
就可以用本地缓存来展示数据啦～

做完这个后又想着做一个 electron 版本的服务了，这样就可以时时自定义请求头和接口参数，这部分就下次再更新了

这是我的[github 项目地址](https://github.com/czkm/mockServer)有需要的朋友们可以去看看然后点个 star ～
