<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <strong>我的课程</strong>
          </div>
          <div class="firstStep clearfix" v-for="course in courseList">
            <div class="lessons-item js-lessons-item g-clearfix">
              <a :href="'/course/detail?pageMode=student&crn=' + course.crn">
                <div class="lessons-pic">
                  <img width="200" height="200" src="/static/img/logo.png">
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
                <img width="200" height="200" src="/static/img/logo.png">
              </div>
              <div class="lessons-info">
                <h3 class="info-tile">无进行中的课程。</h3>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col cols="12" v-if="(rolList.indexOf('1') || rolList.indexOf('6')) !== -1">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>我教的课程</strong>
          </div>
          <div class="firstStep clearfix" v-for="course in teachList">
            <div class="lessons-item js-lessons-item g-clearfix">
              <a :href="'/course/detail?pageMode=faculty&crn=' + course.crn">
                <div class="lessons-pic">
                  <img width="200" height="200" src="/static/img/logo.png">
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
                <img width="200" height="200" src="/static/img/logo.png">
              </div>
              <div class="lessons-info">
                <h3 class="info-tile">无教授的课程。</h3>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
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
      }
    },
    mounted: function () {
      const token = decode(window.localStorage.getItem('access_token'));
      this.rolList = token.rol;

      this.initTeachList();
      this.initCourseList();
    },
    methods: {
      initTeachList: function () {
        axios.get('/course?mode=faculty&status=0').then((response) => {
          this.teachList = response.data.data
        })
      },
      initCourseList: function () {
        axios.get('/student/course?status=0').then((response) => {
          this.courseList = response.data.data
        })
      }
    }
  }
</script>
