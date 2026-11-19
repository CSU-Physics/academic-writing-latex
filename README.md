# Academic Writing Using LaTeX: slides, Try it tools and starter files

Slide decks, Try it tools and Overleaf starter files for the SemiAcademy micro-credential **Academic Writing Using LaTeX** (Central State University). They are embedded in the Canvas course pages, and each one also opens on its own from the [GitHub Pages site](https://csu-physics.github.io/academic-writing-latex/).

## Contents

- `slides/m1.html`: Module 1 slides, Your first paper (11 slides).
- `tryit/t1-structure-errors.html`: Module 1 Try it tool, Source and structure, then Find the error.
- `starters/m1-find-and-fix.tex`: Module 1 Overleaf starter, a short report with three planted problems.
- `starters/m1-find-and-fix.zip`: the same starter as `main.tex` in a .zip, for Overleaf's upload of a zipped project.
- `tests/cases.js`: test cases for the Module 1 Try it checker: valid LaTeX, broken LaTeX, and text after `\end{document}`.
- `tests/t1_regression.js`: checker tests (valid cases report nothing, broken cases report the expected message, text after `\end{document}` gives one notice and stays out of the outline). Run with Node and Playwright: `node tests/t1_regression.js`.
- `tests/compile_valid.js`: compiler tests, kept separate (every valid case must compile with pdflatex with no errors; uses the image in `tests/fixtures`). Run: `node tests/compile_valid.js`.

Later modules add their own files in the same folders.

## How the files work

Every HTML file is self-contained: inline CSS and JavaScript, the Lato font embedded, no outside requests, no cookies or browser storage, and nothing typed is saved or sent anywhere. Decks move with the arrow keys, Page Up and Page Down, Home and End, or the buttons, and print one slide per page.

Starter files open in Overleaf through its Open in Overleaf link, `https://www.overleaf.com/docs?snip_uri=<address of the .tex file>`, which copies the file into the learner's own Overleaf account. If that link does not work, the learner downloads the .zip and uploads it as a new project, or adds the .tex file to a blank project and sets it as the main document. Overleaf is a separate service; this project is not affiliated with it. Each starter is kept small so it compiles well inside the free plan's time limit.

## License

The course materials in this repository are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0); see `LICENSE`. The embedded Lato font is licensed under the SIL Open Font License 1.1.
