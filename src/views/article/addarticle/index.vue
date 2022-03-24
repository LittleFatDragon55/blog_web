<template>
  <div class="app-container">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" class="demo-ruleForm">
      <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="关键字" :label-width="formLabelWidth">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="封面连接" :label-width="formLabelWidth">
        <el-input v-model="form.img_url"></el-input>
      </el-form-item>
      <el-row :gutter="10" style="margin-left: 115px;">
        <el-col :span="8">
          <el-form-item>
            <el-select v-model="form.tags" multiple placeholder="请选择标签" style="width:100%">
              <el-option
                v-for="item in tag_options"
                :key="item.name"
                :label="item.name"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-select v-model="form.category" multiple placeholder="请选择分类" style="width:100%">
              <el-option
                v-for="item in category_options"
                :key="item.name"
                :label="item.name"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-select v-model="form.state" style="width:100%" placeholder="请选择发布状态">
              <el-option label="发布" :value="1"></el-option>
              <el-option label="草稿" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-left: 115px;">
        <el-col :span="8">
          <el-form-item>
            <el-select v-model="form.type" style="width:100%" placeholder="请选择文章类型">
              <el-option label="普通文章" :value="1"></el-option>
              <el-option label="简历" :value="2"></el-option>
              <el-option label="管理员介绍" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-select v-model="form.origin" style="width:100%" placeholder="请选择文章转载类型">
              <el-option label="原创" :value="0"></el-option>
              <el-option label="转载" :value="1"></el-option>
              <el-option label="混合" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="文章内容" :label-width="formLabelWidth" style="height: 400px">
        <div style="width: 100%;height: 300px">
          <quill-editor :options="editorOption" style="height: 100%" v-model="form.content">
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item style="text-align: center;" v-show="show">
        <el-button @click="submit('ruleFormRef')">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    add_data: {
      type: Object,
    },
  },
  watch: {
    add_data(newVal, oldVal) {
      this.form = newVal
      this.show = false
    }
  },
  data: function () {
    return {
      formLabelWidth: "120px",
      editorOption: {},
      form: {
        // title: "",
        // keyword: "",
        // desc: "",
        // tags: [],
        // category: "",
        // content: ""
      },
      rules: {
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur',
        }]
      },
      tag_options: [],
      category_options: [],
      show: true
    }
  },
  created() {
    if (this.add_data) {
      this.form = this.add_data
    }
    console.log(this.add_data, "this.add_data")
  },
  mounted() {
    this.tag_list()
    this.category_list()
    console.log(this.add_data, "this.add_data")
  },
  methods: {
    submit(ruleFormRef) {
      console.log(ruleFormRef, this.form, this.tags)
      this.axios.post("/api/article/add_article", this.form).then(res => {
        this.$message("文章添加成功")
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    tag_list() {
      this.axios.get("/api/tag/list_tag",).then(res => {
        this.tag_options = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    category_list() {
      this.axios.get("/api/category/list_category",).then(res => {
        this.category_options = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
