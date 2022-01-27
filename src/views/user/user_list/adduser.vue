<template>
<div>
  <el-form :model="adduser_data">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="adduser_data.name"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="adduser_data.password"></el-input>
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
  data:function(){
    return{
      // data:this.adduser_data,
      formLabelWidth:"120px"

    }
  }
}
</script>

<style scoped>

</style>
