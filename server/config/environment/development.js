'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  TWITTER_CONSUMER_KEY:'BLLqpGYWHrjVz0gl50avA',
  TWITTER_CONSUMER_SECRET:'jVjaMZIj7PQU4o04PjuK2uEqsnGmaheSCehpObBI',
  TWITTER_ACCESS_TOKEN_KEY:'13681972-YIutbOmBgspughuUn7OzuKhaKeQvxG7oa5CIskZA2',
  TWITTER_ACCESS_TOKEN_SECRET:'yoVyYYnV73W3gxNifNZfUq6DucKrw46PrZt3xY7lgsJPT',
  mongo: {
   uri: 'mongodb://localhost/twaural-dev'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },

  seedDB: true
};
