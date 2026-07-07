/* eslint-disable max-classes-per-file */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable newline-before-return */
/* eslint-disable no-plusplus */
import test from 'ava';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import plugin from '../.eleventy.js';

function createEleventyConfigStub() {
  /** @type {Record<string, Function[]>} */
  const listeners = Object.create(null);

  /** @type {{ name: string; fn: Function } | undefined} */
  let shortcode;

  /** @type {Set<string>} */
  const ignores = new Set();

  /** @type {string[]} */
  const logs = [];

  return {
    listeners,
    getShortcode() {
      if (!shortcode) {
        throw new Error('Shortcode not registered');
      }
      return shortcode;
    },
    eleventyConfig: {
      logger: {
        log(msg) {
          logs.push(String(msg));
        },
        get logs() {
          return logs;
        },
      },
      ignores: {
        add(glob) {
          ignores.add(glob);
        },
        get values() {
          return ignores;
        },
      },
      on(name, fn) {
        listeners[name] ||= [];
        listeners[name].push(fn);
      },
      addAsyncShortcode(name, fn) {
        shortcode = { name, fn };
      },
    },
  };
}

async function createTmpDir(t) {
  const dir = path.join(os.tmpdir(), `eleventy-plugin-og-image-test-${process.pid}-${Date.now()}`);
  await fs.mkdir(dir, { recursive: true });
  t.teardown(async () => {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {}
  });
  return dir;
}

test.serial('plugin registers ignores and shortcode', async (t) => {
  const stub = createEleventyConfigStub();

  await plugin(stub.eleventyConfig, {});

  t.true(stub.eleventyConfig.ignores.values.size >= 1);
  t.is(stub.getShortcode().name, 'ogImage');
});

test.serial('ogImage shortcode returns null when page.url is false', async (t) => {
  const stub = createEleventyConfigStub();
  await plugin(stub.eleventyConfig, {});

  // Set required config for mergedOptions/joined paths (dir + config events)
  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: '.', output: '_site', includes: '_includes', data: '_data' });
  }
  for (const fn of stub.listeners['eleventy.config'] || []) {
    fn({});
  }
  for (const fn of stub.listeners['eleventy.extensionmap'] || []) {
    fn({});
  }

  const { fn: ogImageShortcode } = stub.getShortcode();
  const result = await ogImageShortcode.call({ page: { url: false } }, './does-not-matter.og.njk');
  t.is(result, null);
});

test.serial('ogImage shortcode throws a helpful error when input template is missing', async (t) => {
  const stub = createEleventyConfigStub();
  await plugin(stub.eleventyConfig, {});

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: '.', output: '_site', includes: '_includes', data: '_data' });
  }
  for (const fn of stub.listeners['eleventy.config'] || []) {
    fn({});
  }
  for (const fn of stub.listeners['eleventy.extensionmap'] || []) {
    fn({});
  }

  const { fn: ogImageShortcode } = stub.getShortcode();

  await t.throwsAsync(
    async () => ogImageShortcode.call({ page: { url: '/x/' }, eleventy: {} }, './missing.og.njk'),
    { message: /Could not find file for the `ogImage` shortcode/ },
  );
});

test.serial('eleventy.before creates/removes preview dirs depending on runMode', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const siteDir = path.join(root, '_site');
  const outputDir = 'out';
  const previewDir = 'out/preview';

  await plugin(stub.eleventyConfig, {
    outputDir,
    previewDir,
    previewMode: 'auto',
    // Ensure inputFileGlob is stable for ignores.add
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: root, output: siteDir, includes: '_includes', data: '_data' });
  }

  // watch => preview enabled => mkdir previewDir
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'watch' });
  }
  const previewStat1 = await fs.stat(path.join(siteDir, previewDir));
  t.true(previewStat1.isDirectory());

  // build => preview disabled => rm previewDir
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'build' });
  }
  const existsAfter = await fs
    .access(path.join(siteDir, previewDir))
    .then(() => true)
    .catch(() => false);
  t.false(existsAfter);
});

