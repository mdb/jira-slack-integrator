var Integrator = require('slack-integrator'),
    request = require('request'),
    helpers = require('./helpers'),
    app;

app = Object.create({
  integrate: function(config) {
    var slackToken = config.slackToken || process.env.SLACK_TOKEN,
        slackHookPath = config.slackHookPath || process.env.SLACK_HOOK_PATH,
        jiraProtocol = config.jiraProtocol || 'https://',
        jiraRootUrl = config.jiraRootUrl || process.env.JIRA_ROOT_URL,
        jiraUsername = config.jiraUsername || process.env.JIRA_USERNAME,
        jiraPassword = config.jiraPassword || process.env.JIRA_PASSWORD,
        jiraUrl = jiraProtocol + jiraRootUrl,
        artifactQueryUrl = jiraProtocol + jiraUsername + ':' + jiraPassword + '@' + jiraRootUrl + '/rest/api/2/search?jql=key=';

    this.integrator = new Integrator({
      payload: function (req, callback) {
        var issue,
            payload = {
              username: 'Jira',
              channel: req.body.channel_id,
              icon_emoji: ':ghost:',
              text: ''
            };

        request({
          url: artifactQueryUrl + req.body.text
        }, function (error, response, body) {
          if (error) {
            console.log(error);

            payload.text = error.message;

            callback(payload);
          }

          issue = helpers.getIssueJson(body);

          payload.attachments = [
            helpers.getAttachment({
              issue: issue,
              user: req.body.user_name,
              jiraUrl: jiraUrl
            })
          ];

          callback(payload);
        });
      },

      token: slackToken,

      hookPath: slackHookPath
    });
  }
});

module.exports = app;
