import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../../ui/layout/app-body';
import '../../ui/pages/app-home';
import '../../ui/pages/chart1';
import '../../ui/pages/not-found';

FlowRouter.route('/', {
  name: 'appHome',
  action() {
    FlowRouter.go('/chart/1');
    BlazeLayout.render('appBody', {main: 'appHome'});
  }
});

FlowRouter.route('/chart/:num', {
  name: 'chart',
  action(params) {
    BlazeLayout.render('appBody', {main: 'chart' + params.num});
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('appBody', {main: 'notFound'});
  },
};