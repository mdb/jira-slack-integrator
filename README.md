[![Build Status](https://travis-ci.org/mdb/jira-slack-integrator.svg?branch=master)](https://travis-ci.org/mdb/jira-slack-integrator)

# jira-slack-integrator

Query Jira ticket details from Slack!

## Usage

```
var JiraIntegrator = require('jira-slack-integrator');

new JiraIntegrator({
  // your Slack's token
  slackToken: '123', // defaults to $SLACK_TOKEN env var

  // your Slack's incoming webhook path
  slackHookPath: 'slackHookPath', // defaults to $SLACK_HOOK_PATH env var

  // your Jira instance's homepage host & path (omit the protocol)
  jiraRootUrl: 'some-jira.com', // defaults to $JIRA_ROOT_URL env var

  // the protocol at which your Jira is hosted
  jiraProtocol: 'http://', // defaults to 'https://'

  // a valid username for acccessing your Jira
  jiraUsername: 'username', // defaults to $JIRA_USERNAME env var

  // the username's password for acccessing your Jira
  jiraPassword: 'password' // defaults to $JIRA_PASSWORD env var
});
```
