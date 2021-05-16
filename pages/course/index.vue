<template>
  <div>
    <div id="input">
       <el-input v-model="courseQuery.name" prefix-icon="el-icon-search" placeholder="实验班课名字" size="medium" style="width:30%"/>
       <el-input v-model="courseQuery.teacherName" prefix-icon="el-icon-search" placeholder="实验班课老师名字" size="medium" style="width:30%"/>
       <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
       <el-button type="default" @click="resetData()">清空</el-button>   
    </div>
    <div>
        <article class="comm-course-list">
        <ul
          class="of"
          id="bna"
        >
          <li v-for="(item,index) in course" v-bind:key="index">
            <div class="cc-l-wrap">
              <section class="course-img">
                <img
                  src="~/assets/photo/course/1.jpg"
                  class="img-responsive"
                  alt="班课"
                >
                <div class="cc-mask">
                  <a
                    title="加入班课"
                    class="comm-btn c-btn-1"
                    @click="jionCourse(item.id)"
                    style="cursor:pointer;"
                  >加入班课</a>
                </div>
              </section>
              <h3 class="hLh30 txtOf mt10">
                <a
                  href="#"
                  :title="item.name"
                  class="course-title fsize18 c-333"
                >班课名称:{{item.name}}</a>
                <i class="c-999 f-fA">&nbsp;&nbsp;班课创建者{{item.userCreate}}</i>
              </h3>
              <section class="mt10 hLh20 of">
                <span class="fl jgAttr c-ccc f-fA">
                  <i class="c-999 f-fA">班课容量{{item.number}}人</i>
                  |
                  <i class="c-999 f-fA">班课实际{{item.realityNumber}}人</i>
                </span>
              </section>
            </div>
          </li>
        </ul>
      </article>
    </div>
    <div>
        <!-- 分页条 -->
        <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
        />
    </div>
  </div>
</template>

<script>
import course from '@/api/course'
import usercourse from '@/api/usercourse'
import cookie from "js-cookie";
export default {
    data(){
        return{
            course:null,
            page: 1,
            limit: 8,
            total: 0,//总记录数
            courseQuery: {},
            usercourse:{}
        }
    },
    created(){
        this.getList()
    },
    methods:{
         getList(page =1) {
            this.page = page
            course.getCoursePage(this.page,this.limit,this.courseQuery)
                .then( response => {
                    if (response.data.success === true) {
                        this.course = response.data.data.items
                        this.total = response.data.data.total
                    }
                })
                .catch(error => { console.log(error)})          
        },
        jionCourse(id){
            //判断是否已经登陆
            if (typeof(cookie.get("simulink_ucenter")) != "undefined"&& cookie.get("simulink_ucenter") !=="") {
               this.user = JSON.parse(cookie.get("simulink_ucenter"))
              // console.log(this.user)
               this.usercourse.classid = id
               this.usercourse.userid = this.user.id
               usercourse.joinCourse(this.usercourse).then(response =>{
                   this.$router.push({path:'/'})
               })
            }else{
                // 跳转到登录界面
                 this.$router.push({path:'/login'})
            }
        },
        resetData() {
            this.courseQuery = {}
            this.getList()
        },
    }
}
</script>
<style  scoped>

</style>