'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'twaural-secret',
  TWITTER_CONSUMER_KEY:'BLLqpGYWHrjVz0gl50avA',
  TWITTER_CONSUMER_SECRET:'jVjaMZIj7PQU4o04PjuK2uEqsnGmaheSCehpObBI',
  TWITTER_ACCESS_TOKEN_KEY:'13681972-YIutbOmBgspughuUn7OzuKhaKeQvxG7oa5CIskZA2',
  TWITTER_ACCESS_TOKEN_SECRET:'yoVyYYnV73W3gxNifNZfUq6DucKrw46PrZt3xY7lgsJPT'
  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
