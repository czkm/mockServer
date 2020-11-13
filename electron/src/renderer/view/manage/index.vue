<template>
  <div class="container">
    <div class="middle_container">
      <div class="left_container" :class="{ left_container_fold: isFold }">
        <el-tabs class="Tabs" v-model="activeTabs" v-show="!isFold">
          <el-tab-pane label="历史记录" name="0">
            <div class="histoy_tool">
              <el-button size="mini" type="info" plain @click="handleHistoryDelete">清空历史记录</el-button>
              <!-- <el-button size="mini" plain @click="handleHistoryAdd">添加</el-button> -->
              <div class="history_count">历史记录保存数:{{historyCount}}</div>
            </div>

            <el-divider />

            <div class="collectionContain">
              <div v-for="(item,index) in historyList" :key="index">
                <el-tooltip :disabled="disabled" :content="item" placement="top" :key="index">
                  <div
                    class="url_container"
                    @mouseenter="hadnleHistoryItemShow(item)"
                    @mouseleave="hadnleHistoryItemShow(null)"
                  >
                    <div class="url_item" @click="handleSelect(item)">{{item}}</div>
                    <transition name="el-fade-in">
                      <el-button
                        v-show="HistoryItemShow==item"
                        class="url_item_btn"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="hadleHistoryItemDelete(index)"
                      ></el-button>
                    </transition>
                    <!-- </div> -->
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="接口分类" name="1">
            <el-button size="mini" type="info" plain @click="handleAdd">添加分类</el-button>
            <el-button
              size="mini"
              @click="disabled = !disabled"
            >点击{{disabled ? '开启' : '关闭'}} tooltip 功能</el-button>

            <el-divider />
            <div class="collectionContain">
              <el-collapse :value="collectionList" @change="handleChange">
                <template v-for="(item,index) in this.collectionList">
                  <el-collapse-item
                    :name="index"
                    :key="index"
                    @mouseenter.native="upHere = index"
                    @mouseleave.native="upHere = null"
                  >
                    <template slot="title">
                      <div class="item_title">
                        <el-link :underline="false" type="success">{{item.title}}</el-link>
                      </div>

                      <div class="btn_group" v-show="upHere==index">
                        <el-button
                          class="btn_inline"
                          type="primary"
                          icon="el-icon-refresh"
                          circle
                          size="mini"
                          @click.stop="handlefresh(index)"
                        ></el-button>
                        <el-button
                          class="btn_inline"
                          size="mini"
                          icon="el-icon-edit"
                          circle
                          @click.stop="handleEdit(item,index)"
                        ></el-button>

                        <el-button
                          class="btn_inline"
                          type="danger"
                          size="mini"
                          @click.stop="handleDelete(index)"
                        >删除</el-button>
                      </div>
                    </template>
                    <div v-for="(url,urlindex) in item.data" :key="urlindex">
                      <el-tooltip
                        :disabled="disabled"
                        :content="url"
                        placement="top"
                        :key="urlindex"
                      >
                        <div
                          class="url_container"
                          @mouseenter="hadnleurlItemShow(item.title+item.data[urlindex])"
                          @mouseleave="hadnleurlItemShow(null)"
                        >
                          <div class="url_item" @click="handleSelect(item.data[urlindex])">{{url}}</div>
                          <transition name="el-fade-in">
                            <el-button
                              v-show="ItemShow==item.title+item.data[urlindex]"
                              class="url_item_btn"
                              type="danger"
                              icon="el-icon-delete"
                              size="mini"
                              @click="hadleItemDelete(index,urlindex)"
                            ></el-button>
                          </transition>
                        </div>
                      </el-tooltip>
                    </div>
                  </el-collapse-item>
                </template>
              </el-collapse>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧 -->
      <div class="right_container">
        <Login ref="login" @handleHistoryAdd="handleHistoryAdd"></Login>
      </div>
      <div class="foot_container">
        <div class="fold_btn" @click="handleFold">
          <i
            :class="[isFold?  'el-icon-d-arrow-left fold_go' : 'el-icon-d-arrow-left fold_default' ]"
          ></i>
        </div>
      </div>
    </div>

    <el-dialog title="添加分类" :visible.sync="addVisible" width="50%">
      <el-form :rules="rules" ref="addform" :model="addform" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="addcard">
        <el-card>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item,index) in this.urls"
              :label="item"
              :key="index"
              class="checkList_item"
            ></el-checkbox>
          </el-checkbox-group>
        </el-card>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddSuccess">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit -->
    <el-dialog title="修改分类" :visible.sync="editVisible" width="50%">
      <el-form :rules="rules" ref="editform" :model="editform" label-width="80px">
        <el-form-item label="分类名称" prop="Ename">
          <el-input v-model="editform.Ename"></el-input>
        </el-form-item>
      </el-form>
      <div class="addcard">
        <el-card>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item,index) in this.urls"
              :label="item"
              :key="index"
              class="checkList_item"
            ></el-checkbox>
          </el-checkbox-group>
        </el-card>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditSuccess">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import store from '../../';
