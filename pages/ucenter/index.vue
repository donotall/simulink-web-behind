<template>
  <div>
      <el-button class="back" icon="el-icon-back" @click="back()">返回</el-button>
      <div class="user">
      <el-form ref="form" :model="user" label-width="160px">
        <el-form-item label="用户头像">
            <el-avatar  :src="user.avatar"></el-avatar>
        </el-form-item>
        <el-form-item label="用户昵称">
            <el-input  v-model="user.nickname" :minlength="1"></el-input>
        </el-form-item>
        <el-form-item label="用户年龄">
            <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')"  v-model="user.age"></el-input>
        </el-form-item>
        <el-form-item label="用户最高分和最低分" v-if="scoreMaxMin">
            <el-tag type="success">{{scoreMaxMin.max}}</el-tag>&nbsp;&nbsp;
            <el-tag type="danger">{{scoreMaxMin.min}}</el-tag>
        </el-form-item>
      </el-form>
       <el-button type="warning" @click="change()" class="change">修改</el-button>
      </div>
  </div>
</template>

<script>
import login from '@/api/login'
import score from '@/api/score'
export default {
    data(){
        return {
            user:{},
            scoreMaxMin:{}
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            login.getLoginInfo().then(response=>{
                if(response.data.success){
                    this.user = response.data.data.item
                    score.getMaxMinScore(this.user.id).then(response=>{
                    if(response.data.success){
                        this.scoreMaxMin = response.data.data.score
                    }
                  })
                }else{
                    this.$router.push({path:'/login'})
                }
            })
            
        },
        back(){
           this.$router.push({path:'/'})
        },
        change(){
            login.change(this.user).then(response =>{
                if(response.data.success){
                    this.$message.success("修改成功")
                    this.getList()
                }
            })
        }
    }
}
</script>

<style scoped>
.back{
    margin-left: 20px;
    margin-top: 20px;
}
.user{
    margin:0 auto;
    width: 600px;
}
.change{
    margin-left: 300px;
    margin-bottom: 20px;
}
</style>