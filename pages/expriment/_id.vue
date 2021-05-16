<template>
  <div>
      <div id="cc-main" style="min-height: 645px;">
          <div class="interaction-rows" style="display: block;">
              <div class="interaction-row" v-for="(item,index) in experiments" v-bind:key="index">
                  <div @click="startExperiment(item.id,item.gmtEnd)">
                  <img src="https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/activities-list-icon-assignment.png" alt="" style="width:60px;vertical-align:middle;margin-right:10px;">
                  <div class="" style="display:inline-block;vertical-align:middle;">
                      <div><span class="title">实验名称：  {{item.name}}</span></div>
                      <div style="display:inline-block;vertical-align:middle;"><span class="time">  创建时间:  {{item.gmtCreate}} |</span></div>
                      <div style="display:inline-block;vertical-align:middle;"><span  class="time">  结束时间:  {{item.gmtEnd}}</span></div>
                     
                  </div>
                </div>
                <div>
                    <a :href="'/expriment/detail/'+item.id" class="detail">详情</a>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import experiment from "@/api/experiment";
export default {
    asyncData({ params, error }){
        // 根据课程id获取实验名称
       return experiment.getExperimentById(params.id).then(response => {
            return {
                experiments: response.data.data.list,
                courseId: params.id
            }
        })
        
    },
    data() {
        return {
            experiments:[],
            courseId:''
        }
    },
    methods:{
        // 跳转到实验界面
        startExperiment(id,time){
            var t = new Date()
            var nowTime = this.getCurrentDate()
            //判断当前时间和结束时间的关系
            if(nowTime<time){
              this.$router.push({path:'/startEx/'+id})
            }else{
                this.$message.error("实验已结束，不能实验")
            }
        },
        // 得到当前系统时间
        getCurrentDate() {
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期
            var day = now.getDay();//得到周几
            var hour = now.getHours();//得到小时
            var minu = now.getMinutes();//得到分钟
            var sec = now.getSeconds();//得到秒
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;
            return year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
        }
    }
}
</script>

<style scoped>
.interaction-row {
    cursor: pointer;
    padding: 20px;
    color: #666;
    border-left: 1px solid #FFF;
    border-right: 1px solid #FFF;
    border-top: 1px solid #e1e1e1;
    background-color: #fff;
    position: relative;
}
.title {
    font-size:20px
}
.time {
    font-size: 12px;
    color: rgb(139, 138, 138);
}
#cc-main {
    position: relative;
    width: 980px;
    margin: 0 auto;
    background-color: #FFF;
}
.detail {
    position: absolute;
    right: 0px;
    color: rgb(59, 177, 108);
}
</style>