// 1、加载模块
const http = require('http');
const server = new http.Server()
const axios = require('axios');
const store = require('./utils/store')
const md5 = require('md5-node')
const querystring = require('querystring')
const Url = require('url')
const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  "Access-Control-Allow-Origin": "*",
  "access-control-allow-credentials": "true"
}
// 3、监听请求事件
server.on('request', function (request, response) {
  // 监听到请求之后所做的操作
  // request 对象包含：用户请求报文的所有内容
  // response 响应对象,用来响应一些数据
  // 当服务器想要向客户端响应数据的时候，就必须使用response对象
  // const { method, url, headers } = req;
  // console.log(method, url, headers)
  if (request.url !== '/favicon.ico') {
    const index = request.url.indexOf('/mock/')
    const reurl = 'http://' + request.url.substr(index + 6)
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
        if (res) {//如果命中缓存🎯
          console.log('get请求命中缓存🎯')
          response.writeHead(200, headers)
          response.end(JSON.stringify(res))
        } else {
          axios.get(reurl)
            .then(res => {
              store.setJson(reurl, res.data)
              response.writeHead(200, headers);
              response.end(JSON.stringify(res.data));
            })
            .catch(err => {
              console.log(err);
            })
        }
      }))
    } else {//post 请求
      const newURL = Url.parse(reurl)

      parseJSON(request, response, ((res) => {
        const key = reurl + md5(res)//post请求用Md5加密保证参数独立性
        const postData = res
        store.getJson(key, ((res) => {
          const opheaders = {
            // 'Content-Length': length,
            // 'appid': request.headers.appid !== undefined ? request.headers.appid : '1',
            'Content-Type': 'application/json;charset=UTF-8'

          }
          if (res) {//如果命中缓存🎯
            console.log('post请求命中缓存🎯')
            response.writeHead(200, headers)
            response.end(JSON.stringify(res))
          } else {
            axios.post(reurl, postData, { headers: opheaders })
              .then(function (res) {
                store.setJson(key, res.data)
                response.writeHead(200, headers);
                response.end(JSON.stringify(res.data));
              })
              .catch(function (err) {
                console.log(err);
              });

          }
        }))
        // console.log(arguments)
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
  //使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象
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
