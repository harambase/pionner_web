<template>
  <div class="animated fadeIn">
    <div class="row" v-show="pageMode === 'manage' && student">
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
                          <input id="sid" value="" class="form-control"
                                 v-model="transcript.studentId"
                                 disabled>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程CRN:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input class="form-control" required disabled
                                 v-model="transcript.crn"/>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程学分:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input id="credits2" class="form-control"
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
                                 class="form-control" v-model="transcript.grade"
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
                                 class="form-control" minlength="6"
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
                          <input class="form-control"
                                 v-model="addStudent.studentId"
                                 disabled>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程CRN:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input class="form-control" required disabled
                                 v-model="addStudent.crn"/>
                        </div>
                        <div class="col-sm-3" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*课程学分:</label>
                        </div>
                        <div class="col-sm-9" style="margin-top:10px;">
                          <input class="form-control"
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
                                 class="form-control" minlength="6"
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
    </div>

    <b-row v-show="pageMode === 'manage' && table">
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>课程查询</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="5" class="my-1">
                <b-form-group horizontal label="按学期查询：" class="mb-0">
                  <v-select v-model="info" :filterable="false" :options="infoOptions"
                            @search="infoList"></v-select>
                </b-form-group>
              </b-col>
              <b-col md="5" class="my-1">
                <b-form-group horizontal label="按授课老师查询：" class="mb-0">
                  <v-select v-model="faculty" :filterable="false" :options="facultyOptions"
                            @search="facultyList"></v-select>
                </b-form-group>
              </b-col>
              <b-col md="2" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="initTable">详细搜索</b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>课程列表</strong>
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
                     ref="courseTable"
                     :striped=true
                     :fixed=true
                     :hover=true
                     :items="courseTable"
                     :fields="field"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     :isBusy="false"
                     @filtered="onFiltered"
            >
              <template slot="status" slot-scope="row">
                <p v-if="row.value === 1" style="color:blue;">未开始</p>
                <p v-if="row.value === 0" style="color:green;">进行中</p>
                <p v-if="row.value === -1" style="color:red;">已结课</p>
              </template>
              <template slot="actions" slot-scope="row">
                <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                  {{ row.detailsShowing ? '隐藏' : '展示' }}详情
                </b-button>
              </template>
              <template slot="row-details" slot-scope="row">
                <b-card>
                  <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
                  </ul>
                </b-card>
              </template>
            </b-table>
            <b-col md="6" class="my-1">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                            class="my-0"/>
            </b-col>
          </b-container>
        </b-card>
      </b-col>
    </b-row>

    <div class="row"
         v-show="pageMode === 'request' || pageMode === 'create' || pageMode === 'view' || detail">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            <button class="btn btn-primary btn-info" type="button"
                    v-if="pageMode === 'create' && id !== ''"
                    onclick="window.location.href=basePath + '/teach/request?mode=manage'">
              <i class="fa fa-arrow-left"></i> 返回列表
            </button>
            <button class="btn btn-primary btn-info" type="button"
                    v-if="pageMode === 'request' && id !== ''"
                    onclick="window.location.href=basePath + '/course/request?mode=faculty'">
              <i class="fa fa-arrow-left"></i> 返回列表
            </button>
            <button class="btn btn-primary btn-info" type="button"
                    v-if="pageMode === 'view' && url.indexOf('choose') === -1"
                    onclick="window.location.href=basePath + '/course/view'">
              <i class="fa fa-arrow-left"></i> 返回查询列表
            </button>
            <button class="btn btn-primary btn-info" type="button"
                    v-if="pageMode === 'manage'"
                    v-on:click="showTable">
              <i class="fa fa-arrow-left"></i> 返回列表
            </button>
            <button class="btn btn-primary btn-info" type="button"
                    v-if="url.indexOf('choose') !== -1"
                    onclick="window.location.href=basePath + '/course/choose'">
              <i class="fa fa-arrow-left"></i> 返回选课工作表
            </button>
            课程基本信息表
          </div>
          <div class="panel-body">
            <form class="form-horizontal">
              <div class="col-md-12 col-sm-4">
                <div class="panel panel-danger">
                  <div class="panel-heading">
                    学期信息
                  </div>
                  <div class="form-group panel-body">
                    <div class="col-sm-2">
                      <label class="col-sm-12 control-label">*年份-学期(YYYY-XX):</label>
                    </div>
                    <div class="col-sm-3">
                      <input class="form-control" required v-model="course.info"
                             :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-4">
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    课程基本信息
                  </div>
                  <div class="panel-body">
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*课程名:</label>
                      </div>
                      <div class="col-sm-3">
                        <input class="form-control"
                               minlength="1"
                               maxlength="20"
                               required v-model="course.name"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*课程等级:</label>
                      </div>
                      <div class="col-sm-3">
                        <input isDigits="true"
                               class="form-control"
                               placeholder="*100-499" minlength="3"
                               maxlength="3" required
                               v-model="course.level"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*课程班级:</label>
                      </div>
                      <div class="col-sm-3">
                        <input class="form-control"
                               placeholder="*01,02,03..."
                               minlength="2" maxlength="2" required
                               v-model="course.section"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*学分:</label>
                      </div>
                      <div class="col-sm-3">
                        <input isDigits="true"
                               placeholder="*0-4"
                               class="form-control" minlength="1"
                               maxlength="1" required
                               v-model="course.credits"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*课程容量:</label>
                      </div>
                      <div class="col-sm-3">
                        <input isDigits="true"
                               class="form-control" required
                               v-model="course.capacity"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">教室:</label>
                      </div>
                      <div class="col-sm-3">
                        <input class="form-control"
                               maxlength="20"
                               v-model="course.classroom"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="startdate"
                               class="col-sm-12 control-label">*开始日期:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="startdate" class="form-control"
                               required v-model="course.startDate"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="enddate"
                               class="col-sm-12 control-label">*结束日期:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="enddate" class="form-control"
                               required
                               v-model="course.endDate"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="starttime"
                               class="col-sm-12 control-label">*开始时间:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="starttime" class="form-control"
                               required v-model="course.startTime"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="endtime"
                               class="col-sm-12 control-label">*结束时间:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="endtime" class="form-control"
                               required
                               v-model="course.endTime"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*选择上课日:</label>
                      </div>
                      <div class="col-sm-8">
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="m" id="m"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="m">星期一</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="t" id="t"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="t">星期二</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="w" id="w"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="w">星期三</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="tr" id="tr"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="tr">星期四</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="f" id="f"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="f">星期五</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="sa" id="sa"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="sa">星期六</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" value="s" id="s"
                                 name="day" v-model="courseDay"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="s">星期日</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="panel-footer">
                    注意：*为必填项，其余选填。
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-4">
                <div class="panel panel-success">
                  <div class="panel-heading"
                       v-if="pageMode === 'create' || pageMode === 'manage'">
                    教师与预修课分配
                  </div>
                  <div class="panel-heading" v-if="pageMode === 'request'">
                    预修课分配
                  </div>
                  <div class="panel-body">
                    <div class="form-group"
                         v-if="pageMode === 'create' || pageMode === 'manage' || pageMode === 'view'">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*分配教师:</label>
                      </div>
                      <div class="col-sm-8">
                        <select class="js-example-basic-single user"
                                name="teacher" style="width: 100%;"
                                :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                        </select>
                      </div>

                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">预修课程（可多选，可不选）:</label>
                      </div>
                      <div class="col-sm-8">
                        <select class="col-sm-12 js-example-basic-multiple course"
                                name="preList[]" style="width: 100%;"
                                multiple="multiple"
                                :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    更多信息
                  </div>
                  <div class="panel-body">
                    <div class="form-group" v-if="!showDocument">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">上传课程大纲:</label>
                      </div>
                      <div class="col-sm-6">
                        <input type="file" id="document"
                               :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                      </div>
                    </div>
                    <div class="form-group" v-if="showDocument">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">课程大纲:</label>
                      </div>
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
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">备注信息:</label>
                      </div>
                      <div class="col-sm-8">
                                                        <textarea style="resize: none;" class="form-control" rows="3"
                                                                  v-model="course.comment"
                                                                  :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"></textarea>
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
                      </div>
                      <div class="col-sm-3" v-if="pageMode !== 'view'">
                        <div
                          class="checkbox3 checkbox-danger checkbox-inline checkbox-check checkbox-circle checkbox-light">
                          <input type="checkbox" id="yes"
                                 name="confirm" v-model="confirm"
                                 required
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true">
                          <label for="yes">确认</label>
                        </div>
                      </div>
                      <div v-if="pageMode === 'create' || pageMode === 'manage'">
                        <div class="col-sm-2">
                          <label class="col-sm-12 control-label">*管理员操作密码:</label>
                        </div>
                        <div class="col-sm-3">
                          <input type="password"
                                 class="form-control" minlength="6"
                                 maxlength="16" checkOpPwd="true"
                                 :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"
                                 required/>
                        </div>
                      </div>
                      <button style="width:150px;" class="btn btn-primary"
                              v-if="pageMode === 'create' && id === ''"
                              v-on:click="courseCreate"
                              onclick="return false;">创建课程
                      </button>
                      <button style="width:150px;" class="btn btn-success"
                              v-if="pageMode === 'manage' && id === ''"
                              v-on:click="courseUpdate"
                              onclick="return false;">修改课程
                      </button>
                      <button style="width:150px;" class="btn btn-success"
                              v-if="pageMode === 'create' && id !== ''"
                              v-on:click="tempCourseApprove"
                              :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"
                              onclick="return false;">批准申请
                      </button>
                      <button style="width:150px;" class="btn btn-danger"
                              v-if="pageMode === 'create' && id !== ''"
                              v-on:click="tempCourseDecline"
                              :disabled="tempCourse.status==='0' && pageMode !== 'view'?false:true"
                              onclick="return false;">拒绝申请
                      </button>
                      <button style="margin-left: 32%; width:150px;" class="btn btn-primary"
                              v-if="pageMode === 'request' && id === ''"
                              v-on:click="tempCourseCreate"
                              onclick="return false;">提交申请
                      </button>
                      <button style="margin-left: 32%; width:150px;" class="btn btn-danger"
                              v-if="pageMode === 'request' && id !== '' && tempCourse.status === '0'"
                              v-on:click="tempCourseUpdate"
                              onclick="return false;">修改申请
                      </button>
                    </div>
                    <div class="panel-footer">
                      注意：操作密码不是登录密码
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

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
      console.log(this.$route.fullPath);
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
          initRequest(this.id);
        else
          showCourseDetail(this.id);
      }

      //执行一个laydate实例
      laydate.render({
        elem: '#startdate',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.course.startDate = value
        }
      });
      laydate.render({
        elem: '#enddate',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.course.endDate = value
        }
      });
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
      });
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
      });
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
        let day = "", precrn = "";
        this.preList = $(".course").val();

        if (isNotEmpty(this.courseDay))
          for (let i = 0; i < this.courseDay.length; i++)
            if (isNotEmpty(this.courseDay[i]))
              day += this.courseDay[i] + "/";

        if (isNotEmpty(this.preList))
          for (let i = 0; i < this.preList.length; i++)
            if (isNotEmpty(this.preList[i]))
              precrn += this.preList[i] + "/";

        this.course.day = day;
        this.course.precrn = precrn;
        this.course.facultyId = $(".user").val();

        if (isNotEmpty(this.course.courseInfo))
          this.course.courseInfo = JSON.stringify(this.course.courseInfo);
      },
      showTable () {
        this.table = true;
        this.detail = false;
        this.student = false;
      },
      tempCourseCreate () {
        if(!this.confirm) {
          Showbo.Msg.alert("请确认上述信息无误!", function () {
          });
          return;
        }
        this.prepare();

        axios.post('/request/course/register', this.course).then(function (response) {
          if (response.data.code === 2001) {
            let id = response.data.data.id;
            Showbo.Msg.alert("申请成功，等待教务答复!", function () {
              documentUpload(id);
              window.location.href = basePath + '/course/request?mode=faculty';
            });
          }
          else
            Showbo.Msg.alert(response.data.msg, function () {
            });
        })
      },

      tempCourseUpdate () {
        if(!this.confirm) {
          Showbo.Msg.alert("请确认上述信息无误!", function () {
          });
          return;
        }

        this.prepare();

        this.tempCourse.courseJson = JSON.stringify(this.course);

        axios.put('/request/course/' + this.id, this.tempCourse).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert("修改成功，等待教务答复!", function () {
              documentUpload();
              window.location.href = basePath + '/course/request?mode=faculty';
            });
          else
            Showbo.Msg.alert(response.data.msg, function () {
            });
        })
      },
      tempCourseApprove () {
        if(!this.confirm) {
          Showbo.Msg.alert("请确认上述信息无误!", function () {
          });
          return;
        }

        this.prepare();

        this.tempCourse.status = "1";
        this.tempCourse.courseJson = JSON.stringify(this.course);

        if (!this.showDocument)
          documentUpload(this.id);
        update(this.id, this.tempCourse);

      },
      tempCourseDecline () {
        if(!this.confirm) {
          Showbo.Msg.alert("请确认上述信息无误!", function () {
          });
          return;
        }

        if (isNotEmpty(this.course.comment)) {
          this.tempCourse.status = "-1";
          this.tempCourse.courseJson = JSON.stringify(this.course);
          update(this.id, this.tempCourse);
        } else
          Showbo.Msg.alert("必须填写备注！", function () {
          });

      },
      courseCreate () {
        if(!this.confirm) {
          Showbo.Msg.alert("请确认上述信息无误!", function () {
          });
          return;
        }

        this.prepare();

        axios.post('/course', this.course).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert("创建成功!", function () {
              courseVue.$data.course = response.data.data;
              documentUpload(response.data.data.course.crn);
              window.location.href = basePath + '/teach/course?mode=manage&id=';
            });
          else
            Showbo.Msg.alert(response.data.msg, function () {
            });
        })
      },
      courseUpdate () {
        if(!this.confirm) {
          Showbo.Msg.alert("请确认上述信息无误!", function () {
          });
          return;
        }

        this.prepare();
        axios.put('/course/' + this.course.crn, this.course).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert("修改成功!", function () {
              documentUpload();
              window.location.reload();
            });
          else
            Showbo.Msg.alert(response.data.msg, function () {
            });
        })
      },
      transcriptReset () {
        this.transcript.complete = "";
        this.transcript.studentId = "";
        this.transcript.grade = "";
      },
      transcriptUpdate () {
        axios.put('/transcript/' + this.transcript.id, this.transcript).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              studentInCourse.draw();
            });
          else
            Showbo.Msg.alert(response.data.msg, function () {
            });
        })
      },
      addStudent2Course () {
        axios.put('/course/' + this.addStudent.crn + '/student/' + this.addStudent.studentId, this.addStudent.option).then(function (response) {
          if (response.data.code === 2001) {
            Showbo.Msg.alert("添加成功!", function () {
              studentInCourse.draw();
            });
          } else {
            Showbo.Msg.alert(response.data.msg, function () {
            });
          }
        });
      },
      addStudentReset () {
        this.addStudent.studentId = "";
        this.addStudent.option.capacity = false;
        this.addStudent.option.prereq = false;
        this.addStudent.option.time = false;
      }
    }
  }

