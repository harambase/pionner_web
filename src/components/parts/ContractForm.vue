<template>
  <div class="animated fadeIn">
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
                         :options="[{ text: '春季入学', value: '01' },{ text: '秋季入学', value: '02' }, { text: '夏季入学', value: '03' }]"
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
            <input type="radio" value="100" id="intro"
                   :class="{'custom-control-input': true, 'is-invalid': errors.has('type')}"
                   name="type" v-model="contract.type" v-validate="'required'">
            <label class="custom-control-label" for="intro">劳动合同</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" value="200" id="median"
                   :class="{'custom-control-input': true, 'is-invalid': errors.has('type')}"
                   name="type" v-model="contract.type" v-validate="'required'">
            <label class="custom-control-label" for="median">入学协议</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" value="300" id="advance"
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
          <CUserSelect v-on:pass="passUser"/>
        </b-col>
      </b-row>
      >
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
        <b-col md="2" class="my-1" v-if="!showDocument && isNotEmpty(contract.courseInfo)">
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
              点击下载-> <a href="#" style="cursor: pointer;" @click="documentDownload">{{contract.courseInfo.name}}</a>
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
          <b-button style="width:150px;" class="btn btn-success"
                    @click="update">修改合同
          </b-button>
          <b-button style="margin-left: 32%; width:150px;" class="btn btn-success"
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
    data() {
      return {
        url: this.$route.fullPath,
        info: {
          year: '2018',
          semester: '01'
        },
        contract: {
          contractId: '',
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
    methods: {
      passUser(val) {
        this.user = val;
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      create(){

      },
      update(){

      }
    }
  }


</script>
