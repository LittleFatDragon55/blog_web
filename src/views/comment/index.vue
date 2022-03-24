<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="form" class="form">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-input v-model="form.keyword" placeholder="关键字搜索"/>
          </el-col>
          <el-col :span="5">
            <el-select v-model="form.category" style="width:100%" placeholder="选择状态">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="已处理" value="已处理"></el-option>
              <el-option label="未处理" value="未处理"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <!--            <el-button type="primary" @click="search" style="margin-right: 10px;">查询</el-button>-->
          </el-col>

        </el-row>

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
        <el-table-column align="center" label="评论用户" prop="id">
          <template v-slot="scope">
            <span>{{ scope.row.user.username }}</span>
          </template>
        </el-table-column>

        <el-table-column label="内容" align="center" prop="content">
        </el-table-column>
        <el-table-column label="状态" align="center" prop="state">
          <template v-slot="scope">
            <span>{{ scope.state ? "待审核" : "已通过" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否处理" align="center" prop="is_handle">
          <template v-slot="scope">
            <span>{{ scope.is_handle == 1 ? "已处理" : "未处理" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time" sortable>
          <template v-slot="scope">
            <span>{{ get_time(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-tag type="success" @click="look_article(scope.row)" class="tag_hover">查看文章</el-tag>
            <el-tag type="danger" @click="look_comment(scope.row)" class="tag_hover">查看回复</el-tag>
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

    <el-dialog title="文章内容" :visible.sync="show">
      <h1 class="title" style="text-align: center;">{{ article_data.title }}</h1>
      <div class="ql-editor" v-html="article_data.content"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">关 闭</el-button>
        <!--        <el-button type="primary" @click="submit">确 定</el-button>-->
      </div>
    </el-dialog>
    <el-dialog title="评论回复" :visible.sync="commentsShow">
      <div style="height: 500px;overflow: auto">
        <ul>
          <li v-for="item1 in other_comments" style="border-bottom: 1px solid #e1e0e0;">
            <div>
              <p>用户名：{{ item1.user.username }}</p>
              <p>时间：{{ get_time(item1.create_time) }}</p>
              <p>内容：{{ item1.content }}</p>
            </div>

          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getTime} from "../../utils/utils"

export default {
  data() {
    return {
      list: [],
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
        icon: ""
      },
      show: false,
      title: "新增用户",
      is_add: true,
      id: '',
      is_handle: 0,
      article_data: {},
    other_comments:{},
      commentsShow:false
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    get_time(time) {
      return getTime(time)
    },
    listData() {
      // this.listLoading = true
      // this.list=[]
      this.axios.get("/api/comment/getCommentList", {
        params: {
          keyword: this.form.keyword,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          is_handle: this.is_handle
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
    handleSelectionChange(val) {
      this.selectId = []
      val.forEach(e => {
        this.selectId.push(e.id)
      })
    },
    look_article(row) {
      this.show = true
      this.axios
        .get("/api/article/article_detail", {
          params: {
            id: row.article_id,
          },
        })
        .then((res) => {
          this.article_data = res.data.data;
        });
    },
    look_comment(row) {
      this.commentsShow = true
      this.other_comments = row.other_comments
      console.log(row.other_comments)
    }
  }
}
</script>
<style scoped>


</style>
