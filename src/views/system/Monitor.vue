<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="4">
        <b-card>
          <div class="panel panel-primary">
            <div class="number">
              <h3>
                <span>{{studentNum}}</span><br/>
                <small>当前学生总数</small>
              </h3>
            </div>
            <div class="icon">
              <i class="fa fa-user fa-5x red"></i>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card>
          <div class="panel panel-primary">
            <div class="number">
              <h3>
                <span>{{facultyNum}}</span><br/>
                <small>当前教师总数</small>
              </h3>
            </div>
            <div class="icon">
              <i class="fa fa-eye fa-5x blue"></i>
            </div>

          </div>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card>
          <div class="panel panel-primary">
            <div class="number">
              <h3>
                <span>{{courseNum}}</span><br/>
                <small>当前课程总数</small>
              </h3>
            </div>
            <div class="icon">
              <i class="fa fa-book fa-5x green"></i>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <b-card>
          <div class="panel panel-danger">
            <div class="panel-heading">
              <div class="card-title">
                <div class="title">先锋用户组成情况表</div>
              </div>
            </div>
            <div class="panel-body">
              <div id="exampleChart" style="width: 100%; height: 460px"></div>
            </div>
            <div class="panel-footer">
              图例：左图按类型分类,右图按性别分类。
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card>
          <div class="panel panel-danger">
            <div class="panel-heading">
              <div class="card-title">
                <div class="title">先锋SFC关系表</div>
              </div>
            </div>
            <div class="panel-body">
              <div id="relationChart" style="width: 100%; height: 460px"></div>
            </div>
            <div class="panel-footer">
              图例：Student-Faculty-Course(SFC: 学生-教师-课程)
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import echarts from 'echarts'

  export default {
    name: 'Monitor',
    data() {
      return {
        studentNum: 0,
        facultyNum: 0,
        courseNum: 0
      }
    },
    mounted: function () {

      axios('/system/info').then((response) => {

        const result = response.data.data
        this.studentNum = result.student
        this.facultyNum = result.faculty
        this.courseNum = result.course
      })

      axios('/system/user/count').then((response) => {
        const dataBeast = response.data.dataBeast
        const xAxisData = response.data.xAxisData
        this.exampleUserTop('exampleChart', dataBeast, xAxisData)
      })

      axios('/system/relation').then((response) => {
        this.relation(response.data.data, 'relationChart')
      })
    },
    methods: {
      exampleUserTop(divUrl, data1, data2) {
        const myChart = echarts.init(document.getElementById(divUrl))
        const option = {
          // title : {
          //     text: 'Pioneer User Chart',
          //     subtext: 'Realtime',
          //     x:'center'
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: ['1', '2', '3', '4', '5', '6', '7', '8']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          series: [
            {
              name: 'User Counts',
              type: 'pie',
              radius: [20, 135],
              center: ['25%', '50%'],
              roseType: 'radius',
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              lableLine: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              data: data1
            },
            {
              name: 'Gender Counts',
              type: 'pie',
              radius: [30, 135],
              center: ['75%', '50%'],
              roseType: 'radius',
              data: data2
            }
          ]
        }

        myChart.setOption(option)
        return myChart
      },
      relation(data, divUrl) {
        const myChart = echarts.init(document.getElementById(divUrl))
        myChart.showLoading()
        console.log(data)
        if (data !== '') {
          myChart.hideLoading()

          const graph = gexf.parse(data)
          const categories = [{name: '课程'}, {name: '学生'}, {name: '教师'}]

          graph.nodes.forEach(function (node) {
            node.itemStyle = null
            node.value = (node.symbolSize - 10) / 5
            node.label = {
              normal: {
                show: node.symbolSize > 10
              }
            }
            node.category = node.attributes.type
          })
          const option = {
            // title: {
            //     text: 'Pioneer SFC Relations',
            //     subtext: 'Student-Faculty-Course',
            //     top: 'bottom',
            //     left: 'right'
            // },
            tooltip: {},
            legend: [{
              // selectedMode: 'single',
              data: categories.map(function (a) {
                return a.name
              })
            }],
            toolbox: {
              show: true,
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {
                  show: true,
                  type: ['pie', 'funnel']
                },
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
              {

                type: 'graph',
                layout: 'circular',
                circular: {
                  rotateLabel: true
                },
                data: graph.nodes,
                links: graph.links,
                categories: categories,
                roam: false,
                label: {
                  normal: {
                    position: 'right',
                    formatter: '{b}'
                  }
                },
                lineStyle: {
                  normal: {
                    color: 'source',
                    curveness: 0.3
                  }
                }
              }
            ]
          }
          myChart.setOption(option)
        }
      }
    }
  }
</script>
