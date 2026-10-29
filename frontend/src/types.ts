export type Platform = "yt" | "tw" | "fb" | "ig";

export interface DownloadUrl {
  quality: string;
  size: number | string;
  url: string;
}

export interface VideoResult {
  title: string;
  thumb: string;
  urls: DownloadUrl[];
}

export interface VideoApiFailure {
  status: "fail";
  error: string;
  code?: number;
}

export type VideoApiResponse = VideoResult | VideoApiFailure;