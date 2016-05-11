var assert = require('assert'),
    helpers = require('../src/helpers'),
    issueData = {
      jiraUrl: 'jiraUrl',
      user: 'user',
      issue: {
        key: 'issueKey',
        fields: {
          summary: 'summary',
          description: 'description',
          creator: {
            displayName: 'displayName'
          }
        }
      }
    };

describe('helpers', function() {
  describe('#makeField', function() {
    it('returns a field object', function() {
      var field = helpers.makeField('title', 'val', false);

      assert.equal(field.title, 'title');
      assert.equal(field.value, 'val');
      assert.equal(field.short, false);
    });
  });

  describe('#getIssueJson', function() {
    it('returns the first issue from the Jira JSON response body', function() {
      var json = helpers.getIssueJson('{"issues": ["someIssue"]}');

      assert.equal(json, 'someIssue');
    });
  });

  describe('#getAttachment', function() {
    var attachment = helpers.getAttachment(issueData);

    it('returns a Slack attachment object', function() {
      assert.equal(attachment.text, '');
      assert.equal(attachment.fallback, 'jiraUrl/browse/issueKey');
      assert.equal(attachment.pretext, '@user : here is the defect you requested...');
      assert.equal(attachment.color, 'bad');
    });

    describe('its fields', function() {
      var fields = attachment.fields;

      it('has the proper 5 fields', function() {
        assert.equal(fields[0].title, 'link');
        assert.equal(fields[1].title, 'key');
        assert.equal(fields[2].title, 'summary');
        assert.equal(fields[3].title, 'description');
        assert.equal(fields[4].title, 'creator');
      });
    });
  });
});
