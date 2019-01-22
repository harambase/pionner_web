<template>
  <div>
    <div v-for="(val, index) in rate">
      <dl class="row">
        <dt class="col-sm-3">评价:</dt>
        <dd class="col-sm-5">
          <el-rate
            v-model="val.star"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </dd>

        <dt class="col-sm-1"></dt>
        <dd class="col-sm-3">
          <b-button size="sm"
                    class="btn btn-danger"
                    @click="showDeleteFeedback(index)">
            删除该他评
          </b-button>
        </dd>
      </dl>
      <dl class="row">
        <dt class="col-sm-3"></dt>
        <dd class="col-sm-9">{{val.comment}}</dd>
      </dl>
      <b-modal v-model="showDeleteModal"
               size="sm"
               header-bg-variant='danger'
               @ok="deleteMessage"
               centered
               title="不可逆操作警告！">
        <div class="d-block text-center">
          <h3>确认删除该条他评？</h3>
        </div>
      </b-modal>
      <!--<b-modal v-model="showModal" size="sm"-->
               <!--:header-bg-variant="headerBgVariant"-->
               <!--ok-only-->
               <!--ok-title="关闭"-->
               <!--centered-->
               <!--title="消息">-->
        <!--<div class="d-block text-center">-->
          <!--<h3>{{msg}}</h3>-->
        <!--</div>-->
      <!--</b-modal>-->
    </div>

  </div>

</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-others-feedback',
    props: ['rate', 'feedback'],
    data() {
      return {
        basePath: basePath,
        showDeleteModal: false,
        index: '',
      }
    },
    mounted() {

    },
    methods: {
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      showDeleteFeedback(index) {
        this.showDeleteModal = true;
        this.index = index;
        console.log(index);
      },
      deleteMessage() {
        this.$delete(this.rate, this.index);
        this.feedback.rate = JSON.stringify(this.rate);
        axios.put('/feedback/' + this.feedback.id, this.feedback).then((response) => {
          if (response.data.code === 2001) {
            this.headerBgVariant = 'success';
          } else {
            this.headerBgVariant = 'danger';
          }
          this.msg = response.data.msg;
          this.showModal = true
        })
      }
    }
  }
</script>
