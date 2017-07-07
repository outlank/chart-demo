import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import "./count-visitors.html";

Template.countVisitors.helpers({
  title: 'Visitors',
  visitors_count() {
    if (!Meteor.subscribe('visitors').ready()) {
      return "loading.."
    }
    return Visitors.find().count();
  }
});
