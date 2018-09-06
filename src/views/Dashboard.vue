<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-primary">
          <b-card-body class="pb-0">
            <h4 class="mb-0">{{numOfCourse}}</h4>
            <p>你正在进行中的课程<br>Number of your on-going courses.</p>
          </b-card-body>

        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-info">
          <b-card-body class="pb-0">
            <h4 class="mb-0">{{numOfTeach}}</h4>
            <p>你 所教授的课程<br>Number of your teaching courses.</p>
          </b-card-body>

        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-warning">
          <b-card-body class="pb-0">
            <h4 class="mb-0">{{numOfAdvisor}}</h4>
            <p>导师数量<br>Number of Advisors</p>
          </b-card-body>

        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-danger">
          <b-card-body class="pb-0">
            <h4 class="mb-0">{{numOfStudent}}</h4>
            <p>学生数量<br>Number of Students</p>
          </b-card-body>

        </b-card>
      </b-col>
    </b-row>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="课程表" name="first">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <b-row>
            <b-col md="2"></b-col>
            <b-col md="8">
              <img :src="basePath + '/static/img/先锋2018年秋季试听课表.jpg'" width="100%"/>
            </b-col>
            <b-col md="2">
              <!--<b-row>-->
                <!--<b-button>下载课程表</b-button>-->
                <!--<b-button>上传课程表</b-button>-->
              <!--</b-row>-->
            </b-col>
          </b-row>
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="我的课程" name="second">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div class="firstStep clearfix" v-for="course in courseList">
            <div class="lessons-item js-lessons-item g-clearfix">
              <a :href="'/course/detail?pageMode=student&crn=' + course.crn">
                <div class="lessons-pic">
                  <img width="200" height="200" src="/static/eas/img/logo.png">
                </div>
                <div class="lessons-info">
                  <h3 class="info-tile">{{course.name}}
                    ({{course.level}}/{{course.section}})</h3>

                  <div class="lessons-live">
                    <span class="space">课程周期: {{course.date}}</span>
                    <span class="">课程时间：{{course.time}} {{course.day}}</span>
                  </div>
                  <div class="lessons-complete">
                    <span>教师：<span class="js-lesson-record">{{course.faculty}}</span></span>
                  </div>
                </div>
                <div class="lessons-operate">
                  <div class="status being">进行中</div>
                  <div class="enter-class">进入课程</div>
                </div>
              </a>
            </div>
          </div>
          <div class="firstStep clearfix" v-if="courseList.length === 0">
            <div class="lessons-item js-lessons-item g-clearfix" style="cursor: default">
              <div class="lessons-pic">
                <img width="200" height="200" src="/static/eas/img/logo.png">
              </div>
              <div class="lessons-info">
                <h3 class="info-tile">无进行中的课程。</h3>
              </div>
            </div>
          </div>
        </b-card>

      </el-tab-pane>
      <el-tab-pane label="我教的课" name="third" v-if="(rolList.indexOf('1') || rolList.indexOf('6')) !== -1">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div class="firstStep clearfix" v-for="course in teachList">
            <div class="lessons-item js-lessons-item g-clearfix">
              <a :href="'/course/detail?pageMode=faculty&crn=' + course.crn">
                <div class="lessons-pic">
                  <img width="200" height="200" src="/static/eas/img/logo.png">
                </div>
                <div class="lessons-info">
                  <h3 class="info-tile">{{course.name}}
                    ({{course.level}}/{{course.section}})</h3>

                  <div class="lessons-live">
                    <span class="space">课程周期: {{course.date}}</span>
                    <span class="space">课程时间：{{course.time}}</span>
                    <span class="">课程星期：{{course.day}}</span>
                  </div>
                  <div class="lessons-complete">
                    <span class="space">学生人数：
                      <span
                        class="js-lesson-complete">{{course.capacity - course.remain}}</span>
                    </span>
                    <span class="space">剩余：<span class="js-lesson-rate">{{course.remain}}</span></span>
                    <span>教室：<span class="js-lesson-record">{{course.classroom}}</span></span>
                  </div>
                </div>
                <div class="lessons-operate">
                  <div class="status being" v-if="course.status === 0">进行中</div>
                  <div class="status before" v-if="course.status === 1">未开始</div>
                  <div class="enter-class">进入课程</div>
                </div>
              </a>
            </div>
          </div>
          <div class="firstStep clearfix" v-if="teachList.length === 0">
            <div class="lessons-item js-lessons-item g-clearfix" style="cursor: default">
              <div class="lessons-pic">
                <img width="200" height="200" src="/static/eas/img/logo.png">
              </div>
              <div class="lessons-info">
                <h3 class="info-tile">无教授的课程。</h3>
              </div>
            </div>
          </div>
        </b-card>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import axios from 'axios'
  import decode from 'jwt-decode'

  export default {
    name: 'dashboard',
    data() {
      return {
        courseList: [],
        teachList: [],
        rolList: [],
        numOfCourse: 0,
        numOfTeach: 0,
        numOfAdvisor: 0,
        numOfStudent: 0,
        basePath: basePath,
        activeName:'first'
      }
    },
    mounted: function () {
      const token = decode(window.localStorage.getItem('access_token'));
      this.rolList = token.rol;

      this.initTeachList();
      this.initCourseList();
      this.count();
    },
    methods: {
      initTeachList: function () {
        axios.get('/course?mode=faculty&status=0').then((response) => {
          this.teachList = response.data.data
          this.numOfTeach = this.teachList.length;
        })
      },
      initCourseList: function () {
        axios.get('/student/course?status=0').then((response) => {
          this.courseList = response.data.data
          this.numOfCourse = this.courseList.length;
        })
      },
      count() {
        axios.get('/system/info').then((response) => {
          this.numOfAdvisor = response.data.data.advisor;
          this.numOfStudent = response.data.data.student;
        })
      }
    }
  }
</script>
