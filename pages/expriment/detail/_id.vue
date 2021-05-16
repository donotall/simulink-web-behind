<template>
  <div>
      <div>
        <el-form label-width="80px">
          <el-form-item label="实验名称">
            <span>{{detailEx.name}}</span>
          </el-form-item>
          <el-form-item label="实验描述">
            <span v-html="detailEx.description">{{detailEx.description}}</span>
          </el-form-item>
          <el-form-item label="实验文件" v-if="fileUrl.length !==0">
            <div v-for="(item) in fileUrl" :key="item.id" style="cursor:pointer;">
              <el-tag type="success" @click="download(item.url)">{{item.fileName}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="实验结果" v-if="imgUrl.length !==0">
            <div>
                <el-image 
                style="width: 100px; height: 100px"
                src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1278177485,1285685648&fm=26&gp=0.jpg"
                :preview-src-list="imgUrl"
                fit="contain">
              </el-image>
            </div>
          </el-form-item>
          <el-form-item >
            <el-button @click="back()" type="success">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import experiment from '@/api/experiment'
import login from '@/api/login'
export default {
  asyncData({ params, error }){
    return  {
      exId: params.id
    }
  },
  data(){
    return{
      detailEx:{},
      imgUrl:[],
      fileUrl:[],
      exId:''
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      login.getLoginInfo().then(response =>{
      if(response.data.success){
        experiment.getDetailExperimentById(response.data.data.item.id,this.exId).then(response =>{
          if(response.data.success){
             this.detailEx = response.data.data.experiment
             this.fileUrl = response.data.data.fileUrls
             this.imgUrl = []
             response.data.data.imgUrls.forEach(item=>{
               this.imgUrl.push(item.url)
             })
             
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
    download(url){
      window.open(url)
    }
  }
}
</script>
<style scoped>
</style>