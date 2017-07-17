import "./line-visitors-one-day.html";
import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import {Tracker} from 'meteor/tracker';
import echarts from 'echarts';


Template.lineVisitorsOneDay.onRendered(function () {
  this.$('.panel-body>div').height(this.$('.panel-body>div').width() * .5);
  let chart = echarts.init(this.$('.panel-body>div')[0]);
  //chart.showLoading();

  let data = [];
  let startTime = moment();

  chart.setOption({
    // title: {
    //   text: '24小时访问量'
    // },
    textStyle: {
      color: 'rgba(255, 255, 255, .4)'
    },
    grid: {
      left: 45,
      right: 20,
      top: 10,
      bottom: 35,
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        let date = new Date(params.name);
        return (date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + '时 : ' + params.value[1];
      },
      axisPointer: {
        animation: false
      },
      confine: true,
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [{
      name: '模拟数据',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: data,
      smooth: true,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#C23531'
          }, {
            offset: 1,
            color: 'rgb(0, 0, 0)'
          }])
        }
      },
    }]
  });

  Tracker.autorun(() => {
    if (Meteor.subscribe('visitors').ready()) {
      function hourData(date) {
        let date_start = new Date(date);
        let date_end = new Date(moment(date_start).add(1, 'hour'));
        return {
          name: date,
          value: [date, Visitors.find({createAt: {"$gt": date_start, "$lte": date_end}}).count()]
        }
      }

      let now = moment().startOf('hour');
      let sub = now.diff(startTime, 'hour');

      if (data.length === 0 || sub >= 24) {
        data = [];
        for (let i = 0; i < 24; i++) {
          //初始化
          chart.hideLoading();
          let date = moment(now).subtract(i, 'hours').format();
          data.unshift(hourData(date));
        }
      } else {
        if (sub) {
          data.shift(sub)
        }
        data.pop();
        for (let i = 0; i <= sub; i++) {
          let date = moment(now).subtract(sub - i, 'hours').format();
          data.push(hourData(date));
        }
      }
      chart.setOption({series: [{data: data}]});
    }
  });

});
