import setting from '../setting';
const Store = require('electron-store');
const store = new Store();
const date = new Date();

const { elstore_time }=setting
// store.clear()

function allNames() {
  return store.get('$allname')
    ? new Set([...store.get('$allname')])
    : new Set([]);
}

function isreplace(key) {
  return key ? key.toString().replace(/\./g, '-') : key;
}

 export const get = function (key) {
  let flag = false;
  if (
    store.get(isreplace(key)) &&
    store.get(isreplace(key)).ctime == formatDate(date)
  ) {
    flag = true;
  }
  if (elstore_time&&flag) {
    return store.get(isreplace(key));
  } else {
    store.has(isreplace(key)) ? store.delete(isreplace(key)) : '';
    return false;
  }
};

 export const set = function(key, value) {
   let allname = allNames();
   allname.add(key);
   value.ctime = formatDate(date);
   if (!value.normal) {
     value.normal = true;
   }
   store.set(isreplace(key), JSON.parse(JSON.stringify(value)));
   store.set('$allname', [...allname]);
 };

function formatDate(date) {
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();
  if (mymonth < 10) {
    mymonth = '0' + mymonth;
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday;
  }
  return myyear + '-' + mymonth + '-' + myweekday;
}
