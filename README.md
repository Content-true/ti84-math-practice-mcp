# TI 84 math practice MCP

A small local companion to [TI 84 Calculator Online](https://ti84.io/). The website provides a browser graphing calculator with a keypad, Y= input, graph, tables, lists, and matrices. This MCP server helps prepare and check two common practice tasks; it does not control or replace the website.

- `quadratic_report` calculates the discriminant, roots, vertex, opening direction, and a starting x-window for `ax² + bx + c`.
- `summary_statistics` calculates count, min/max, mean, median, and population and sample standard deviations from a numeric list.
- `get_official_links` returns the calculator and guide pages.

For a quadratic, work out the roots on paper, then enter the function in the [TI 84 Calculator Online](https://ti84.io/) Y= screen and compare the graph, vertex, and table. The suggested window is only a starting point; zoom and trace as needed. For statistics, compare both sample and population standard deviations so you choose the one your assignment asks for.

## Run

Node.js 20.18.1 or newer:

```sh
npm install
npm test
node index.mjs
```

Configure your MCP client to start `node /absolute/path/to/ti84-mcp/index.mjs` over stdio. No login or network request is made by this server. MIT license; see `LICENSE`.
