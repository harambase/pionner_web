<template>
  <div class="animated fadeIn">

    <b-row v-show="pageMode === 'student'">
      <b-button class="btn btn-primary btn-info"
                @click="showTable">
        <i class="fa fa-arrow-left"></i> 返回列表
      </b-button>
      <b-col cols="12">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>课程中学生详情</strong>
          </div>
          <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>学生列表</strong>
              </div>
              <b-container fluid>
                <!-- User Interface controls -->
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="每页显示条数：" class="mb-0">
                      <b-form-select :options="pageOptions" v-model="perPage"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="模糊查询：" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter"/>
                        <b-input-group-button>
                          <b-button :disabled="!filter" @click="filter = ''">重置</b-button>
                        </b-input-group-button>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>

                <!-- Main table element -->
                <b-table show-empty
                         stacked="md"
                         ref="studentInCourseTable"
                         :striped=true
                         :fixed=true
                         :hover=true
                         :items="studentInCourseTable"
                         :fields="studentInCourseField"
                         :current-page="currentPage"
                         :per-page="perPage"
                         :filter="filter"
                         :sort-by.sync="sortBy"
                         :sort-desc.sync="sortDesc"
                         :isBusy="false"
                         @filtered="onFiltered"
                >
                  <template slot="complete" slot-scope="row">
                    <p v-if="row.value === 1" style="color:green;">完成</p>
                    <p v-if="row.value === 0" style="color:blue;">进行中</p>
                    <p v-if="row.value === -1" style="color:red;">挂科</p>
                  </template>
                  <template slot="actions" slot-scope="row">
                    <b-button size="sm" class="btn btn-danger" @click.stop="removeStuFromCourse(row.item.userId)">
                     移除该学生
                    </b-button>
                  </template>

                </b-table>
                <b-col md="6" class="my-1">
                  <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                                class="my-0"/>
                </b-col>
              </b-container>
            </b-card>
        </b-card>
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>添加学生</strong>
          </div>
        </b-card>
        <!---->
        <!--<div class="panel panel-default">-->
          <!--<div class="panel-heading">-->
                            <!--<span style="cursor: pointer" data-toggle="collapse" data-parent="#accordion"-->
                                  <!--href="#collapseThree" class="collapsed">添加学生</span>-->
          <!--</div>-->
          <!--<div id="collapseThree" class="panel-collapse in">-->
            <!--<div class="panel-body">-->
              <!--<div class="col-md-7 col-sm-4">-->
                <!--<div class="panel panel-default">-->
                  <!--<div class="panel-body">-->
                    <!--<table style="width:100%" id="studentTable"-->
                           <!--class="table table-striped table-bordered table-hover"></table>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<form class="form-horizontal">-->
                <!--<div class="col-md-5 col-sm-4">-->
                  <!--<div class="panel panel-primary">-->
                    <!--<div class="panel-heading">-->
                      <!--添加学生选项-->
                    <!--</div>-->
                    <!--<div class="panel-body">-->
                      <!--<div class="form-group">-->
                        <!--<div class="col-sm-3">-->
                          <!--<label for="sid"-->
                                 <!--class="col-sm-12 control-label">学生ID:</label>-->
                        <!--</div>-->
                        <!--<div class="col-sm-9">-->
                          <!--<input :class="{'form-control': true, 'is-invalid': errors.has('name')}"-->
                                 <!--v-model="addStudent.studentId"-->
                                 <!--disabled>-->
                        <!--</div>-->
                        <!--<div class="col-sm-3" style="margin-top:10px;">-->
                          <!--<label class="col-sm-12 control-label">*课程CRN:</label>-->
                        <!--</div>-->
                        <!--<div class="col-sm-9" style="margin-top:10px;">-->
                          <!--<input :class="{'form-control': true, 'is-invalid': errors.has('name')}" required disabled-->
                                 <!--v-model="addStudent.crn"/>-->
                        <!--</div>-->
                        <!--<div class="col-sm-3" style="margin-top:10px;">-->
                          <!--<label class="col-sm-12 control-label">*课程学分:</label>-->
                        <!--</div>-->
                        <!--<div class="col-sm-9" style="margin-top:10px;">-->
                          <!--<input :class="{'form-control': true, 'is-invalid': errors.has('name')}"-->
                                 <!--required v-model="addStudent.credits"-->
                                 <!--disabled/>-->
                        <!--</div>-->
                        <!--<div class="col-sm-9" style="margin-top:10px;">-->
                          <!--<div-->
                            <!--class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">-->
                            <!--<input type="checkbox" id="prereq" name="prereq"-->
                                   <!--value="1"-->
                                   <!--v-model="addStudent.option.prereq">-->
                            <!--<label for="prereq">添加此学生，即使未完成预选课程</label>-->
                          <!--</div>-->
                          <!--<div-->
                            <!--class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">-->
                            <!--<input type="checkbox" id="time" name="time"-->
                                   <!--v-model="addStudent.option.time"-->
                                   <!--value="2">-->
                            <!--<label for="time">添加此学生，即使有时间冲突</label>-->
                          <!--</div>-->
                          <!--<div-->
                            <!--class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">-->
                            <!--<input type="checkbox" id="capacity" name="type"-->
                                   <!--v-model="addStudent.option.capacity"-->
                                   <!--value="2">-->
                            <!--<label for="capacity">添加此学生，即使已经达到课程人数上限</label>-->
                          <!--</div>-->
                        <!--</div>-->
                        <!--<div class="col-sm-3" style="margin-top:10px;">-->
                          <!--<label for="tPassword"-->
                                 <!--class="col-sm-12 control-label">*管理员操作密码:</label>-->
                        <!--</div>-->
                        <!--<div class="col-sm-6" style="margin-top:10px;">-->
                          <!--<input type="password"-->
                                 <!--:class="{'form-control': true, 'is-invalid': errors.has('name')}" minlength="6"-->
                                 <!--maxlength="16" checkOpPwd="true" required/>-->
                        <!--</div>-->
                        <!--<button class="btn btn-success col-sm-2"-->
                                <!--style="margin-top:10px;" onclick="return false"-->
                                <!--@click="addStudent2Course">添加-->
                        <!--</button>-->
                        <!--<button class="btn btn-danger col-sm-2" onclick="return false"-->
                                <!--@click="addStudentReset">-->
                          <!--取消-->
                        <!--</button>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</form>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      </b-col>
    </b-row>

    <b-row v-show="pageMode === 'request' || pageMode === 'create' || pageMode === 'manage'">
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
                <input :class="{'form-control': true, 'is-invalid': errors.has('info')}" v-model="course.info"
                       v-validate="'required'" name="info"
                       :disabled="tempCourse.status!=='0'"/>
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
                <label class="col-sm-12 control-label">*课程等级:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input :class="{'form-control': true, 'is-invalid': errors.has('level')}" placeholder="请输入数字从100到400的数字"
                       v-validate="'required|numeric|min:3|max:3'"
                       v-model="course.level" name="level"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('level')" class="invalid-tooltip">{{ errors.first('level') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*课程班级:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input :class="{'form-control': true, 'is-invalid': errors.has('section')}" name="section"
                       placeholder="请输入数字（例如：01,02,03...）"
                       v-validate="'required|numeric|min:2|max:2'"
                       v-model="course.section"
                       :disabled="tempCourse.status!=='0'"/>
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
                <label class="col-sm-12 control-label">*课程容量:</label>
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
                <label for="startdate"
                       class="col-sm-12 control-label">*开始日期:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input id="startdate" :class="{'form-control': true, 'is-invalid': errors.has('startdate')}"
                       v-validate="'required'" v-model="course.startDate" name="startdate"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('startdate')" class="invalid-tooltip">{{ errors.first('startdate') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label for="enddate"
                       class="col-sm-12 control-label">*结束日期:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input id="enddate" :class="{'form-control': true, 'is-invalid': errors.has('enddate')}"
                       v-validate="'required'" name="enddate"
                       v-model="course.endDate"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('enddate')" class="invalid-tooltip">{{ errors.first('enddate') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label for="starttime"
                       class="col-sm-12 control-label">*开始时间:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input id="starttime" :class="{'form-control': true, 'is-invalid': errors.has('startTime')}"
                       name="startTime"
                       v-model="course.startTime" v-validate="'required'"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('startTime')" class="invalid-tooltip">{{ errors.first('startTime') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label for="endtime"
                       class="col-sm-12 control-label">*结束时间:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input id="endtime" :class="{'form-control': true, 'is-invalid': errors.has('endTime')}"
                       v-validate="'required'" name="endTime"
                       v-model="course.endTime"
                       :disabled="tempCourse.status!=='0'"/>
                <div v-show="errors.has('endTime')" class="invalid-tooltip">{{ errors.first('endTime') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*选择上课日:</label>
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
              <b-col md="3" class="my-1">
                <label class="col-sm-12 control-label">*分配教师:</label>
              </b-col>
              <b-col md="6" class="my-1">
                <v-select name="faculty" v-validate="'required'"
                          v-model="faculty" :filterable="false" :options="facultyOptions"
                          :disabled="tempCourse.status!=='0'"
                          :class="{'is-invalid': errors.has('faculty')}"
                          @search="facultyList"></v-select>
                <div v-show="errors.has('faculty')" class="invalid-tooltip">{{ errors.first('faculty') }}</div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="3" class="my-1">
                <label class="col-sm-12 control-label">预修课程（可多选，可不选）:</label>
              </b-col>
              <b-col md="6" class="my-1">
                <v-select v-model="preList" :filterable="false" :options="courseOptions"
                          @search="preCourseList" multiple
                          :disabled="tempCourse.status!=='0'">
                </v-select>
              </b-col>
            </b-row>
          </b-card>
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>更多信息</strong>
            </div>
            <b-row>
              <b-col md="2" class="my-1" v-if="!showDocument">
                <label class="col-sm-12 control-label">上传课程大纲:</label>
              </b-col>
              <b-col md="6" class="my-1" v-if="!showDocument">
                <input type="file" id="document"
                       :disabled="tempCourse.status!=='0'">
              </b-col>
              <b-col md="2" class="my-1" v-if="!showDocument && isNotEmpty(course.courseInfo)">
                <b-button style="width: 100%" class="btn btn-success"
                          @click="showDocument = true">
                  取消替换
                </b-button>
              </b-col>
              <b-col md="2" class="my-1" v-if="showDocument">
                <label class="col-sm-12 control-label">课程大纲:</label>
              </b-col>
              <b-col md="6" class="my-1" v-if="showDocument">
                <b-row>
                  <b-col md="6">
                    <a href="#" @click="documentDownload">{{course.courseInfo.name}}</a>
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
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="yes"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                         name="confirm" v-model="confirm"
                         :disabled="tempCourse.status!=='0'">
                  <label class="custom-control-label" for="yes">确认</label>
                  <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                </div>
              </b-col>

              <b-col md="2" class="my-1" v-show="pageMode === 'manage' || pageMode === 'create'">
                <label class="col-sm-12 control-label">*管理员操作密码:</label>
              </b-col>
              <b-col md="3" class="my-1" v-show="pageMode === 'manage' || pageMode === 'create'">
                <input type="password" v-validate="'required'" name="adminPwd"
                       :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"
                       :disabled="tempCourse.status!=='0'"/>
              </b-col>

              <b-col md="2" class="my-1">
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
                <b-button style="margin-left: 32%; width:150px;" class="btn btn-primary"
                          v-if="pageMode === 'request' && id === ''"
                          @click="tempCourseCreate">提交申请
                </b-button>
                <b-button style="margin-left: 32%; width:150px;" class="btn btn-danger"
                          v-if="pageMode === 'request' && id !== '' && tempCourse.status === '0'"
                          @click="tempCourseUpdate">修改申请
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="showModal" size="sm"
             :header-bg-variant="headerBgVariant"
             @ok="goTo"
             ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'

  const studentItems = []
  const studentField = [
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '姓名', sortable: true},
    {key: 'maxCredits', label: '学分上限', sortable: true},
    {key: 'complete', label: '已完成', sortable: true},
    {key: 'progress', label: '进行中', sortable: true},
    {key: 'incomplete', label: '未完成', sortable: true},
    {key: 'actions', label: '操作', sortable: true}
  ]
  const studentInCourseFieldItems = []
  const studentInCourseField = [
    {key: 'id', label: '序号', sortable: true},
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '学生名', sortable: true},
    {key: 'grade', label: '学生成绩', sortable: true},
    {key: 'complete', label: '完成情况', sortable: true}
  ]

  export default {
    name: 'ViewCourse',
    data () {
      return {
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
        transcript: {
          id: '',
          studentId: '',
          grade: '',
          crn: '',
          complete: '',
          credits: ''
        },
        addStudent: {
          crn: '',
          studentId: '',
          credits: '',
          option: {
            prereq: false,
            time: false,
            capacity: false,
          },
        },
        courseDay: [],
        showDocument: false,
        confirm: false,
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        id: this.$route.fullPath.split('&')[1].split('=')[1],//maybe CRN
        url: this.$route.fullPath,
        studentInCourseField: studentInCourseField,
        studentField: studentField,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        infoOptions: [],
        facultyOptions: [],
        courseOptions: [],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        studentItems: studentItems,
        studentInCourseFieldItems: studentInCourseFieldItems,
        isBusy: false,
        msg: '',
        showModal: false,
        headerBgVariant: '',
        info: '',
        faculty: '',
        preList: '',
        goToUrl: '',
      }
    },
    mounted () {
      console.log(this.pageMode)
      //学期信息
      axios.get('/course/info?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i],
            value: response.data.data[i]
          }
          this.infoOptions.push(item)
        }
      })
      //教师
      axios.get('/user/search?status=1&type=f&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let item = {
            label: name,
            value: response.data.data[i].userId
          }
          this.facultyOptions.push(item)
        }
      })
      //课程
      axios.get('/course/search').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i].name,
            value: response.data.data[i].crn
          }
          this.courseOptions.push(item)
        }
      })

      if (isNotEmpty(this.id)) {
        switch (this.pageMode) {
          case 'manage':
            this.showCourseDetail(this.id)
            break
          case 'student':
            this.showStudentDetail(this.id)
            break
          default:
            this.initRequest(this.id)
            break
        }
      }

      //执行一个laydate实例
      laydate.render({
        elem: '#startdate',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.course.startDate = value
        }
      })
      laydate.render({
        elem: '#enddate',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.course.endDate = value
        }
      })
      laydate.render({
        elem: '#starttime',
        theme: '#393D49',
        type: 'time',
        min: '06:00:00',
        max: '22:00:00',
        showBottom: ['clear', 'confirm'],
        done: (value) => {
          this.course.startTime = value
        }
      })
      laydate.render({
        elem: '#endtime',
        theme: '#393D49',
        type: 'time',
        min: '06:00:00',
        max: '22:00:00',
        showBottom: ['clear', 'confirm'],
        done: (value) => {
          this.course.endTime = value
        }
      })
    },
    computed: {
      sortOptions () {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      }
    },
    methods: {
      goTo () {
        if (isNotEmpty(this.goToUrl)) {
          this.$router.push({path: this.goToUrl})
        }
      },
      backToTempCourseTable () {
        if (this.pageMode === 'create') {
          this.$router.push({path: '/teach/request?mode=manage'})
        } else {
          this.$router.push({path: '/course/new/request?mode=faculty'})
        }
      },
      initRequest (id) {
        if (isNotEmpty(id)) {
          axios.get('/request/course/' + id).then((response) => {
            this.tempCourse = response.data.data
            this.course = JSON.parse(response.data.data.courseJson)
            this.course.facultyId = response.data.data.facultyId
            this.initCourseExtend()
          })
        }
      },
      initCourseExtend () {
        let preList = this.course.precrn.split('/')
        this.courseDay = this.course.day.split('/')

        if (isNotEmpty(this.course.courseInfo)) {
          this.course.courseInfo = JSON.parse(this.course.courseInfo)
          this.showDocument = true
        }

        for (let i = 0; i < preList.length; i++) {
          if (isNotEmpty(preList[i])) {
            axios.get('/course/' + preList[i]).then((response) => {
              this.preList = []
              this.preList.push({
                label: response.data.data.name,
                value: response.data.data.crn
              })
            })
          }
        }

        axios.get('/user/' + this.course.facultyId).then((response) => {
          let name = response.data.data.lastName + ', ' + response.data.data.firstName
          this.faculty = {
            label: name,
            value: response.data.data.userId
          }
        })
        this.facultyId = this.course.facultyId
      },

      showCourseDetail (crn) {
        if (isNotEmpty(crn)) {
          axios.get('/course/' + crn).then((response) => {
            this.course = response.data.data
            this.initCourseExtend()
          })
        }
      },

      showStudentDetail (crn, credits) {
        this.transcript.crn = crn
        this.transcript.credits = credits
        this.initStudentTable();
      },

      infoList (search, loading) {
        loading(true)
        this.infoOptions = []
        axios.get('/course/info?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i],
              value: response.data.data[i]
            }
            this.infoOptions.push(item)
          }
        })
        loading(false)
      },
      facultyList (search, loading) {
        loading(true)
        this.facultyOptions = []
        axios.get('/user/search?status=1&type=f&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let item = {
              label: name,
              value: response.data.data[i].userId
            }
            this.facultyOptions.push(item)

          }
        })
        loading(false)
      },
      preCourseList (search, loading) {
        loading(true)
        this.courseOptions = []
        axios.get('/course/search?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i].name,
              value: response.data.data[i].crn
            }
            this.courseOptions.push(item)
          }
        })
        loading(false)
      },

      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initStudentTable () {
        this.$refs.studentInCourseTable.refresh()
      },
      studentInCourseTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/transcript/course/student?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.transcript.crn))
          url += '&crn=' + this.transcript.crn
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        return axios.get(url).then((response) => {
          let items = response.data.data
          this.totalRows = response.data.recordsTotal
          return (items || [])
        })

      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },

      prepare () {
        let day = '', precrn = ''

        if (isNotEmpty(this.courseDay))
          for (let i = 0; i < this.courseDay.length; i++)
            if (isNotEmpty(this.courseDay[i]))
              day += this.courseDay[i] + '/'

        if (isNotEmpty(this.preList))
          for (let i = 0; i < this.preList.length; i++)
            if (isNotEmpty(this.preList[i]))
              precrn += this.preList[i].value + '/'

        this.course.day = day
        this.course.precrn = precrn

        if (this.pageMode === 'request' && this.id === '') {
          this.course.facultyId = ''
        }
        else {
          this.course.facultyId = this.faculty.value
        }

        if (isNotEmpty(this.course.courseInfo))
          this.course.courseInfo = JSON.stringify(this.course.courseInfo)
      },
      showTable () {
        this.$router.push({path: '/teach/curriculum?mode=manage'})
      },

      //临时课程创建
      tempCourseCreate () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          this.prepare()

          axios.post('/request/course/register', this.course).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '申请成功，等待教务答复!'
              this.showModal = true
              this.headerBgVariant = 'success'
              let id = response.data.data.id
              this.documentUpload(id)
              this.goToUrl = '/course/request?mode=faculty'
            }
            else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      //临时课程修改
      tempCourseUpdate () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          this.prepare()

          this.tempCourse.courseJson = JSON.stringify(this.course)

          axios.put('/request/course/' + this.id, this.tempCourse).then((response) => {
            if (response.data.code === 2001) {
              this.documentUpload(this.id)
              this.msg = '修改成功，请等待答复!'
              this.showModal = true
              this.headerBgVariant = 'success'
              this.goToUrl = '/course/new/request?mode=faculty'
            }
            else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      tempCourseApprove () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          this.prepare()

          this.tempCourse.status = '1'
          this.tempCourse.courseJson = JSON.stringify(this.course)

          if (!this.showDocument)
            this.documentUpload(this.id)
          this.update(this.id, this.tempCourse)
        })

      },
      tempCourseDecline () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          if (isNotEmpty(this.course.comment)) {
            this.tempCourse.status = '-1'
            this.tempCourse.courseJson = JSON.stringify(this.course)
            this.update(this.id, this.tempCourse)
          } else {
            this.msg = '必须填写备注！'
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })

      },

      courseUpdate () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          this.prepare()
          axios.put('/course/' + this.course.crn, this.course).then((response) => {
            if (response.data.code === 2001)
              Showbo.Msg.alert('修改成功!', function () {
                documentUpload()
                window.location.reload()
              })
            else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      transcriptReset () {
        this.transcript.complete = ''
        this.transcript.studentId = ''
        this.transcript.grade = ''
      },
      transcriptUpdate () {
        axios.put('/transcript/' + this.transcript.id, this.transcript).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              studentInCourse.draw()
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      addStudent2Course () {
        axios.put('/course/' + this.addStudent.crn + '/student/' + this.addStudent.studentId, this.addStudent.option).then(function (response) {
          if (response.data.code === 2001) {
            Showbo.Msg.alert('添加成功!', function () {
              studentInCourse.draw()
            })
          } else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      addStudentReset () {
        this.addStudent.studentId = ''
        this.addStudent.option.capacity = false
        this.addStudent.option.prereq = false
        this.addStudent.option.time = false
      },

      update (id, tempCourse) {
        axios.put('/request/course/' + id, tempCourse).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'success'
            this.goToUrl = '/teach/request?mode=manage'
          }
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      documentUpload (key) {
        if (this.showDocument)
          return

        if (!isNotEmpty(document.getElementById('document').files))
          return

        let requestUrl = '/request/course/info/'
        let updateUrl = '/course/info/'
        let formData = new FormData()

        formData.append('file', document.getElementById('document').files[0])
        let url

        if (this.url.indexOf('course') !== -1 && this.pageMode !== 'manage') {
          if (isNotEmpty(key))
            url = requestUrl + key
          else
            url = requestUrl + this.id
        } else {
          if (isNotEmpty(key))
            url = updateUrl + key
          else
            url = updateUrl + this.course.crn
        }

        axios.put(url, formData).then((response) => {
          if (response.data.code === 2001) {
            this.course.courseInfo = response.data.data
            this.showDocument = true
          } else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },

      documentDownload () {
        if (isNotEmpty(this.id))//申请中的下载
          window.open(basePath + '/request/course/info/' + this.id + '?token=' + window.localStorage.getItem('access_token'))
        else {//查看下载
          window.open(basePath + '/course/info/' + this.course.crn + '?token=' + window.localStorage.getItem('access_token'))
        }
      },

      removeStuFromCourse (studentId, crn) {
        Showbo.Msg.confirm('确认从课程中删除该学生？', function () {
          if ($('.btnfocus').val() !== '取消') {
            axios.delete('/course/' + crn + '/student/' + studentId).then(function (response) {
              if (response.data.code === 2001) {
                Showbo.Msg.alert('删除成功!', function () {
                  studentInCourse.draw()
                })
              } else {
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              }
            })
          }
        })
      },

      showAddStudentToCourse (studentId) {
        this.addStudent.studentId = studentId
        this.addStudent.crn = this.transcript.crn
        this.addStudent.credits = this.transcript.credits
      },

      showTranscript (id, studentId, grade, complete) {
        this.transcript.id = id
        this.transcript.studentId = studentId
        this.transcript.grade = grade
        this.transcript.complete = complete
      },
    }
  }


</script>
