/* eslint-env node */
'use strict';

// A safe charset for an agent id placed into a User-Agent header: env vars
// are not validated by whoever sets them, so a value like "foo\nbar: injected"
// must be rejected here rather than reaching `got` as an invalid header value
// (which would throw and break every request).
var SAFE_FALLBACK_ID = /^[\w.-]{1,64}$/;

// (agentId, [[envVar, expectedValueOrNull], ...]) - table order is precedence
// order; the first entry with any matching condition wins. expectedValue null
// means a presence check (the key exists in process.env with a non-empty,
// non-whitespace value); otherwise an exact-equality check.
//
// Ported from mapbox/tilesets-cli's `agent_detect.py` (this repo's sibling
// implementation of the same allowlist - keep the two in sync). Canonical
// origin: HuggingFace's public `agent-harnesses.ts` registry.
var ALLOWLIST = [
  ['antigravity', [['ANTIGRAVITY_AGENT', null]]],
  ['augment-cli', [['AUGMENT_AGENT', null]]],
  ['cline', [['CLINE_ACTIVE', null]]],
  ['cowork', [['CLAUDE_CODE_IS_COWORK', null]]],
  ['claude-code', [['CLAUDECODE', null], ['CLAUDE_CODE', null]]],
  [
    'codex',
    [['CODEX_SANDBOX', null], ['CODEX_CI', null], ['CODEX_THREAD_ID', null]]
  ],
  ['crush', [['CRUSH', null]]],
  ['gemini-cli', [['GEMINI_CLI', null]]],
  [
    'github-copilot',
    [
      ['COPILOT_MODEL', null],
      ['COPILOT_ALLOW_ALL', null],
      ['COPILOT_GITHUB_TOKEN', null]
    ]
  ],
  ['goose', [['GOOSE_TERMINAL', null]]],
  ['hermes-agent', [['HERMES_SESSION_ID', null]]],
  ['kilo-code', [['KILOCODE_FEATURE', null]]],
  ['kiro', [['AGENT_CONTEXT_OUT', null]]],
  ['openclaw', [['OPENCLAW_SHELL', null]]],
  ['opencode', [['OPENCODE_CLIENT', null]]],
  ['pi', [['PI_CODING_AGENT', null]]],
  ['replit', [['REPL_ID', null]]],
  ['trae', [['TRAE_AI_SHELL_ID', null]]],
  ['vtcode', [['VTCODE', '1']]],
  ['warp', [['TERM_PROGRAM', 'WarpTerminal']]],
  ['zed', [['ZED_TERM', null]]],
  ['cursor-cli', [['CURSOR_AGENT', null]]],
  ['cursor', [['CURSOR_TRACE_ID', null]]]
];

// Checked only if nothing in ALLOWLIST matched. First one with a non-empty
// (after trimming) value matching SAFE_FALLBACK_ID wins; an unsafe or empty
// value falls through to the next var rather than being returned as-is.
var FALLBACK_VARS = ['AI_AGENT', 'AGENT'];

// Scans `env` for a matching agent indicator. Split out from `detectAgent`
// so the individual key reads below (which could throw in an environment
// where `process.env` is a permission-gated Proxy, e.g. Deno without
// --allow-env) are covered by a single try/catch there, rather than one
// bare `typeof process` guard that only checks the top-level object.
function scanEnv(env) {
  for (var i = 0; i < ALLOWLIST.length; i++) {
    var agentId = ALLOWLIST[i][0];
    var conditions = ALLOWLIST[i][1];
    for (var j = 0; j < conditions.length; j++) {
      var envVar = conditions[j][0];
      var expected = conditions[j][1];
      if (expected === null) {
        if ((env[envVar] || '').trim()) {
          return agentId;
        }
      } else if (env[envVar] === expected) {
        return agentId;
      }
    }
  }

  for (var k = 0; k < FALLBACK_VARS.length; k++) {
    var value = (env[FALLBACK_VARS[k]] || '').trim();
    if (value && SAFE_FALLBACK_ID.test(value)) {
      return value;
    }
  }

  return null;
}

/**
 * Detect the AI coding agent (if any) driving this process, from
 * `process.env`. Node-only: returns `null` immediately outside Node (e.g.
 * bundled for the browser), where there is no `process.env` to read.
 *
 * Never reads or logs the full environment - only the matched id is used.
 * Never throws: any error while reading `process.env` (e.g. a
 * permission-gated environment) is treated as "no agent detected" rather
 * than propagating out of `MapiRequest`'s constructor and breaking every
 * request.
 *
 * @returns {string|null} The detected agent id, or `null` when no agent
 *   indicator is present.
 */
function detectAgent() {
  // The `process.env` accesses below (including the guard itself) must all
  // be inside this try: in an environment where `process.env` is a
  // permission-gated Proxy (e.g. Deno without --allow-env), even reading
  // `process.env` to check it can throw, not just reading an individual key.
  try {
    if (typeof process === 'undefined' || !process.env) {
      return null;
    }
    return scanEnv(process.env);
  } catch (error) {
    return null;
  }
}

module.exports = detectAgent;
