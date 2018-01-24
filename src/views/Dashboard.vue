<template>
  <div class="animated fadeIn">
    <div class="row" id="myCoursePage">

      <div class="col-md-12" v-if="courseList.length > 0">
        <!-- Advanced Tables -->
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h1 style="font-size: 20px">我的课程</h1>
          </div>
          <div class="panel-body">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="firstStep clearfix" v-for="course in courseList">
                  <div class="lessons-item js-lessons-item g-clearfix">
                    <a :href="'/course/detail?pageMode=student&crn=' + course.crn">
                      <div class="lessons-pic">
                        <img width="200" height="200" src="/static/images/harambe.png">
                      </div>
                      <div class="lessons-info">
                        <h3 class="info-tile">{{course.name}}
                          ({{course.level}}/{{course.section}})</h3>

                        <div class="lessons-live">
                          <span class="space">课程周期: {{course.date}}</span>
                          <span class="">课程时间：{{course.time}} {{course.day}}</span>
                        </div>
                        <div class="lessons-complete">
                                                        <span>教师：<span
                                                          class="js-lesson-record">{{course.faculty}}</span></span>
                        </div>
                      </div>
                      <div class="lessons-operate">
                        <div class="status being">进行中</div>
                        <div class="enter-class">进入课程</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--End Advanced Tables -->
      </div>
      <div class="col-md-12" v-if="teachList.length > 0">
        <!-- Advanced Tables -->
        <div class="panel panel-danger">
          <div class="panel-heading">
            <h1 style="font-size: 20px">我教的课程</h1>
          </div>
          <div class="panel-body">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="firstStep clearfix" v-for="course in teachList">
                  <div class="lessons-item js-lessons-item g-clearfix"
                       v-if="course.status !== -1">
                    <a :href="'/course/detail?pageMode=faculty&crn=' + course.crn">
                      <div class="lessons-pic">
                        <img width="200" height="200" src="/static/images/harambe.png">
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
                          <span class="space">剩余：
                                                            <span class="js-lesson-rate">{{course.remain}}</span>
                                                        </span>
                          <span>教室：
                                                            <span class="js-lesson-record">{{course.classroom}}
                                                            </span>
                                                        </span>
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
              </div>
            </div>
          </div>
        </div>
        <!--End Advanced Tables -->
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'dashboard',
    data () {
      return {
        courseList: [],
        teachList: []
      }
    },
    mounted: function () {
      this.initTeachList()
      this.initCourseList()
    },
    methods: {
      initTeachList: function () {
        axios.get('/course?mode=faculty').then((response) => {
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
