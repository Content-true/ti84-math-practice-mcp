import assert from 'node:assert/strict';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { quadraticReport, summarizeNumbers } from './index.mjs';

test('quadratic roots and vertex agree', () => {
  const result = quadraticReport({ a: 1, b: -3, c: 2 });
  assert.deepEqual(result.roots, [1, 2]);
  assert.equal(result.vertex.y, -0.25);
  assert.equal(quadraticReport({ a: 1, b: 0, c: 1 }).roots[0].imaginary, 1);
});
test('sample and population statistics are distinct', () => {
  const result = summarizeNumbers([1, 2, 3]);
  assert.equal(result.mean, 2);
  assert.equal(result.standardDeviationSample, 1);
  assert.equal(summarizeNumbers([5]).standardDeviationSample, null);
});
test('MCP client can call quadratic report', async () => {
  const client = new Client({ name: 'ti84-test', version: '0.1.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [new URL('./index.mjs', import.meta.url).pathname] }));
  try {
    assert.equal((await client.listTools()).tools.length, 3);
    const result = await client.callTool({ name: 'quadratic_report', arguments: { a: 1, b: -3, c: 2 } });
    assert.deepEqual(JSON.parse(result.content[0].text).roots, [1, 2]);
  } finally { await client.close(); }
});
