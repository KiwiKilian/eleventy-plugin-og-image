import test from 'ava';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import Eleventy from '@11ty/eleventy';

async function pathExists(p) {
  return fs
    .access(p)
    .then(() => true)
    .catch(() => false);
}

async function mkTmpDir(t) {
  const dir = path.join(os.tmpdir(), `eleventy-plugin-og-image-int-${process.pid}-${Date.now()}`);
  await fs.mkdir(dir, { recursive: true });
  t.teardown(async () => {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {}
  });
  return dir;
}

test.serial('integration: Eleventy build writes html + og image output', async (t) => {
  const root = await mkTmpDir(t);
  const inputDir = path.join(root, 'input');
  const outputDir = path.join(root, '_site');

  await fs.mkdir(inputDir, { recursive: true });

  // Minimal OG template without text (no fonts/network required)
  await fs.writeFile(
    path.join(inputDir, 'og-test.og.njk'),
    `<style>
  .root { width: 100%; height: 100%; background: #f0f; display: flex; }
</style>
<div class="root"></div>
`,
    'utf8',
  );

  await fs.writeFile(
    path.join(inputDir, 'page.njk'),
    `<!doctype html>
<html>
  <head>
    {% ogImage "./og-test.og.njk" %}
  </head>
  <body>ok</body>
</html>
`,
    'utf8',
  );

  const repoRoot = path.resolve('.');
  const configPath = path.join(root, '.eleventy.js');

  await fs.writeFile(
    configPath,
    `import EleventyPluginOgImage from ${JSON.stringify(path.join(repoRoot, '.eleventy.js'))};

/** @param {import('@11ty/eleventy/src/UserConfig').default} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    // Make output deterministic for assertions
    outputFileSlug: async () => "fixed",
    outputFileExtension: "png",
    outputDir: "og-images",
    urlPath: "og-images",
    previewMode: false,
    satoriOptions: { width: 120, height: 63, fonts: [] },
  });
};
`,
    'utf8',
  );

  const elev = new Eleventy(inputDir, outputDir, {
    configPath,
    quietMode: true,
  });

  await elev.init();
  await elev.write();

  const htmlOutPath = path.join(outputDir, 'page', 'index.html');
  const imageOutPath = path.join(outputDir, 'og-images', 'fixed.png');

  t.true(await pathExists(htmlOutPath));
  t.true(await pathExists(imageOutPath));

  const html = await fs.readFile(htmlOutPath, 'utf8');
  t.regex(html, /<meta property="og:image" content="\/og-images\/fixed\.png" \/>/);
});

test.serial('integration: second Eleventy build reuses cached image (no rewrite)', async (t) => {
  const root = await mkTmpDir(t);
  const inputDir = path.join(root, 'input');
  const outputDir = path.join(root, '_site');

  await fs.mkdir(inputDir, { recursive: true });

  await fs.writeFile(
    path.join(inputDir, 'og-test.og.njk'),
    `<style>.root{width:100%;height:100%;background:#000;display:flex;}</style><div class="root"></div>`,
    'utf8',
  );
  await fs.writeFile(
    path.join(inputDir, 'page.njk'),
    `<!doctype html><html><head>{% ogImage "./og-test.og.njk" %}</head><body>ok</body></html>`,
    'utf8',
  );

  const repoRoot = path.resolve('.');
  const configPath = path.join(root, '.eleventy.js');

  await fs.writeFile(
    configPath,
    `import EleventyPluginOgImage from ${JSON.stringify(path.join(repoRoot, '.eleventy.js'))};
export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    outputFileSlug: async () => "fixed",
    outputFileExtension: "png",
    outputDir: "og-images",
    urlPath: "og-images",
    previewMode: false,
    satoriOptions: { width: 120, height: 63, fonts: [] },
  });
};
`,
    'utf8',
  );

  const imageOutPath = path.join(outputDir, 'og-images', 'fixed.png');

  const elev1 = new Eleventy(inputDir, outputDir, { configPath, quietMode: true });
  await elev1.init();
  await elev1.write();

  const stat1 = await fs.stat(imageOutPath);

  // Ensure mtime resolution changes if rewritten
  await new Promise((r) => setTimeout(r, 20));

  const elev2 = new Eleventy(inputDir, outputDir, { configPath, quietMode: true });
  await elev2.init();
  await elev2.write();

  const stat2 = await fs.stat(imageOutPath);
  t.is(stat2.mtimeMs, stat1.mtimeMs);
});

