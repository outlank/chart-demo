import {HTTP} from "meteor/http";
import UA from "useragent";
import "/imports/env";

import "./fixtures";
import "./register-api";

Meteor.onConnection((e) => {
  let agent = UA.parse(e.httpHeaders['user-agent']);
  e.useragent = {
    agent: agent.toAgent(),
    os: agent.os.toString(),
    device: agent.device.toString()
  };

  let ip = e.clientAddress === "127.0.0.1"?"":e.clientAddress;
  HTTP.call('GET', "https://api.map.baidu.com/location/ip", {params: {ip: ip, ak: env.ak, coor: "bd09ll"}}, (error, result) => {
    if (!error) {
      if (result.data.status !== 0) {
        console.log(result);
      } else {
        e.location = result.data.content;
        e.address = result.data.address.split('|');
        Meteor.call('visitors.insert', e);
      }
    }
  });
});