import path from 'node:path';
import url from 'node:url';
import { TemplatePath } from '@11ty/eleventy-utils';

/**
 * @param { Omit<import('eleventy-plugin-og-image').EleventyPluginOgImageOptions, 'satoriOptions' | 'sharpOptions'> } options
 * @param { string } fileSlug
 *
 * @returns {{ outputFilename: string, outputFilePath: string, outputUrl: string }}
 * */
export function getOutputParameters({ options, fileSlug }) {
  const outputFilename = `${fileSlug}.${options.outputFileExtension}`;
  const outputFilePath = TemplatePath.standardizeFilePath(path.join(options.outputDir, outputFilename));

  const fileUrl = new url.URL('file://');
  fileUrl.pathname = path.join(options.urlPath, outputFilename);
  const outputUrl = fileUrl.pathname;

  return { outputFilename, outputFilePath, outputUrl };
}
