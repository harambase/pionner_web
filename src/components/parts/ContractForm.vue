<template>
  <div>
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
                         :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                         :plain="true"
                         :options="[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]"
                         v-model="info.year">
          </b-form-select>

          <b-form-select id="info" style="width: 50%" v-validate="'required'" name="info"
                         :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                         :plain="true"
                         :options="[{ text: '春季', value: '01' },{ text: '秋季', value: '02' }, { text: '夏季', value: '03' }]"
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
        <i className="fa fa-align-justify"></i><strong>合同基本信息</strong>
      </div>
      <b-row>
        <b-col md="2" class="my-1">
          <label class="col-sm-12 control-label">*合同所有人名:</label>
        </b-col>
        <b-col md="3" class="my-1">
          <input :class="{'form-control': true, 'is-invalid': errors.has('name')}" name="name"
                 v-validate="'required|min:1|max:20'"
                 v-model="contract.oname"/>
          <div v-show="errors.has('name')" class="invalid-tooltip">{{ errors.first('name') }}</div>
        </b-col>
        <b-col md="2" class="my-1">
          <label class="col-sm-12 control-label">*类型:</label>
        </b-col>
        <b-col md="3" class="my-1">
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" value="劳动合同" id="intro"
                   :class="{'custom-control-input': true, 'is-invalid': errors.has('type')}"
                   name="type" v-model="contract.type" v-validate="'required'">
            <label class="custom-control-label" for="intro">劳动合同</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" value="入学协议" id="median"
                   :class="{'custom-control-input': true, 'is-invalid': errors.has('type')}"
                   name="type" v-model="contract.type" v-validate="'required'">
            <label class="custom-control-label" for="median">入学协议</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" value="志愿者服务协议" id="advance"
                   :class="{'custom-control-input': true, 'is-invalid': errors.has('type')}"
                   name="type" v-model="contract.type" v-validate="'required'">
            <label class="custom-control-label" for="advance">志愿者服务协议</label>
          </div>
          <div v-show="errors.has('type')" class="invalid-tooltip">{{ errors.first('type') }}</div>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="2" class="my-1">
          <label class="col-sm-12 control-label">*周期:</label>
        </b-col>
        <b-col md="3" class="my-1">
          <el-date-picker
            v-model="contractRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="form-control"
            size="mini"
            style="height: 34px; width: 100%; padding: 5px 12px;"
          >
          </el-date-picker>
        </b-col>
      </b-row>
    </b-card>
    <b-card
      header-tag="header"
      footer-tag="footer">
      <div slot="header">
        <i className="fa fa-align-justify"></i><strong>合同所有人</strong>
      </div>
      <b-row>
        <b-col md="2">
          <label class="control-label">*所有人:</label>
        </b-col>
        <b-col md="3">
          <CUserSelect v-on:pass="passUser" :passUser="user"/>
        </b-col>
      </b-row>
    </b-card>
    <b-card
      header-tag="header"
      footer-tag="footer">
      <div slot="header">
        <i className="fa fa-align-justify"></i><strong>更多信息</strong>
      </div>
      <b-row v-if="!showDocument">
        <b-col md="2" class="my-1">
          <label class="col-sm-12 control-label">上传合同:</label>
        </b-col>
        <b-col md="6" class="my-1">
          <input type="file" id="document">
        </b-col>
        <b-col md="2" class="my-1" v-if="showUpload">
          <b-button style="width: 100%" class="btn btn-info my-1" @click="documentUpload">
            上传
          </b-button>
        </b-col>
        <b-col md="2" class="my-1" v-if="!showDocument && isNotEmpty(contract.contractInfo)">
          <b-button style="width: 100%" class="btn btn-success"
                    @click="showDocument = true">
            取消替换
          </b-button>
        </b-col>
      </b-row>
      <b-row v-if="showDocument">
        <b-col md="2" class="my-1">
          <label class="col-sm-12 control-label">入学大纲:</label>
        </b-col>
        <b-col md="6" class="my-1">
          <b-row>
            <b-col md="6">
              点击下载-> <a href="#" style="cursor: pointer;" @click="documentDownload">{{contract.contractInfo.name}}</a>
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
                     rows="3" v-model="contract.comment">
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
          <b-button style="width:150px;" class="btn btn-info" v-if="isNotEmpty(id)"
                    @click="update">修改合同
          </b-button>
          <b-button style="width:150px;" class="btn btn-cancel" v-if="isNotEmpty(id)"
                    @click="cancel">取消修改
          </b-button>
          <b-button style="margin-left: 32%; width:150px;" class="btn btn-success" v-else
                    @click="create"> 创建合同
          </b-button>

        </b-col>
      </b-row>
    </b-card>
    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             @ok="$router.go({path: '/logistic/contract'})"
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
  import CUserSelect from "../selects/UserSelect";

  export default {
    name: 'c-contractForm',
    components: {CUserSelect},
    props: ['id'],
    data() {
      return {
        url: this.$route.fullPath,
        info: {
          year: '2018',
          semester: '01'
        },
        contract: {
          id: '',
          contractId: '',
          ownerId: '',
          oname: '',
          info: '',
          type: '',
          expireDate: '',
          initDate: '',
          operatorId: '',
          contractInfo: '',
          comment: '',
        },
        contractRange: [],
        showDocument: false,
        confirm: false,
        msg: '',
        showModal: false,
        headerBgVariant: '',
        goToUrl: '',
        showUpload: false,
        user: ''
      }
    },
    watch: {
      id: function (val) {
        if (isNotEmpty(val))
          this.init();
      }
    },
    methods: {
      documentDownload() {
        window.open(basePath + '/contract/info/' + this.contract.id + '?token=' + window.localStorage.getItem('access_token'))
      },

      cancel(){
        this.$emit('pass', '')
      },
      init() {
        axios.get('/contract/' + this.id).then(response => {
          this.contract = response.data.data;

          let info = this.contract.info.split("-");
          this.info.year = info[0];
          this.info.semester = info[1];

          this.contractRange = [new Date(this.contract.initDate), new Date(this.contract.expireDate)];

          if (isNotEmpty(this.contract.contractInfo)) {
            this.contract.contractInfo = JSON.parse(this.contract.contractInfo);
            this.showDocument = true
          }

          if (isNotEmpty(this.contract.ownerId)){
            axios.get('/user/' + this.contract.ownerId).then((response) => {
              let name = response.data.data.lastName + ', ' + response.data.data.firstName;
              let profilePath = '/static/img/logo.png';
              if (isNotEmpty(response.data.data.profile)) {
                let profile = JSON.parse(response.data.data.profile);
                profilePath = basePath + '/static' + profile.path
              }
              this.user = {
                label: name,
                value: response.data.data.userId,
                profile: profilePath
              }
            });
          }
        })

      },
      passUser(val) {
        this.user = val;
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      prepare() {
        this.contract.initDate = date2Str(this.contractRange[0], 'yyyy-MM-dd');
        this.contract.expireDate = date2Str(this.contractRange[1], 'yyyy-MM-dd');
        this.contract.info = this.info.year + "-" + this.info.semester;
        this.contract.ownerId = this.user.value;
      },
      create() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.prepare();

          axios.post('/contract', this.contract).then((response) => {
            if (response.data.code === 2001) {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'success';
              this.contract = response.data.data;
              this.documentUpload();
            }
            else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      update() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.prepare();

          axios.put('/contract/' + this.id, this.contract).then((response) => {
            if (response.data.code === 2001) {
              this.msg = response.data.msg;
              this.headerBgVariant = 'success';
              this.showModal = true;
              this.contract = response.data.data;
              this.documentUpload();
            }
            else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      documentUpload() {

        if (!isNotEmpty(document.getElementById('document').files)[0]) {
          return;
        }

        let formData = new FormData();
        formData.append('file', document.getElementById('document').files[0]);

        let url = '/contract/info/' + this.contract.id;

        axios.put(url, formData).then((response) => {
          if (response.data.code === 2001) {
            this.showDocument = true;
            if (this.showUpload) {
              this.contract.contractInfo = response.data.data;
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
    }
  }


</script>
