<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            成绩单列表
          </div>
        </div>
      </div>
    </div>
    <div class="row" id="transcriptPage">
      <div class="col-md-12">
        <div class="panel panel-default">
          <div class="panel-heading">
            搜索条件
          </div>
          <div class="panel-body">
            <div class="form-group">
              <div class="col-sm-1">
                <label class="col-sm-12 control-label">按学期:</label>
              </div>
              <div class="col-sm-2">
                <select class="js-example-basic-single info col-sm-12"></select>
              </div>
              <div class="col-sm-1">
                <label class="col-sm-12 control-label">按学生:</label>
              </div>
              <div class="col-sm-2">
                <select class="js-example-basic-single user col-sm-12"></select>
              </div>
              <div class="col-sm-1">
                <label class="col-sm-12 control-label">按课程:</label>
              </div>
              <div class="col-sm-2">
                <select class="js-example-basic-single course col-sm-12"></select>
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
                                <span style="cursor: pointer" data-toggle="collapse" data-parent="#accordion"
                                      href="#collapseTwo" class="collapsed">成绩单列表</span>
          </div>
          <div id="collapseTwo" class="panel-collapse in">
            <div class="panel-body">
              <div class="col-md-8">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <table id="transcriptTable" style="width: 100%;"
                           class="table table-striped table-bordered table-hover"></table>
                  </div>
                </div>
              </div>
              <form class="form-horizontal">
                <div class="col-md-4">
                  <div class="panel panel-primary">
                    <div class="panel-heading">
                      学生成绩详情
                    </div>
                    <div class="panel-body">
                      <div class="form-group">
                        <div class="col-sm-4">
                          <label class="control-label">学生ID:
                            {{transcript.studentId}}</label>
                        </div>
                        <div class="col-sm-4">
                          <label class="control-label">课程CRN: {{transcript.crn}}</label>
                        </div>
                        <div class="col-sm-4">
                          <label class="control-label">课程学分:{{transcript.credits}}</label>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="col-sm-4" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*成绩:</label>
                        </div>
                        <div class="col-sm-8" style="margin-top:10px;">
                          <input placeholder="可使用Letter Grade或百分制"
                                 class="form-control" v-model="transcript.grade"
                                 minlength="1" required>
                        </div>

                        <div class="col-sm-4" style="margin-top:10px;">
                          <label class="col-sm-12 control-label">*完成情况:</label>
                        </div>
                        <div class="col-sm-8" style="margin-top:10px;">
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
                        <div class="col-sm-4" style="margin-top:10px;">
                          <label class="control-label">*教务系统密码:</label>
                        </div>
                        <div class="col-sm-5">
                          <input type="password" class="form-control" minlength="6"
                                 maxlength="16" checkOpPwd="true" required/>
                        </div>
                        <button class="btn btn-success col-sm-2" onclick="return false"
                                v-on:click="transcriptUpdate">更新
                        </button>
                        <button class="btn btn-danger col-sm-2" onclick="return false"
                                v-on:click="transcriptReset">取消
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
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'TranscriptManage',
    data () {
      return {
        transcript: {
          id: '',
          studentId: '',
          grade: '',
          crn: '',
          complete: '',
          credits: ''
        },
      }
    },
    methods: {
      transcriptUpdate: function () {
        axios.put('/transcript/' + this.transcript.id, this.transcript).then(function (response) {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              transcriptTable.draw()
            })
          else
            Showbo.Msg.alert(response.data.msg, function () {
            })
        })
      },
      transcriptReset: function () {
        this.transcript.complete = ''
        this.transcript.studentId = ''
        this.transcript.grade = ''
      },
      initTable () {
        transcriptTable.draw()
      },
      showTranscript (id, studentId, grade, complete) {
        this.transcript.id = id
        this.transcript.studentId = studentId
        this.transcript.grade = grade
        this.transcript.complete = complete
      },
      downloadReport (studentId) {
        window.open(basePath + '/transcript/report?studentId=' + studentId)
      },
    }
  }
</script>