test.serial('ogImage shortcode: render/write branch, cache copy branch, and preview branch', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const inputDir = path.join(root, 'input');
  const siteDir = path.join(root, '_site');
  const outputDir = 'og-images';
  const previewDir = 'og-images/preview';
  const resolvedOutputDir = path.join(siteDir, outputDir);
  const resolvedPreviewDir = path.join(siteDir, previewDir);

  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(resolvedOutputDir, { recursive: true });

  const inputTemplatePath = path.join(inputDir, 'og-image.og.njk');
  await fs.writeFile(inputTemplatePath, 'stub', 'utf8');

  /** @type {{ constructorArgs?: any; renderCalled: number }} */
  const state = { constructorArgs: undefined, renderCalled: 0 };

  class OgImageMock {
    constructor(args) {
      state.constructorArgs = args;
    }
    async outputFilePath() {
      return path.join(resolvedOutputDir, 'out.png');
    }
    async cacheFilePath() {
      return path.join(resolvedOutputDir, 'cache.png');
    }
    async render() {
      state.renderCalled++;
      return {
        async toFile(fp) {
          await fs.writeFile(fp, 'png', 'utf8');
        },
      };
    }
    previewFilePath() {
      return path.join(resolvedPreviewDir, 'page.png');
    }
    async previewHtml() {
      return '<html>preview</html>';
    }
    async shortcodeOutput() {
      return 'SHORTCODE_OUTPUT';
    }
  }

  await plugin(stub.eleventyConfig, {
    OgImage: OgImageMock,
    outputDir,
    previewDir,
    previewMode: true,
    urlPath: 'og-images',
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: inputDir, output: siteDir, includes: '_includes', data: '_data' });
  }
  for (const fn of stub.listeners['eleventy.config'] || []) {
    fn({ template: 'config' });
  }
  for (const fn of stub.listeners['eleventy.extensionmap'] || []) {
    fn({ ext: 'map' });
  }

  // Enable preview mode (sets previewEnabled + ensures dirs exist)
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'build' });
  }

  const { fn: ogImageShortcode } = stub.getShortcode();

  // First call: cache copy fails (cache missing) => render/write branch hit
  const result = await ogImageShortcode.call(
    { page: { url: '/page/' }, eleventy: { some: 'ctx' } },
    './og-image.og.njk',
    { extra: 1 },
  );

  t.is(result, 'SHORTCODE_OUTPUT');
  t.is(state.renderCalled, 1);
  t.truthy(state.constructorArgs.extensionMap);
  t.truthy(state.constructorArgs.templateConfig);

  // output file written
  t.true(
    await fs
      .access(path.join(resolvedOutputDir, 'out.png'))
      .then(() => true)
      .catch(() => false),
  );

  // preview written
  t.true(
    await fs
      .access(path.join(resolvedPreviewDir, 'page.png'))
      .then(() => true)
      .catch(() => false),
  );
  t.true(
    await fs
      .access(path.join(resolvedPreviewDir, 'page.png.html'))
      .then(() => true)
      .catch(() => false),
  );

  // log called
  t.true(stub.eleventyConfig.logger.logs.some((l) => l.includes('Writing')));

  // Second call: cache exists and copy succeeds => render not called again
  await fs.writeFile(path.join(resolvedOutputDir, 'cache.png'), 'cached', 'utf8');
  await fs.rm(path.join(resolvedOutputDir, 'out.png'), { force: true });
  await ogImageShortcode.call({ page: { url: '/page/' }, eleventy: {} }, './og-image.og.njk');
  t.is(state.renderCalled, 1);
});

test.serial('eleventy.before catches mkdir failure when outputDir is a file', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const siteDir = path.join(root, '_site');
  const outputDir = 'output-as-file';
  const previewDir = 'preview';
  await fs.mkdir(siteDir, { recursive: true });
  await fs.writeFile(path.join(siteDir, outputDir), 'not a dir', 'utf8');

  await plugin(stub.eleventyConfig, {
    outputDir,
    previewDir,
    previewMode: true,
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: root, output: siteDir, includes: '_includes', data: '_data' });
  }

  // should not throw (errors are swallowed)
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'build' });
  }

  t.pass();
});

test.serial('eleventy.before catches previewDir mkdir failure when previewDir is a file', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const siteDir = path.join(root, '_site');
  await fs.mkdir(siteDir, { recursive: true });

  // Make previewDir point at an existing file to force mkdir failure.
  await fs.writeFile(path.join(siteDir, 'preview-as-file'), 'x', 'utf8');

  await plugin(stub.eleventyConfig, {
    outputDir: 'og-images',
    previewDir: 'preview-as-file',
    previewMode: true,
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: root, output: siteDir, includes: '_includes', data: '_data' });
  }

  // Should not throw (mkdir failure is swallowed)
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'build' });
  }

  t.pass();
});

