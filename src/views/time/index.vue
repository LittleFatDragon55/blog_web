<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="form" class="form">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="form.keyword" placeholder="内容"/>
            </el-col>
            <el-col :span="5">
              <el-select v-model="form.category" style="width:100%" placeholder="选择状态">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
                <el-option label="未完成" value="未完成"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="search" style="margin-right: 10px;">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-tag type="success" @click="addtag({})" class="taghover">新增</el-tag>
            </el-col>
          </el-row>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-tag type="success" @click="addtag({})" class="taghover">新增</el-tag>-->
        <!--          <el-tag type="danger" @click="delete_tag({})" class="taghover">删除</el-tag>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column align="center" label="标题" width="95" prop="id" >
        </el-table-column>

        <el-table-column label="内容" align="center" prop="name">
        </el-table-column>
        <el-table-column label="状态" align="center" prop="desc">
        </el-table-column>
        <el-table-column label="开始时间" align="center" prop="icon" sortable>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="icon" sortable>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tag type="success" @click="addtag(scope.row)" class="taghover">修改</el-tag>
            <el-tag type="danger" @click="delete_tag(scope.row)" class="taghover">删除</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="title" :visible.sync="show">
        <el-form :model="add_data" label-width="120px">
          <el-form-item label="标题" >
            <el-input v-model="add_data.name"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="add_data.desc" type="textarea"></el-input>

          </el-form-item>
          <el-form-item label="起止时间">
            <el-date-picker
              style="width: 100%"
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.category" style="width:100%" placeholder="选择状态">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
              <el-option label="未完成" value="未完成"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="show = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: null,
      listLoading: false,
      form: {
        keyword: "",
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      selectId: [],
      add_data: {
        name: "",
        desc: "",
        icon:""
      },
      show: false,
      title: "新增时间轴",
      isadd: true,
      id:''
    }
  },
  created() {
    this.listData()
  },
  methods: {
    listData() {
      // this.listLoading = true
      this.list=[]
      // this.axios.get("/api/tag/list_tag", {
      //   params: {
      //     keyword: this.form.keyword,
      //     pageSize: this.pageSize,
      //     currentPage: this.currentPage
      //   }
      // }).then(res => {
      //   console.log(res.data)
      //   this.list = res.data.data
      //   this.total = res.data.total
      //   this.listLoading = false
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    search() {
      this.listData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listData()
      console.log(`每页 ${val} 条`, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.listData()
      console.log(`当前页: ${val}`);
    },
    addtag(row) {
      this.show = true
      if (row.id) {
        this.add_data.name = row.name
        this.add_data.desc = row.desc
        this.add_data.icon = row.icon
        this.id = row.id
        this.isadd = false
      }
    },
    submit() {
      console.log(this.isadd)
      if (this.isadd) {
        this.axios.post("/api/tag/add_tag", {
          name: this.add_data.name,
          desc: this.add_data.desc,
          icon:this.add_data.icon
        }).then(res => {
          if (res.data.code == 0) {
            this.$message("添加成功")
          } else {
            this.$message("分类名已存在")
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.axios.post("/api/tag/update_tag", {
          id:this.id,
          name: this.add_data.name,
          desc: this.add_data.desc,
          icon:this.add_data.icon
        }).then(res => {
          if (res.data.code == 0) {
            this.$message("修改成功")
          } else {
            this.$message("分类名重复")
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.listData()
      this.show = false
      this.add_data = {
        name: "",
        desc: ""
      }
    },
    delete_tag(row) {
      let ids = []
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.id) {
          console.log(row)
          ids.push(row.id)
        }else if (this.selectId.length > 0) {
          ids = this.selectId
        } else {
          this.$message("请选择分类")
        }
        this.axios.post("/api/tag/delete_tag", {"ids": ids}).then(res => {
          this.$message("删除成功")
          this.listData()

        }).catch(err => {
          console.log(err)
        })
      })

    },
    handleSelectionChange(val) {
      this.selectId = []
      val.forEach(e => {
        this.selectId.push(e.id)
      })
    }
  }
}
</script>
<style scoped>
.form .el-input {
  width: 90%;
}

</style>
