const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: [require.resolve('yoga-wasm-web')],
    outfile: 'build/yoga-wasm-web.js',
    bundle: true,
    platform: 'node',
  })
  .catch(() => {
    throw new Error("eleventy-plugin-og-image couldn't compile yoga-wasm-web");
  });

esbuild
  .build({
    entryPoints: [require.resolve('satori-html')],
    outfile: 'build/satori-html.js',
    bundle: true,
    platform: 'node',
  })
  .catch(() => {
    throw new Error("eleventy-plugin-og-image couldn't compile satori-html");
  });
