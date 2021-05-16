<template>
  <div>
    <div id="bg">
      <div>
        <!-- 选择连接xpc的地址和端口 -->
        <el-select v-model="value" placeholder="请选择xpc地址" @visible-change="linkXpc($event)">
          <el-option
            v-for="item in attr"
            :key="item.id"
            :label="item.ip+':'+item.port"
            :value="item.id"
            >
          </el-option>
        </el-select>
        <el-button type="danger" @click="unLinkXpc()">断开连接</el-button>
      </div>
    <div>
      <!-- 上传slx文件并且编译 -->
      <el-upload
        class="upload-demo"
        drag
        :action="url+'/simulink/file/'+port"
        multiple :on-success="function (res, file,fileList) { return fileSuccess(res, file,fileList)}">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传slx文件</div>
      </el-upload>
    </div>
    <div>
      <el-button type="primary" @click="loading()">加载模型</el-button>
      <el-tooltip class="item" effect="dark" content="设置xpc的结束时间和取样时间(取样时间过小会导致cpu爆红)" placement="top">
          <el-button type="warning" @click="getSetting()">参数修改</el-button>
      </el-tooltip>
      <el-button type="success" @click="start()">运行</el-button>
      <el-button type="danger" @click="stop()">停止</el-button>
    </div>
    <div class="dataShow">
      <el-tooltip class="item" effect="dark" content="最好每次选一种数据，数据种类太多会影响图形" placement="top">
        <div id="myChart"></div>
      </el-tooltip>  
    </div>
    <div>    
      <el-button type="primary" @click="imgList()">保存当前数据</el-button>
      <el-button type="danger" @click="remove()">清除所有保存数据</el-button>
      <el-button type="primary" @click="uploadimgList()">上传</el-button>
      <el-button type="success" @click="live()">结束实验</el-button>
    </div>
    </div>
    <el-drawer
      title="参数设置"
      :visible.sync="drawer">
      <el-form :model="setting" :rules="rules" ref="settingRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="取样间隔时间" prop="ts" >
          <el-input v-model="setting.ts"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="tfinal">
          <el-input v-model="setting.tfinal"></el-input>
        </el-form-item>
        <el-form-item label="连接超时时间" prop="timeOut">
          <el-input v-model="setting.timeOut"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="changeParameter('settingRef')">修改参数</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import attr from '@/api/attr'
import simulink from '@/api/simulink'
import img from '@/api/img'
import score from '@/api/score'
import cookie from "js-cookie"

