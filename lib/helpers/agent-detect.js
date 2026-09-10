/* eslint-env node */
'use strict';

// (agentId, [[envVar, expectedValueOrNull], ...]) - table order is precedence
// order; the first entry with any matching condition wins. expectedValue null
// means a presence check (the key exists in process.env at all - even set to
// "" or whitespace still counts, we only care whether it exists, not what
// it's set to); otherwise an exact-equality check.
//
// Ported from mapbox/tilesets-cli's `agent_detect.py` (this repo's sibling
// implementation of the same allowlist - keep the two in sync). Canonical
// origin: HuggingFace's public `agent-harnesses.ts` registry.
//
// The final entry, `custom-agent`, is a catch-all for AI_AGENT/AGENT: these
// exist so an agent not on this list can still flag its presence, but we only
// ever check for them, never read their value - an arbitrary, unvalidated
// string must never be forwarded into telemetry as an "agent id".
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
  ['cursor', [['CURSOR_TRACE_ID', null]]],
  ['custom-agent', [['AI_AGENT', null], ['AGENT', null]]]
];

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
        if (Object.prototype.hasOwnProperty.call(env, envVar)) {
          return agentId;
        }
      } else if (env[envVar] === expected) {
        return agentId;
      }
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
