<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12" v-show="!showValidate && !pinValidate">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>评价工作区</strong>
          </div>
          <b-card-body>
            <h2 class="mt-3">
              <a style="color:blue;" href="#" @click="showValidate=true">点击这里</a>输入识别码。
            </h2>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <div v-show="pinValidate">
      <b-row>
        <b-col v-if="pinObject.role == 4" md="12">
          <b-card>
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>评价工作区</strong>
              <small>详情</small>
            </div>
            <b-card-body>
              <h4>你的年度自我评价：</h4>
              <b-form-textarea id="textarea1"
                               v-model="feedback.selfComment"
                               placeholder="你的评价"
                               :rows="20">
              </b-form-textarea>
              <hr/>
              <b-row>
                <b-col cols="6" md="6">
                  <b-button block class="btn btn-success" @click="turnIn">
                    提交
                  </b-button>
                </b-col>
                <b-col cols="6" md="6">
                  <b-button block class="btn btn-danger" @click="reset">
                    重置
                  </b-button>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col v-if="pinObject.role == 5" md="12">
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>评价列表</strong>
            </div>
            <b-container fluid>
              <b-row>
                <h4>年度他评：</h4>
                <p>在列表中评价他人，并进行星级评定</p>
                <hr/>
              </b-row>

              <!-- User Interface controls -->
              <b-row>
                <b-col md="1" class="my-1">
                  <legend class="col-form-legend">每页显示：</legend>
                </b-col>
                <b-col md="1" class="my-1">
                  <b-form-group>
                    <b-form-select :options="pageOptions" v-model="perPage"/>
                  </b-form-group>
                </b-col>
                <b-col md="6" class="my-1"></b-col>
                <b-col md="4" class="my-1">
                  <b-form-group>
                    <b-input-group>
                      <b-input-group-button>
                        <div class="mt-2">
                          搜索：
                        </div>
                      </b-input-group-button>
                      <b-form-input v-model="filter"/>
                      <b-input-group-button>
                        <b-button variant="danger" :disabled="!filter" @click="filter = ''">重置</b-button>
                      </b-input-group-button>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <!-- Main table element -->
              <b-table show-empty
                       stacked="md"
                       ref="feedbackTable"
                       :striped=true
                       :fixed=true
                       :hover=true
                       :items="feedbackTable"
                       :fields="field"
                       :current-page="currentPage"
                       :per-page="perPage"
                       :filter="filter"
                       :sort-by.sync="sortBy"
                       :sort-desc.sync="sortDesc"
                       :isBusy="false"
                       @filtered="onFiltered"
              >
                <template slot="index" slot-scope="row">
                  {{(currentPage-1) * perPage + 1 + row.index}}
                </template>

                <template slot="actions" slot-scope="row">
                  <i style="cursor: pointer; margin-top:5px; color: green;" class="fa fa-pencil" title="填写评价"
                     @click.stop="row.toggleDetails"> 填写评价
                  </i>
                </template>

                <template slot="row-details" slot-scope="row">
                  <b-card>
                    <b-list-group>
                      <b-list-group-item title="评价" class="flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">被评人 <strong>{{row.item.fname}}</strong></h5>
                        </div>
                        <hr/>
                        <div class="mr-1">
                          <b-row>
                            <b-col md="9">
                              <dl class="row">
                                <dt class="col-sm-2">被评人的自评:</dt>
                                <dd class="col-sm-9">{{row.item.selfComment}}</dd>
                              </dl>

                              <dl class="row">
                                <dt class="col-sm-2">星级评价:</dt>
                                <dd class="col-sm-5">
                                  <el-rate
                                    v-model="rate.star"
                                    show-score
                                    :allow-half=true
                                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                                  </el-rate>
                                </dd>
                              </dl>
                              <dl class="row">
                                <dt class="col-sm-2">你的评价:</dt>
                                <dd class="col-sm-9">
                                  <b-form-textarea id="textarea1"
                                                   v-model="rate.comment"
                                                   placeholder="你的评价"
                                                   :rows="6">
                                  </b-form-textarea>
                                </dd>
                              </dl>
                              <dl class="row">
                                <dt class="col-sm-1">操作:</dt>
                                <dd class="col-sm-5">
                                  <b-button size="md" class="btn btn-success"
                                            @click.stop="turnInComment(row.item, row.index)">
                                    提交
                                  </b-button>
                                  <b-button size="md" class="btn btn-danger"
                                            @click.stop="row.toggleDetails">
                                    取消
                                  </b-button>
                                  <b-button size="md" class="btn btn-info"
                                            @click.stop="rate.comment = rate.star= ''">
                                    重置
                                  </b-button>
                                </dd>
                              </dl>
                            </b-col>
                            <b-col md="3">
                              <dl class="row">
                                <dt class="col-sm-4">被评人：</dt>
                                <dd class="col-sm-8">
                                  <img v-if="isNotEmpty(row.item.profile)"
                                       :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                                       style="width: 80%"
                                       class="img-avatar">
                                  <img v-else
                                       src="/static/img/logo.png"
                                       style="width: 80%"
                                       class="img-avatar">
                                </dd>
                              </dl>
                            </b-col>
                          </b-row>
                        </div>
                      </b-list-group-item>
                    </b-list-group>
                  </b-card>
                </template>
              </b-table>
              <b-row>
                <b-col md="6" class="my-1">
                  <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                                class="my-0"/>
                </b-col>
                <b-col md="6" class="my-1">
                  <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至
                    {{((currentPage-1) *
                    perPage + perPage) <=
                    totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
                </b-col>
              </b-row>
            </b-container>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <b-modal title="识别码验证" header-bg-variant="info"
             centered hide-footer
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
             v-model="showValidate">
      <b-input-group class="mb-6">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <a href="#" v-b-tooltip title="填写6位数字识别码，识别码请在消息中心或者管理员处获取。">*请输入6位识别码:</a>
          </span>
        </div>
        <input class="form-control" name="pin" v-model="pin"
               v-validate="'required|numeric|min:6|max:6'"
               :class="{'is-invalid': errors.has('pin')}">
        <div v-show="errors.has('pin')" class="invalid-tooltip">{{ errors.first('pin') }}</div>
      </b-input-group>
      <b-btn class="mt-3" variant="outline-success" block @click="validate">验证识别码</b-btn>
    </b-modal>

    <b-modal v-model="showModal" size="sm" @ok="$router.push({path: '/dashboard'})" :header-bg-variant="headerBgVariant"
             ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>

    <b-modal v-model="showModal2" size="sm" :header-bg-variant="headerBgVariant"
             ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {FacultySelect} from '../../components/'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'fname', label: '被评人', sortable: true},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'Feedback_Fill',
    components: {FacultySelect},
    data() {
      return {
        pinObject: '',
        pin: '',
        pinValidate: false,
        showValidate: true,
        feedback: {
          comment: ''
        },
        counter: 0,
        msg: '',
        field: field,
        currentPage: 1,
        perPage: 15,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        showModal: false,
        showModal2: false,
        headerBgVariant: '',
        basePath: basePath,
        faculty: '',
        rate: {
          star: '',
          comment: ''
        }
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
      },
    },
    watch: {
      faculty() {
        this.initTable()
      }
    },
    mounted() {
      if (this.pinObject === null || this.pinObject === '') {
        return
      }
      this.showValidate = false
      this.pinValidate = true
      this.initFacultyInfo()
    },
    methods: {
      passFaculty(val) {
        this.faculty = val
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      feedbackTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/feedback?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.faculty))
          url += '&facultyId=' + this.faculty.value
        if (this.isNotEmpty(this.pinObject))
          url += '&info=' + this.pinObject.info
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        return axios.get(url).then((response) => {
          let items = response.data.data;
          for (let i = 0; i < items.length; i++) {
            if (items[i].facultyId === this.pinObject.ownerId) {
              this.$delete(items, i);
              this.totalRows = response.data.recordsTotal - 1;
            }
            if (this.isNotEmpty(this.feedback.comment)) {
              let complete = this.feedback.comment.split("/");
              for (let j = 0; j < complete.length; j++)
                if (items[i].facultyId === complete[j]) {
                  this.$delete(items, i);
                  this.totalRows = response.data.recordsTotal - 1;
                }
            }
          }
          return (items || [])
        })
      },
      initTable() {
        this.$refs.feedbackTable.refresh()
      },
      validate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;
          axios.get('/pin/' + this.pin).then((response) => {
            if (response.data.code === 2001 &&
              (response.data.data.role == 4 || response.data.data.role == 5)) {
              this.pinObject = response.data.data;
              this.initFacultyInfo();
              this.pinValidate = true;
              this.showValidate = false
            }
            else {
              this.msg = '识别码验证失败！  ';
              this.headerBgVariant = 'danger';
              this.showModal = true
            }
          })
        })
      },
      initFacultyInfo() {
        axios.get('/feedback/find/' + this.pinObject.ownerId).then((response) => {
          if (response.data.code === 2001) {
            this.feedback = response.data.data;
            this.initTable()
          } else {
            this.msg = response.data.msg;
            this.headerBgVariant = 'danger';
            this.showModal = true
          }
        })
      },
      turnIn() {
        axios.put('/feedback/' + this.feedback.id, this.feedback).then((response) => {
          if (response.data.code === 2001) {
            this.headerBgVariant = 'success';
          } else {
            this.headerBgVariant = 'danger';
          }
          this.msg = response.data.msg;
          this.showModal = true;

        })
      },
      reset() {
        this.feedback.selfComment = '';
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      turnInComment(item) {
        let rateArray = [];
        if (this.isNotEmpty(item.rate)) {
          rateArray = JSON.parse(item.rate);
        }
        rateArray.push(this.rate);

        item.rate = JSON.stringify(rateArray);

        axios.put('/feedback/' + item.id, item).then((response) => {
          if (response.data.code === 2001) {
            this.headerBgVariant = 'success';
            this.rate = {
              star: '',
              comment: ''
            };
            this.feedback.comment += '/' + item.facultyId;
            axios.put('/feedback/' + this.feedback.id, this.feedback);
            this.initTable();
          } else {
            this.headerBgVariant = 'danger';
          }
          this.msg = response.data.msg;
          this.showModal2 = true
        })
      }
    }

  }

</script>