export default {
  asyncData({ params, error }){
       return {
         exId: params.id
       }
    },
  name: 'Echarts',
  data(){
    var valiNumberPass1 = (rule, value, callback) => {//包含小数的数字
            let reg = /^\d+(\.\d+)?$/;
            if (value === '') {
                callback(new Error('请输入内容'));
            } else if (!reg.test(value)) {
                callback(new Error('请输入数字'));
            } else {
                callback();
            }
    }
    return{
      attr: [],
      value: '',
      port: '',
      fileName: 'xpctank',
      drawer: false,
      setting:{},
      user:{},
      url: 'http://localhost:8222',
      rules: {
        ts: [
            { required: true, message: '请输入取样间隔时间', trigger: 'blur' },
            {validator: valiNumberPass1, message: '取样间隔时间必须为数字值'}
          ],
        tfinal: [
            { required: true, message: '请输入结束时间', trigger: 'blur' },
            {validator: valiNumberPass1, message: '结束时间必须为数字值'}
          ],
        timeOut: [
            { required: true, message: '请输入连接超时时间', trigger: 'blur' },
            {validator: valiNumberPass1,message: '连接超时时间必须为数字值'}
          ]
      },
      // 执行标志
      startFlag: false,
      //获取的数据
      simulinkData:[],
      length: 0,
      option:{
        title: {
        text: '数据展示'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [],
            type: 'scroll',
            orient: 'vertical',
            right: '0%',
            top: 20,
            bottom: 20,
        },
        grid: {
            left: '3%',
            right: '20%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {
                  name:''
                }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value',
        },
        series: []
      },
      first: true,
      dataflag: false,
      //保存上传的图片列表
      imgLists:[],
      // 判断是否上传成功
      uploadflag: false,
      exId:'',
      attrId:'',
      SigName:[]
    }
  },
  created(){
    this.getAttr()
  },
  watch: {
    // 监听选择的xpcip的变化
    value(newval,oldval){
      if(oldval!== ""&&newval!==oldval){
        this.unLinkXpc()
      }
    },
    // 监听连接simulink的标志
    startFlag(newval,oldval){
      if(newval === true){
        this.getSimulinkData()
      }
    }
  },
  mounted (){
    //this.echartsInit()
    //刷新和退出都会断开xpc连接
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    //离开当前界面也会断开xpc连接
    window.addEventListener('onbeforeunload', e => this.onbeforeunloadHandler(e))
  },
  methods:{
    beforeunloadHandler(e){
      this.unLinkXpc()
    },
    onbeforeunloadHandler(e){
      this.unLinkXpc()
    },
    getAttr(){
      attr.getAttr().then(response =>{
        this.attr =  response.data.data.attrList
      })
    },
    // 获取xpc连接
    linkXpc(callback){
      const attr1 = this.attr[this.value-1]
      //将选择的值保存
      if(!callback){
        if(typeof(attr1)!=='undefined'){
           this.attrId  = attr1.id
        simulink.getXpcConnection(attr1.id,attr1.ip,attr1.port).then(response =>{
        if(response.data.success){
          this.port = response.data.data.port
          this.$message({
          message: 'xpc连接成功',
          type: 'success'
        })
        }
      })
        }
      }
    },
    // 断开xpc连接
    unLinkXpc(){
      simulink.unLinkXpc(this.attrId,this.port).then(response =>{
        if(response.data.success){
          this.startFlag = false
          this.$message({
          message: 'xpc断开连接成功',
          type: 'success'
        })
         this.dataflag = true
        }
      })
    },
    // 文件上传成功后执行方法
    fileSuccess(res,file,fileList){
      this.fileName  = res.data.fileName
    },
    //根据port和文件名获取参数信息
    getSetting(){
      this.drawer = true
      simulink.getSetting(this.port).then(response =>{
        this.setting =  response.data.data.setting
      })
    },
    // 修改参数设置
    changeParameter(settingRef){
      this.$refs[settingRef].validate((valid) => {
        if(!valid){
          return  this.$message.error('表单验证失败')
        }
        simulink.ChangeTargetSetting(this.port,this.fileName,this.setting).then(response =>{
          if(response.data.success){
            this.$message.success('修改参数成功！')
            this.drawer = false
          }
        })
      })
    },
    start(){
      simulink.startSimulink(this.port).then(response =>{
        if(response.data.success){
                  // 将开始标志设置为true
          this.startFlag = true
          this.$message.success('开始运行')
        }
        // 如果是停止之后的数据需要将数据先清空
        if(this.dataflag){
          this.length = 0
          this.simulinkData = []
        }
      })
    },
    stop(){
      simulink.stopSimulink(this.port).then(response =>{
        if(response.data.success){
                  // 将开始标志设置为true
          this.startFlag = false
          this.$message.success('停止运行')
          this.dataflag = true
        }
      })
    },
    echartsInit () {
      // 找到容器
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      if(this.first){
        // 开始渲染
        for(var i = 1;i<=this.length;i++){
          this.option.legend.data.push(this.SigName[i-1]+'')
          var x = {
                  name: this.SigName[i-1]+'',
                  type: 'line',
                  data: this.simulinkData[i]
          }
          this.option.series.push(x)
        }
        this.first = false
      }else{
        for(var i = 0;i<this.length;i++){
          this.option.series[i].data = this.simulinkData[i]
        }
      }
      
      this.option.xAxis.data = this.simulinkData[0]
      myChart.setOption(this.option)
    },
    // 获取运行数据
    getSimulinkData(){
      simulink.getSimulinkData(this.port).then(response =>{
        if(response.data.success){
           this.simulinkDataHandle(response.data.data)
          }
      }).then(response =>{
        //如果开始标志为true,每隔指定的间隔时间向后端发起请求
         if(this.startFlag){
            this.echartsInit()
            setTimeout(this.getSimulinkData(),this.setting.ts)
          }
      })
    },
    // 加载模型
    loading(){
      simulink.loadingModel(this.fileName,this.port).then(response =>{
        if(response.data.success){
          this.$message.success('模型加载成功！')
        }
      })
    },
    // 数据的封装
    simulinkDataHandle(data){
      for(var i = 0;i<=data.data.length;i++)
      {
        if(this.length == 0){
          this.simulinkData[i] = new Array()       
        }
        if(i === 0) this.simulinkData[i].push(data.currentTime)
        else this.simulinkData[i].push(data.data[i])
      }
      this.length = data.data.length
      this.SigName = data.SigName
    },
    // 保存图片列表
    imgList(){
      // 找到容器
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      //将d
      this.imgLists.push(myChart.getDataURL({
        type: 'png'
      }))
      this.$message({
          message: '图片保存成功',
          type: 'success'})
    },
    // 清除图片列表
    remove(){
      this.imgLists = []
    },
    // 上传图片列表
    uploadimgList(){
      this.user = JSON.parse(cookie.get("simulink_ucenter"))
      if(this.imgLists.length !==0){
        img.uploadImg(this.user.id,this.exId,this.imgLists).then(response =>{
        if(response.data.success){
          this.$message({
          message: '图片上传成功',
          type: 'success'})
          this.uploadflag = true
          this.imgLists = []
        }
      })
      }
    },
    // 离开实验
    live(){
      //判断是否上传图片
      if(!this.uploadflag){
         this.$notify({
          title: '警告',
          message: '您还未保存数据',
          type: 'warning'
        })
      }else{
        var UAE = {
          userId:this.user.id,
          experimentId: this.exId
        }
        score.addScore(UAE).then(response =>{
          if(response.data.success){
            this.$router.push({path:'/'})
          }
        })
      }
    }

    },
    destroyed () {
      window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
      window.removeEventListener('onbeforeunload', e => this.beforeunloadHandler(e))
    }
}
</script>

<style scoped>
#bg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  flex-direction: column;  
}
#bg div{
  flex: 1;
  margin-bottom: 20px;
}
.dataShow{
  margin-top: 20px;
  width: 900px;
  height: 600px;
  margin-left: auto;
  margin-right: auto;
  float: left;
}
#myChart{
    width: 1000px;
    height: 600px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }
</style>