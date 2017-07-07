import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import {Tracker} from 'meteor/tracker';

import "./map-china.html";
import echarts from 'echarts';
import 'echarts/map/js/china';

Template.mapChina.onCreated(function () {
  Meteor.subscribe('visitors')
});

Template.mapChina.onRendered(function () {
  this.$('.panel-body>div').height(this.$('.panel-body>div').width()*.8);
  var chart = echarts.init(this.$('.panel-body>div')[0]);
  chart.showLoading();

  var max = 0;
  var province = ['北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门'];
  var data = [];

  chart.setOption({
    backgroundColor: '#404a59',
    title: {
      text: '全国访问量',
      left: 'center',
      textStyle: {
        color: '#fff',
      }
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 0,
      max: max,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],           // 文本，默认为数值文本
      calculable: true,
      textStyle: {
        color: '#fff'
      }
    },
    // legend: {
    //   orient: 'vertical',
    //   y: 'bottom',
    //   x: 'right',
    //   data: ['pm2.5'],
    //   textStyle: {
    //     color: '#fff'
    //   }
    // },
    series: [
      {
        name: '全国访问量',
        type: 'map',
        mapType: 'china',
        data: data,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
    ]
  });
  Tracker.autorun(() => {
    if (Meteor.subscribe('visitors').ready()) {
      chart.hideLoading();
      data = province.map((e) => {
        var count = Visitors.find({address: e}).count();
        max = count > max ? count : max;
        return {name: e, value: count}
      });
      chart.setOption({visualMap: {max: max,}, series: [{data: data,},]});
    }
  });
});

Template.mapChina.helpers({});