import Login from '../login/index'
import setting from '../../../setting'
export default {
  data () {
    var validateName = (rule, value, callback) => {
      // console.log('val', value)
      if (value === '' || typeof (value) == "undefined") {
        callback(new Error('分类名称不能为空'));
      } else if (this.saveName.indexOf(value) !== -1) {
        callback(new Error('这个分类名已被使用了'));
      } else {
        callback();
      }

    };
    var EditName = (rule, value, callback) => {
      // console.log('value', value)
      // console.log(typeof (value) == "undefined")
      if (value === '' || typeof (value) == "undefined") {
        callback(new Error('分类名称不能为空'));
      } else if (value === this.editName) {
        callback();
      }
      else if (this.saveName.indexOf(value) !== -1) {
        callback(new Error('这个分类名已被使用了'));
      } else {
        callback();
      }

    };
    return {
      historyCount: setting.HistoryLength,
      isFold: false,//默认展开
      itemvisible: false,
      ItemShow: null,
      HistoryItemShow: null,
      disabled: true,
      activeTabs: "0",
      addVisible: false,
      editVisible: false,
      addform: { name: '' },
      editform: { Ename: '' },
      upHere: null,
      editName: null,
      editIndex: null,
      selectUrlItem: null,
      // urls: [],//缓存url
      checkList: [],
      historyList: [],//历史记录
      collectionList: [],//集合列表
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        Ename: [
          { validator: EditName, trigger: 'blur' }
        ]
      }

    }
  },
  components: {
    Login
  },
  // watch: {
  //   collectionList: {
  //     handler (val) {
  //       console.log('val', val)
  //     },
  //     deep: true
  //   }

  // },
  computed: {
    saveName () {
      // console.log(this.$elstore.allHistory())
      return this.$elstore.getCollectionName()
    },
    urls () {
      return this.$elstore.all()

    },


  },
  created () {
    // console.log(this.$elstore.getallHistory())
    this.collectionList = this.$elstore.getallCollection()
    this.historyList = this.$elstore.getallHistory()
  },
  methods: {
    hadnleurlItemShow (val) {
      // console.log(this.ItemShow)
      this.ItemShow = val
    },
    hadnleHistoryItemShow (val) {
      // console.log(this.HistoryItemShow)
      this.HistoryItemShow = val
    },


    handleAdd () {
      // console.log(this.urls)
      this.checkList = []
      this.addVisible = true

    },
    handleAddSuccess () {
      // console.log('saveName', this.$elstore.getCollectionName())
      this.$refs['addform'].validate((valid) => {
        if (valid) {
          let obj = {}
          obj.title = this.addform.name
          obj.data = this.checkList
          this.collectionList.push(obj)
          // console.log(this.$elstore)
          this.$elstore.setCollection(obj)
          this.handleAddCancel()
        } else {
          return false;
        }
      })
    },

    handleAddCancel () {
      this.$refs['addform'].resetFields();
      this.addVisible = false
    },
    handleHistoryAdd (val) {
      // console.log('CHILD', val)
      // let string = '424'
      this.$elstore.setHistory(val)
      this.$nextTick(() => {
        this.historyList = this.$elstore.getallHistory()
      })
    },
    hadleItemDelete (index, itemindex) {
      this.$elstore.delSingleCollection(index, itemindex)
      // this.collectionList = this.$elstore.getallCollection()

      this.$nextTick(() => {
        this.collectionList = this.$elstore.getallCollection()
      })
    },
    handleSelect (argument) {
      console.log(argument, '55')
      this.$refs.login.getFatherUrl(argument)
    },

    handleChange (val) {
      console.log(val)
    },
    handleHistoryDelete () {
      this.$elstore.delHistory()
      this.$nextTick(() => {
        this.historyList = this.$elstore.getallHistory()
      })
    },
    handleDelete (index) {
      this.$elstore.delCollection(index)
      console.log(this.$elstore.getallCollection())
      this.$nextTick(() => {
        this.collectionList = this.$elstore.getallCollection()

      })
      // console.log(key)
    },
    hadleHistoryItemDelete (index) {
      this.$elstore.delSingleHistory(index)
      this.$nextTick(() => {
        this.historyList = this.$elstore.getallHistory()

      })
    },
    handlefresh (index) {
      this.$refs.login.UpdateApi(this.collectionList[index].data)

    },
    handleFold () {
      this.isFold = !this.isFold
    },
    // edit
    handleEdit (item, index) {
      // console.log(item)
      this.editform.Ename = item.title
      this.editName = item.title
      this.editIndex = index
      this.checkList = [...item.data]
      this.editVisible = true

    },
    handleEditCancel () {
      this.$refs['editform'].resetFields();
      this.editName = null
      this.editIndex = null
      this.checkList = []
      this.editVisible = false
    },
    handleEditSuccess () {
      this.$refs['editform'].validate((valid) => {
        if (valid) {
          let obj = {}
          obj.title = this.editform.Ename
          obj.data = this.checkList
          // console.log(obj)
          this.$elstore.editCollection(obj, this.editIndex)
          this.collectionList.splice(this.editIndex, 1, obj);
          this.handleEditCancel()
        } else {
          return false;
        }
      })

    }

  }
}
</script>

