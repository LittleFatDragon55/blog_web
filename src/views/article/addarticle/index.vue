<template>
  <div class="app-container">
    <el-form ref="ruleFormRef"
             :model="form"
             :rules="rules"
             class="demo-ruleForm">
      <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="关键字" :label-width="formLabelWidth">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="标签" :label-width="formLabelWidth">
        <el-input v-model="form.tags"></el-input>
      </el-form-item>
      <el-form-item label="分类" :label-width="formLabelWidth">
        <el-input v-model="form.category"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" :label-width="formLabelWidth" style="height: 400px">
        <div style="width: 100%;height: 300px">
          <quill-editor :options="editorOption" style="height: 100%" v-model="form.content">
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="submit('ruleFormRef')">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "index",
  data: function () {
    return {
      formLabelWidth: "120px",
      editorOption: {},
      form: {
        title: "",
        keyword: "",
        desc: "",
        tags: "",
        category: "",
        content: ""
      },
      rules: {
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur',
        }]
      }

    }
  },
  methods: {
    submit(ruleFormRef) {
      console.log(ruleFormRef,this.form)
      this.axios.post("/api/article/add_article", {
        title: this.form.title,
        keyword: this.form.keyword,
        desc: this.form.desc,
        tags: this.form.tags,
        category: this.form.category,
        content: this.form.content,
        author:"hh",
        state:1,
        type:1,
        origin:0,
      }).then(res => {
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
