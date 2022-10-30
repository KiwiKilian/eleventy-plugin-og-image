import { SatoriOptions } from 'satori';
import { FormatEnum, Sharp } from 'sharp';

declare type EleventyPluginOgImageOptions = {
  inputFileGlob?: string;
  outputFileExtension?: keyof FormatEnum;
  satoriOptions?: SatoriOptions;
  sharpOptions?: Parameters<Sharp['toFormat']>[1];
};

export { EleventyPluginOgImageOptions };
