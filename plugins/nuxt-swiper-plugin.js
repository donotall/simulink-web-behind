import Vue from 'vue'

import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import * as echarts from 'echarts'// 引入echarts
Vue.prototype.$echarts = echarts 
Vue.use(ElementUI) //使用elementUI
