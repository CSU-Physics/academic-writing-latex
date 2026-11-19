// Compiler check for the valid test cases: every VALID snippet must compile with pdflatex with no errors.
// Separate from the checker tests. Run: node tests/compile_valid.js   (needs Node and a TeX installation with pdflatex)
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const { wrap, VALID } = require('./cases.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't1-compile-'));
fs.copyFileSync(path.join(__dirname, 'fixtures', 'my_fig.png'), path.join(dir, 'my_fig.png'));
let fail = 0;
VALID.forEach(([name, body], i) => {
  const f = 'v' + i;
  fs.writeFileSync(path.join(dir, f + '.tex'), wrap(body));
  try { execFileSync('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', f + '.tex'], { cwd: dir, stdio: 'ignore', timeout: 60000 }); }
  catch (e) { /* the log is checked below */ }
  const log = fs.readFileSync(path.join(dir, f + '.log'), 'utf8');
  const errors = log.split('\n').filter(l => l.startsWith('!')).length;
  const pdf = fs.existsSync(path.join(dir, f + '.pdf'));
  if (errors || !pdf) { fail++; console.log('FAIL compile:', name, 'errors', errors, 'pdf', pdf); }
});
console.log(`pdflatex: valid ${VALID.length}, failures ${fail}`);
process.exit(fail ? 1 : 0);
