import type { Project } from '@/content/types';

export const codeNotebook: Project = {
  slug: 'code-notebook',
  title: 'Code Notebook',
  label: 'Frontend · Developer tooling',
  summary:
    'An in-browser React notebook: write code and Markdown in cells, bundle it in the browser, preview instantly, and save to a local file.',
  hardProblem:
    'How do you compile, bundle and run user-written React code inside a browser tab, without a build server and without breaking the editor?',
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
    'Code Notebook runs from a single command. It starts a small local server, opens a notebook in the browser, and lets you mix code cells and Markdown cells. Each code cell is bundled in the browser with esbuild compiled to WebAssembly, then executed in a preview frame next to the editor. Your notebook is saved to a file on your own machine.',
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
      blocks: [
        {
          type: 'p',
          text: 'Browsers do not understand JSX or bare imports like "react". The notebook has to transpile code, resolve imports to real files, and bundle them, all inside the tab and quickly enough to feel live.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Edit: the user types into a code cell; input is debounced so bundling does not run on every keystroke.',
            'Bundle: esbuild-wasm transpiles JSX and TypeScript; custom plugins resolve bare imports to a package CDN and cache fetched files.',
            'Execute: the bundled output is posted into a sandboxed preview frame rather than evaluated in the editor’s own page.',
            'Report: compile errors and runtime errors are caught and shown in the preview instead of crashing the editor.',
            'Persist: cells are sent to the local API, which writes them to a file you chose on the command line.',
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
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
      ],
    },
  ],
  decisions: [
    {
      title: 'Where does bundling happen?',
      choice: 'In the browser, with esbuild compiled to WebAssembly.',
      alternative: 'Send code to a server that runs a bundler.',
      why: 'No remote build infrastructure to run or secure, and feedback stays fast. The cost is a larger first load for the WebAssembly binary.',
    },
    {
      title: 'Where does user code run?',
      choice: 'In a separate preview frame that receives bundled code by message.',
      alternative: 'Evaluate the bundle directly in the editor page.',
      why: 'An infinite loop or a thrown error in user code should not take down the editor or its state.',
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
    'Imports are fetched from a public package CDN, so the notebook needs network access for new packages.',
    'The preview frame isolates errors for convenience; it is not designed as a security boundary for untrusted code.',
  ],
};
