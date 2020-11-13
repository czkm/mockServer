import setting from '../setting';

const http = require('http');
const { net, app, remote } = require('electron');
const store = require('./store');
// const http_req = require('./http');
const server = new http.Server();
const headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-credentials': 'true',
};
const {
  isgoel,
  timeout,
  Access_Headers,
  refuse_headers,
  Allow_headers,
  Allowed_headers,
  store_area,
  store_name,
} = setting;

//url,method
// const APP = process.type === 'renderer' ? remote.app : app;
// const ST_PATH = APP.getPath('userData');
console.log(`缓存地址:${store_area}下的 ${store_name}.json`);

function toparams(obj) {
  let str = '';
  obj = obj instanceof Object ? obj : JSON.parse(obj);
  Object.entries(obj).forEach((val, index) => {
    str += (index == 0 ? '' : '&') + `${val[0]}=${val[1]}`;
  });
  return str;
}

export const request = function(port) {
  server.on('request', function(req, res) {
    if (req.url !== '/favicon.ico') {
      const index = req.url.indexOf('/mock/');
      const url = 'http://' + req.url.substr(index + 6);
      if (req.method === 'GET') {
        if (isgoel && store.get(url) && store.get(url).normal) {
          setTimeout(() => {
            console.log('get🎯缓存');

            res.writeHead(200, headers);
            res.end(store.get(url).data.toString());
            // res.end();
          }, timeout);
        } else {
          let rqHeafer = {};
          if (req.headers) {
            Object.entries(req.headers).forEach((val) => {
              if (!refuse_headers.includes(val[0])) {
                rqHeafer[val[0]] = val[1];
              }
            });
          }

          const request = net.request(url);
          request.on('response', (response) => {
            response.on('data', (chunk) => {
              setTimeout(() => {
                res.writeHead(200, headers);
                res.end(chunk.toString());
                // res.end();
                store.set(url, {
                  config: {
                    url: url,
                    method: req.method,
                    headers: rqHeafer,
                  },
                  data: chunk.toString(),
                });
              }, timeout);
            });
          });
          request.on('error', (e) => {
            console.error(`get api error: ${e.message}`);
          });
          setTimeout(() => {
            request.end();
          }, timeout);
        }
      } else if (req.method === 'OPTIONS') {
        console.log('options');
        setTimeout(() => {
          // res.writeHead(200, {
          //   'Access-Control-Allow-Credentials': 'true',
          //   'Access-Control-Allow-Headers':
          //     'authorization,content-type,token,appid',
          //   'Access-Control-Allow-Methods': '*',
          //   'Access-Control-Allow-Origin': '*',
          //   'Access-Control-Expose-Headers':
          //     'authorization,content-type,token,appid',
          //   'Access-Control-Max-Age': '3600',
          //   Connection: 'keep-alive',
          //   'Content-Length': 0,
          //   Server: 'openresty/1.15.8.2',
          // });
          res.setHeader('Access-Control-Expose-Headers', '*');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '3600');
          res.setHeader('Access-Control-Allow-Origin', '*');
          // res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Access-Control-Allow-Headers', Access_Headers);
          res.setHeader('Access-Control-Allow-Methods', '*');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('Content-Length', 0);
          res.setHeader('Access-Control-Request-Method', 'POST');
          res.setHeader('Allow', Allow_headers);
          res.setHeader('Allowed', Allowed_headers);
          res.writeHead(200);
          // res.writeHead(200)
          res.write('');

          res.end();
        }, timeout);
      } else {
        // console.log('post');
        const querystring = require('querystring');
        const Url = require('url');
        const newURL = Url.parse(url);

        req.on('data', (chunk) => {
          const postData = toparams(JSON.parse(chunk));
          const stars = postData ? '?' : '';
          const length = chunk.length;
          const key = url + stars + postData;
          if (isgoel && store.get(key) && store.get(key).normal) {
            setTimeout(() => {
              console.log('post🎯缓存');
              res.writeHead(200, headers);
              res.end(store.get(key).data.toString());
              // res.end();
            }, timeout);
          } else {
            let rq = {};
            if (req.headers) {
              Object.entries(req.headers).forEach((val) => {
                if (!refuse_headers.includes(val[0])) {
                  rq[val[0]] = val[1];
                }
              });
            }

            const options = {
              hostname: newURL.hostname,
              port: newURL.port,
              path: newURL.path,
              method: 'POST',
              headers: req.headers || {},
            };

            let result = '';
            const request = http.request(options, function(_res) {
              _res.setEncoding('utf8');
              _res.on('data', function(chunk) {
                setTimeout(async () => {
                  result += chunk;
                  res.writeHead(200, headers);
                  await res.end(result.toString());
                  // console.log('send');
                  let rq2 = rq;
                  Object.entries(rq2).forEach((val) => {
                    if (!val[1]) {
                      delete rq2[val[0]];
                    }
                  });
                  store.set(key, {
                    config: {
                      url: url + stars + postData,
                      method: req.method,
                      headers: rq2,
                    },
                    data: result.toString(),
                  });
                }, timeout);
              });
            });
            request.on('error', (e) => {
              console.error(`api error: ${e.message}`);
            });
            setTimeout(() => {
              request.end(chunk.toString());
              // request.end();
            }, timeout);
          }
        });
      }
    } else {
      setTimeout(() => {
        res.writeHead(200, headers);
        res.end('');
        // res.end();
      }, timeout);
    }
  });

  server.listen(port);
};
