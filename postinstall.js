const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: [require.resolve('satori-html')],
    outfile: 'build/satori-html.js',
    bundle: true,
    platform: 'node',
  })
  .catch(() => process.exit(1));
