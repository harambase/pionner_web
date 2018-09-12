<template>
  <div class="animated fadeIn">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="辅导关系列表" name="first">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>辅导关系列表</strong>
          </div>
          <b-row>
            <CAdviseTable showAdvisor="1"/>
          </b-row>
        </b-card>
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>辅导关系表格下载</strong>
          </div>
          <b-row>
            <b-col md="2" class="mr-1">
              <legend class="col-form-legend">选择下载的学期：</legend>
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
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="新增辅导关系" name="second">
        <b-card
          header-tag="header"
          footer-tag="footer" style="height:700px;">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>新增辅导关系</strong>
          </div>
          <b-row class="mt-1">
            <b-col sm="4" lg="4">
              <b-card no-body class="">
                <b-card-body class="pb-0">
                  <CInfoSelect v-on:pass="passCreateInfo"/>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
          <b-row class="mt-1" v-if="isNotEmpty(createInfo)">
            <b-col sm="4" lg="4">
              <b-card no-body class="">
                <b-card-body class="pb-0">
                  <CAdvisorSelect v-on:pass="passAdvisor"/>
                  <CStudentSelectMultiple v-on:pass="passStudent"/>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col sm="4" lg="4">
              <b-card no-body class="">
                <b-card-body class="pb-0">
                  <b-input-group-button class="mb-1">
                    <b-button variant="success" block @click="createAdvise">新增
                    </b-button>
                  </b-input-group-button>
                </b-card-body>
              </b-card>
            </b-col>

          </b-row>
          <div slot="footer">
            <i className="fa fa-align-justify"></i><strong>注意：学生可以多选</strong>
          </div>
        </b-card>

      </el-tab-pane>
      <el-tab-pane label="辅导申请管理" name="third">
        <b-row>
          <b-col md="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>辅导关系申请列表</strong>
              </div>
              <CRequestAdvisorTable mode="manage"/>
            </b-card>
          </b-col>
          <b-col cols="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>辅导关系申请列表下载</strong>
              </div>
              <b-container fluid>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-input-group-button>
                      <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadRequestAdvise">下载
                      </b-button>
                    </b-input-group-button>
                  </b-col>
                </b-row>
              </b-container>
            </b-card>
          </b-col>
        </b-row>
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
  import CRequestAdvisorTable from '../../components/tables/RequestAdvisorTable';

  export default {
    name: 'Advise',
    components: {CAdvisorSelect, CStudentSelectMultiple, CInfoSelect, CAdviseTable, CRequestAdvisorTable},
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
      downloadRequestAdvise() {
        window.open(basePath + '/request/advise/download?token=' + window.localStorage.getItem('access_token'))
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
