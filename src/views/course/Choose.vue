<template>
  <div class="animated fadeIn">
    <b-row>
      <b-card
        header-tag="header"
        footer-tag="footer"
        class="mx-12">
          <div class="col-md-12" id="choosePage">
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="card-title">
                  <div class="title">选课表单</div>
                </div>
              </div>
              <div class="panel-body">
                <div v-if="!pinValidate">
                  <form class="form-horizontal" onclick="return false;">
                    <div class="col-md-12">
                      <div class="panel panel-danger">
                        <h1>识别码验证</h1>
                        <div class="form-group panel-body">
                          <label for="pin" class="col-sm-12 control-label">*请输入6位识别码:</label>
                          <input id="pin" v-validate="'required|numeric|min:6|max:6'" name="pin" v-model="pin" class="mb-3"
                                 :class="{'form-control': true, 'is-invalid': errors.has('pin')}">
                          <button class="btn btn-success mb-3" :click="validate">
                            验证
                          </button>
                          <div v-show="errors.has('pin')" class="invalid-tooltip">{{ errors.first('pin') }}</div>

                        </div>
                        <div class="panel-footer">
                          注意：该处填写6位数字识别码，识别码请在导师处获取。
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div v-show="pinValidate">
                  <form class="form-horizontal">
                    <div class="col-md-12 col-sm-4">
                      <div class="panel panel-success">
                        <div class="panel-heading">
                          选课工作区
                        </div>
                        <div class="form-group panel-body">
                          <div class="col-md-3">
                            <div class="panel panel-info">
                              <div class="panel-heading">
                                选课工作表
                              </div>
                              <div class="panel-body">
                                <div class="form-group">
                                  <div class="col-sm-4">
                                    学分上限: {{tol_credits}}
                                  </div>
                                  <div class="col-sm-4">
                                    已用学分: {{use_credits}}
                                  </div>
                                  <div class="col-sm-4">
                                    可用学分: {{ava_credits}}
                                  </div>
                                </div>
                                <hr/>
                                <div id="worksheet" v-html="worksheet"></div>
                                <hr/>
                                <div class="form-group">
                                  <div class="col-sm-6">
                                    <button style="width:150px;" class="btn btn-success"
                                            id="submit" v-on:click="submit"
                                            onclick="return false;">
                                      提交
                                    </button>
                                  </div>
                                  <div class="col-sm-6">
                                    <button style="width:150px;" class="btn btn-danger"
                                            id="reset" v-on:click="reset"
                                            onclick="return false;">
                                      重置当前
                                    </button>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-9">
                            <div class="panel panel-info">
                              <div class="panel-heading">
                                新学期课程列表
                              </div>
                              <b-container fluid>
                                <!-- User Interface controls -->
                                <b-row>
                                  <b-col md="3" class="my-1">
                                    <b-form-group horizontal label="显示" class="mb-0">
                                      <b-form-select :options="pageOptions" v-model="perPage"/>
                                    </b-form-group>
                                  </b-col>
                                  <b-col md="3" class="my-1">
                                    <b-form-group horizontal label="搜索" class="mb-0">
                                      <b-input-group>
                                        <b-form-input v-model="filter"/>
                                        <b-input-group-button>
                                          <b-btn :disabled="!filter" @click="filter = ''">重置</b-btn>
                                        </b-input-group-button>
                                      </b-input-group>
                                    </b-form-group>
                                  </b-col>
                                </b-row>

                                <!-- Main table element -->
                                <b-table show-empty
                                         stacked="md"
                                         :striped=true
                                         :fixed=true
                                         :hover=true
                                         :items="courseTable"
                                         :fields="fields"
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
      </b-card>
    </b-row>
    <!--<b-modal v-model="showModal" size="sm" ok-only centered title="消息">-->
    <!--<div class="d-block text-center">-->
    <!--<h4>{{msg}}</h4>-->
    <!--</div>-->
    <!--</b-modal>-->
  </div>
</template>

