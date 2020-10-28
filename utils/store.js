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


const getJson = ((key, callback, path = defalutpath,) => {
  getStuff(path).then(res => {
    // console.log(res)
    const json = res ? JSON.parse(res) : {}
    if (json !== undefined) {
      callback(json[key])
      return json[key]
    } else {
      return false
    }
  })

})
const setJson = ((key, value = {}, path = defalutpath) => {
  getStuff(path).then(res => {
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
