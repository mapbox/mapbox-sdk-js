/* eslint-env node */
'use strict';

// (agentId, [envVar, ...]) - table order is precedence order; the first
// entry with any of its env vars present wins. Presence is the only thing
// ever tested - a var's value is never read or compared against anything,
// for any entry. Even a var explicitly set to "" or whitespace counts as
// present.
//
// Ported from mapbox/tilesets-cli's `agent_detect.py` (this repo's sibling
// implementation of the same allowlist - keep the two in sync). Canonical
// origin: HuggingFace's public `agent-harnesses.ts` registry.
//
// `vtcode` and `warp` used to require a specific value (`VTCODE === '1'`,
// `TERM_PROGRAM === 'WarpTerminal'`) rather than mere presence. Since values
// are never checked, `warp` was dropped entirely: `TERM_PROGRAM` is set by
// most terminal emulators (iTerm2, Apple Terminal, VS Code, Hyper, ...), not
// just Warp, so an existence check on it would misidentify most terminal
// sessions as "warp". `VTCODE` has no such collision risk and stays as a
// plain presence check.
//
// The final entry, `custom-agent`, is a catch-all for AI_AGENT/AGENT: these
// exist so an agent not on this list can still flag its presence, but we only
// ever check for them, never read their value - an arbitrary, unvalidated
// string must never be forwarded into telemetry as an "agent id".
var ALLOWLIST = [
  ['antigravity', ['ANTIGRAVITY_AGENT']],
  ['augment-cli', ['AUGMENT_AGENT']],
  ['cline', ['CLINE_ACTIVE']],
  ['cowork', ['CLAUDE_CODE_IS_COWORK']],
  ['claude-code', ['CLAUDECODE', 'CLAUDE_CODE']],
  ['codex', ['CODEX_SANDBOX', 'CODEX_CI', 'CODEX_THREAD_ID']],
  ['crush', ['CRUSH']],
  ['gemini-cli', ['GEMINI_CLI']],
  ['github-copilot', ['COPILOT_MODEL', 'COPILOT_ALLOW_ALL', 'COPILOT_GITHUB_TOKEN']],
  ['goose', ['GOOSE_TERMINAL']],
  ['hermes-agent', ['HERMES_SESSION_ID']],
  ['kilo-code', ['KILOCODE_FEATURE']],
  ['kiro', ['AGENT_CONTEXT_OUT']],
  ['openclaw', ['OPENCLAW_SHELL']],
  ['opencode', ['OPENCODE_CLIENT']],
  ['pi', ['PI_CODING_AGENT']],
  ['replit', ['REPL_ID']],
  ['trae', ['TRAE_AI_SHELL_ID']],
  ['vtcode', ['VTCODE']],
  ['zed', ['ZED_TERM']],
  ['cursor-cli', ['CURSOR_AGENT']],
  ['cursor', ['CURSOR_TRACE_ID']],
  ['custom-agent', ['AI_AGENT', 'AGENT']]
];

// Scans `env` for a matching agent indicator. Split out from `detectAgent`
// so the individual key reads below (which could throw in an environment
// where `process.env` is a permission-gated Proxy, e.g. Deno without
// --allow-env) are covered by a single try/catch there, rather than one
// bare `typeof process` guard that only checks the top-level object.
function scanEnv(env) {
  for (var i = 0; i < ALLOWLIST.length; i++) {
    var agentId = ALLOWLIST[i][0];
    var envVars = ALLOWLIST[i][1];
    for (var j = 0; j < envVars.length; j++) {
      if (Object.prototype.hasOwnProperty.call(env, envVars[j])) {
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
