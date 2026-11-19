// Test cases for the Module 1 Try it checker (tryit/t1-structure-errors.html).
// Shared by t1_regression.js (checker results) and compile_valid.js (pdflatex results).
const wrap = b => '\\documentclass{article}\n\\usepackage{amsmath}\n\\usepackage{siunitx}\n\\usepackage{graphicx}\n\\usepackage{hyperref}\n\\title{T}\n\\author{A}\n\\begin{document}\n\\maketitle\n' + b + '\n\\end{document}';
// Valid LaTeX: the checker must report nothing, and pdflatex must compile it with no errors.
const VALID = [
 ['inline math with \\( \\)', 'The sheet resistance \\(R_s\\) fell.'],
 ['inline math with $', 'The sheet resistance $R_s$ fell.'],
 ['display math $$', '$$ x_1 + x_2^2 $$'],
 ['display math \\[ \\]', '\\[ R_s = \\frac{\\pi}{\\ln 2}\\frac{V}{I} \\]'],
 ['equation env', '\\begin{equation}\n  t_{ox} = 50\n\\end{equation}'],
 ['align with &', '\\begin{align}\n  a &= b + c \\\\\n  d &= e\n\\end{align}'],
 ['tabular with &', '\\begin{tabular}{lr}\n  Wafer & Value \\\\\n  A & 49\n\\end{tabular}'],
 ['texttt and textsc', 'Saved in \\texttt{main.tex} by \\textsc{Lee}.'],
 ['url with _ # %', 'See \\url{https://example.com/a_b#c}.'],
 ['href', 'See \\href{https://example.com/x_y}{the guide}.'],
 ['label ref cite with _', 'As in Eq.~\\eqref{eq:r_s}, Figure~\\ref{fig_1} and \\cite{smith_2020}.'],
 ['includegraphics with _', '\\includegraphics[width=0.5\\textwidth]{my_fig.png}'],
 ['escaped specials', 'Yield rose 5\\% at \\$20, item \\#3, Smith \\& Jones, file\\_name.'],
 ['comment line', '% a note for myself about 5% yield\nText.'],
 ['verb', 'Type \\verb|a_b & c| in the editor.'],
 ['siunitx', 'The layer was \\SI{50}{\\nano\\metre} thick at \\qty{1000}{\\degreeCelsius}.'],
 ['newcommand with #', '\\newcommand{\\vect}[1]{\\mathbf{#1}}'],
 ['math env', '\\begin{math} a_1 \\end{math}'],
 ['greek and operators in math', '$\\alpha \\leq \\beta \\approx \\infty$'],
 ['itemize', '\\begin{itemize}\n  \\item one\n  \\item two\n\\end{itemize}'],
 ['section star', '\\section*{Acknowledgments}\nThanks.'],
];
// Broken LaTeX: the checker must report the expected message.
const BROKEN = [
 ['misspelled section', '\\sectoin{Results}', 'is not a standard LaTeX command'],
 ['unescaped & in text', 'Smith & Jones measured it.', 'Misplaced alignment tab character'],
 ['_ in text', 'The value R_s fell.', 'Missing $ inserted'],
 ['missing brace', 'We recorded the \\textbf{thickness.', 'is never closed'],
 ['usepackage in body', '\\usepackage{xcolor}', 'Can be used only in preamble'],
 ['digit % comment', 'The yield rose 5% after the anneal.', 'starts a comment'],
 ['unescaped #', 'Item #3 failed.', 'special character'],
 ['env mismatch', '\\begin{itemize}\n\\item a\n\\end{enumerate}', 'does not match'],
];
// Text after \end{document}: LaTeX ignores it, so the checker must report one notice and nothing else,
// and must leave it out of the outline.
const AFTER_END = '\\documentclass{article}\n\\begin{document}\nHello.\n\\end{document}\nDraft notes: R_s & #1\n\\section{Unused notes}';
module.exports = { wrap, VALID, BROKEN, AFTER_END };
