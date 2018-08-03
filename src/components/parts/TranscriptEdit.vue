<template>
  <b-card>
    <b-list-group>
      <b-list-group-item title="修改成绩" class="flex-column align-items-start" disabled>
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">学生 <strong>{{row.item.sname}}</strong> 在 <strong>{{row.item.cname}}</strong>
            课程的成绩信息</h5>
          <small class="text-muted">课程CRN：{{row.item.crn}}</small>
        </div>
        <hr/>
        <div class="mr-1">
          <dl class="row">
            <dt class="col-sm-1">学生名:</dt>
            <dd class="col-sm-1">{{row.item.sname}}</dd>

            <dt class="col-sm-1">课程学分:</dt>
            <dd class="col-sm-1">{{row.item.credits}}</dd>

            <dt class="col-sm-1">成绩:</dt>
            <dd class="col-sm-3">
              <input placeholder="可使用Letter Grade或百分制" name="grade"
                     :class="{'form-control': true, 'is-invalid': errors.has('grade')}"
                     v-model="row.item.grade" :disabled="mode==='faculty'"
                     v-validate="'required'">
              <div v-show="errors.has('grade')" class="invalid-tooltip">{{ errors.first('grade')}}</div>
            </dd>
          </dl>
          <dl class="row">
            <dt class="col-sm-1">完成情况:</dt>
            <dd class="col-sm-3">
              <b-row>
                <b-col md="4">
                  <div class="custom-control custom-radio">
                    <input type="radio" id="complete" name="complete"
                           value="1" class="custom-control-input"
                           v-model="row.item.complete" :disabled="mode==='faculty'">
                    <label class="custom-control-label" for="complete">完成</label>
                  </div>
                </b-col>
                <b-col md="4">
                  <div class="custom-control custom-radio">
                    <input type="radio" id="process" name="complete"
                           value="0" class="custom-control-input"
                           v-model="row.item.complete" :disabled="mode==='faculty'">
                    <label class="custom-control-label" for="process">正在进行</label>
                  </div>
                </b-col>
                <b-col md="4">
                  <div class="custom-control custom-radio">
                    <input type="radio" id="nComplete" name="nComplete"
                           value="-1" class="custom-control-input"
                           v-model="row.item.complete" :disabled="mode==='faculty'">
                    <label class="custom-control-label" for="nComplete">未完成</label>
                  </div>
                </b-col>
              </b-row>
            </dd>
            <dt class="col-sm-1">获得学分:</dt>
            <dd class="col-sm-3">
              <input type="text" v-validate="'required|verify_credit:' + row.item.credits + ''" name="credit"
                     :class="{'form-control': true, 'is-invalid': errors.has('credit')}"
                     v-model="row.item.credit" :disabled="mode==='faculty'"/>
              <div v-show="errors.has('credit')" class="invalid-tooltip">{{ errors.first('credit')}}
              </div>
            </dd>
          </dl>
          <dl class="row">
            <dt class="col-sm-1">评语:</dt>
            <dd class="col-sm-7">
                <textarea style="resize: none;" class="form-control" rows="7"
                          v-model="row.item.remark"></textarea>
            </dd>
          </dl>
          <dl class="row" v-if="mode!=='faculty'">
            <dt class="col-sm-1">操作:</dt>
            <dd class="col-sm-5">
              <b-button size="sm" variant="success"
                        @click.stop="updateTranscript(row.item, row)">
                修改成绩
              </b-button>
              <b-button size="sm" variant="danger"
                        @click.stop="showDeleteTranscript(row.item.id)">
                删除成绩
              </b-button>
              <b-button size="sm" variant="primary" @click.stop="row.toggleDetails">
                取消修改
              </b-button>
            </dd>
          </dl>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteTranscript"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该成绩单？</h3>
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
    name: 'c-transcriptEdit',
    props: ['row', 'mode'],
    data() {
      return {
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
      }
    },
    methods: {
      updateTranscript(transcript) {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          axios.put('/transcript/' + transcript.id, transcript).then((response) => {
            if (response.data.code === 2001) {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'success'
            }
            else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
      showDeleteTranscript(id) {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          this.showDeleteModal = true
          this.deleteId = id
        })
      },
      deleteTranscript() {
        if (!result)
          return

        axios.delete('/transcript' + this.deleteId).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'success'
          }
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
    }

  }
</script>
