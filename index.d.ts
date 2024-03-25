import { SatoriOptions } from 'satori';
import { FormatEnum, Sharp } from 'sharp';

type DirectoriesConfig = {
  input: string;
  includes: string;
  data: string;
  layouts?: string;
  output: string;
};

type SharpFormatOptions = Parameters<Sharp['toFormat']>[1];

type EleventyPluginOgImageOptions = {
  inputFileGlob?: string;
  hashLength?: number;
  outputFileExtension?: keyof FormatEnum;
  outputDir?: string;
  previewDir?: string;
  urlPath?: string;

  getOutputFileSlug?: () => Promise<string>;
  generateHTML?: (outputUrl: string) => Promise<string>;

  satoriOptions?: Partial<SatoriOptions>;
  sharpOptions?: SharpFormatOptions;
};

type EleventyPluginOgImageMergedOptions = Omit<
  Required<EleventyPluginOgImageOptions>,
  'satoriOptions' | 'sharpOptions'
> &
  Pick<EleventyPluginOgImageOptions, 'sharpOptions'> & {
    satoriOptions: SatoriOptions & { width: number; height: number };
  };

export { EleventyPluginOgImageOptions, EleventyPluginOgImageMergedOptions, DirectoriesConfig };
