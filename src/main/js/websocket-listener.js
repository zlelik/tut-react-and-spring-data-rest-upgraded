'use strict';

const SockJS = require('sockjs-client');
require('stompjs');

let stompClient = null;
const subscriptions = {};

function register(registrations) {
  const socket = SockJS('/payroll');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame) {
    registrations.forEach(function(registration) {
      const subscription = stompClient.subscribe(registration.route, registration.callback);
      subscriptions[registration.route] = subscription;
    });
  });
}

function unregister(registrations) {
  if (stompClient) {
    registrations.forEach(function(registration) {
      if (subscriptions[registration.route]) {
        subscriptions[registration.route].unsubscribe();
        delete subscriptions[registration.route];
      }
    });
  }
}

module.exports = { register, unregister };
