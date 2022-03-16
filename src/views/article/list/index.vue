<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="form" class="form">
        <el-form-item>
          <el-col :span="5">
            <el-input v-model="form.keyword" placeholder="关键字"/>
          </el-col>

          <el-col :span="5">
            <el-select v-model="form.state" placeholder="选择状态">
              <el-option label="发布" value="1"/>
              <el-option label="草稿" value="0"/>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search" style="margin-right: 10px;">查询</el-button>
          </el-col>

        </el-form-item>
        <el-form-item>
          <el-tag type="success" @click="add({})" class="taghover">新增</el-tag>
          <el-tag type="danger" @click="deleteArticle({})" class="taghover">删除</el-tag>
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

        <el-table-column label="标题" align="center" prop="title">
        </el-table-column>
        <el-table-column label="关键词" align="center" prop="keyword">
        </el-table-column>
        <el-table-column label="描述" align="center" prop="desc">
        </el-table-column>
        <el-table-column label="标签" align="center" prop="tags">
          <template slot-scope="scope">
              <div v-for="item in scope.row.tags" :key="item._id">
                <el-tag class="mx-1" size="small" effect="dark">{{ item.name }}</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center" prop="category">
          <template slot-scope="scope">
              <div v-for="item1 in scope.row.category" :key="item1._id">
                <el-tag  class="mx-1" size="small" effect="dark">{{ item1.name }}</el-tag>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time.split("T")[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tag type="success" @click="add(scope.row)" class="taghover">修改</el-tag>
            <el-tag type="danger" @click="deleteArticle(scope.row)" class="taghover">删除</el-tag>
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
<!--    <div>-->
      <el-dialog :title="title" :visible.sync="show" center>
        <div style="height: 500px;overflow: auto">
          <Add_article :add_data="add_data"></Add_article>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="show = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
<!--    </div>-->
  </div>
</template>

<script>
import Add_article from "@/views/article/addarticle/index";

export default {
  components: {Add_article},
  data() {
    return {
      list: null,
      listLoading: true,
      form: {
        keyword: "",
        state: ""
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      selectId: [],
      add_data: {},
      show: false,
      title: "新增文章",
      is_add: true,
      id: '',
    }
  },
  created() {
    this.fetchData()
  },
  watch:{
    show(newVal,oldVal){
      if(newVal===false){
        this.add_data={}
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.axios.get("/api/article/list", {
        params: {
          keyword: this.form.keyword,
          state: this.form.state,
          pageSize: this.pageSize,
          pageNum: this.currentPage
        }
      }).then(res => {
        console.log(res.data)
        this.list = res.data.data.list
        this.total = res.data.data.count
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    search() {
      console.log(this.form)
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
      console.log(`每页 ${val} 条`, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
      console.log(`当前页: ${val}`);
    },
    add(row) {
      this.show = true
      if (row.id) {
        this.title="修改文章"
        this.add_data = row
        this.is_add = false
        let tags= this.add_data.tags
        let category = this.add_data.category
        let arr = [],arr2 = []
        tags.forEach(e=>{
          arr.push(e._id)
        })
        category.forEach(e=>{
          arr2.push(e._id)
        })
        this.add_data.tags = arr
        this.add_data.category = arr2
        this.add_data.keyword = this.add_data.keyword.join(",")
      }else{
        this.is_add = true
      }
    },
    submit() {
      if(this.is_add){
        this.axios.post("/api/article/add_article", this.add_data).then(res => {
          this.$message("文章添加成功")
          this.show = false
          this.fetchData()
        }).catch(err => {
          console.log(err)
        })
      }else{
        this.axios.post("/api/article/updateArticle", this.add_data).then(res => {
          this.$message("文章修改成功")
          this.show = false
          this.fetchData()
        }).catch(err => {
          console.log(err)
        })
      }

    },
    deleteArticle(row) {
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
          this.$message("请选择用户")
        }
        this.axios.post("/api/article/delArticle", {"ids": ids}).then(res => {
          this.$message("删除成功")
          this.fetchData()

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
/*.form .el-input {*/
/*  width: 90%;*/
/*}*/

</style>