<script>
  import axios from 'axios'

  const items = []
  export default {
    name: 'Choose',
    data () {
      return {
        pin: '',
        pinValidate: false,
        tol_credits: 0,
        use_credits: 0,
        ava_credits: 0,
        counter: 0,
        crnList: [],
        worksheet: '',
        msg: '',
        fields: [
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
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      }
    },
    mounted: function () {
//      this.initPin()
//      this.initCourseTable()
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      courseTable: function (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
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
      initPin () {
        axios.get('/pin/session').then((response) => {
          if (response.data.code === 2001) {
            this.initStudentInfo()
//            //courseTable.draw()
            this.pinValidate = true
            if (isNotEmpty(window.localStorage.getItem('chooseVue'))) {
              let data = JSON.parse(window.localStorage.getItem('chooseVue'))
              this.pin = data.pin
              this.tol_credits = data.tol_credits
              this.use_credits = data.use_credits
              this.ava_credits = data.ava_credits
              this.counter = data.counter
              this.crnList = data.crnList
              this.worksheet = data.worksheet
              window.localStorage.clear()
            }
          }
        })
      },
      initStudentInfo () {
        axios.get('/user/current').then((response) => {
          initStudent(response.data.data.userId)
        })

        function initStudent (studentId) {
          axios.get('/student/' + studentId + '/available/credit').then((response) => {
            if (response.data.code === 2001) {
              this.tol_credits = response.data.data.tol_credits
              this.use_credits = response.data.data.use_credits
              this.ava_credits = response.data.data.ava_credits
            } else {
              this.msg = response.data.msg
              this.headerBgVariant = 'danger'
              this.showModal = true
            }

          })
        }
      },

      validate () {
        axios.get('/pin/' + this.pin).then(function (response) {
          if (response.data.code === 2001) {
            initStudentInfo()
            //courseTable.draw()
            this.pinValidate = true
          }
//          else
//            Showbo.Msg.alert('验证失败!', function () {
//            })
        })

      },

      initPin () {
        axios.get('/pin/session').then(function (response) {
          if (response.data.code === 2001) {
            initStudentInfo()
            //courseTable.draw()
            this.pinValidate = true
            if (isNotEmpty(window.localStorage.getItem('chooseVue'))) {
              let data = JSON.parse(window.localStorage.getItem('chooseVue'))
              this.pin = data.pin
              this.tol_credits = data.tol_credits
              this.use_credits = data.use_credits
              this.ava_credits = data.ava_credits
              this.counter = data.counter
              this.crnList = data.crnList
              this.worksheet = data.worksheet
              window.localStorage.clear()
            }
          }
        })
      },

      initStudentInfo () {
        axios.get('/user/current').then(function (response) {
          initStudent(response.data.data.userId)
        })

        function initStudent (studentId) {
          axios.get('/student/' + studentId + '/available/credit').then(function (response) {
            if (response.data.code === 2001) {
              this.tol_credits = response.data.data.tol_credits
              this.use_credits = response.data.data.use_credits
              this.ava_credits = response.data.data.ava_credits
            }
//            else
//              Showbo.Msg.alert('获取学生信息失败!', function () {
//              })
          })
        }
      },

      addToWorkSheet (crn, credits) {

        function isAvaCreditsEnough (credits) {
          return (this.tol_credits - this.use_credits - credits) >= 0
        }

        function isSelectAgain (crn) {
          let newId = 'input_' + crn
          let input = document.getElementById(newId)
          return input !== null //true:again, false:not again
        }

        if (!isAvaCreditsEnough(credits)) {
          Showbo.Msg.alert('学分不足!', function () {
          })
          return
        }
        if (isSelectAgain(crn)) {
          Showbo.Msg.alert('不可重复选!', function () {
          })
          return
        }
        this.counter++
        this.crnList.push(crn)

        this.worksheet = this.worksheet +
          '<div id="form_' + crn + '" class="form-group">' +
          '   <div class="col-sm-1">' +
          '       <i id="remove_' + crn + '" class="fa fa-minus-circle fa-2x" style="color: red; cursor: pointer; margin-top: 3px;" ' +
          '          onclick="removeFromWorkSheet(\'' + crn + '\',\'' + credits + '\')"></i>' +
          '   </div>' +
          '   <div class="col-sm-4">' +
          '       <label for="input_' + crn + '" class="control-label">已选课程:</label>' +
          '   </div>' +
          '   <div class="col-sm-6">' +
          '        <input name="course_choose" id="input_' + crn + '" class="form-control" value="' + crn + '" disabled/>' +
          '   </div>' +
          '</div>'

        this.use_credits += parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
      },

      removeFromWorkSheet (crn, credits) {
        let input = document.getElementById('form_' + crn)
        input.parentNode.removeChild(input)
        this.crnList.splice($.inArray(crn, this.crnList), 1)
        this.worksheet = document.getElementById('worksheet').innerHTML
        this.use_credits -= parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
      },

      toCourse (crn) {
        window.localStorage.setItem('chooseVue', JSON.stringify(this))
        window.location.href = '/course/choose/detail?pageMode=view&crn=' + crn
      },

      reset: function () {
        this.worksheet = ''
        this.initStudentInfo()
      },
      submit: function () {

        let choiceList = []
        if (this.crnList.length === 0) {
          this.msg = '没有选择任何课程!'
          this.showModal = true
          this.headerBgVariant = 'danger'
          return
        }
        for (let i = 0; i < this.crnList.length; i++) {
          let newId = 'input_' + this.crnList[i]
          let input = document.getElementById(newId)
          if (input !== null) {
            choiceList.push(this.crnList[i])
          }
        }

        axios.post('/course/choose', {
          choiceList: choiceList
        }).then((response) => {
          let failList = response.data.data.failList
          if (failList.length === 0) {
            this.msg = '全部注册成功!'
            this.showModal = true
            this.headerBgVariant = 'danger'
            this.worksheet = ''
            this.initStudentInfo()
          } else {
            let html = '<table style="text-align: left">'
            for (let i = 0; i < failList.length; i++) {
              html += '<tr><td>' + failList[i] + '</td></tr>'
            }
            let input = '<p style="color: red">课程注册失败详情</p>' + html + '</table>'
            this.worksheet = ''
            this.msg = input
            this.initStudentInfo()
          }
        })
      }
    }
  }
</script>
