function validateUrl(value) {
    var urlPattern = new RegExp(
      '^((?:https?:\\/\\/)(?:www\\.|(?!www)))?' + // protocol and subdomain
        '(?:[A-Za-z0-9-]+\\.)+' + // domain name
        '(?:\\w{2,})(?:\\/\\S*)?$', // top-level domain and optional path
      'i'
    );
  console.log(value)
    return !!urlPattern.test(value);
  }
  
  module.exports = { validateUrl };
  