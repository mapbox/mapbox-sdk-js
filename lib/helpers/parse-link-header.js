'use strict';

/**
 * Like https://github.com/thlorenz/lib/parse-link-header but without any
 * additional dependencies.
 * @ignore
 * @param {string} param
 */
function parseParam(param) {
  /** @type {RegExpMatchArray|null} */
  var parts = param.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
  if (!parts) return null;

  return {
    key: parts[1],
    value: parts[2]
  };
}

/**
 * @ignore
 * @param {string} link
 */
function parseLink(link) {
  var parts = link.match(/<?([^>]*)>(.*)/);
  if (!parts) return null;

  var linkUrl = parts[1];
  var linkParams = parts[2].split(';');
  var rel = '';

  /** @type {{[key: string]: string}} */
  var parsedLinkParams = linkParams.reduce(function(result, param) {
    var parsed = parseParam(param);
    if (!parsed) return result;
    if (parsed.key === 'rel') {
      if (!rel) {
        rel = parsed.value;
      }
      return result;
    }
    result[parsed.key] = parsed.value;
    return result;
  }, {});
  if (!rel) return null;

  return {
    url: linkUrl,
    rel: rel,
    params: parsedLinkParams
  };
}

/**
 * Parse a Link header.
 *
 * @param {string} linkHeader
 * @returns {{
 *   [k: string]: {
 *     url: string,
 *     params: { [p: string]: string }
 *   }
 * }}
 */
function parseLinkHeader(linkHeader) {
  if (!linkHeader) return {};

  return linkHeader.split(/,\s*</).reduce(function(result, link) {
    var parsed = parseLink(link);
    if (parsed === null) return result;
    else {
      // rel value can be multiple whitespace-separated rels.
      var splitRel = parsed.rel.split(/\s+/);
      splitRel.forEach(function(rel) {
        if (!result[rel]) {
          result[rel] = {
            url: parsed.url,
            params: parsed.params
          };
        }
      });
      return result;
    }
  }, {});
}

module.exports = parseLinkHeader;
