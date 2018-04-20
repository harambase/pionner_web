<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码列表（按学期分类）</strong>
          </div>
          <b-col cols="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>成绩单列表</strong>
              </div>
              <CPinTable/>
            </b-card>
          </b-col>
        </b-card>
      </b-col>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码(PIN)管理</strong>
          </div>
          <b-row>
            <b-col md="12">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>PIN生成</strong>
                  <small>生成规则信息</small>
                </div>
                <b-row>
                  <b-col md="2" class="mt-1">
                    <label for="info" class="col-sm-12 control-label">*年份-学期(YYYY-XX):</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                    <input v-validate="'min:7|max:7|required'" name="info"
                           :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                           v-model="info" id="info"/>
                    <div v-show="errors.has('info')" class="invalid-tooltip">{{ errors.first('info') }}</div>
                  </b-col>
                  <b-col md="2">
                    <label class="col-sm-12 control-label">*是否批量:</label>
                  </b-col>
                  <b-col md="3">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="batch" name="mode" v-validate="'required'" class="custom-control-input"
                             value="1" v-model="mode">
                      <label class="custom-control-label" for="batch">批量</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="single" name="mode" v-validate="'required'" class="custom-control-input"
                             value="0" v-model="mode">
                      <label class="custom-control-label" for="single">单个</label>
                    </div>
                    <div v-show="errors.has('mode')" class="invalid-tooltip">{{ errors.first('info') }}</div>
                  </b-col>
                </b-row>
                <b-row v-show="mode==='0'">
                  <b-col md="2" class="mt-1">
                    <label class="col-sm-12 control-label">*识别码的所有人:</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                   <CUserSelect v-bind:pass="passUser"/>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="mt-1">
                    <label for="startTime" class="col-sm-12 control-label">*生效时间:</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                    <input id="startTime" v-model="startTime" name="startTime"
                           v-validate="'required'" :class="{'form-control': true, 'is-invalid': errors.has('startTime')}">
                    <div v-show="errors.has('startTime')" class="invalid-tooltip">{{ errors.first('startTime') }}</div>
                  </b-col>
                  <b-col md="2" class="mt-1">
                    <label for="endTime"
                           class="col-sm-12 control-label">*失效时间:</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                    <input id="endTime" v-model="endTime" name="endTime"
                           v-validate="'required'" :class="{'form-control': true, 'is-invalid': errors.has('endTime')}">
                    <div v-show="errors.has('endTime')" class="invalid-tooltip">{{ errors.first('startTime') }}</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2">
                    <label class="col-sm-12 control-label">*选择种类（可复选）:</label>
                  </b-col>
                  <b-col md="8">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="course" name="role" v-validate="'required'" class="custom-control-input"
                             value="1" v-model="role">
                      <label class="custom-control-label" for="course">选课</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="transcript" name="role" v-validate="'required'" class="custom-control-input"
                             value="2" v-model="role">
                      <label class="custom-control-label" for="transcript">成绩录入</label>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="mt-1">
                    <label for="comments"
                           class="col-sm-12 control-label">备注信息:</label>
                  </b-col>
                  <b-col md="8" class="mt-1">
                  <textarea style="resize: none;" class="form-control"
                            v-model="remark"
                            id="comments" rows="3"></textarea>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="mt-1">
                    <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="yes"
                             :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                             name="confirm" v-model="confirm">
                      <label class="custom-control-label" for="yes">确认</label>
                      <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                    </div>
                  </b-col>
                  <b-col md="2" class="mt-1">
                    <label class="col-sm-12 control-label">*管理员操作密码:</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                    <input type="password" v-validate="'required'" name="adminPwd"
                           :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                    <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{ errors.first('adminPwd') }}</div>
                  </b-col>
                  <b-col md="2" class="mt-1">
                    <b-button style="width:150px;" variant="success" @click="generateAll">生成
                    </b-button>
                  </b-col>
                </b-row>


                <div slot="footer">
                  注意：该处填写规则为注册年份-学期号。学期号规则为：春季是01，秋季是02，其他为03。
                </div>
              </b-card>
            </b-col>
            <b-col md="12">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>识别码(PIN)批量清空</strong>
                </div>
                <b-row>
                  <b-col md="5">
                    <CInfoSelect v-on:pass="passInfo"/>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*管理员操作密码:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input type="password" v-validate="'required'" name="adminPwd"
                           :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                    <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{ errors.first('adminPwd') }}</div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <b-button style="width:150px;" variant="danger" @click="deleteAll">清除
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col md="12">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>识别码(PIN)发送</strong>
                </div>
                <!--<b-row>-->
                <!--<b-col>-->
                <!--<label class="col-sm-12 control-label"> 发送教师成绩录入识别码:</label>-->
                <!--</b-col>-->
                <!--<b-col>-->
                <!--<b-button variant="success" style="width:150px;" @click="sendFacultyPin">发送-->
                <!--</b-button>-->
                <!--</b-col>-->
                <!--<b-col>-->
                <!--<label class="col-sm-12 control-label"> 向导师发送学生选课识别码:</label>-->
                <!--</b-col>-->
                <!--<b-col>-->
                <!--<b-button variant="success" style="width:150px;" @click="sendAdvisorPin">向导师发送-->
                <!--</b-button>-->
                <!--</b-col>-->
                <!--</b-row>-->
                <b-row>
                  <b-col md="5">
                    <CInfoSelect v-on:pass="passInfo"/>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*管理员操作密码:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input type="password" v-validate="'required'" name="adminPwd"
                           :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                    <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{ errors.first('adminPwd') }}</div>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import CInfoSelect from '../../components/selects/InfoSelect'
  import CPinTable from '../../components/tables/PinTable'
  import CUserSelect from '../../components/selects/UserSelect'

  export default {
    name: 'Pin',
    components: {CUserSelect, CPinTable, CInfoSelect},
    data () {
      return {
        startTime: '',
        endTime: '',
        role: [],
        remark: '',
        info: '',
        table: '',
        mode: '',
        confirm: '',
        user:''
      }
    },
    mounted: function () {
      laydate.render({
        elem: '#startTime',
        theme: '#393D49',
        type: 'datetime',
        showBottom: ['clear', 'confirm'],
        done: (value) => {
          this.startTime = value
        }
      })
      laydate.render({
        elem: '#endTime',
        theme: '#393D49',
        type: 'datetime',
        showBottom: ['clear', 'confirm'],
        done: (value) => {
          this.endTime = value
        }
      })
    },
    methods: {
      passUser(val){
        this.user = val
      },
      passInfo (val) {
        this.info = val
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      sendAdvisorPin () {
        axios.delete('/send/advisor/' + $('#send').val()).then((response) => {
          this.msg = response.data.msg
          this.showModal = true
          this.headerBgVariant = 'danger'
        })
      },
      sendFacultyPin () {
        axios.delete('/send/faculty/' + $('#send').val()).then((response) => {
          this.msg = response.data.msg
          this.showModal = true
          this.headerBgVariant = 'danger'
        })
      },
      generateAll: function () {
        let url = '/pin'
          + '?startTime=' + this.startTime
          + '&endTime=' + this.endTime
          + '&role=' + this.role
          + '&info=' + this.info
          + '&remark=' + this.remark
        axios.post(url).then((response) => {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.reload()
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      generateOne: function () {
        let url = '/pin/' + $('.user').val()
          + '?startTime=' + this.startTime
          + '&endTime=' + this.endTime
          + '&role=' + this.role
          + '&info=' + this.info
          + '&remark=' + this.remark
        axios.post(url).then((response) => {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.reload()
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      deleteAll: function () {
        Showbo.Msg.confirm('确认清除？', function () {
          if ($('.btnfocus').val() !== '取消') {
            axios.delete('/pin/' + this.info + '/all').then((response) => {
              if (response.data.code === 2001)
                Showbo.Msg.alert(response.data.msg, function () {
                  window.location.reload()
                })
              else {
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              }
            })
          }
        })

      },

    }

  }
</script>
