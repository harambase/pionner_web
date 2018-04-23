<template>
  <div class="animated fadeIn">
    <b-row id="myCoursePage">
      <b-col cols="12">
        <b-card>
          <b-row>
            <b-col cols="3">
              <b-list-group>
                <b-list-group-item class="d-flex justify-content-between align-items-center">
                  <b-button>写一个新InMsg</b-button>
                </b-list-group-item>

                <b-list-group-item @click="inbox" href="#" class="d-flex justify-content-between align-items-center">
                  收件箱
                  <b-badge variant="primary" pill> {{unread}}</b-badge>
                </b-list-group-item>
                <b-list-group-item @click="sent" href="#" class="d-flex justify-content-between align-items-center">
                  已发送
                </b-list-group-item>
                <b-list-group-item @click="important" href="#"
                                   class="d-flex justify-content-between align-items-center">
                  重要
                  <b-badge variant="primary" pill>{{ importantNum}}</b-badge>
                </b-list-group-item>
                <b-list-group-item @click="draft" href="#" class="d-flex justify-content-between align-items-center">
                  草稿
                  <b-badge variant="primary" pill>{{saved}}</b-badge>
                </b-list-group-item>
                <b-list-group-item @click="deleted" href="#" class="d-flex justify-content-between align-items-center">
                  已删除
                  <b-badge variant="primary" pill>{{trashed}}</b-badge>
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col v-show="table" cols="9">
              <b-card
                header-tag="header"
                footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>您的信息列表</strong>
                </div>

                <b-container fluid>
                  <!-- User Interface controls -->
                  <b-row>
                    <b-col md="2" class="my-1">
                      <legend class="col-form-legend">每页显示：</legend>
                    </b-col>
                    <b-col md="3" class="my-1">
                      <b-form-group>
                        <b-form-select :options="pageOptions" v-model="perPage"/>
                      </b-form-group>
                    </b-col>
                    <b-col md="3" class="my-1"></b-col>
                    <b-col md="3" class="my-1">
                      <b-form-group>
                        <b-input-group>
                          <b-input-group-button>
                            <b-button disabled><i class="fa fa-search"></i></b-button>
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
                           ref="messageTable"
                           :fixed=true
                           :hover=true
                           :items="messageTable"
                           :fields="field"
                           :current-page="currentPage"
                           :per-page="perPage"
                           :filter="filter"
                           :sort-by.sync="sortBy"
                           :sort-desc.sync="sortDesc"
                           :isBusy="false"
                           @filtered="onFiltered"
                  >
                    <template slot="actions" slot-scope="row">
                      <b-list-group>
                        <b-list-group-item href="#" class="flex-column align-items-start" @click="showMsg(row.item.id)">
                          <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1"><strong>{{row.item.title}}</strong> {{row.item.subject}}</h5>
                            <small>发送时间：{{row.item.date}}</small>
                            <b-badge variant="primary" pill v-if="row.item.status=='unread'">未读</b-badge>
                          </div>
                          <hr/>
                          <b-row>
                            <b-col md="2" class="my-1">
                              <img v-if="isNotEmpty(row.item.pic)"
                                   :src="basePath + '/pioneer' + JSON.parse(row.item.pic).path"
                                   style="width: 40px;height: 40px"
                                   class="img-avatar">
                              <img v-else
                                   :src="basePath + '/pioneer/image/profile/logo.png'"
                                   style="width: 40px;height: 40px"
                                   class="img-avatar">
                              {{row.item.sender}}
                            </b-col>
                            <b-col md="10">
                              <p class="mb-1">
                                {{row.item.body}}
                              </p>
                              <small>{{row.item.attachment}}</small>
                            </b-col>
                          </b-row>
                        </b-list-group-item>
                      </b-list-group>
                    </template>
                  </b-table>
                  <b-col md="6" class="my-1">
                    <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                                  class="my-0"/>
                  </b-col>
                </b-container>

              </b-card>
            </b-col>
            <b-col v-show="detail" cols="9">
              <b-card
                header-tag="header"
                footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>信息详情</strong>
                  <b-button class="btn btn-primary btn-info"
                            @click="back">
                    <i class="fa fa-arrow-left"></i> 返回列表
                  </b-button>
                </div>
                {{message}}
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

  const items = []
  const field = [
    {key: 'actions', label: '消息列表'}
  ]

  export default {
    name: 'message',
    data () {
      return {
        unread: 0,
        importantNum: 0,
        saved: 0,
        trashed: 0,
        box: 'inbox',
        showWrite: false,
        detail: false,
        table: true,
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
        sortDesc: false,
        filter: null,
        items: items,
        basePath: basePath,
        message: ''
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.initImportant()
        this.initUnread()
        this.initDraft()
        this.initTrash()
      },
      initImportant () {
        axios.get('/message/count?status=unread&box=important').then((response) => {
          this.importantNum = response.data.data
        })
      },

      initUnread () {
        axios.get('/message/count?status=unread&box=inbox').then((response) => {
          this.unread = response.data.data
        })
      },

      initDraft () {
        axios.get('/message/count?status=saved&box=draft').then((response) => {
          this.saved = response.data.data
        })
      },

      initTrash () {
        axios.get('/message/count?status=trashed&box=trash').then((response) => {
          this.trashed = response.data.data
        })
      },
      showMsg (id) {
        axios.get('/message/' + id).then((response) => {
          this.message = response.data.data
          this.table = false
          this.detail = true
        })
      },
      inbox () {
        this.box = 'inbox'
        this.initTable()
      },
      sent () {
        this.box = 'sent'
        this.initTable()
      },
      draft () {
        this.box = 'draft'
        this.initTable()
      },
      important () {
        this.box = 'important'
        this.initTable()
      },
      deleted () {
        this.box = 'trash'
        this.initTable()
      },
      write () {
        this.showWrite = true
      },
      back () {
        this.detail = false
        this.table = true
      },
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.messageTable.refresh()
      },
      messageTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/message/list?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (this.isNotEmpty(this.box))
          url += '&box=' + this.box
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
    }
  }

  // function markAsRead(id) {
  //   let status = "read";
  //   sendStatusUpdateAjax(id, status);
  // }
  //
  // function markAsUnread(id) {
  //   let status = "unread";
  //   sendStatusUpdateAjax(id, status);
  // }
  //
  // function sendStatusUpdateAjax(id, status) {
  //   axios.put('/message/' + id + '/status?status=' + status).then((response)=> {
  //     if (response.data.code === 2001) {
  //       messageVue.init();
  //       this.initTable();
  //     }
  //     else
  //       Showbo.Msg.alert("消息更新失败!", function () {
  //       });
  //   });
  // }
  //
  // function deleteMsg(id) {
  //   Showbo.Msg.confirm("确认删除该用户？", function () {
  //     if ($(".btnfocus").val() !== "取消") {
  //       axios.delete('/message/' + id).then((response)=> {
  //         if (response.data.code === 2001) {
  //           messageVue.init();
  //           this.initTable();
  //         }
  //         else
  //           Showbo.Msg.alert("消息删除失败!", function () {
  //           });
  //       });
  //     }
  //   });
  // }
  //
  // function viewDraft(id) {
  //   axios.get('/message/' + id).then((response)=> {
  //     messageVue.$data.showWrite = true;
  //     writeVue.$data.message = response.data.data;
  //   });
  // }
  //
  // function viewDetail(id) {
  //   markAsRead(id);
  //   axios.get('/message/' + id).then((response)=> {
  //     if (response.data.code === 2001) {
  //       let message = response.data.data;
  //       messageVue.$data.detail = true;
  //       messageVue.$data.table = false;
  //       let senderInfo =
  //         '<img class="human-picture" src="' + message.pic + '">' +
  //         '   <div class="name"><h2 class="name-h ng-binding">发件人：' + message.sender + '</h2>' +
  //         '       <div>' +
  //         '           <span class="mail-tag tag label family">' + message.tag + '</span>' +
  //         '       </div>' +
  //         '   </div>';
  //       $("#senderInfo").html(senderInfo);
  //
  //       let contactInfo =
  //         '<div class="contact-info phone-email">' +
  //         '    <div>' +
  //         '       <i class="fa fa-phone-square fa-2x"></i> ' +
  //         '       <span class="phone"> ' + message.tel + '</span>' +
  //         '    </div>' +
  //         '    <div>' +
  //         '       <i class="fa fa-envelope-square fa-2x"></i> ' +
  //         '       <span class="email"> ' + message.email + '</span>' +
  //         '    </div>' +
  //         '</div>';
  //       $("#contactInfo").html(contactInfo);
  //
  //       let roleInfo =
  //         '<div class="contact-info position-address">' +
  //         '   <div>' +
  //         '       <i class="fa fa-user-circle fa-2x"></i>' +
  //         '       <span class="position">Technical Chef</span>' +
  //         '   </div>' +
  //         '   <div>' +
  //         '       <i class="fa fa-address-card fa-2x"></i>' +
  //         '       <span class="address">12 Nezavisimosti st. Vilnius, Lithuania</span>' +
  //         '   </div>' +
  //         '</div>';
  //       $("#roleInfo").html(roleInfo);
  //
  //       let subject =
  //         '<span class="subject ng-binding">' + message.subject + '</span>' +
  //         '<span class="date ng-binding">• ' + message.date + ' </span>';
  //       $("#subject").html(subject);
  //
  //       let body = '<p>' + message.body + '</p>';
  //       $("#body").html(body);
  //     }
  //     else
  //       Showbo.Msg.alert("消息获取失败", function () {
  //       });
  //
  //   });
  // }
  //
  // let writeVue = new Vue({
  //   el: "#writeMail",
  //   data: {
  //     message: {
  //       receiverId: "",
  //       body: "",
  //       subject: "",
  //       title: "",
  //       tag: "",
  //       status: ""
  //     },
  //     receivers: "",
  //     body: "",
  //     subject: ""
  //   },
  //   methods: {
  //     send() {
  //       let receiverList = $(".user").val();
  //       for (let i = 0; i < receiverList.length; i++)
  //         this.message.receiverId += receiverList[i] + "/";
  //       this.status = "unread";
  //       this.sendWrite();
  //     },
  //     save() {
  //       let receiverList = $(".user").val();
  //       for (let i = 0; i < receiverList.length; i++)
  //         this.message.receiverId += receiverList[i] + "/";
  //       this.status = "saved";
  //       this.sendWrite();
  //     },
  //     quit() {
  //       $("#writeMail").modal('hide');
  //       this.message = {
  //         receiverId: "",
  //         body: "",
  //         subject: "",
  //         title: "",
  //         tag: "",
  //         status: ""
  //       }
  //     },
  //     sendWrite() {
  //       axios.post('/message', this.message).then((response)=> {
  //         if (response.data.code === 2001) {
  //           this.initTable();
  //           this.quit();
  //         }
  //         else
  //           Showbo.Msg.alert("发送失败", function () {
  //           });
  //       })
  //     }
  //   }
  // });
  //
  // let messageTable = $("#messageTable").DataTable({
  //
  //   "language": {
  //     "aria": {
  //       "sortAscending": ": activate to sort column ascending",
  //       "sortDescending": ": activate to sort column descending"
  //     },
  //     "emptyTable": "没有数据！",
  //     "info": "显示 _START_ 至 _END_ 条 ，总共_TOTAL_ 条数据",
  //     "infoEmpty": "没有发现记录！",
  //     "infoFiltered": "(从_MAX_条记录中搜索)",
  //     "lengthMenu": "显示: _MENU_",
  //     "search": "搜索:",
  //     "zeroRecords": "没有找到匹配的记录！",
  //     "paginate": {
  //       "previous": "上一页",
  //       "next": "下一页",
  //       "last": "尾页",
  //       "first": "首页"
  //     }
  //   },
  //   "pagingType": "full_numbers",
  //   "lengthMenu": [
  //     [5, 10, 25, 50],
  //     [5, 10, 25, 50]
  //   ],
  //   processing: true,
  //   serverSide: true,
  //   searching: false,
  //   lengthChange: false,
  //   order: [[0, "desc"]],
  //   ajax: {
  //     url: basePath + "/message/list",
  //     data: function (d) {
  //       d.box = messageVue.$data.box;
  //     }
  //   },
  //   columns: [
  //     {
  //       "data": null, "title": "选择", "createdCell": function (nTd) {
  //         let htmlStr =
  //           '<div class="check-td mail-checkbox">' +
  //           '     <label class="checkbox-inline custom-checkbox nowrap">' +
  //           '       <input type="checkbox">' +
  //           '       <span></span>' +
  //           '     </label>' +
  //           '</div>';
  //         $(nTd).html(htmlStr);
  //       }
  //     },
  //     {
  //       "data": null, "title": "发件人", "createdCell": function (nTd, rowData) {
  //         let htmlStr = '<div style="float: left">' +
  //           '<img style="border-radius: 23px; margin: 7px 0 7px 7px;" class="photo-td little-human little-human-picture" ' +
  //           '   src="' + rowData.pic + '">' +
  //           '</div>';
  //         htmlStr +=
  //           '<div class="name-container" style="margin-top: 5%;float: right">' +
  //           '   <div>' +
  //           '       <span class="name">' + rowData.sender + '</span>' +
  //           '   </div>' +
  //           '   <div>' +
  //           '       <span class="tag label label-primary friend">' + rowData.tag + '</span>' +
  //           '   </div>' +
  //           '</div>';
  //         $(nTd).html(htmlStr);
  //       }, "width": "250px"
  //     },
  //     {"data": "subject", "title": "主题"},
  //     {"data": "body", "title": "内容"},
  //     {"data": "date", "title": "发送时间"},
  //     {
  //       "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
  //         if (rowData.status.toLowerCase() === "unread") {
  //           $(nTd).html('' +
  //             '<button class="btn btn-primary btn-info" style="width: 50%" onclick="viewDetail(\'' + rowData.id + '\')">查看消息</button>' +
  //             '<button class="btn btn-primary btn-danger" style="width: 50%" onclick="markAsRead(\'' + rowData.id + '\')">标为已读</button>');
  //         }
  //         if (rowData.status.toLowerCase() === "read") {
  //           $(nTd).html('' +
  //             '<button class="btn btn-primary btn-info" style="width: 50%" onclick="viewDetail(\'' + rowData.id + '\')">查看消息</button>' +
  //             '<button class="btn btn-primary btn-edit" style="width: 50%" onclick="markAsUnread(\'' + rowData.id + '\')">标为未读</button>');
  //         }
  //         if (rowData.status.toLowerCase() === "saved") {
  //           $(nTd).html('' +
  //             '<button class="btn btn-primary btn-info" style="width: 50%" onclick="viewDraft(\'' + rowData.id + '\')">查看消息</button>');
  //         }
  //         if (rowData.status.toLowerCase() === "trashed") {
  //           $(nTd).html('' +
  //             '<button class="btn btn-primary btn-info" style="width: 50%" onclick="viewDetail(\'' + rowData.id + '\')">查看消息</button>' +
  //             '<button class="btn btn-primary btn-danger" style="width: 50%" onclick="deleteMsg(\'' + rowData.id + '\')">永久删除</button>');
  //         }
  //         if (rowData.status.toLowerCase() === "sent") {
  //           $(nTd).html('' +
  //             '<button class="btn btn-primary btn-info" style="width: 50%" onclick="viewDetail(\'' + rowData.id + '\')">查看消息</button>');
  //         }
  //
  //       }, "width": "300px"
  //     }
  //   ],
  //   "columnDefs": [{
  //     orderable: false
  //   }, {
  //     "defaultContent": "",
  //     "targets": "_all"
  //   }]
  // });
</script>
