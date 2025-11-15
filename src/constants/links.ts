export type SampleLink = {
  id: string;
  code: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
};

export const SAMPLE_LINKS: SampleLink[] = [
  {
    id: "1",
    code: "demo1",
    originalUrl: "https://irfanwork.vercel.app",
    clickCount: 12,
    createdAt: "2025-11-10T10:00:00Z",
  },
];
