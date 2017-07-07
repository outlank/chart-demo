import {Meteor} from 'meteor/meteor';
// import { check } from 'meteor/check';
import {Visitors} from './visitors';

Meteor.methods({
  'visitors.insert'(e) {
    e.createAt = new Date();
    return Visitors.insert(e);
  }
});

Meteor.publish('visitors', function () {
  return Visitors.find({}, {fields: {httpHeaders: false}});
});