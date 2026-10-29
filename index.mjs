import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

export const officialLinks = Object.freeze({ calculator: 'https://ti84.io/', howTo: 'https://ti84.io/how-to-use', features: 'https://ti84.io/features' });

export function quadraticReport({ a, b, c }) {
  if (![a, b, c].every(Number.isFinite) || a === 0) throw new Error('Finite coefficients are required and a must be nonzero.');
  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX ** 2 + b * vertexX + c;
  let roots;
  if (discriminant >= 0) {
    const radical = Math.sqrt(discriminant);
    roots = [(-b - radical) / (2 * a), (-b + radical) / (2 * a)].sort((x, y) => x - y);
  } else {
    roots = [{ real: -b / (2 * a), imaginary: Math.sqrt(-discriminant) / Math.abs(2 * a) }, { real: -b / (2 * a), imaginary: -Math.sqrt(-discriminant) / Math.abs(2 * a) }];
  }
  const xSpan = Math.max(2, ...[vertexX, ...(typeof roots[0] === 'number' ? roots : [])].map(x => Math.abs(x))) + 2;
  return { equation: `${a}x² + ${b}x + ${c} = 0`, discriminant, vertex: { x: vertexX, y: vertexY }, roots, opens: a > 0 ? 'up' : 'down', suggestedXWindow: [-xSpan, xSpan], note: 'Enter the function in Y= on the online calculator to inspect the graph and adjust the window for your task.' };
}

export function summarizeNumbers(values) {
  if (!values.length || !values.every(Number.isFinite)) throw new Error('Provide at least one finite value.');
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  const mean = values.reduce((sum, x) => sum + x, 0) / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const variancePopulation = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;
  return { count: n, min: sorted[0], max: sorted[n - 1], mean, median, standardDeviationPopulation: Math.sqrt(variancePopulation), standardDeviationSample: n > 1 ? Math.sqrt(variancePopulation * n / (n - 1)) : null, note: 'Use the calculator list/statistics menus to check the result and show your work.' };
}

const reply = value => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] });
export function createServer() {
  const server = new McpServer({ name: 'ti84-math-practice', version: '0.1.0' });
  server.registerTool('quadratic_report', { title: 'Analyze a quadratic', description: 'Compute discriminant, roots, vertex, and a starting x-window for graph practice.', inputSchema: z.object({ a: z.number().finite(), b: z.number().finite(), c: z.number().finite() }) }, async input => { try { return reply(quadraticReport(input)); } catch (error) { return { ...reply({ error: error.message }), isError: true }; } });
  server.registerTool('summary_statistics', { title: 'Summarize a list', description: 'Compute mean, median, range, and population/sample standard deviations for a small list.', inputSchema: z.object({ values: z.array(z.number().finite()).min(1).max(1000) }) }, async ({ values }) => reply(summarizeNumbers(values)));
  server.registerTool('get_official_links', { title: 'Official TI 84 links', description: 'Return the online calculator and guide pages.', inputSchema: z.object({}) }, async () => reply(officialLinks));
  return server;
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) void serveStdio(createServer);
