<template>
  <div>
    <el-form :model="adduser_data">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="adduser_data.username"></el-input>
      </el-form-item>
      <el-form-item label="email" :label-width="formLabelWidth">
        <el-input v-model="adduser_data.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="adduser_data.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="用户类型" :label-width="formLabelWidth">
        <el-select v-model="adduser_data.type" placeholder="请选择用户类型" style="width:100%">
          <el-option label="管理员" value="1"></el-option>
          <el-option label="普通用户" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="adduser_data.phone"></el-input>
      </el-form-item>
      <el-form-item label="介绍" :label-width="formLabelWidth">
        <el-input v-model="adduser_data.introduce" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="头像" :label-width="formLabelWidth">
        <el-upload
          class="avatar-uploader"
          action="/api/users/upload/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="files" :src="files" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "adduser",
  props: {
    adduser_data: {
      type: Object,
    },
  },
  data() {
    return {
      // data:this.adduser_data,
      formLabelWidth: "120px",
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      files:""
    }
  },
  mounted() {
    this.files  = this.adduser_data.avatar
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(file)
      this.files = URL.createObjectURL(file.raw);
      console.log(URL.createObjectURL(file.raw))
      this.adduser_data.avatar= "/api/images/"+file.name
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' ||file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }

}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
