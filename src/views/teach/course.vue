<template>
  <div class="animated fadeIn">

    <b-row v-show="pageMode === 'manage' && student">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
              <span style="cursor: pointer" data-toggle="collapse" data-parent="#accordion"
                    href="#collapseTwo" class="collapsed">课程中学生详情</span>
          </div>
          <div id="collapseTwo" class="panel-collapse in">
            <div class="panel-body">
              <div class="col-md-7 col-sm-4">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <table style="width: 100%" id="studentInCourse"
                           class="table table-striped table-bordered table-hover"></table>
                  </div>
                </div>
              </div>
              <form class="form-horizontal">
                <div class="col-md-5 col-sm-4">
                  <div class="panel panel-primary">
                    <div class="panel-heading">
                      学生成绩详情
                    </div>
                    <div class="panel-body">
                      <div class="form-group">
                        <div class="col-sm-3">
                          <label for="sid"
                                 class="col-sm-12 control-label">学生ID:</label>
                        </div>
                        <div class="col-sm-9">
                          <input id="sid" value="" :class="{'form-control': true, 'is-invalid': errors.has('name')}"
                                 v-model="transcript.studentId"
                                 disabled>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程CRN:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input :class="{'form-control': true, 'is-invalid': errors.has('name')}" required disabled
                                 v-model="transcript.crn"/>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程学分:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input id="credits2" :class="{'form-control': true, 'is-invalid': errors.has('name')}"
                                 required v-model="transcript.credits"
                                 disabled/>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*成绩:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input placeholder="可使用Letter Grade或百分制"
                                 id="grade"
                                 name="grade" value=""
                                 :class="{'form-control': true, 'is-invalid': errors.has('name')}" v-model="transcript.grade"
                                 minlength="1" required>
                        </div>

                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*完成情况:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <div class="radio3 radio-check radio-success radio-inline">
                            <input type="radio" id="complete" name="complete"
                                   value="1"
                                   v-model="transcript.complete">
                            <label for="complete">完成</label>
                          </div>
                          <div class="radio3 radio-check radio-success radio-inline">
                            <input type="radio" id="process" name="complete"
                                   value="0"
                                   v-model="transcript.complete">
                            <label for="process">正在进行</label>
                          </div>
                          <div class="radio3 radio-check radio-success radio-inline">
                            <input type="radio" id="nComplete" name="nComplete"
                                   value="-1"
                                   v-model="transcript.complete">
                            <label for="nComplete">未完成</label>
                          </div>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label for="tPassword"
                                 class="col-sm-12 control-label">*管理员操作密码:</label>
                        </div>
                        <div class="col-sm-6" style="margin-top:10px;">
                          <input type="password" id="tPassword"
                                 :class="{'form-control': true, 'is-invalid': errors.has('name')}" minlength="6"
                                 maxlength="16" checkOpPwd="true" required/>
                        </div>
                        <button class="btn btn-success col-sm-2"
                                style="margin-top:10px;" onclick="return false"
                                v-on:click="transcriptUpdate">更新
                        </button>
                        <button class="btn btn-danger col-sm-2" onclick="return false"
                                v-on:click="transcriptReset">
                          取消
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
                            <span style="cursor: pointer" data-toggle="collapse" data-parent="#accordion"
                                  href="#collapseThree" class="collapsed">添加学生</span>
          </div>
          <div id="collapseThree" class="panel-collapse in">
            <div class="panel-body">
              <div class="col-md-7 col-sm-4">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <table style="width:100%" id="studentTable"
                           class="table table-striped table-bordered table-hover"></table>
                  </div>
                </div>
              </div>
              <form class="form-horizontal">
                <div class="col-md-5 col-sm-4">
                  <div class="panel panel-primary">
                    <div class="panel-heading">
                      添加学生选项
                    </div>
                    <div class="panel-body">
                      <div class="form-group">
                        <div class="col-sm-3">
                          <label for="sid"
                                 class="col-sm-12 control-label">学生ID:</label>
                        </div>
                        <div class="col-sm-9">
                          <input :class="{'form-control': true, 'is-invalid': errors.has('name')}"
                                 v-model="addStudent.studentId"
                                 disabled>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程CRN:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input :class="{'form-control': true, 'is-invalid': errors.has('name')}" required disabled
                                 v-model="addStudent.crn"/>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程学分:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input :class="{'form-control': true, 'is-invalid': errors.has('name')}"
                                 required v-model="addStudent.credits"
                                 disabled/>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <div
                            class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                            <input type="checkbox" id="prereq" name="prereq"
                                   value="1"
                                   v-model="addStudent.option.prereq">
                            <label for="prereq">添加此学生，即使未完成预选课程</label>
                          </div>
                          <div
                            class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                            <input type="checkbox" id="time" name="time"
                                   v-model="addStudent.option.time"
                                   value="2">
                            <label for="time">添加此学生，即使有时间冲突</label>
                          </div>
                          <div
                            class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                            <input type="checkbox" id="capacity" name="type"
                                   v-model="addStudent.option.capacity"
                                   value="2">
                            <label for="capacity">添加此学生，即使已经达到课程人数上限</label>
                          </div>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label for="tPassword"
                                 class="col-sm-12 control-label">*管理员操作密码:</label>
                        </div>
                        <div class="col-sm-6" style="margin-top:10px;">
                          <input type="password"
                                 :class="{'form-control': true, 'is-invalid': errors.has('name')}" minlength="6"
                                 maxlength="16" checkOpPwd="true" required/>
                        </div>
                        <button class="btn btn-success col-sm-2"
                                style="margin-top:10px;" onclick="return false"
                                v-on:click="addStudent2Course">添加
                        </button>
                        <button class="btn btn-danger col-sm-2" onclick="return false"
                                v-on:click="addStudentReset">
                          取消
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </b-row>

    <b-row v-show="pageMode === 'manage' && table">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            搜索条件
          </div>
          <div class="panel-body">
            <div class="form-group">
              <div class="col-sm-2">
                <label class="col-sm-12 control-label">*按学期查询:</label>
              </div>
              <div class="col-sm-3">
                <select class="js-example-basic-single info col-sm-12"></select>
              </div>
              <div class="col-sm-2">
                <label class="col-sm-12 control-label">*按授课老师查询:</label>
              </div>
              <div class="col-sm-3">
                <select class="js-example-basic-single user col-sm-12"></select>
              </div>
              <div class="col-sm-2">
                <button class="btn btn-primary col-sm-12" onclick="refresh()">查询</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            课程列表
          </div>
          <div class="panel-body">
            <table class="table table-striped table-bordered table-hover" id="courseTable"></table>
          </div>
        </div>
      </div>
    </b-row>

    <b-row v-show="pageMode === 'request' || pageMode === 'create' || pageMode === 'view' || detail">
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'create' && id !== ''"
                      onclick="window.location.href=basePath + '/teach/request?mode=manage'">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'request' && id !== ''"
                      onclick="window.location.href=basePath + '/course/request?mode=faculty'">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'view' && url.indexOf('choose') === -1"
                      onclick="window.location.href=basePath + '/course/view'">
              <i class="fa fa-arrow-left"></i> 返回查询列表
            </b-button>
            <b-button class="btn btn-primary btn-info"
                      v-if="pageMode === 'manage'"
                      v-on:click="showTable">
              <i class="fa fa-arrow-left"></i> 返回列表
            </b-button>
            <b-button class="btn btn-primary btn-info"
                      v-if="url.indexOf('choose') !== -1"
                      onclick="window.location.href=basePath + '/course/choose'">
              <i class="fa fa-arrow-left"></i> 返回选课工作表
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                <div v-show="errors.has('name')" class="invalid-tooltip">{{ errors.first('name') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*课程等级:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input :class="{'form-control': true, 'is-invalid': errors.has('level')}" placeholder="请输入数字从100到400的数字"
                       v-validate="'required|numeric|min:3|max:3'"
                       v-model="course.level" name="level"
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                <div v-show="errors.has('capacity')" class="invalid-tooltip">{{ errors.first('capacity') }}</div>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">教室:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input :class="{'form-control': true, 'is-invalid': errors.has('classroom')}" name="classroom"
                       v-validate="'max:20'"
                       v-model="course.classroom"
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                <div v-show="errors.has('enddate')" class="invalid-tooltip">{{ errors.first('enddate') }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label for="starttime"
                       class="col-sm-12 control-label">*开始时间:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <input id="starttime" :class="{'form-control': true, 'is-invalid': errors.has('startTime')}" name="startTime"
                       v-model="course.startTime" v-validate="'required'"
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
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
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                    <label class="custom-control-label" for="m">星期一</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="t" id="t" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                    <label class="custom-control-label" for="t">星期二</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="w" id="w" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                    <label class="custom-control-label" for="w">星期三</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="tr" id="tr" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                    <label class="custom-control-label" for="tr">星期四</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="f" id="f" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                    <label class="custom-control-label" for="f">星期五</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="sa" id="sa" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                    <label class="custom-control-label" for="sa">星期六</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" value="s" id="s" class="custom-control-input"
                           name="day" v-model="courseDay"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
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

              <div class="form-group"
                   v-if="pageMode === 'create' || pageMode === 'manage' || pageMode === 'view'">
                <b-col md="2" class="my-1">
                  <label for="starttime"
                         class="col-sm-12 control-label">*分配教师:</label>
                </b-col>
                <b-col md="8" class="my-1">
                  <v-select :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                  </v-select>
                </b-col>
              </div>

              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">预修课程（可多选，可不选）:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <v-select :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
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
                       :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
              </b-col>
              <b-col md="2" class="my-1" v-if="showDocument">
                <label class="col-sm-12 control-label">课程大纲:</label>
              </b-col>
              <b-col md="6" class="my-1" v-if="showDocument">
                <div class="col-sm-4" style="margin-top: 10px;">
                  下载文件： <a onclick="documentDownload()" style="cursor: pointer;"
                           class="control-label">{{course.courseInfo.name}}</a>
                </div>
                <div class="col-sm-2">
                  <button style="width: 100%" class="btn btn-primary btn-danger"
                          v-on:click="showDocument = false"
                          v-if="pageMode !== 'view'">
                    替换
                  </button>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">备注信息:</label>
              </b-col>
              <b-col md="10" class="my-1">
                 <textarea style="resize: none;" :class="{'form-control': true, 'is-invalid': errors.has('name')}" rows="3" v-model="course.comment"
                           :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">

                 </textarea>
              </b-col>
              <b-col md="2" class="my-1">
                <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
              </b-col>
              <b-col md="3" class="my-1">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="checkbox" id="yes" class="custom-control-input"
                         name="confirm" v-model="confirm"
                         :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                  <label class="custom-control-label" for="yes">确认</label>
                </div>
              </b-col>
              <div v-if="pageMode === 'create' || pageMode === 'manage'">
                <b-col md="2" class="my-1">
                  <label class="col-sm-12 control-label">*管理员操作密码:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input type="password"
                         :class="{'form-control': true, 'is-invalid': errors.has('name')}" minlength="6"
                         maxlength="16" checkOpPwd="true"
                         :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"
                         required/>
                </b-col>
              </div>
              <b-col md="2" class="my-1">
                <b-button style="width:150px;" class="btn btn-primary"
                          v-if="pageMode === 'create' && id === ''"
                          v-on:click="courseCreate"
                          onclick="return false;">创建课程
                </b-button>
                <b-button style="width:150px;" class="btn btn-success"
                          v-if="pageMode === 'manage' && id === ''"
                          v-on:click="courseUpdate"
                          onclick="return false;">修改课程
                </b-button>
                <b-button style="width:150px;" class="btn btn-success"
                          v-if="pageMode === 'create' && id !== ''"
                          v-on:click="tempCourseApprove"
                          :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"
                          onclick="return false;">批准申请
                </b-button>
                <b-button style="width:150px;" class="btn btn-danger"
                          v-if="pageMode === 'create' && id !== ''"
                          v-on:click="tempCourseDecline"
                          :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"
                          onclick="return false;">拒绝申请
                </b-button>
                <b-button style="margin-left: 32%; width:150px;" class="btn btn-primary"
                          v-if="pageMode === 'request' && id === ''"
                          v-on:click="tempCourseCreate"
                          onclick="return false;">提交申请
                </b-button>
                <b-button style="margin-left: 32%; width:150px;" class="btn btn-danger"
                          v-if="pageMode === 'request' && id !== '' && tempCourse.status === '0'"
                          v-on:click="tempCourseUpdate"
                          onclick="return false;">修改申请
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'crn', label: '编号', sortable: true},
    {key: 'name', label: '课程名', sortable: true, 'class': 'text-center'},
    {key: 'capacity', label: '容量', sortable: true},
    {key: 'remain', label: '剩余', sortable: true},
    {key: 'status', label: '状态', sortable: true},
    {key: 'date', label: '起止时间', sortable: true},
    {key: 'time', label: '上课时间', sortable: true},
    {key: 'day', label: '星期', sortable: true},
    {key: 'faculty', label: '授课老师', sortable: true},
    {key: 'actions', label: '查看详情'}
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
        preList: [],
        table: true,
        detail: false,
        showDocument: false,
        student: false,
        confirm: false,
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        id: this.$route.fullPath.split('&')[1].split('=')[1],//maybe CRN
        url: this.$route.fullPath,
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        infoOptions: [],
        facultyOptions: [],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        info: '',
        faculty: '',
      }
    },
    mounted () {
      console.log(this.$route.fullPath)
      axios.get('/course/info?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i],
            value: response.data.data[i]
          }
          this.infoOptions.push(item)
        }
      })
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

      if (isNotEmpty(this.id)) {
        if (this.pageMode !== 'view')
          this.initRequest(this.id)
        else
          this.showCourseDetail(this.id)
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
      initRequest (id) {
        if (isNotEmpty(id)) {
          axios.get('/request/course/' + id).then((response) => {
            this.tempCourse = response.data.data
            this.course = JSON.parse(response.data.data.courseJson)
            this.course.facultyId = response.data.data.facultyId
            this.initCourse()
          })
        }
      },

      initCourse () {
        this.courseDay = this.course.day.split('/')
        this.preList = this.course.precrn.split('/')

        if (isNotEmpty(this.course.courseInfo)) {
          this.course.courseInfo = JSON.parse(this.course.courseInfo)
          this.showDocument = true
        }

//        let preListOption = [];
//        for (let i = 0; i < this.preList.length; i++)
//          if (this.preList[i] !== "")
//            preListOption.push(new Option(this.preList[i], this.preList[i], true, true));
//        courseSelect.append(preListOption);
//        courseSelect.trigger('change');
//
//        let facultyId = this.course.facultyId;
//        userSelect.append(new Option(facultyId, facultyId, true, true));
//        courseSelect.trigger('change');

      },

      showCourseDetail (crn) {
        if (isNotEmpty(crn)) {
          axios.get('/course/' + crn).then(function (response) {
            this.course = response.data.data
            initCourse()
            this.table = false
            this.detail = true
          })
        }
      },

      showStudentDetail (crn, credits) {
        this.transcript.crn = crn
        this.transcript.credits = credits
        this.table = false
        this.detail = false
        this.student = true
//        studentInCourse.draw()
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
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.courseTable.refresh()
      },
      courseTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy + '&mode=student'
        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
        if (this.isNotEmpty(this.faculty))
          url += '&facultyId=' + this.faculty.value
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
        this.preList = $('.course').val()

        if (isNotEmpty(this.courseDay))
          for (let i = 0; i < this.courseDay.length; i++)
            if (isNotEmpty(this.courseDay[i]))
              day += this.courseDay[i] + '/'

        if (isNotEmpty(this.preList))
          for (let i = 0; i < this.preList.length; i++)
            if (isNotEmpty(this.preList[i]))
              precrn += this.preList[i] + '/'

        this.course.day = day
        this.course.precrn = precrn
        this.course.facultyId = $('.user').val()

        if (isNotEmpty(this.course.courseInfo))
          this.course.courseInfo = JSON.stringify(this.course.courseInfo)
      },
      showTable () {
        this.table = true
        this.detail = false
        this.student = false
      },
      tempCourseCreate () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;
          if (!this.confirm) {
            Showbo.Msg.alert('请确认上述信息无误!', function () {
            })
            return
          }
          this.prepare()

          axios.post('/request/course/register', this.course).then((response) => {
            if (response.data.code === 2001) {
              let id = response.data.data.id
              Showbo.Msg.alert('申请成功，等待教务答复!', function () {
                documentUpload(id)
                window.location.href = basePath + '/course/request?mode=faculty'
              })
            }
            else
              Showbo.Msg.alert(response.data.msg, function () {
              })
          })
        })
      },

      tempCourseUpdate () {
        if (!this.confirm) {
          Showbo.Msg.alert('请确认上述信息无误!', function () {
          })
          return
        }

        this.prepare()

        this.tempCourse.courseJson = JSON.stringify(this.course)

        axios.put('/request/course/' + this.id, this.tempCourse).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert('修改成功，等待教务答复!', function () {
              documentUpload()
              window.location.href = basePath + '/course/request?mode=faculty'
            })
          else
            Showbo.Msg.alert(response.data.msg, function () {
            })
        })
      },
      tempCourseApprove () {
        if (!this.confirm) {
          Showbo.Msg.alert('请确认上述信息无误!', function () {
          })
          return
        }

        this.prepare()

        this.tempCourse.status = '1'
        this.tempCourse.courseJson = JSON.stringify(this.course)

        if (!this.showDocument)
          documentUpload(this.id)
        update(this.id, this.tempCourse)

      },
      tempCourseDecline () {
        if (!this.confirm) {
          Showbo.Msg.alert('请确认上述信息无误!', function () {
          })
          return
        }

        if (isNotEmpty(this.course.comment)) {
          this.tempCourse.status = '-1'
          this.tempCourse.courseJson = JSON.stringify(this.course)
          update(this.id, this.tempCourse)
        } else
          Showbo.Msg.alert('必须填写备注！', function () {
          })

      },
      courseCreate () {
        if (!this.confirm) {
          Showbo.Msg.alert('请确认上述信息无误!', function () {
          })
          return
        }

        this.prepare()

        axios.post('/course', this.course).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert('创建成功!', function () {
              this.course = response.data.data
              documentUpload(response.data.data.course.crn)
              window.location.href = basePath + '/teach/course?mode=manage&id='
            })
          else
            Showbo.Msg.alert(response.data.msg, function () {
            })
        })
      },
      courseUpdate () {
        if (!this.confirm) {
          Showbo.Msg.alert('请确认上述信息无误!', function () {
          })
          return
        }

        this.prepare()
        axios.put('/course/' + this.course.crn, this.course).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert('修改成功!', function () {
              documentUpload()
              window.location.reload()
            })
          else
            Showbo.Msg.alert(response.data.msg, function () {
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
          else
            Showbo.Msg.alert(response.data.msg, function () {
            })
        })
      },
      addStudent2Course () {
        axios.put('/course/' + this.addStudent.crn + '/student/' + this.addStudent.studentId, this.addStudent.option).then(function (response) {
          if (response.data.code === 2001) {
            Showbo.Msg.alert('添加成功!', function () {
              studentInCourse.draw()
            })
          } else {
            Showbo.Msg.alert(response.data.msg, function () {
            })
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
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.href = '/teach/request?mode=manage'
            })
          else
            Showbo.Msg.alert(response.data.msg, function () {
            })
        })
      },
      deleteCourse (crn) {
        Showbo.Msg.confirm('确认删除该课程？', function () {
          if ($('.btnfocus').val() !== '取消') {
            axios.delete('/course/' + crn).then(function (response) {
              if (response.data.code === 2001)
                Showbo.Msg.alert('删除成功!', function () {
                  courseTable.draw()
                })
              else
                Showbo.Msg.alert(response.data.msg, function () {
                })
            })
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
            Showbo.Msg.alert(response.data.msg, function () {
            })
          }
        })
      },

      documentDownload () {
        if (isNotEmpty(this.id))//申请中的下载
          window.open(basePath + '/request/course/info/' + this.id)
        else {//查看下载
          window.open(basePath + '/course/info/' + this.course.crn)
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
                Showbo.Msg.alert(response.data.msg, function () {
                })
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
