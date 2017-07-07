import {Meteor} from 'meteor/meteor';
import {Visitors} from '/imports/api/visitors/visitors';
import "./list-visitors.html";

Template.listVisitors.onCreated(function () {
  Meteor.subscribe('visitors').ready();
});

Template.listVisitors.helpers({
  title: 'Visitors Recent',
  visitors() {
    if (!Meteor.subscribe('visitors').ready()) {
      return false;
    } else {
      return Visitors.find({}, {sort: {'createAt': -1}, limit: 8}).fetch();
    }
  }
});
