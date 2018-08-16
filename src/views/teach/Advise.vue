<template>
  <div class="animated fadeIn">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="辅导关系列表" name="first">
        <b-container fluid>
          <b-row>
            <b-card>
              <b-row>
                <b-col md="1" class="mr-1">
                  <legend class="col-form-legend">辅导关系表格：</legend>
                </b-col>
                <b-col md="3" class="mr-1">
                  <CInfoSelect v-on:pass="passInfo"/>
                </b-col>
                <b-col md="6" class="mr-1">
                  <b-input-group-button>
                    <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadAdvise"
                              :disabled="!isNotEmpty(info)">下载
                    </b-button>
                  </b-input-group-button>
                </b-col>
              </b-row>
              <b-row>
                <CAdviseTable showAdvisor="1"/>
              </b-row>
            </b-card>
          </b-row>
        </b-container>
      </el-tab-pane>
      <el-tab-pane label="新增辅导关系" name="second">
        <b-container fluid>
          <b-card
            header-tag="header"
            footer-tag="footer" style="height:350px;">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>新增辅导关系</strong>
            </div>
            <b-row>
              <b-col md="1">
                <label class="col-sm-12 control-label">*添加学期:</label>
              </b-col>
              <b-col md="3">
                <CInfoSelect v-on:pass="passCreateInfo"/>
              </b-col>
            </b-row>
            <b-row v-if="isNotEmpty(createInfo)" class="mt-1">
              <b-col md="1">
                <label class="col-sm-12 control-label">*选择导师:</label>
              </b-col>
              <b-col md="3">
                <CAdvisorSelect v-on:pass="passAdvisor"/>
              </b-col>
              <b-col md="1">
                <label class="col-sm-12 control-label">*选择学生:</label>
              </b-col>
              <b-col md="3">
                <CStudentSelectMultiple v-on:pass="passStudent"/>
              </b-col>
              <b-col md="4" class="my-1">
                <b-input-group-button>
                  <b-button class="btn btn-success" style="width: 150px;" @click="createAdvise">新增
                  </b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
            <div slot="footer">
              <i className="fa fa-align-justify"></i><strong>注意：学生可以多选</strong>
            </div>
          </b-card>
        </b-container>
      </el-tab-pane>
      <el-tab-pane label="辅导申请管理" name="third">

      </el-tab-pane>
    </el-tabs>
    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             @ok="$router.go(0)"
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
  import CAdviseTable from '../../components/tables/AdviseTable'
  import CInfoSelect from '../../components/selects/InfoSelect'
  import CStudentSelectMultiple from "../../components/selects/StudentSelectMultiple";
  import CAdvisorSelect from "../../components/selects/AdvisorSelect";

  export default {
    name: 'Advise',
    components: {CAdvisorSelect, CStudentSelectMultiple, CInfoSelect, CAdviseTable},
    data() {
      return {
        info: '',
        student: '',
        advisor: '',
        createInfo: '',
        activeName: 'first',
        showModal: false,
        headerBgVariant: '',
        confirm: false,
        msg: ''
      }
    },

    methods: {
      passInfo(val) {
        this.info = val
      },
      passStudent(val) {
        this.student = val;
      },
      passAdvisor(val) {
        this.advisor = val;
      },
      passCreateInfo(val) {
        this.createInfo = val;
      },
      createAdvise() {
        let fail = false;
        for (let i = 0; i < this.student.length; i++) {
          let advise = {
            studentId: this.student[i].value,
            facultyId: this.advisor.value,
            info: this.createInfo.value,
          };
          axios.post('/advise', advise).then(response => {
            if (response.data.code !== 2001) {
              this.msg = response.data.msg + this.student[i].label + '有异常！'
              this.showModal = true;
              this.headerBgVariant = 'danger'
              fail = true;
            }
          })
        }
        if (!fail) {
          this.msg = '创建成功';
          this.showModal = true;
          this.headerBgVariant = 'success'
        }
      },
      downloadAdvise() {
        window.open(basePath + '/advise/download/' + this.info.value + '?token=' + window.localStorage.getItem('access_token'))
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
