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
            <p>你所教授的课程<br>Number of your teaching courses.</p>
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
    <b-row>
      <b-col lg="5">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>课程表</strong>
            <small>Schedule</small>
          </div>
          <b-card-body>
            <img :src="basePath + '/static/img/先锋2018年秋季试听课表.jpg'" @click="downloadSchedule()" style="width: 100%; cursor: pointer"/>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col lg="7">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="我的课程" name="second" v-if="(rolList.indexOf('5')) !== -1">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div class="firstStep clearfix" v-for="course in courseList">
                <div class="lessons-item g-clearfix">
                  <a>
                    <div class="lessons-pic">
                      <img v-if="isNotEmpty(course.profile)"
                           :src="basePath + '/static' + JSON.parse(course.profile).path"
                           style="width: 150px; height: 150px" class="profile">
                      <img v-else
                           :src="basePath + '/static/img/logo.png'"
                           style="width: 150px; height: 150px" class="profile">
                    </div>
                    <div class="lessons-info">
                      <h3 class="info-tile">{{course.name}}
                        ({{course.level}}/{{course.section}})</h3>

                      <div class="lessons-live">
                        <span class="space">课程周期: {{course.date}}</span>
                        <span class="space">课程时间：{{course.time}}</span>
                        <span class="space">每周：{{course.day}}</span>
                      </div>
                      <div class="lessons-live">
                        <span>教师：<span class="js-lesson-record">{{course.faculty}}</span></span>
                      </div>
                    </div>
                    <div class="lessons-operate">
                      <div class="status being">进行中</div>
                      <!--<div class="enter-class">进入课程</div>-->
                    </div>
                  </a>
                </div>
              </div>
              <div class="firstStep clearfix" v-if="courseList.length === 0">
                <div class="lessons-item g-clearfix" style="cursor: default">
                  <div class="lessons-pic">
                    <img width="150" height="150" :src="basePath + '/static/eas/img/logo.png'">
                  </div>
                  <div class="lessons-info">
                    <h3 class="info-tile">无进行中的课程。</h3>
                  </div>
                </div>
              </div>
            </b-card>
          </el-tab-pane>
          <el-tab-pane label="我教的课" name="third" v-if="(rolList.indexOf('1') !==-1 || rolList.indexOf('6')) !== -1">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div class="firstStep clearfix" v-for="course in teachList">
                <div class="lessons-item g-clearfix">
                  <a @click="showStudent = !showStudent">
                    <div class="lessons-pic">
                      <img v-if="isNotEmpty(course.profile)"
                           :src="basePath + '/static' + JSON.parse(course.profile).path"
                           style="width: 150px; height: 150px" class="profile">
                      <img v-else
                           :src="basePath + '/static/img/logo.png'"
                           style="width: 150px; height: 150px" class="profile">
                    </div>
                    <div class="lessons-info">
                      <h3 class="info-tile">{{course.name}}
                        ({{course.level}}/{{course.section}})</h3>

                      <div class="lessons-live">
                        <span class="space">课程周期: {{course.date}}</span>
                        <span class="space">课程时间：{{course.time}}</span>
                        <span class="space">每周：{{course.day}}</span>
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
                      <div class="enter-class">
                        {{ showStudent ? '隐藏' : '查看'}}学生</div>
                    </div>
                  </a>
                  <template>
                    <CStudentInCourseTable v-if="showStudent" v-bind:crn="course.crn" :mode="'teach'" class="mt-3"/>
                  </template>

                </div>

              </div>
              <div class="firstStep clearfix" v-if="teachList.length === 0">
                <div class="lessons-item  g-clearfix" style="cursor: default">
                  <div class="lessons-pic">
                    <img width="150" height="150" :src="basePath + '/static/eas/img/logo.png'">
                  </div>
                  <div class="lessons-info">
                    <h3 class="info-tile">无教授的课程。</h3>
                  </div>
                </div>
              </div>
            </b-card>
          </el-tab-pane>
          <el-tab-pane label="你的导师信息" name="forth" v-if="rolList.indexOf('5') !== -1">
            <b-card header-tag="header"
                    footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>导师信息</strong>
              </div>
              <b-row v-if="isNotEmpty(advisor)">
                <b-col md="9">
                  <b-row>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">姓名:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.lastName}},{{advisor.firstName}}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">生日:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.birthday.substr(0,10)}}
                    </b-col>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">邮箱:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.email}}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">电话号:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.tel}}
                    </b-col>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">宿舍号:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.dorm}}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">QQ号:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.qq}}
                    </b-col>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">微信号:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.weChat}}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md="3" class="my-1">
                      <label class="col-sm-12 control-label">性别:</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      {{advisor.gender}}
                    </b-col>
                  </b-row>
                </b-col>
                <b-col md="3">
                  <img v-if="isNotEmpty(advisor.profile)"
                       :src="basePath + '/static' + JSON.parse(advisor.profile).path"
                       style="width: 150px; height: 150px" class="profile">
                  <img v-else
                       :src="basePath + '/static/img/logo.png'"
                       style="width: 150px; height: 150px" class="profile">
                </b-col>
              </b-row>
              <b-row v-else>
                <p><strong>暂无导师信息。</strong></p>
              </b-row>
            </b-card>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>

  </div>
</template>

<script>
  import axios from 'axios'
  import decode from 'jwt-decode'
  import CStudentInCourseTable from "../components/tables/StudentInCourseTable";

  export default {
    name: 'dashboard',
    components: {CStudentInCourseTable},
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
        activeName: 'second',
        advisor: '',
        showStudent: false,
      }
    },
    mounted: function () {
      const token = decode(window.localStorage.getItem('access_token'));
      this.rolList = token.rol;

      if (this.rolList.indexOf('5') !== -1) {
        axios.get('/advise/advisor/student/' + token.sub).then(response => {
          if (isNotEmpty(response.data.data)) {
            let userId = response.data.data.facultyId;
            axios.get('/user/' + userId).then(response => {
              this.advisor = response.data.data;
            })
          }
        })
      }
      if(this.rolList.indexOf('1') !==-1 || this.rolList.indexOf('6') !== -1){
        this.initTeachList();
        this.activeName = 'third'
      }
      if(this.rolList.indexOf('5') !==-1){
        this.initCourseList();
      }

      this.count();
    },
    methods: {
      downloadSchedule() {
        window.open(basePath + '/static/img/%E5%85%88%E9%94%8B2018%E5%B9%B4%E7%A7%8B%E5%AD%A3%E8%AF%95%E5%90%AC%E8%AF%BE%E8%A1%A8.jpg')
      },
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
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      }
    }
  }
</script>
