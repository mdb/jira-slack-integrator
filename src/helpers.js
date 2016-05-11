var helpers;

helpers = {
  makeField: function(title, value, isShort) {
    return {
      title: title,
      value: value,
      short: isShort
    };
  },

  getIssueJson: function(body) {
    var json = JSON.parse(body);

    return json.issues[0];
  },

  getAttachment: function(data) {
    return {
      text: '',
      fallback: data.jiraUrl + '/browse/' + data.issue.key,
      pretext: '@' + data.user + ' : here is the defect you requested...',
      color: 'bad',
      fields: helpers.makeFields(data)
    };
  },

  makeFields: function(data) {
    return [
      helpers.makeField(
        'link',
        '<' + data.jiraUrl + '/browse/' + data.issue.key + '|' + data.issue.fields.summary + '>',
        false
      ),
      helpers.makeField(
        'key',
        data.issue.key,
        true
      ),
      helpers.makeField(
        'summary',
        data.issue.fields.summary,
        true
      ),
      helpers.makeField(
        'description',
        data.issue.fields.description,
        true
      ),
      helpers.makeField(
        'creator',
        data.issue.fields.creator.displayName,
        true
      )
    ];
  }
};

module.exports = helpers;
