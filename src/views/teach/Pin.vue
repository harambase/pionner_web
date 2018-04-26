<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码列表（按学期）</strong>
          </div>
          <b-col cols="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>识别码列表</strong>
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
                             value="2" v-model="mode">
                      <label class="custom-control-label" for="batch">批量</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="single" name="mode" v-validate="'required'" class="custom-control-input"
                             value="1" v-model="mode">
                      <label class="custom-control-label" for="single">单个</label>
                    </div>
                    <div v-show="errors.has('mode')" class="invalid-tooltip">{{ errors.first('info') }}</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="mt-1">
                    <label class="col-sm-12 control-label">*识别码的所有人:</label>
                  </b-col>
                  <b-col md="3" class="mt-1">
                    <CUserSelect v-on:pass="passUser" :mode="mode"/>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2">
                    <label for="startTime" class="col-sm-12 control-label">*生效时间:</label>
                  </b-col>
                  <b-col md="3">
                    <input id="startTime" v-model="startTime" name="startTime"
                           v-validate="'required|date_format:YYYY-MM-DD HH:mm:ss'"
                           :class="{'form-control': true, 'is-invalid': errors.has('startTime')}">
                    <div v-show="errors.has('startTime')" class="invalid-tooltip">{{ errors.first('startTime') }}</div>
                  </b-col>
                  <b-col md="2">
                    <label for="endTime"
                           class="col-sm-12 control-label">*失效时间:</label>
                  </b-col>
                  <b-col md="3">
                    <input id="endTime" v-model="endTime" name="endTime"
                           v-validate="'required|date_format:YYYY-MM-DD HH:mm:ss'"
                           :class="{'form-control': true, 'is-invalid': errors.has('endTime')}">
                    <div v-show="errors.has('endTime')" class="invalid-tooltip">{{ errors.first('startTime') }}</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2">
                    <label class="col-sm-12 control-label">*选择种类（可复选）:</label>
                  </b-col>
                  <b-col md="8">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="course" name="role" v-validate="'required'"
                             class="custom-control-input"
                             value="1" v-model="role">
                      <label class="custom-control-label" for="course">选课</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" id="transcript" name="role" v-validate="'required'"
                             class="custom-control-input"
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
                    <b-button variant="success" @click="generate">生成（并自动发送）
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
                  <b-col md="2" class="mt-1">
                    <label class="col-sm-12 control-label">*选择清除的学期:</label>
                  </b-col>
                  <b-col md="5">
                    <CInfoSelect v-on:pass="passInfo"/>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <b-button style="width:150px;" variant="danger" @click="showDeleteAll">清除
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col md="12">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>识别码(PIN)批量发送</strong>
                </div>

                <b-row>
                  <b-col md="2">
                    <label class="col-sm-12 control-label">*选择发送学期:</label>
                  </b-col>
                  <b-col md="4">
                    <CInfoSelect v-on:pass="passSendInfo"/>
                  </b-col>
                  <b-col md="2">
                    <label class="col-sm-12 control-label">*选择发送种类（可复选）:</label>
                  </b-col>
                  <b-col md="2">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input id="choose" type="checkbox" name="role2" v-validate="'required'"
                             class="custom-control-input"
                             value="1" v-model="sendRole">
                      <label class="custom-control-label" for="choose">选课</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input id="grade" type="checkbox" name="role2" v-validate="'required'"
                             class="custom-control-input"
                             value="2" v-model="sendRole">
                      <label class="custom-control-label" for="grade">成绩录入</label>
                    </div>
                  </b-col>
                  <b-col md="2">
                    <b-button variant="success" style="width:150px;" @click="sendPin">发送
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteAll"
             centered
             ok-title="清除"
             cancel-title="取消"
             ok-vairant="danger"
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认清除{{this.deleteInfo}}该学期的识别码？</h3>
      </div>
    </b-modal>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             centered
             title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import CInfoSelect from '../../components/selects/InfoSelect'
  import CPinTable from '../../components/tables/PinTable'
  import CUserSelect from '../../components/selects/UserSelect'
  import CPinSelect from '../../components/selects/PinSelect'

  export default {
    name: 'Pin',
    components: {CPinSelect, CUserSelect, CPinTable, CInfoSelect},
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
        user: '',
        deleteInfo: '',
        showDeleteModal: false,
        showModal: false,
        msg: '',
        headerBgVariant: '',
        pin: '',
        sendRole: [],
        sendInfo: ''
      }
    },
    mounted () {
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
      passUser (val) {
        this.user = val
      },
      passInfo (val) {
        this.deleteInfo = val
      },
      passPin (val) {
        this.pin = val
      },
      passSendInfo (val) {
        this.sendInfo = val
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      sendPin () {
        for(let i = 0; i<this.sendRole.length; i++) {
          switch (this.sendRole[i]) {
            case '1':
              axios.get('/pin/send/advisor/' + this.sendInfo.value).then((response) => {
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              })
              break
            case '2':
              axios.get('/pin/send/faculty/' + this.sendInfo.value).then((response) => {
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              })
              break
          }
        }
      },
      generate () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          let url = '/pin'

          switch (this.mode) {
            case '2':
              url += '?startTime=' + this.startTime
                + '&endTime=' + this.endTime
                + '&role=' + this.role
                + '&info=' + this.info
                + '&remark=' + this.remark
              axios.post(url).then((response) => {
                if (response.data.code === 2001) {
                  this.msg = response.data.msg
                  this.showModal = true
                  this.headerBgVariant = 'success'
                }
                else {
                  this.msg = response.data.msg
                  this.showModal = true
                  this.headerBgVariant = 'danger'
                }
              })
              break
            case '1':
              url += '/' + this.user.value
                + '?startTime=' + this.startTime
                + '&endTime=' + this.endTime
                + '&role=' + this.role
                + '&info=' + this.info
                + '&remark=' + this.remark
              axios.post(url).then((response) => {
                if (response.data.code === 2001) {
                  this.msg = '创建并发送成功！'
                  this.showModal = true
                  this.headerBgVariant = 'success'
                }
                else {
                  this.msg = response.data.msg
                  this.showModal = true
                  this.headerBgVariant = 'danger'
                }
              })
          }
        })
      },
      showDeleteAll () {
        this.showDeleteModal = true
      },
      deleteAll () {
        axios.delete('/pin/' + this.deleteInfo.value + '/all').then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功！'
            this.showModal = true
            this.headerBgVariant = 'success'
            this.deleteInfo = ''
          }
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      }
    }

  }
</script>
