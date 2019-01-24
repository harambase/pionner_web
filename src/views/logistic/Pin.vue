<template>
  <div class="animated fadeIn">

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="识别码列表" name="first">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码列表</strong>
          </div>
          <b-card-body>
            <CPinTable/>
          </b-card-body>
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="识别码(PIN)生成" name="second">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>PIN生成</strong>
            <small>生成规则信息</small>
          </div>
          <b-card-body>
            <b-row>
              <b-col md="2">
                <label class="col-sm-12 control-label">*评价年份:</label>
              </b-col>
              <b-col md="3">
                <b-form-select id="year" style="width: 100%; float:left;" name="info"
                               class="form-control"
                               :plain="true"
                               :options="[2019,2020,2021,2022,2023,2024,2025]"
                               v-model="pinInfo.year">
                </b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*生成方式:</label>
              </b-col>
              <b-col md="3">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="single" name="mode" v-validate="'required'" class="custom-control-input"
                         value="2" v-model="mode">
                  <label class="custom-control-label" for="single">按用户（目前不支持多选）</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="batch" name="mode" v-validate="'required'" class="custom-control-input"
                         value="1" v-model="mode">
                  <label class="custom-control-label" for="batch">按类型</label>
                </div>
                <div v-show="errors.has('mode')" class="invalid-tooltip">{{ errors.first('info') }}</div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*选择类型:</label>
              </b-col>
              <b-col md="5">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="course" value="4"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('role')}"
                         name="level" v-model="role" v-validate="'required'">
                  <label class="custom-control-label" for="course">自评</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="advisor" value="5"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('role')}"
                         name="level" v-model="role" v-validate="'required'">
                  <label class="custom-control-label" for="advisor">他评</label>
                </div>
                <div v-show="errors.has('role')" class="invalid-tooltip">{{ errors.first('role') }}</div>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="mode == 2 && role != ''">
              <b-col md="2">
                <label class="col-sm-12 control-label">*识别码的所有人:</label>
              </b-col>
              <b-col md="3">
                <CFacultyMultipleSelect v-on:pass="passUser"/>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*有效期:</label>
              </b-col>
              <b-col md="3">
                <el-date-picker
                  id="range"
                  v-model="range"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label for="comments"
                       class="col-sm-12 control-label">备注信息:</label>
              </b-col>
              <b-col md="8">
                  <textarea style="resize: none;" class="form-control"
                            v-model="remark"
                            id="comments" rows="3"></textarea>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
              </b-col>
              <b-col md="3">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="yes"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                         name="confirm" v-model="confirm">
                  <label class="custom-control-label" for="yes">确认</label>
                  <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                </div>
              </b-col>
              <b-col md="2">
                <b-button variant="success" @click="generate">生成（并自动发送）
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
          <div slot="footer">
            注意：如果生成失败，可以尝试清空后再生成。
          </div>
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="识别码(PIN)批量清空" name="third">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码(PIN)批量清空</strong>
          </div>
          <b-row>
            <b-col md="2" class="mt-1">
              <label class="col-sm-12 control-label">*选择清除的年份:</label>
            </b-col>
            <b-col md="5">
              <b-form-select id="year" style="width: 50%; float:left;" v-validate="'required'" name="info"
                             :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                             :plain="true"
                             :options="[2019,2020,2021,2022,2023,2024,2025]"
                             v-model="deleteInfo.value">
              </b-form-select>
            </b-col>
            <b-col md="2" class="my-1">
              <b-button style="width:150px;" variant="danger" @click="showDeleteAll">清除
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="识别码(PIN)批量发送" name="fourth">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码(PIN)批量发送</strong>
          </div>

          <b-row>
            <b-col md="2">
              <label class="col-sm-12 control-label">*选择发送年份:</label>
            </b-col>
            <b-col md="4">
              <b-form-select id="year" style="width: 50%; float:left;" v-validate="'required'" name="info"
                             :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                             :plain="true"
                             :options="[2019,2020,2021,2022,2023,2024,2025]"
                             v-model="sendInfo.value">
              </b-form-select>
            </b-col>
            <b-col md="2">
              <label class="col-sm-12 control-label">*选择发送种类（可复选）:</label>
            </b-col>
            <b-col md="2">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input id="choose" type="checkbox" name="role2"
                       class="custom-control-input"
                       value="4" v-model="sendRole">
                <label class="custom-control-label" for="choose">自评</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input id="advisor2" type="checkbox" name="role2"
                       class="custom-control-input"
                       value="5" v-model="sendRole">
                <label class="custom-control-label" for="advisor2">他评</label>
              </div>
            </b-col>
            <b-col md="2">
              <b-button variant="success" style="width:150px;" @click="sendPin">发送
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </el-tab-pane>
    </el-tabs>

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
        <h3>确认清除{{this.deleteInfo}}该年的识别码？</h3>
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
  import CPinTable from '../../components/tables/PinTable'
  import CUserSelect from '../../components/selects/UserSelect'
  import CPinSelect from '../../components/selects/PinSelect'
  import CFacultyMultipleSelect from "../../components/selects/FacultySelectMultiple";

  export default {
    name: 'FeedbackPin',
    components: {CFacultyMultipleSelect, CPinSelect, CUserSelect, CPinTable},
    data() {
      return {
        startTime: '',
        endTime: '',
        range: [],
        role: '',
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
        sendInfo: '',
        activeName: 'second',
        pinInfo: {
          year: '2018'
        },
      }
    },
    methods: {
      passUser(val) {
        this.user = val
      },
      passPin(val) {
        this.pin = val
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      sendPin() {
        for (let i = 0; i < this.sendRole.length; i++) {
          if (this.sendRole[i] == 4) {
            axios.get('/pin/send/feedback/self/' + this.sendInfo.value).then((response) => {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'success'
            });
          } else {
            axios.get('/pin/send/feedback/other/' + this.sendInfo.value).then((response) => {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'success'
            });
          }
        }
      },
      generate() {
        this.$validator.validateAll().then((result) => {
          // if (!result)
          //   return;
          let url = '/pin';

          this.startTime = date2Str(this.range[0], "yyyy-MM-dd hh:mm:ss");
          this.endTime = date2Str(this.range[1], "yyyy-MM-dd hh:mm:ss");
          let info = this.pinInfo.year;

          switch (this.mode) {
            case '1':
              url += '?startTime=' + this.startTime
                + '&endTime=' + this.endTime
                + '&role=' + this.role
                + '&info=' + info
                + '&remark=' + this.remark;
              axios.post(url).then((response) => {
                if (response.data.code === 2001) {
                  this.msg = response.data.msg;
                  this.showModal = true;
                  this.headerBgVariant = 'success'
                }
                else {
                  this.msg = response.data.msg;
                  this.showModal = true;
                  this.headerBgVariant = 'danger'
                }
              });
              break;
            case '2':
              for (let i = 0; i < this.user.length; i++) {
                url = '/pin/' + this.user[i].value
                  + '?startTime=' + this.startTime
                  + '&endTime=' + this.endTime
                  + '&role=' + this.role
                  + '&info=' + info
                  + '&remark=' + this.remark
                axios.post(url).then((response) => {
                  if (response.data.code === 2001) {
                    this.msg = '创建并发送成功！';
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
          }
        })
      },
      showDeleteAll() {
        this.showDeleteModal = true
      },
      deleteAll() {
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
