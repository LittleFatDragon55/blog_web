<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="form" class="form">
        <el-form-item>
          <el-col :span="5">
            <el-input v-model="form.keyword" placeholder="关键字搜索"/>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search" style="margin-right: 10px;">查询</el-button>
          </el-col>

        </el-form-item>
        <el-form-item>
          <el-tag type="success" @click="add_category({})" class="tag_hover">新增</el-tag>
          <el-tag type="danger" @click="delete_category({})" class="tag_hover">删除</el-tag>
        </el-form-item>
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
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" label="id" width="95" prop="id" sortable>
        </el-table-column>

        <el-table-column label="分类名" align="center" prop="name">
        </el-table-column>
        <el-table-column label="描述" align="center" prop="desc">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time">
          <template v-slot="scope">
            <span>{{ scope.row.create_time.split("T")[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-tag type="success" @click="add_category(scope.row)" class="tag_hover">修改</el-tag>
            <el-tag type="danger" @click="delete_category(scope.row)" class="tag_hover">删除</el-tag>
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
          <el-form-item label="分类名称">
            <el-input v-model="add_data.name"></el-input>
          </el-form-item>
          <el-form-item label="分类描述">
            <el-input v-model="add_data.desc"></el-input>
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
      listLoading: true,
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

      },
      show: false,
      title: "新增用户",
      is_add: true,
      id: ''
    }
  },
  created() {
    this.listData()
  },
  methods: {
    listData() {
      this.listLoading = true
      this.axios.get("/api/category/list_category", {
        params: {
          keyword: this.form.keyword,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
      }).then(res => {
        console.log(res.data)
        this.list = res.data.data
        this.total = res.data.total
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
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
    add_category(row) {
      this.show = true
      if (row.id) {
        console.log(row.length)

        this.add_data.name = row.name
        this.add_data.desc = row.desc
        this.id = row.id
        this.is_add = false
      }
    },
    submit() {
      console.log(this.is_add)
      if (this.is_add) {
        this.axios.post("/api/category/add_category", {
          name: this.add_data.name,
          desc: this.add_data.desc,
        }).then(res => {
          if (res.data.code === 0) {
            this.$message("添加成功")
          } else {
            this.$message("分类名已存在")
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.axios.post("/api/category/update_category", {
          id: this.id,
          name: this.add_data.name,
          desc: this.add_data.desc,
        }).then(res => {
          if (res.data.code === 0) {
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
    delete_category(row) {
      let ids = []
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.id) {
          console.log(row)
          ids.push(row.id)
        } else if (this.selectId.length > 0) {
          ids = this.selectId
        } else {
          this.$message("请选择分类")
        }
        this.axios.post("/api/category/delete_category", {"ids": ids}).then(res => {
          if (res.data.code === 0) {
            this.$message("删除成功")
            this.listData()
          }


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


</style>
