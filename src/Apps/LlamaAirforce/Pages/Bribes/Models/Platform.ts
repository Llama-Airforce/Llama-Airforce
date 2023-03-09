const platforms = ["votium", "hh"] as const;

export type Platform = typeof platforms[number];

export function isPlatform(platform: string): platform is Platform {
  return platforms.includes(platform as Platform);
}
