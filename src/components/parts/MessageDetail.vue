<template>
  <b-card>
    <b-list-group>
      <b-list-group-item :title="row.item.title" class="flex-column align-items-start" disabled
                         style="background:#f4f6f8">
        <div class="d-flex w-100 justify-content-between">
          <h5 style="color:darkblue"><strong>{{row.item.title}}
            <small>{{row.item.tag}}消息</small>
          </strong></h5>
        </div>
        <hr/>
        <div class="mr-1">
          <b-row>
            <b-col md="8">
              <dl class="row">
                <dt class="col-sm-4">发件人:</dt>
                <dd class="col-sm-4">{{row.item.sender}}</dd>
              </dl>
              <dl class="row">
                <dt class="col-sm-4">发件时间:</dt>
                <dd class="col-sm-4">{{row.item.date}}</dd>
              </dl>
              <dl class="row">
                <dt class="col-sm-4">收件人:</dt>
                <dd class="col-sm-4">{{row.item.receiver}}</dd>
              </dl>
              <dl class="row">
                <dt class="col-sm-4">主题:</dt>
                <dd class="col-sm-4">{{row.item.subject}}</dd>
              </dl>
              <dl class="row">
                <dt class="col-sm-4">正文:</dt>
                <dd class="col-sm-8" style="color:orangered">
                  <p v-html="row.item.body"></p>
                </dd>
              </dl>
            </b-col>
            <b-col md="4">
              <b-row>
                <img v-if="isNotEmpty(row.item.pic)"
                     :src="basePath + '/static' + JSON.parse(row.item.pic).path"
                     class="img-avatar">
                <img v-else
                     :src="basePath + '/static/img/logo.png'"
                     class="img-avatar">
              </b-row>
              <b-row>
                <dl class="row">
                  <dt class="col-sm-7">发件人联系电话:</dt>
                  <dd class="col-sm-7">{{row.item.tel}}</dd>
                  <dt class="col-sm-7">发件人电子邮件:</dt>
                  <dd class="col-sm-7">{{row.item.email}}</dd>
                </dl>
              </b-row>
            </b-col>
          </b-row>
          <hr/>
          <b-row>
            <b-col md="12">
              <dl class="row">
                <dt class="col-sm-1">操作:</dt>
                <dd class="col-sm-5">
                  <b-button size="sm" variant="success" v-if="row.item.status=='read'"
                            @click.stop="markAsUnread()">
                    标记为未读
                  </b-button>
                  <b-button size="sm" variant="success" v-if="row.item.status=='unread'"
                            @click.stop="markAsRead()">
                    标记为已读
                  </b-button>
                  <b-button size="sm" variant="primary" v-if="row.item.status!='trashed'"
                            @click.stop="moveToTrash()">
                    移入垃圾箱
                  </b-button>
                  <b-button size="sm" variant="primary" v-if="row.item.status=='trashed'"
                            @click.stop="moveToInbox()">
                    移入收件箱
                  </b-button>
                  <b-button size="sm" variant="danger"
                            @click.stop="showDeleteMessage(row.item.id)">
                    彻底删除
                  </b-button>
                  <b-button size="sm" variant="primary" @click.stop="row.toggleDetails">
                    关闭信息
                  </b-button>
                </dd>
              </dl>
            </b-col>
          </b-row>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteMessage"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该消息？</h3>
      </div>
    </b-modal>
    <b-modal v-model="showModal" size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             centered
             @ok="row.toggleDetails"
             title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-messageDetail',
    props: ['row', 'info'],
    data() {
      return {
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        basePath: basePath,
        deleteId: '',
      }
    },
    mounted(){
      this.info.unread--;
      if (this.row.item.labels == '重要')
        this.info.important--;
      if (this.row.item.labels == '紧急')
        this.info.urgent--;

      this.row.item.status = 'read';
      axios.put('/message/' + this.row.item.id, this.row.item).then((response) => {
        if (response.data.code !== 2001) {
          this.msg = response.data.msg;
          this.showModal = true;
          this.headerBgVariant = 'danger';
        }
      })
    },
    methods: {
      showDeleteMessage(id) {
        this.deleteId = id;
        this.showDeleteModal = true;
      },
      deleteMessage() {
        axios.delete('/message/' + this.deleteId).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.$router.go(0);
          }
          else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger';
          }
        })
      },
      markAsRead() {
        this.info.unread--;
        if (this.row.item.labels == '重要')
          this.info.important--;
        if (this.row.item.labels == '紧急')
          this.info.urgent--;

        this.row.item.status = 'read';
        axios.put('/message/' + this.row.item.id, this.row.item).then((response) => {
          if (response.data.code !== 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger';
          }
        })
      },
      markAsUnread() {
        this.info.unread++;
        if (this.row.item.labels == '重要')
          this.info.important++;
        if (this.row.item.labels == '紧急')
          this.info.urgent++;

        this.row.item.status = 'unread';
        axios.put('/message/' + this.row.item.id, this.row.item).then((response) => {
          if (response.data.code !== 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger';
          }
        })
      },
      moveToInbox() {
        this.row.item.status = 'read';
        axios.put('/message/' + this.row.item.id, this.row.item).then((response) => {
          this.$router.go(0)
          if (response.data.code !== 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger';
          }
        })
      },
      moveToTrash() {
        this.row.item.status = 'trashed';
        axios.put('/message/' + this.row.item.id, this.row.item).then((response) => {
          this.$router.go(0)
          if (response.data.code !== 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger';
          }
        })
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }

  }
</script>
