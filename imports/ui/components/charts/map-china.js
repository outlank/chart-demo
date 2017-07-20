import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import {Tracker} from 'meteor/tracker';

import "./map-china.html";
import echarts from 'echarts';
import 'echarts/map/js/china';

Template.mapChina.onRendered(function () {
  this.$('.panel-body>div').height(this.$('.panel-body>div').width() * .7);
  var chart = echarts.init(this.$('.panel-body>div')[0]);
  chart.showLoading({    maskColor: 'rgba(255, 255, 255, 0.1)',  });

  var max = 0;
  var province = ['北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门', '南海诸岛'];
  var data = [];

  chart.setOption({
    backgroundColor: 'transparent',
    // title: {
    //   text: '全国访问量',
    //   left: 'center',
    //   textStyle: {
    //     color: '#fff',
    //   }
    // },
    tooltip: {
      trigger: 'item',
      confine: true,
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
        zoom: 1.1,
        data: data,
        center: [100, 36],
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true,
            textStyle: {
              color: 'rgba(255,255,255,.8)'
            },
          }
        },
        itemStyle: {
          normal: {
            areaColor: 'rgba(21,22,28,1)',
            // borderColor: '#8193A3'，
            borderColor: 'rgba(21,22,28,1)',
            // borderWidth: 1,
            shadowColor: 'black',
            shadowBlur: 1
          },
          emphasis: {}
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
        return {
          name: e, value: count,
        }
      });
      chart.setOption({
        visualMap: {
          min: 0,
          max: max,
          left: 'left',
          bottom: '12%',
          text: ['高', '低'],           // 文本，默认为数值文本
          calculable: true,
          inRange: {
            color: ['rgba(129,147,163,.4)', '#C23531'],
          },
          textStyle: {
            color: 'rgba(255,255,255,.4)'
          },
        }, series: [{data: data,},]
      });
    }
  });
});

Template.mapChina.helpers({});