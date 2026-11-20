# Academic Writing Using LaTeX: slides, Try it tools and starter files

Slide decks, Try it tools and Overleaf starter files for the SemiAcademy micro-credential **Academic Writing Using LaTeX** (Central State University). They are embedded in the Canvas course pages, and each one also opens on its own from the [GitHub Pages site](https://csu-physics.github.io/academic-writing-latex/).

## Contents

- `slides/m1.html`: Module 1 slides, Your first paper (11 slides).
- `slides/m2.html`: Module 2 slides, Writing mathematics (11 slides).
- `slides/m3.html` to `slides/m6.html`: Module 3 to 6 slides: Figures, tables and captions; Citations and bibliographies; Templates for every document; Polish, collaborate and submit (11 slides each).
- `tryit/t1-structure-errors.html`: Module 1 Try it tool, Source and structure, then Find the error.
- `tryit/t2-math.html`: Module 2 Try it tool, Equation builder, then Fix the math.
- `tryit/t3-tables-captions.html`: Module 3, Table builder, Fix this table, Caption check.
- `tryit/t4-bib-citations.html`: Module 4, .bib builder and checker, then Which cite command.
- `tryit/t5-templates.html`: Module 5, Template matcher, then Edit the template.
- `tryit/t6-log-macros.html`: Module 6, Log reader, then Macro refactor (math preview with the KaTeX copy in `vendor/`).
- `starters/m1-find-and-fix.tex`: Module 1 Overleaf starter, a short report with three planted problems.
- `starters/m1-find-and-fix.zip`: the same starter as `main.tex` in a .zip, for Overleaf's upload of a zipped project.
- `starters/m2-sheet-resistance.tex` and `.zip`: Module 2 Overleaf starter, a derivation typed as plain text to be rewritten.
- `starters/m3-figures-tables.zip`: Module 3 starter, a report with a PDF plot and a PNG map to insert and a table to build.
- `starters/m4-citations.zip`: Module 4 starter, hand-typed citations to replace and a references.bib with six real references, two of them broken on purpose.
- `starters/m5-report-to-paper.zip`: Module 5 starter, the same study as a plain report and as an IEEE conference paper (opens with report.tex as the main document).
- `starters/m6-seven-problems.zip`: Module 6 starter, a nearly finished paper with seven planted problems.
- `vendor/katex-0.16.47/`: KaTeX 0.16.47 (MIT licence, see its LICENSE file), unchanged, used by the Module 2 tool to show math. Only the .woff2 fonts are included.
- `tests/cases.js`: test cases for the Module 1 Try it checker: valid LaTeX, broken LaTeX, and text after `\end{document}`.
- `tests/t1_regression.js`: checker tests (valid cases report nothing, broken cases report the expected message, text after `\end{document}` gives one notice and stays out of the outline). Run with Node and Playwright: `node tests/t1_regression.js`.
- `tests/compile_valid.js`: compiler tests, kept separate (every valid case must compile with pdflatex with no errors; uses the image in `tests/fixtures`). Run: `node tests/compile_valid.js`.
- `tests/t2_regression.js`: tests for the Module 2 tool (every answer and spacing variant accepted, near misses rejected, every Fix the math key marked right, no outside requests). Run: `node tests/t2_regression.js`.
- `tests/t36_regression.js`: tests for the Module 3 to 6 tools (table builder, .bib checker, template matcher and macro checker logic; every choice item marked right with its key; no outside requests; no sideways scrolling at 390 and 800 pixels). Run: `node tests/t36_regression.js`.

## How the files work

Every HTML file loads nothing from other sites: inline CSS and JavaScript, the Lato font embedded (the Module 2 and Module 6 tools also load KaTeX from `vendor/` on this site), no outside requests, no cookies or browser storage, and nothing typed is saved or sent anywhere. Decks move with the arrow keys, Page Up and Page Down, Home and End, or the buttons, and print one slide per page.

Starter files open in Overleaf through its Open in Overleaf link, `https://www.overleaf.com/docs?snip_uri=<address of the .tex file>`, which copies the file into the learner's own Overleaf account; for the Module 5 starter the link also sets `main_document=report.tex`. Starters with figures or a .bib file are offered as .zip projects only. If that link does not work, the learner downloads the .zip and uploads it as a new project, or adds the .tex file to a blank project and sets it as the main document. Overleaf is a separate service; this project is not affiliated with it. Each starter is kept small so it compiles well inside the free plan's time limit.

## The references in the starters

The .bib files in the Module 4, 5 and 6 starters cite real papers and one textbook (Deal and Grove 1965; Smits 1958; Shockley 1949; Shockley and Read 1952; Hall 1952; Sze and Ng 2007). Their details were checked against Crossref and the publisher's page on 19 Nov 2026. The measurements in the starters are invented for practice.

## License

The course materials in this repository are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0); see `LICENSE`. The embedded Lato font is licensed under the SIL Open Font License 1.1. KaTeX, in `vendor/`, is licensed under the MIT licence (see `vendor/katex-0.16.47/LICENSE`).
