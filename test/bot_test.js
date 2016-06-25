var request = require('supertest'),
    nock = require('nock'),
    Jira = require('../src/bot'),
    bot = new Jira({
      slackToken: '123',
      slackHookPath: 'slackHookPath',
      jiraRootUrl: 'some-jira.com',
      jiraUsername: 'username',
      jiraPassword: 'password'
    }),
    app = bot.integrator.app;

describe('GET /', function() {
  it('returns "Hello world!"', function(done) {
    request(app)
      .get('/')
      .expect(200, 'Hello world!', done);
  });
});

describe('POST /integration', function() {
  describe('when the request token does not match the configured slack token', function() {
    it('returns 401', function(done) {
      request(app)
        .post('/integration')
        .send({
          token: '456',
        })
        .expect(401, done);
    });
  });
});

describe('when it is queried for Jira info', function() {
  it('returns the Jira ticket info', function(done) {
    var fakeResp = {
      issues: [{
        key: 'key',
        fields: {
          summary: 'summary',
          description: 'description',
          creator: {
            displayName: 'displayName'
          }
        }
      }]
    };

    nock('https://username:password@some-jira.com')
      .get('/rest/api/2/search?jql=key=123')
      .reply(200, fakeResp);

    nock('https://hooks.slack.com')
      .post('/services/slackHookPath', {
        username: 'Jira',
        channel: 'channel id',
        icon_emoji: ':ghost:',
        text: '',
        attachments: [{
          text: '',
          fallback: 'https://some-jira.com/browse/key',
          pretext: '@user : here is the defect you requested...',
          color: 'bad',
          fields: [{
            title: 'link',
            value: '<https://some-jira.com/browse/key|summary>',
            short: false
          }, {
            title: 'key',
            value: 'key',
            short: true
          }, {
            title: 'summary',
            value: 'summary',
            short: true
          }, {
            title: 'description',
            value: 'description',
            short: true
          }, {
            title: 'creator',
            value: 'displayName',
            short: true
          }]
        }]
      })
      .reply(200);

    request(app)
      .post('/integration')
      .send({
        token: '123',
        user_name: 'user',
        channel_id: 'channel id',
        text: '123'
      })
      .expect(200, done);
  });
});
