<template>

  <div>
    <!-- 根据用户获取用户加入班课 -->
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
                    :href="'/expriment/'+item.id"
                    title="进入班课"
                    class="comm-btn c-btn-1"
                  >进入班课</a>
                </div>
              </section>
              <h3 class="hLh30 txtOf mt10">
                <a
                  href="#"
                  :title="item.name"
                  class="course-title fsize18 c-333"
                >班课名称:{{item.name}}</a>
                <i class="c-999 f-fA">&nbsp;&nbsp;&nbsp;班课创建者{{item.userCreate}}</i>
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

  </div>
</template>

<script>
import courseUser from "@/api/usercourse"
import login from "@/api/login"
export default {
  data() {
    return {
      user: {},
      course: [],
    };
  },
  created() {
    this.getCourseByUser()
  },
  methods: {
    getCourseByUser() {
      login.getLoginInfo().then(response =>{
        if(response.data.success){
          this.user = response.data.data.item
          courseUser.getCourseByUserId(this.user.id).then((response) => {
            if(response.data.success)
            this.course = response.data.data.course
          })
        }else{
          this.$router.push({path:'/login'})
        }
      })
    },
  },
};
</script>