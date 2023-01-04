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
  outputFileExtension?: keyof FormatEnum;
  outputDir?: string;
  urlPath?: string;
  hashLength?: number;
  generateHTML?: (outputUrl: string) => string;

  satoriOptions?: Partial<SatoriOptions>;
  sharpOptions?: Parameters<Sharp['toFormat']>[1];
};

export { EleventyPluginOgImageOptions, DirectoriesConfig };
