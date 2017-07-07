import "./pie-visitors-count-os.html";
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {Visitors} from '/imports/api/visitors/visitors';
import echarts from 'echarts';


Template.pieVisitorsCountOs.onRendered(function () {
  this.$('.panel-body>div').height(this.$('.panel-body>div').width());
  var temp = this;
  var chart = echarts.init(temp.$('.panel-body>div')[0]);
  chart.showLoading();

  let data = [];
  chart.setOption({
    backgroundColor: '#2c343c',

    title: {
      text: 'Customized Pie',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: false,
      inRange: {
        colorLightness: [0.3, 0.7]
      }
    },
    series: [
      {
        name: '浏览器',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: data.sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: false,
        label: {
          normal: {
            position: 'inside',
            textStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
        },
        // labelLine: {
        //   normal: {
        //     lineStyle: {
        //       color: 'rgba(255, 255, 255, 0.3)'
        //     },
        //     smooth: 0.2,
        //     length: 10,
        //     length2: 20
        //   }
        // },
        itemStyle: {
          normal: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  });

  Tracker.autorun(() => {
    if (Meteor.subscribe('visitors').ready()) {
      chart.hideLoading();

      Meteor.call('visitors.aggregate', "os", (err, res) => {
        if (err) {
          alert(err);
        } else {
          let d = {};
          res.map(function (e) {
            let name = e._id.split(' ');
            name.pop();
            name = name.join('');
            if (!d[name]) {
              d[name] = 0;
            }
            d[name] += e.value;
          });
          _.each(d, function (val, key) {
            data.push({
              name: key,
              value: val
            })
          });
          chart.setOption({series: [{data: data}]});
        }
      });
    }
  });

});