<style>
.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  flex-direction: column;
} /* 纵向排列 */

.middle_container {
  flex: 1;
  display: flex;
}
.left_container {
  display: flex;
  justify-content: center;
  width: 40rem;
  background-color: rgb(255, 255, 255);
  -webkit-transition: width 0.8s;
  transition: width 0.8s;
}
.left_container_fold {
  width: 0;
}
.right_container {
  flex: 1;
  overflow: auto;
}
.foot_container {
  position: fixed;
  width: 100%;
  height: 3rem;
  background-color: rgb(120, 138, 240);
  bottom: 0rem;
  font-weight: 800;
  color: #fff;
  font-size: 1.8rem;
  text-align: left;
  padding-right: 2.5rem;
  line-height: 3rem;
}
.fold_btn {
  margin-left: 2rem;
  cursor: pointer;
}
.Tabs {
  width: 100%;
  padding: 0 1rem;
}
.url_container {
  display: flex;
  justify-content: center;
  margin: 5px 0;
  user-select: none;
}
.url_item {
  width: 100%;
  height: 2.5rem;
  line-height: 2.5rem;
  margin: 5px auto;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 1.4rem;
  font-weight: 500;
  color: #606266;
  align-items: center;
  cursor: pointer;
  /* background-color: violet; */
}
.url_container:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.checkList_item {
  font-size: 1.4rem;
  margin: 5px auto;
  overflow: hidden;
}
.addcard {
  height: 20rem;
  overflow: scroll;
}
.collectionContain {
  height: 80vh;
  overflow: scroll;
}
.element::-webkit-scrollbar {
  width: 0 !important;
}
.btn_group {
  /* width: 20.0rem; */
  /* float: right; */
  margin: 0 0px 0px 5rem;
}
.item_title {
  width: 10rem;
  overflow: hidden;
  font-size: 1.2rem;
  font-weight: 400;
}
.fold_default {
  transition: all 0.8s;
}

.fold_go {
  transform: rotate(180deg);
  transition: all 0.8s;
}
.btn_inline {
  display: inline-block;
}
.collectionContain::-webkit-scrollbar {
  width: 0;
  display: none;
}
.histoy_tool {
  display: flex;
  justify-content: flex-start;
}
.history_count {
  /* width: 15rem; */
  margin-left: 2rem;
  color: #909399;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
}
</style>