const port = 3001; //端口号

export default {
  port,
  ip: `http://192.168.1.116:${port}/mock/`, //本地ip
  isgoel: false, //是否有缓存后走缓存:true
  timeout: 500, //发送延迟
  elstore_time: true, //是否开启本地缓存有效时间一天:true
  Access_Headers:
    'Authorization,authorization,content-type,token,appid,appsecret,test', //设置Access-Control-Allow-Headers允许的请求头类型
  refuse_headers: [
    'host',
    'connection',
    'content-length',
    'user-agent',
    'origin',
    'referer',
    'cache-control',
    'accept-encoding',
    'pragma',
    'cookie',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
  ],
  Allowed_headers: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  Allow_headers: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  store_area: process.cwd(),//本地存储路径
  store_name: "config",//存储文件名
  HistoryLength: 50
};

console.log('pros', process.cwd());