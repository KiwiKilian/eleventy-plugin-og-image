import { SatoriOptions } from 'satori';
import { FormatEnum, Sharp } from 'sharp';

type DirectoriesConfig = {
  input: string;
  includes: string;
  data: string;
  layouts?: string;
  output: string;
};

type EleventyPluginOgImageOptions = {
  inputFileGlob?: string;
  getOutputFileSlug?: (parameters: {
    inputPath: string;
    data: Record<string, any>;
    svg: string;
    context: Record<string, any>;
  }) => string;
  outputFileExtension?: keyof FormatEnum;
  outputDir?: string;
  urlPath?: string;
  generateHTML?: (outputUrl: string) => string;

  satoriOptions?: Partial<SatoriOptions>;
  sharpOptions?: Parameters<Sharp['toFormat']>[1];
};

export { EleventyPluginOgImageOptions, DirectoriesConfig };
