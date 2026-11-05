import type { Project } from '@/content/types';

const SRC = 'https://github.com/DucAnhLe1992/online-code-editor/blob/f37fe56b58e9a739a3e7ba9f6d1d0b1f0abaedf0/packages/local-client/src';

export const codeNotebook: Project = {
  slug: 'code-notebook',
  title: 'Code Notebook',
  label: 'Frontend · Developer tooling',
  summary:
    'An in-browser React notebook: write code and Markdown in cells, bundle it in the browser, preview it beside the editor, and save to a local file.',
  hardProblem:
    'How do you compile, bundle and run user-written React code inside a browser tab, without a build server?',
  kind: 'course-derived',
  role: 'Developer: implementation, extensions and npm packaging',
  stack: ['React', 'TypeScript', 'Redux', 'esbuild-wasm', 'Node.js', 'Express', 'Commander', 'Lerna'],
  featured: true,
  status: 'maintained',
  visual: 'pipeline',
  evidence: {
    repository: 'https://github.com/DucAnhLe1992/online-code-editor',
    package: 'https://www.npmjs.com/package/bundle-notebook',
  },
  overview:
    'Code Notebook runs from a single command. It starts a small local server, opens a notebook in the browser, and lets you mix code cells and Markdown cells. Each code cell is bundled in the browser with esbuild compiled to WebAssembly, then executed in a preview frame next to the editor. The notebook is saved to a file on your own machine.',
  sections: [
    {
      id: 'context',
      title: 'Context and provenance',
      blocks: [
        {
          type: 'callout',
          tone: 'note',
          title: 'Course-derived',
          text: 'The architecture follows a course by Stephen Grider, credited in the repository. I implemented it in TypeScript, structured it as a Lerna monorepo, and published the result as an installable npm package.',
        },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Run without installing',
          code: 'npx bundle-notebook serve\nnpx bundle-notebook serve -p 3000 notes.js',
        },
      ],
    },
    {
      id: 'problem',
      title: 'The hard problem',
      sources: [
        { label: 'CodeCell', href: `${SRC}/components/CodeCell/index.tsx` },
        { label: 'use-cumulative-code', href: `${SRC}/hooks/use-cumulative-code.ts` },
        { label: 'persist-middleware', href: `${SRC}/state/middlewares/persist-middleware.ts` },
      ],
      blocks: [
        {
          type: 'p',
          text: 'Browsers do not understand JSX or bare imports like "react". The notebook has to transpile code, resolve imports to real files, and bundle them, all inside the tab and quickly enough to feel live.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Edit: the code cell waits for one second without typing before it bundles, so esbuild does not run on every keystroke.',
            'Combine: each cell is bundled together with the cells above it, so later cells can use values defined earlier. A small `show()` helper renders a value or a React element into the preview.',
            'Bundle: esbuild-wasm transpiles JSX; custom plugins resolve bare imports to unpkg and cache fetched files in IndexedDB.',
            'Execute: the bundle is posted into a preview frame, which runs it with `eval` and displays compile and runtime errors in place.',
            'Persist: after a one-second pause in changes, cells are sent to the local API, which writes them to the file named on the command line.',
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      sources: [
        { label: 'bundler', href: `${SRC}/bundler/index.ts` },
        { label: 'fetch-plugin', href: `${SRC}/bundler/plugins/fetch-plugin.ts` },
        { label: 'unpkg-path-plugin', href: `${SRC}/bundler/plugins/unpkg-path-plugin.ts` },
      ],
      blocks: [
        {
          type: 'p',
          text: 'The project is a monorepo of three packages, each with one responsibility.',
        },
        {
          type: 'table',
          head: ['Package', 'Responsibility'],
          rows: [
            ['cli', 'The bundle-notebook command, built with Commander. Parses the port and filename, starts the server.'],
            ['local-api', 'An Express server that serves the client and reads and writes the notebook file.'],
            ['local-client', 'The React and Redux application: cells, editors, Markdown, bundling and preview.'],
          ],
        },
        {
          type: 'p',
          text: 'The bundler starts esbuild 0.8 in a web worker, loading its WebAssembly binary from unpkg. Two plugins do the work a bundler normally gets from the filesystem: one rewrites import paths to unpkg URLs, the other fetches them, caches them with localforage, and turns CSS files into injected style tags.',
        },
      ],
    },
    {
      id: 'preview',
      title: 'The preview frame',
      sources: [{ label: 'Preview', href: `${SRC}/components/Preview/index.tsx` }],
      blocks: [
        {
          type: 'p',
          text: 'Each preview is an iframe built from an inline HTML document (`srcDoc`) with `sandbox="allow-scripts"`. Without `allow-same-origin`, the frame gets an opaque origin, so code inside it cannot read the editor page’s DOM, cookies or storage.',
        },
        {
          type: 'p',
          text: 'When the bundle changes, the preview resets the document to clear the previous run, waits 50 ms, then sends the code with `postMessage`. A listener inside the frame runs it with `eval`, and both a `try/catch` and a global error handler write errors into the frame instead of the editor.',
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'What the frame does not protect against',
          text: 'The frame isolates errors and page state, not CPU. An infinite loop in a cell can still freeze the tab. Messages are posted with target `"*"` and the frame does not check where they came from; that suits a local single-user tool, but it is not a sandbox for untrusted code.',
        },
      ],
    },
  ],
  decisions: [
    {
      title: 'Where does bundling happen?',
      choice: 'In the browser, with esbuild compiled to WebAssembly.',
      alternative: 'Send code to a server that runs a bundler.',
      why: 'No remote build infrastructure to run or secure, and feedback stays fast. The cost is a larger first load for the WebAssembly binary and a dependency on unpkg.',
    },
    {
      title: 'Where does user code run?',
      choice: 'In a sandboxed preview frame that receives bundled code by message.',
      alternative: 'Evaluate the bundle directly in the editor page.',
      why: 'A thrown error or a stray DOM change in user code should not break the editor or its state. Resetting the frame for each run also gives every run a clean page.',
    },
    {
      title: 'Where is work saved?',
      choice: 'To a local file through a small local API.',
      alternative: 'Browser storage only, or a hosted backend.',
      why: 'A file on disk can be versioned, shared and opened again with the same command, and nothing leaves the machine.',
    },
  ],
  limitations: [
    'It runs locally; there is no hosted demo. A recording will be added here.',
    'Cells are transpiled as JSX only; TypeScript syntax inside a cell is not supported.',
    'Imports and the esbuild binary are fetched from unpkg, so the notebook needs network access for new packages.',
    'The preview isolates errors and page state, not execution time, and does not validate message origins.',
  ],
};
