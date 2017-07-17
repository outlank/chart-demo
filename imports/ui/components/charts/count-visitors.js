import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import "./count-visitors.html";
import  CountUp from  'countup';

Template.countVisitors.helpers({
  title: 'Visitors',
  // visitors_count() {
  //   return Meteor.subscribe('visitors').ready();
  // }
});

Template.countVisitors.onRendered(function () {
    var count;
    Tracker.autorun(() => {
      if (Meteor.subscribe('visitors').ready()) {
        $('#count-loading').hide();
        $('#count').show();
        $('#count-text').show();
        count.update(Visitors.find().count());
      } else {
        count = new CountUp("count", 0, 0, 0, 5);
        count.start();
      }
    })
  }
);