test.serial('eleventy.before catches previewDir rm failure when previewMode is false', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const siteDir = path.join(root, '_site');
  await fs.mkdir(siteDir, { recursive: true });
  await fs.writeFile(path.join(siteDir, 'preview-as-file'), 'x', 'utf8');

  await plugin(stub.eleventyConfig, {
    outputDir: 'og-images',
    // rm() against a path whose parent is a file should throw (and be swallowed)
    previewDir: 'preview-as-file/subdir',
    previewMode: false,
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: root, output: siteDir, includes: '_includes', data: '_data' });
  }

  // Should not throw (rm failure is swallowed)
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'build' });
  }

  t.pass();
});

test.serial('ogImage shortcode uses default OgImage when pluginOptions.OgImage is not provided', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const inputDir = path.join(root, 'input');
  const siteDir = path.join(root, '_site');
  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(siteDir, { recursive: true });

  // Real file is required for fs.access(joinedInputPath)
  await fs.writeFile(path.join(inputDir, 'og-image.og.njk'), 'stub', 'utf8');

  // Avoid heavy rendering by forcing a fixed outputFileSlug and pre-creating the output.
  const outputDir = path.join(siteDir, 'og-images');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'fixed.png'), 'already there', 'utf8');

  await plugin(stub.eleventyConfig, {
    outputFileSlug: async () => 'fixed',
    outputFileExtension: 'png',
    outputDir: 'og-images',
    previewMode: false,
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: inputDir, output: siteDir, includes: '_includes', data: '_data' });
  }
  for (const fn of stub.listeners['eleventy.config'] || []) {
    fn({}); // only passed through; not used when outputFileSlug is overridden
  }
  for (const fn of stub.listeners['eleventy.extensionmap'] || []) {
    fn({});
  }

  const { fn: ogImageShortcode } = stub.getShortcode();
  const result = await ogImageShortcode.call({ page: { url: '/x/' }, eleventy: {} }, './og-image.og.njk');

  t.regex(result, /<meta property="og:image"/);
});

test.serial('ogImage shortcode catches preview mkdir error (and then throws later)', async (t) => {
  const stub = createEleventyConfigStub();
  const root = await createTmpDir(t);

  const inputDir = path.join(root, 'input');
  const siteDir = path.join(root, '_site');
  const outputDir = 'og-images';
  const previewDir = 'og-images/preview';
  const resolvedOutputDir = path.join(siteDir, outputDir);
  const resolvedPreviewDir = path.join(siteDir, previewDir);

  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(resolvedOutputDir, { recursive: true });
  await fs.writeFile(path.join(inputDir, 'og-image.og.njk'), 'stub', 'utf8');
  await fs.writeFile(path.join(resolvedOutputDir, 'out.png'), 'exists', 'utf8');

  // Make a file where the shortcode will try to mkdir a directory
  await fs.mkdir(resolvedPreviewDir, { recursive: true });
  await fs.writeFile(path.join(resolvedPreviewDir, 'dir-as-file'), 'x', 'utf8');

  class OgImageMock {
    async outputFilePath() {
      return path.join(resolvedOutputDir, 'out.png');
    }
    async cacheFilePath() {
      return path.join(resolvedOutputDir, 'out.png');
    }
    previewFilePath() {
      return path.join(resolvedPreviewDir, 'dir-as-file', 'page.png');
    }
    async previewHtml() {
      return '<html>preview</html>';
    }
    async shortcodeOutput() {
      return 'SHORTCODE_OUTPUT';
    }
  }

  await plugin(stub.eleventyConfig, {
    OgImage: OgImageMock,
    outputDir,
    previewDir,
    previewMode: true,
    inputFileGlob: '**/*.og.*',
  });

  for (const fn of stub.listeners['eleventy.directories'] || []) {
    fn({ input: inputDir, output: siteDir, includes: '_includes', data: '_data' });
  }
  for (const fn of stub.listeners['eleventy.before'] || []) {
    await fn({ runMode: 'build' });
  }

  const { fn: ogImageShortcode } = stub.getShortcode();

  await t.throwsAsync(async () => ogImageShortcode.call({ page: { url: '/page/' }, eleventy: {} }, './og-image.og.njk'));
});

