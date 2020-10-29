// const fs = require('fs');
const date = new Date()
const path = require('path')
const defalutpath = path.resolve(__dirname, '../json/test.json')

// const fs = require('fs');
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
