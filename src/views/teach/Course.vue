<template>
  <div class="animated fadeIn">

    <b-row v-if="pageMode === 'student'">
      <b-col cols="12">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            <b-button class="btn btn-primary btn-info"
                      @click="showTable">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <i className="fa fa-align-justify"></i><strong>课程中学生详情</strong>
          </div>
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>学生列表</strong>
            </div>
            <CStudentInCourseTable v-bind:crn="id" :mode="pageMode"/>
          </b-card>
        </b-card>
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>添加学生</strong>
          </div>
          <CAddStudentTable mode="addStudent" v-bind:crn="id" :mode="pageMode"/>
        </b-card>
      </b-col>
    </b-row>

    <b-row v-if="pageMode === 'request' || pageMode === 'create' || pageMode === 'manage'">
      <b-col cols="12">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'create' && id !== ''"
                      @click="backToTempCourseTable">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'request' && id !== ''"
                      @click="backToTempCourseTable">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'manage'"
                      @click="showTable">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <i className="fa fa-align-justify"></i><strong>课程基本信息表</strong>
          </div>
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>学期信息</strong>
            </div>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*年份-学期(YYYY-XX):</label>
              </b-col>
              <b-col md="3" class="my-1">
                <b-form-select id="year" style="width: 50%; float:left;" v-validate="'required'" name="info"
                               :disabled="tempCourse.status!=='0'"
                               :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                               :plain="true"
                               :options="[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]"
                               v-model="info.year">
                </b-form-select>

                <b-form-select id="info" style="width: 50%" v-validate="'required'" name="info"
                               :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                               :disabled="tempCourse.status!=='0'"
                               :plain="true"
                               :options="[{ text: '春季课程', value: '01' },{ text: '秋季课程', value: '02' }, { text: '夏季课程', value: '03' }]"
                               v-model="info.semester">
                </b-form-select>
                <div v-show="errors.has('info')" class="invalid-tooltip">{{ errors.first('info') }}</div>
              </b-col>
            </b-row>
          </b-card>
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>课程基本信息</strong>
            </div>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*课程名:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input :class="{'form-control': true, 'is-invalid': errors.has('name')}" name="name"
                       v-validate="'required|min:1|max:20'"
                       v-model="course.name"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('name')" class="invalid-tooltip">{{ errors.first('name') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*等级:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="100" id="intro" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('level')}"
                         name="level" v-model="course.level" v-validate="'required'">
                  <label class="custom-control-label" for="intro">普及级</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="200" id="median" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('level')}"
                         name="level" v-model="course.level" v-validate="'required'">
                  <label class="custom-control-label" for="median">进阶级</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="300" id="advance" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('level')}"
                         name="level" v-model="course.level" v-validate="'required'">
                  <label class="custom-control-label" for="advance">高级</label>
                </div>
                <div v-show="errors.has('level')" class="invalid-tooltip">{{ errors.first('level') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*类型:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="课程" id="course" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('section')}"
                         name="section" v-model="course.section" v-validate="'required'">
                  <label class="custom-control-label" for="course">课程</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="预约课程" id="app" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('section')}"
                         name="section" v-model="course.section" v-validate="'required'">
                  <label class="custom-control-label" for="app">预约课程</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="项目" id="project" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('section')}"
                         name="section" v-model="course.section" v-validate="'required'">
                  <label class="custom-control-label" for="project">项目</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" value="兴趣小组" id="curious" :disabled="tempCourse.status!=='0'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('section')}"
                         name="section" v-model="course.section" v-validate="'required'">
                  <label class="custom-control-label" for="curious">兴趣小组</label>
                </div>
                <div v-show="errors.has('section')" class="invalid-tooltip">{{ errors.first('section') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*学分:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input placeholder="请输入0到4之间的整数数字"
                       :class="{'form-control': true, 'is-invalid': errors.has('credits')}" name="credits"
                       v-validate="'required|numeric|min:1|max:1'"
                       v-model="course.credits"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('credits')" class="invalid-tooltip">{{ errors.first('credits') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*容量:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input isDigits="true"
                       :class="{'form-control': true, 'is-invalid': errors.has('capacity')}" required
                       v-model="course.capacity" name="capacity"
                       v-validate="'required|numeric|min:1|max:2'"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('capacity')" class="invalid-tooltip">{{ errors.first('capacity') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">教室:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input :class="{'form-control': true, 'is-invalid': errors.has('classroom')}" name="classroom"
                       v-validate="'max:20'"
                       v-model="course.classroom"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('classroom')" class="invalid-tooltip">{{ errors.first('classroom') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*周期:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <el-date-picker
                  v-model="courseDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="form-control"
                  size="mini"
                  style="height: 34px; width: 100%; padding: 5px 12px;"
                  :disabled="tempCourse.status!=='0'"
                >
                </el-date-picker>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">时间:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <el-time-picker
                  is-range
                  v-model="courseTime"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  class="form-control"
                  size="mini"
                  style="height: 34px; width: 100%; padding: 5px 12px;"
                  :disabled="tempCourse.status!=='0'"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                >
                </el-time-picker>
                <!--<input id="starttime" :class="{'form-control': true, 'is-invalid': errors.has('startTime')}"-->
                <!--name="startTime"-->
                <!--v-model="course.startTime" v-validate="'required'"-->
                <!--:disabled="tempCourse.status!=='0'"/>-->
                <!--<div v-show="errors.has('startTime')" class="invalid-tooltip">{{ errors.first('startTime') }}</div>-->
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">选择上课日:</label>
              </b-col>
              <b-col md="8" class="my-1">
                <b-form-checkbox-group id="basicInlineCustomCheckboxes">
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="m" id="m" name="day" v-model="courseDay"
                           class="custom-control-input"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="m">星期一</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="t" id="t" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="t">星期二</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="w" id="w" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="w">星期三</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="tr" id="tr" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="tr">星期四</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="f" id="f" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="f">星期五</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="sa" id="sa" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="sa">星期六</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="s" id="s" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status!=='0'">
                    <label class="custom-control-label" for="s">星期日</label>
                  </div>
                </b-form-checkbox-group>
              </b-col>
            </b-row>
            <div slot="footer">
              <i className="fa fa-align-justify"></i><strong>*为必填！ 注意，如果上课时间不是重复时间段，请再创建一个新课程，命名为 XX课程
              第二时段，并且学分填写为0学分。</strong>
            </div>
          </b-card>
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header" v-if="pageMode === 'create' || pageMode === 'manage'">
              <i className="fa fa-align-justify"></i><strong>教师与预修课分配</strong>
            </div>
            <div slot="header" v-if="pageMode === 'request'">
              <i className="fa fa-align-justify"></i><strong>预修课分配</strong>
            </div>
            <b-row>
              <b-col md="2">
                <label class="control-label">*分配教师:</label>
              </b-col>
              <b-col md="3">
                <CFacultySelect v-on:pass="passFaculty" :parentFaculty="faculty"/>
              </b-col>
              <b-col md="2">
                <label class="control-label">预修课程（可多选，可不选）:</label>
              </b-col>
              <b-col md="3">
                <v-select v-model="preList" :filterable="false" :options="courseOptions"
                          @search="preCourseList" multiple
                          :disabled="tempCourse.status!=='0'">
                </v-select>
              </b-col>
            </b-row>
            <div slot="footer">
              <i className="fa fa-align-justify"></i><strong>对于一节课有多个老师的话，请在此处仅填写主要的负责老师，并在备注中写出参与课程的老师名字。</strong>
            </div>
          </b-card>
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>更多信息</strong>
            </div>
            <b-row v-if="!showDocument">
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">上传课程大纲:</label>
              </b-col>
              <b-col md="6" class="my-1">
                <input type="file" id="document" :disabled="tempCourse.status!=='0'">
              </b-col>
              <b-col md="2" class="my-1" v-if="pageMode == 'manage' || showUpload">
                <b-button style="width: 100%" class="btn btn-info my-1" @click="documentUpload">
                  上传
                </b-button>
              </b-col>
              <b-col md="2" class="my-1" v-if="!showDocument && isNotEmpty(course.courseInfo)">
                <b-button style="width: 100%" class="btn btn-success"
                          @click="showDocument = true">
                  取消替换
                </b-button>
              </b-col>
            </b-row>
            <b-row v-if="showDocument">
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">课程大纲:</label>
              </b-col>
              <b-col md="6" class="my-1">
                <b-row>
                  <b-col md="6">
                    点击下载-> <a href="#" style="cursor: pointer;" @click="documentDownload">{{course.courseInfo.name}}</a>
                  </b-col>
                  <b-col md="3">
                    <b-button style="width: 100%" class="btn btn-danger"
                              @click="showDocument = false">
                      替换
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">备注信息:</label>
              </b-col>
              <b-col md="10" class="my-1">
                 <textarea style="resize: none;"
                           :class="{'form-control': true}"
                           rows="3" v-model="course.comment"
                           :disabled="tempCourse.status!=='0'">
                 </textarea>
              </b-col>
            </b-row>
          </b-card>
          <b-card header-tag="header"
                  footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>确认上述信息</strong>
            </div>
            <b-row>
              <b-col md="3" class="my-1">
                <label class="col-sm-12 control-label">*上述信息正确无误:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input type="checkbox" id="confirm" name="confirm" v-validate="'required'"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                         v-model="confirm">
                  <label class="custom-control-label" for="confirm">确认</label>
                  <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                </div>
              </b-col>
              <b-col md="1" class="my-1">
                <label class="col-sm-12 control-label">操作:</label>
              </b-col>
              <b-col md="3">
                <b-button style="width:150px;" class="btn btn-success"
                          v-if="pageMode === 'manage'"
                          @click="courseUpdate">修改课程
                </b-button>
                <b-button style="width:150px;" class="btn btn-success"
                          v-if="pageMode === 'create' && id !== ''"
                          @click="tempCourseApprove"
                          :disabled="tempCourse.status!=='0'">批准申请
                </b-button>
                <b-button style="width:150px;" class="btn btn-danger"
                          v-if="pageMode === 'create' && id !== ''"
                          @click="tempCourseDecline"
                          :disabled="tempCourse.status!=='0'">拒绝申请
                </b-button>
                <b-button style="margin-left: 32%; width:150px;" class="btn btn-success"
                          v-if="pageMode === 'request' && id === ''"
                          @click="tempCourseCreate"> 提交申请
                </b-button>
                <b-button style="margin-left: 32%; width:150px;" class="btn btn-success"
                          v-if="pageMode === 'request' && id !== '' && tempCourse.status === '0'"
                          @click="tempCourseUpdate">修改申请
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-card>
      </b-col>
    </b-row>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             @ok="goTo"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import CAddStudentTable from '../../components/tables/AddStudentTable'
  import CStudentInCourseTable from '../../components/tables/StudentInCourseTable'
  import CFacultySelect from "../../components/selects/FacultySelect";

  export default {
    name: 'ViewCourse',
    components: {CFacultySelect, CStudentInCourseTable, CAddStudentTable},
    data() {
      return {
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        id: this.$route.fullPath.split('&')[1].split('=')[1],//maybe CRN
        url: this.$route.fullPath,
        info: {
          year: '2018',
          semester: '01'
        },
        course: {
          crn: '',
          info: '',
          name: '',
          credits: '',
          level: '',
          section: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          capacity: '',
          classroom: '',
          comment: '',
          day: '',
          precrn: '',
          facultyId: '',
          courseInfo: ''
        },
        tempCourse: {
          id: '',
          crn: '',
          status: '0',
          createTime: '',
          updateTime: '',
          operatorId: '',
          facultyId: '',
          courseJson: '',
        },
        courseTime: [new Date(2016, 9, 10, 9, 0), new Date(2016, 9, 10, 11, 0)],
        courseDate: [],
        courseDay: [],
        showDocument: false,
        confirm: false,
        courseOptions: [],
        msg: '',
        showModal: false,
        headerBgVariant: '',
        faculty: '',
        preList: '',
        goToUrl: '',
        showUpload: false,
      }
    },
    mounted() {
      //PRE课程
      axios.get('/course/search').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i].name,
            value: response.data.data[i].crn
          };
          this.courseOptions.push(item)
        }
      });

      if (isNotEmpty(this.id)) {
        switch (this.pageMode) {
          case 'manage':
            this.showCourseDetail(this.id);
            break;
          case 'transcript':
            this.showStudentDetail(this.id);
            break;
          case 'student':
            break;
          default:
            this.initRequest(this.id);
            break
        }
      }
    },
    methods: {
      goTo() {
        if (isNotEmpty(this.goToUrl)) {
          this.$router.push({path: this.goToUrl})
        }
      },
      backToTempCourseTable() {
        if (this.pageMode === 'create') {
          this.$router.push({path: '/teach/request?mode=manage'})
        } else {
          this.$router.push({path: '/course/new/request?mode=faculty'})
        }
      },
      initRequest(id) {
        if (isNotEmpty(id)) {
          axios.get('/request/course/' + id).then((response) => {
            this.tempCourse = response.data.data;
            this.course = JSON.parse(response.data.data.courseJson);
            this.showUpload = true;
            this.initCourseExtend()
          })
        }
      },
      initCourseExtend() {
        //init INFO
        let info = this.course.info.split("-");
        this.info.year = info[0];
        this.info.semester = info[1];

        //init DAYS and times
        this.courseDay = this.course.day.split('/');
        this.courseDate = [new Date(this.course.startDate), new Date(this.course.endDate)];

        this.courseTime = [
          new Date(2018, 8, 3, parseInt(this.course.startTime.split(":")[0]), parseInt(this.course.startTime.split(":")[1])),
          new Date(2018, 8, 3, parseInt(this.course.endTime.split(":")[0]), parseInt(this.course.endTime.split(":")[1]))
        ];

        //init documents
        if (isNotEmpty(this.course.courseInfo)) {
          this.course.courseInfo = JSON.parse(this.course.courseInfo);
          this.showDocument = true
        }

        //init PRECOURSE
        let preList = this.course.precrn.split('/');
        for (let i = 0; i < preList.length; i++) {
          if (isNotEmpty(preList[i])) {
            axios.get('/course/' + preList[i]).then((response) => {
              this.preList = [];
              this.preList.push({
                label: response.data.data.name,
                value: response.data.data.crn
              })
            })
          }
        }

        axios.get('/user/' + this.course.facultyId).then((response) => {
          let name = response.data.data.lastName + ', ' + response.data.data.firstName;
          let profilePath = '/static/img/logo.png';
          if (isNotEmpty(response.data.data.profile)) {
            let profile = JSON.parse(response.data.data.profile);
            profilePath = basePath + '/static' + profile.path
          }
          this.faculty = {
            label: name,
            value: response.data.data.userId,
            profile: profilePath
          }
        });
        this.facultyId = this.course.facultyId
      },

      showCourseDetail(crn) {
        if (isNotEmpty(crn)) {
          axios.get('/course/' + crn).then((response) => {
            this.course = response.data.data;
            this.initCourseExtend()
          })
        }
      },

      showStudentDetail(crn, credits) {
        this.transcript.crn = crn;
        this.transcript.credits = credits;
      },

      preCourseList(search, loading) {
        loading(true);
        this.courseOptions = [];
        axios.get('/course/search?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i].name,
              value: response.data.data[i].crn
            };
            this.courseOptions.push(item)
          }
        });
        loading(false)
      },

      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length; // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },

      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },

      prepare() {

        let day = '', precrn = '';

        if (isNotEmpty(this.courseDay))
          for (let i = 0; i < this.courseDay.length; i++)
            if (isNotEmpty(this.courseDay[i]))
              day += this.courseDay[i] + '/';

        if (isNotEmpty(this.preList))
          for (let i = 0; i < this.preList.length; i++)
            if (isNotEmpty(this.preList[i]))
              precrn += this.preList[i].value + '/';

        this.course.day = day;
        this.course.precrn = precrn;
        this.course.info = this.info.year + "-" + this.info.semester;

        this.course.startDate = date2Str(this.courseDate[0], "yyyy-MM-dd");
        this.course.endDate = date2Str(this.courseDate[1], "yyyy-MM-dd");
        this.course.startTime = date2Str(this.courseTime[0], "hh:mm:ss");
        this.course.endTime = date2Str(this.courseTime[1], "hh:mm:ss");

        this.course.facultyId = this.faculty.value;

        if (isNotEmpty(this.course.courseInfo))
          this.course.courseInfo = JSON.stringify(this.course.courseInfo)
      },
      showTable() {
        this.$router.push({path: '/teach/curriculum?mode=manage'})
      },

      //临时课程创建
      tempCourseCreate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.prepare();

          axios.post('/request/course/register', this.course).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '申请成功，等待教务答复!';
              this.showModal = true;
              this.headerBgVariant = 'success';
              let id = response.data.data.id;
              this.documentUpload(id);
              this.goToUrl = '/course/new/request?mode=faculty'
            }
            else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      //临时课程修改
      tempCourseUpdate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.prepare();

          this.tempCourse.courseJson = JSON.stringify(this.course);

          axios.put('/request/course/' + this.id, this.tempCourse).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '修改成功，请等待答复!';
              this.showModal = true;
              this.headerBgVariant = 'success';
              this.goToUrl = '/course/new/request?mode=faculty'
            }
            else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      tempCourseApprove() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.prepare();

          this.tempCourse.status = '1';
          this.tempCourse.courseJson = JSON.stringify(this.course);

          this.update(this.id, this.tempCourse)
        })

      },
      tempCourseDecline() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          if (isNotEmpty(this.course.comment)) {
            this.tempCourse.status = '-1';
            this.tempCourse.courseJson = JSON.stringify(this.course);
            this.update(this.id, this.tempCourse)
          } else {
            this.msg = '必须填写备注！';
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })

      },

      courseUpdate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.prepare();
          axios.put('/course/' + this.course.crn, this.course).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '更新成功！';
              this.showModal = true;
              this.headerBgVariant = 'success'
            }
            else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        })
      },

      update(id, tempCourse) {
        axios.put('/request/course/' + id, tempCourse).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.goToUrl = '/teach/request?mode=manage'
          }
          else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },
      documentUpload(key) {

        if (!isNotEmpty(document.getElementById('document').files[0])) {
          return;
        }

        let requestUrl = '/request/course/info/';
        let updateUrl = '/course/info/';

        let formData = new FormData();
        formData.append('file', document.getElementById('document').files[0]);

        let url;

        if (this.pageMode === 'manage') {
          url = updateUrl + this.course.crn;
        }
        else if (this.pageMode === 'create' || this.pageMode === 'request') {
          if (this.showUpload)
            url = requestUrl + this.id;
          else
            url = requestUrl + key
        }

        axios.put(url, formData).then((response) => {
          if (response.data.code === 2001) {
            this.showDocument = true;
            if (this.showUpload) {
              this.course.courseInfo = response.data.data;
              this.msg = response.data.msg;
              this.headerBgVariant = 'success';
              this.showModal = true;
            }
          } else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },

      documentDownload() {
        if (this.pageMode == 'create' || this.pageMode == 'request')//申请中的下载
          window.open(basePath + '/request/course/info/' + this.id + '?token=' + window.localStorage.getItem('access_token'));
        else {//查看下载
          window.open(basePath + '/course/info/' + this.course.crn + '?token=' + window.localStorage.getItem('access_token'))
        }
      },

      passFaculty(val) {
        this.faculty = val
      },
    }
  }


</script>
