var Integrator = require('slack-integrator'),
    request = require('request'),
    helpers = require('./helpers');

class Bot {
  constructor(config) {
    this.config = Object.assign({
      slackToken: process.env.SLACK_TOKEN,
      slackHookPath: process.env.SLACK_HOOK_PATH,
      jiraProtocol: 'https://',
      jiraRootUrl: process.env.JIRA_ROOT_URL,
      jiraUsername: process.env.JIRA_USERNAME,
      jiraPassword: process.env.JIRA_PASSWORD
    }, config);

    this.config.jiraUrl = this.config.jiraProtocol + this.config.jiraRootUrl;
    this.config.artifactQueryUrl = this.config.jiraProtocol + this.config.jiraUsername + ':' + this.config.jiraPassword + '@' + this.config.jiraRootUrl + '/rest/api/2/search?jql=key=';

    this.integrator = new Integrator({
      payload: (req, callback) => {
        var issue,
            payload = {
              username: 'Jira',
              channel: req.body.channel_id,
              icon_emoji: ':ghost:',
              text: ''
            };

        request({
          url: this.config.artifactQueryUrl + req.body.text
        }, (error, response, body) => {
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
              jiraUrl: this.config.jiraUrl
            })
          ];

          console.log('posting to Slack:');
          console.log(payload);

          callback(payload);
        });
      },

      token: this.config.slackToken,

      hookPath: this.config.slackHookPath
    });
  }
}

module.exports = Bot;
