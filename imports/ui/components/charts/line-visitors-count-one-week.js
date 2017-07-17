import "./line-visitors-count-one-week.html";
import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import {Tracker} from 'meteor/tracker';
import echarts from 'echarts';


Template.lineVisitorsCountOneWeek.onRendered(function () {
  this.$('.panel-body>div').height(this.$('.panel-body>div').width() * .5);
  var temp = this;
  var chart = echarts.init(temp.$('.panel-body>div')[0]);
  chart.showLoading({maskColor: 'rgba(255, 255, 255, 0.1)',});

  let data = [];
  let startTime = moment();

  chart.setOption({
    // title: {
    //   text: '访问总量'
    // },
    grid: {
      left: 45,
      right: 20,
      top: 10,
      bottom: 35,
    },
    textStyle: {
      color: 'rgba(255, 255, 255, .4)'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        let date = new Date(params.name);
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 : ' + params.value[1];
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
      function dayData(date) {
        let date_start = new Date(date);
        let date_end = new Date(moment(date_start).add(1, 'day'));
        return {
          name: date,
          value: [date, Visitors.find({createAt: {"$lte": date_end}}).count()]
        }
      }

      let now = moment().startOf('day');
      let sub = now.diff(startTime, 'day');

      if (data.length === 0 || sub >= 30) {
        data = [];
        for (let i = 0; i < 30; i++) {
          //初始化
          chart.hideLoading();
          let date = moment(now).subtract(i, 'days').format();
          date = dayData(date);
          data.unshift(date);
          if (!date.value[1]) break;
        }
      } else {
        if (sub) {
          data.shift(sub)
        }
        data.pop();
        for (let i = 0; i <= sub; i++) {
          let date = moment(now).subtract(sub - i, 'days').format();
          data.push(dayData(date));
        }
      }
      chart.setOption({series: [{data: data}]});
    }
  });

});
