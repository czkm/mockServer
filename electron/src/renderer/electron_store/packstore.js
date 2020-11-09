import elStore from 'electron-store';

// const area = 'C:/Users/Administrator/AppData/Roaming/sjdp';
// const el_name = 'config';

// const elstore = new elStore({
//   name: el_name,
//   cwd: area,
// });
const elstore = new elStore();

// console.log('本地缓存路径:' + area + '下的' + el_name + '.json文件');

function allNames() {
  return elstore.get('$allname')
    ? new Set([...elstore.get('$allname')])
    : new Set([]);
}
function isreplace(key) {
  return key.replace(/\./g, '-');
}

export default {
  get: function(key) {
    //获取
    return elstore.get(isreplace(key));
  },
  set: function(key, value) {
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
  all: function() {
    //获取所有保存的key
    return allNames() ? [...allNames()] : [];
  },
  del: function(key = '') {
    //删除某个key及对应值
    if (key) {
      let allnames = allNames();
      allnames.delete(key);
      elstore.set('$allname', [...allnames]);
      elstore.delete(isreplace(key));
    }
  },
  delall: function() {
    //删除所有
    elstore.clear();
  },
  allvalue: function(include = false) {
    //获取本地全部数据
    let allname = [...allNames()];
    let ar = include ? [{ $allname: allname }] : []; //默认不包含$allname
    allname.forEach((val) => {
      ar.push({ [val]: elstore.get(isreplace(val)) });
    });
    return ar;
  },
  has: function(key) {
    return elstore.has(isreplace(key));
  },
};
