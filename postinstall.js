const esbuild = require('esbuild');

esbuild
  .build({
    // eslint-disable-next-line node/no-missing-require
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
    // eslint-disable-next-line node/no-missing-require
    entryPoints: [require.resolve('satori-html')],
    outfile: 'build/satori-html.js',
    bundle: true,
    platform: 'node',
  })
  .catch(() => {
    throw new Error("eleventy-plugin-og-image couldn't compile satori-html");
  });