//  function update(id, tempCourse) {
//    axios.put("/request/course/" + id, tempCourse).then(function (response) {
//      if (response.data.code === 2001)
//        Showbo.Msg.alert(response.data.msg, function () {
//          window.location.href = "/teach/request?mode=manage"
//        });
//      else
//        Showbo.Msg.alert(response.data.msg, function () {
//        });
//    });
//  }
//
//  function initCourse() {
//    courseVue.$data.courseDay = courseVue.$data.course.day.split("/");
//    courseVue.$data.preList = courseVue.$data.course.precrn.split("/");
//
//    if (isNotEmpty(courseVue.$data.course.courseInfo)) {
//      courseVue.$data.course.courseInfo = JSON.parse(courseVue.$data.course.courseInfo);
//      courseVue.$data.showDocument = true;
//    }
//
//    let preListOption = [];
//    for (let i = 0; i < courseVue.$data.preList.length; i++)
//      if (courseVue.$data.preList[i] !== "")
//        preListOption.push(new Option(courseVue.$data.preList[i], courseVue.$data.preList[i], true, true));
//    courseSelect.append(preListOption);
//    courseSelect.trigger('change');
//
//    let facultyId = courseVue.$data.course.facultyId;
//    userSelect.append(new Option(facultyId, facultyId, true, true));
//    courseSelect.trigger('change');
//
//  }
//
//  function initRequest(id) {
//    if (isNotEmpty(id)) {
//      axios.get('/request/course/' + id).then(function (response) {
//        courseVue.$data.tempCourse = response.data.data;
//        courseVue.$data.course = JSON.parse(response.data.data.courseJson);
//        courseVue.$data.course.facultyId = response.data.data.facultyId;
//        initCourse();
//      });
//    }
//  }
//
//  function showCourseDetail(crn) {
//    if (isNotEmpty(crn)) {
//      axios.get('/course/' + crn).then(function (response) {
//        courseVue.$data.course = response.data.data;
//        initCourse();
//        courseVue.$data.table = false;
//        courseVue.$data.detail = true;
//      });
//    }
//  }
//
//  function showStudentDetail(crn, credits) {
//    courseVue.$data.transcript.crn = crn;
//    courseVue.$data.transcript.credits = credits;
//    courseVue.$data.table = false;
//    courseVue.$data.detail = false;
//    courseVue.$data.student = true;
//    studentInCourse.draw();
//  }
//
//  function deleteCourse(crn) {
//    Showbo.Msg.confirm("确认删除该课程？", function () {
//      if ($(".btnfocus").val() !== "取消") {
//        axios.delete('/course/' + crn).then(function (response) {
//          if (response.data.code === 2001)
//            Showbo.Msg.alert("删除成功!", function () {
//              courseTable.draw();
//            });
//          else
//            Showbo.Msg.alert(response.data.msg, function () {
//            });
//        });
//      }
//    });
//  }
//
//  function documentUpload(key) {
//    if (courseVue.$data.showDocument)
//      return;
//
//    if (!isNotEmpty(document.getElementById("document").files))
//      return;
//
//    let requestUrl = "/request/course/info/";
//    let updateUrl = "/course/info/";
//    let formData = new FormData();
//
//    formData.append("file", document.getElementById("document").files[0]);
//    let url;
//
//    if (courseVue.$data.url.indexOf('course') !== -1 && courseVue.$data.pageMode !== 'manage') {
//      if (isNotEmpty(key))
//        url = requestUrl + key;
//      else
//        url = requestUrl + courseVue.$data.id;
//    } else {
//      if (isNotEmpty(key))
//        url = updateUrl + key;
//      else
//        url = updateUrl + courseVue.$data.course.crn;
//    }
//
//    axios.put(url, formData).then(function (response) {
//      if (response.data.code === 2001) {
//        courseVue.$data.course.courseInfo = response.data.data;
//        courseVue.$data.showDocument = true;
//      } else {
//        Showbo.Msg.alert(response.data.msg, function () {
//        });
//      }
//    });
//  }
//
//  function documentDownload() {
//    if (isNotEmpty(courseVue.$data.id))//申请中的下载
//      window.open(basePath + "/request/course/info/" + courseVue.$data.id);
//    else {//查看下载
//      window.open(basePath + "/course/info/" + courseVue.$data.course.crn);
//    }
//  }
//
//  function removeStuFromCourse(studentId, crn) {
//    Showbo.Msg.confirm("确认从课程中删除该学生？", function () {
//      if ($(".btnfocus").val() !== "取消") {
//        axios.delete('/course/' + crn + '/student/' + studentId).then(function (response) {
//          if (response.data.code === 2001) {
//            Showbo.Msg.alert("删除成功!", function () {
//              studentInCourse.draw();
//            });
//          } else {
//            Showbo.Msg.alert(response.data.msg, function () {
//            });
//          }
//        });
//      }
//    });
//  }
//
//  function showAddStudentToCourse(studentId) {
//    courseVue.$data.addStudent.studentId = studentId;
//    courseVue.$data.addStudent.crn = courseVue.$data.transcript.crn;
//    courseVue.$data.addStudent.credits = courseVue.$data.transcript.credits;
//  }
//
//  function showTranscript(id, studentId, grade, complete) {
//    courseVue.$data.transcript.id = id;
//    courseVue.$data.transcript.studentId = studentId;
//    courseVue.$data.transcript.grade = grade;
//    courseVue.$data.transcript.complete = complete;
//  }

</script>
