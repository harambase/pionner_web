<template>
  <div class="animated fadeIn">
    <b-row>
      <b-card
        header-tag="header"
        footer-tag="footer">
        <b-container fluid>
          <!-- User Interface controls -->
          <b-row>
            <b-col md="6" class="my-1">
              <b-form-group horizontal label="Filter" class="mb-0">
                <b-input-group>
                  <b-form-input v-model="filter" placeholder="Type to Search"/>
                  <b-input-group-button>
                    <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                  </b-input-group-button>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="6" class="my-1">
              <b-form-group horizontal label="Sort" class="mb-0">
                <b-input-group>
                  <b-form-select v-model="sortBy" :options="sortOptions">
                    <option slot="first" :value="null">-- none --</option>
                  </b-form-select>
                  <b-input-group-button>
                    <b-form-select :disabled="!sortBy" v-model="sortDesc">
                      <option :value="true">Asc</option>
                      <option :value="false">Desc</option>
                    </b-form-select>
                  </b-input-group-button>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col md="6" class="my-1">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0"/>
            </b-col>
            <b-col md="6" class="my-1">
              <b-form-group horizontal label="Per page" class="mb-0">
                <b-form-select :options="pageOptions" v-model="perPage"/>
              </b-form-group>
            </b-col>
          </b-row>

          <!-- Main table element -->
          <b-table show-empty
                   stacked="md"
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
            <template slot="name" slot-scope="row">{{row.value.crn}} ({{row.value.level}}-{{row.value.section}})</template>
            <template slot="status" slot-scope="row">{{row.value ? '1' : '0'}}</template>
            <template slot="actions" slot-scope="row">
              <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
              <b-button size="sm" @click.stop="row.toggleDetails">
                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
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
        </b-container>
      </b-card>
    </b-row>
    <!--<b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">-->
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
          {key: 'name', label: '课程名（等级-班级）', sortable: true, 'class': 'text-center'},
          {key: 'capacity', label: '容量', sortable: true},
          {key: 'remain', label: '剩余', sortable: true},
          {key: 'status', label: '状态', sortable: true},
          {key: 'date', label: '起止时间', sortable: true},
          {key: 'time', label: '上课时间', sortable: true},
          {key: 'day', label: '星期', sortable: true},
          {key: 'faculty', label: '授课老师', sortable: true}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: items.length,
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
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      courseTable (ctx) {
        // Here we don't set isBusy prop, so busy state will be handled by table itself
        this.isBusy = true
        console.log(ctx);
        let promise = axios.get('/course?start=' + ctx.currentPage
          + '&length=' + ctx.perPage //+ '&search=' + ctx.filter
//          + '&order=' + ctx.sortDesc + '&orderCol=' + ctx.sortBy)
          + '&order=desc&orderCol=0')

        // Must return a promise that resolves to an array of items
        return promise.then((data) => {
          // Pluck the array of items off our axios response
          console.log(data)
          let items = data.data.data
          // Must return an array of items or an empty array if an error occurred
          return(items || [])
        })
      }









//      initPin: function () {
//        axios.get('/pin/session').then((response) => {
//          if (response.data.code === 2001) {
//            this.initStudentInfo()
////            courseTable.draw()
//            this.pinValidate = true
//            if (isNotEmpty(window.localStorage.getItem('chooseVue'))) {
//              let data = JSON.parse(window.localStorage.getItem('chooseVue'))
//              this.pin = data.pin
//              this.tol_credits = data.tol_credits
//              this.use_credits = data.use_credits
//              this.ava_credits = data.ava_credits
//              this.counter = data.counter
//              this.crnList = data.crnList
//              this.worksheet = data.worksheet
//              window.localStorage.clear()
//            }
//          }
//        })
//      },
//      initStudentInfo: function () {
//        axios.get('/user/current').then((response) => {
//          initStudent(response.data.data.userId)
//        })
//
//        function initStudent (studentId) {
//          axios.get('/student/' + studentId + '/available/credit').then((response) => {
//            if (response.data.code === 2001) {
//              this.tol_credits = response.data.data.tol_credits
//              this.use_credits = response.data.data.use_credits
//              this.ava_credits = response.data.data.ava_credits
//            } else {
//              this.msg = response.data.msg
//              this.headerBgVariant = 'danger'
//              this.showModal = true
//            }
//
//          })
//        }
//      },
//      reset: function () {
//        this.worksheet = "";
//        this.initStudentInfo();
//      },
//      submit: function () {
//
//        let choiceList = [];
//        if (this.crnList.length === 0) {
//          this.msg = "没有选择任何课程!";
//          this.showModal = true;
//          this.headerBgVariant = 'danger';
//          return;
//        }
//        for (let i = 0; i < this.crnList.length; i++) {
//          let newId = "input_" + this.crnList[i];
//          let input = document.getElementById(newId);
//          if (input !== null) {
//            choiceList.push(this.crnList[i]);
//          }
//        }
//
//        axios.post('/course/choose',{
//          choiceList: choiceList
//        }).then((response) => {
//          let failList = response.data.data.failList;
//          if (failList.length === 0){
//            this.msg = "全部注册成功!";
//            this.showModal = true;
//            this.headerBgVariant = 'danger';
//            this.worksheet = "";
//            this.initStudentInfo();
//          } else {
//            let html = '<table style="text-align: left">';
//            for (let i = 0; i < failList.length; i++) {
//              html += '<tr><td>' + failList[i] + '</td></tr>';
//            }
//            let input = '<p style="color: red">课程注册失败详情</p>' + html + '</table>';
//            this.worksheet = "";
//            this.msg = input
//            this.initStudentInfo();
//          }
//        });
//      }
    }
  }
</script>
