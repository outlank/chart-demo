import {Meteor} from 'meteor/meteor';
// import { check } from 'meteor/check';
import {Visitors} from './visitors';

Meteor.methods({
  'visitors.insert'(e) {
    e.createAt = new Date();
    return Visitors.insert(e);
  },
  'visitors.aggregate'(name) {
    let result = Visitors.aggregate([
      {$group: {_id: "$useragent." + name, value: {"$sum": 1}}}
    ]);
    return _.filter(result, function (e) {
      return e._id
    });
  }
});

Meteor.publish('visitors', function () {
  return Visitors.find({});
});
