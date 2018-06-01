<template>
  <aside class="aside-menu">
    <b-tabs>
      <b-tab title="<i class='icon-speech'></i>">
        <div class="p-3">

          <div v-for="(item, index) in items" :key="item.id">
            <div class="message">
              <div class="py-3 pb-5 mr-3 float-left">
                <div class="avatar">
                  <img src="static/img/logo.png" class="img-avatar" alt="admin@bootstrapmaster.com">
                  <b-badge variant="success" class="avatar-status"></b-badge>
                </div>
              </div>
              <div>
                <small class="text-muted">{{item.sender}}</small>
                <small class="text-muted float-right mt-1">{{item.date}}</small>
              </div>
              <div class="text-truncate font-weight-bold">{{item.date}}</div>
              <small class="text-muted">{{item.body}}
              </small>
            </div>
            <hr>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </aside>
</template>

<script>
  import axios from 'axios'

  const items = [];
  export default {
    name: 'c-aside',
    data() {
      return {
        items: []
      }
    },
    mounted() {
      let url = '/message/list?start=1&length=5&orderCol=date&box=unread&order=desc';
      axios.get(url).then((response) => {
        this.items = response.data.data;
      })
    },
  }
</script>
