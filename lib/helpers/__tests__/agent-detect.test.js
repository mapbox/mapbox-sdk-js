'use strict';

const detectAgent = require('../agent-detect');

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {};
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

test('no indicators returns null', () => {
  expect(detectAgent()).toBeNull();
});

test('harness var wins over AI_AGENT fallback, even when both are present', () => {
  process.env.CLAUDECODE = '1';
  process.env.AI_AGENT = 'something-else';
  expect(detectAgent()).toBe('claude-code');
});

test('codex and claude-code are distinct', () => {
  process.env = { CODEX_THREAD_ID: 'abc' };
  expect(detectAgent()).toBe('codex');

  process.env = { CLAUDECODE: '1' };
  expect(detectAgent()).toBe('claude-code');

  process.env = { CLAUDE_CODE: '1' };
  expect(detectAgent()).toBe('claude-code');
});

test('codex matches on any of its vars', () => {
  process.env = { CODEX_SANDBOX: '1' };
  expect(detectAgent()).toBe('codex');

  process.env = { CODEX_CI: '1' };
  expect(detectAgent()).toBe('codex');
});

test('warp requires an exact value match', () => {
  process.env = { TERM_PROGRAM: 'WarpTerminal' };
  expect(detectAgent()).toBe('warp');

  process.env = { TERM_PROGRAM: 'iTerm.app' };
  expect(detectAgent()).toBeNull();
});

test('vtcode requires an exact value match', () => {
  process.env = { VTCODE: '1' };
  expect(detectAgent()).toBe('vtcode');

  process.env = { VTCODE: '0' };
  expect(detectAgent()).toBeNull();

  process.env = { VTCODE: 'true' };
  expect(detectAgent()).toBeNull();
});

test('table order determines precedence among harness vars', () => {
  process.env = { CURSOR_AGENT: '1', ANTIGRAVITY_AGENT: '1' };
  expect(detectAgent()).toBe('antigravity');
});

test('github-copilot matches on any of its vars', () => {
  process.env = { COPILOT_MODEL: 'gpt' };
  expect(detectAgent()).toBe('github-copilot');

  process.env = { COPILOT_ALLOW_ALL: '1' };
  expect(detectAgent()).toBe('github-copilot');

  process.env = { COPILOT_GITHUB_TOKEN: 'abc' };
  expect(detectAgent()).toBe('github-copilot');
});

test('falls back to custom-agent when AI_AGENT is present, regardless of its value', () => {
  process.env = { AI_AGENT: 'my-cool-tool' };
  expect(detectAgent()).toBe('custom-agent');
});

test('falls back to custom-agent when AGENT is present and AI_AGENT does not match', () => {
  process.env = { AGENT: 'my-cool-tool' };
  expect(detectAgent()).toBe('custom-agent');
});

test('AI_AGENT takes precedence over AGENT in the fallback (table order), same result either way', () => {
  process.env = { AI_AGENT: 'first', AGENT: 'second' };
  expect(detectAgent()).toBe('custom-agent');
});

test('an env var set to an empty or whitespace value still counts as present - existence is all that matters', () => {
  process.env = { AI_AGENT: '' };
  expect(detectAgent()).toBe('custom-agent');

  process.env = { AI_AGENT: '   ' };
  expect(detectAgent()).toBe('custom-agent');

  process.env = { CLAUDECODE: '' };
  expect(detectAgent()).toBe('claude-code');

  process.env = { CLAUDECODE: '   ' };
  expect(detectAgent()).toBe('claude-code');
});

test('the fallback value itself is never forwarded, even when it looks header-unsafe', () => {
  process.env = { AI_AGENT: 'foo\nbar: injected' };
  expect(detectAgent()).toBe('custom-agent');
});

// Single-var, presence-check allowlist entries not already covered above by
// a more targeted test (precedence, multi-var-OR, or exact-value-match).
test.each([
  ['augment-cli', 'AUGMENT_AGENT'],
  ['cline', 'CLINE_ACTIVE'],
  ['cowork', 'CLAUDE_CODE_IS_COWORK'],
  ['crush', 'CRUSH'],
  ['gemini-cli', 'GEMINI_CLI'],
  ['goose', 'GOOSE_TERMINAL'],
  ['hermes-agent', 'HERMES_SESSION_ID'],
  ['kilo-code', 'KILOCODE_FEATURE'],
  ['kiro', 'AGENT_CONTEXT_OUT'],
  ['openclaw', 'OPENCLAW_SHELL'],
  ['opencode', 'OPENCODE_CLIENT'],
  ['pi', 'PI_CODING_AGENT'],
  ['replit', 'REPL_ID'],
  ['trae', 'TRAE_AI_SHELL_ID'],
  ['zed', 'ZED_TERM'],
  ['cursor-cli', 'CURSOR_AGENT'],
  ['cursor', 'CURSOR_TRACE_ID']
])('detects %j from its env var %j in isolation', (agentId, envVar) => {
  process.env = { [envVar]: '1' };
  expect(detectAgent()).toBe(agentId);
});

test('a throwing process.env (e.g. a permission-gated Proxy) is treated as no agent detected', () => {
  Object.defineProperty(process, 'env', {
    configurable: true,
    get() {
      throw new Error('permission denied');
    }
  });
  try {
    expect(detectAgent()).toBeNull();
  } finally {
    Object.defineProperty(process, 'env', {
      configurable: true,
      writable: true,
      value: ORIGINAL_ENV
    });
  }
});

test('returns null outside Node, where process.env is unavailable', () => {
  process.env = { CLAUDECODE: '1' };
  const originalProcess = global.process;
  try {
    global.process = undefined;
    expect(detectAgent()).toBeNull();
  } finally {
    global.process = originalProcess;
  }
});
