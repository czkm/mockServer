import elStore from 'electron-store';
import setting from '../../setting';
const { store_area, store_name } = setting;

console.log('stre', store_area, store_name);
const elstore = new elStore({
  name: store_name,
  cwd: store_area,
});
// const elstore = new elStore();

// console.log('本地缓存路径:' + area + '下的' + el_name + '.json文件');

function allNames () {
  return elstore.get('$allname')
    ? new Set([...elstore.get('$allname')])
    : new Set([]);
}
function allHistory () {
  return elstore.get('$History')
    ? [...elstore.get('$History')]
    : []
}
function allCollection () {
  return elstore.get('$Collection')
    ? [...elstore.get('$Collection')]
    : [];
}

function isreplace (key) {
  return key.replace(/\./g, '-');
}

export default {
  get: function (key) {
    //获取
    return elstore.get(isreplace(key));
  },
  set: function (key, value) {
    //添加
    let allname = allNames();
    allname.add(key);
    if (value.normal == undefined) {
      console.log('555');
      value.normal = true;
    }
    elstore.set(key.replace(/\./g, '-'), value);
    elstore.set('$allname', [...allname]);
  },
  // +++++++++++++++++++++++++

  getHistory: function (key) {
    let History = allHistory();
    return History
  },
  setHistory: function (key) {
    let History = allHistory();
    History.push(key);
    // console.log('History', History)
    let newHistory = [...new Set(History)]
    elstore.set('$History', [...newHistory]);
  },
  delHistory: function () {
    // console.log(index)
    let History = allHistory();
    History = []
    elstore.set('$History', [...History]);

  },
  delSingleHistory: function (index) {
    let History = allHistory();
    History.splice(index, 1);
    elstore.set('$History', [...History]);
  },
  getCollection: function (key) {
    let Collection = allCollection();
    return Collection
  },
  setCollection: function (obj) {
    // let { title, data } = obj
    let Collection = allCollection();
    Collection.push(obj)
    Collection = [...new Set(Collection)]
    elstore.set('$Collection', [...Collection]);
  },
  editCollection: function (obj, index) {
    let Collection = allCollection();
    Collection.splice(index, 1, obj);
    elstore.set('$Collection', [...Collection]);

  },

  delCollection: function (index) {
    // console.log(index)
    let Collection = allCollection();
    Collection.splice(index, 1);
    elstore.set('$Collection', [...Collection]);

  },
  delSingleCollection: function (index, itemindex) {
    let Collection = allCollection();
    Collection[index].data.splice(itemindex, 1);
    elstore.set('$Collection', [...Collection]);
  },

  // +++++++++++++++++++++++++

  all: function () {
    //获取所有保存的key
    return allNames() ? [...allNames()] : [];
  },
  getallHistory: function () {
    let MaxLength = setting.HistoryLength
    let History = allHistory() ? [...allHistory()] : [];
    if (History.length > MaxLength) {
      console.log('超出设置lenght')
      // History.splice((History.length - MaxLength), History.length)
      History.shift()
      elstore.set('$History', [...History]);
      return History
    }
    return History

  },
  getallCollection: function () {
    //获取所有保存的key
    return allCollection() ? [...allCollection()] : [];
  },
  getCollectionName: function () {
    let Collection = allCollection() ? [...allCollection()] : []

    let name = []
    Collection.forEach((item, index) => {
      name.push(item.title)
    })
    return name
  },
  del: function (key = '') {
    //删除某个key及对应值
    if (key) {
      let allnames = allNames();
      allnames.delete(key);
      elstore.set('$allname', [...allnames]);
      elstore.delete(isreplace(key));
    }
  },
  delall: function () {
    //删除所有
    elstore.clear();
  },
  allvalue: function (include = false) {
    //获取本地全部数据
    let allname = [...allNames()];
    let ar = include ? [{ $allname: allname }] : []; //默认不包含$allname
    allname.forEach((val) => {
      ar.push({ [val]: elstore.get(isreplace(val)) });
    });
    return ar;
  },
  has: function (key) {
    return elstore.has(isreplace(key));
  },
};
