import type { StoreSettings } from "@/lib/settings";

export const SOCIAL_PLATFORMS = [
  { settingKey: "social_instagram", settingsProp: "socialInstagram", label: "Instagram" },
  { settingKey: "social_pinterest", settingsProp: "socialPinterest", label: "Pinterest" },
  { settingKey: "social_tiktok", settingsProp: "socialTiktok", label: "TikTok" },
  { settingKey: "social_facebook", settingsProp: "socialFacebook", label: "Facebook" },
  { settingKey: "social_youtube", settingsProp: "socialYoutube", label: "YouTube" },
  { settingKey: "social_x", settingsProp: "socialX", label: "X (Twitter)" },
  { settingKey: "social_linkedin", settingsProp: "socialLinkedin", label: "LinkedIn" },
  { settingKey: "social_etsy", settingsProp: "socialEtsy", label: "Etsy" },
] as const;

export type SocialSettings = Pick<
  StoreSettings,
  (typeof SOCIAL_PLATFORMS)[number]["settingsProp"]
>;

export type SocialPlatformId =
  | "instagram"
  | "pinterest"
  | "tiktok"
  | "facebook"
  | "youtube"
  | "x"
  | "linkedin"
  | "etsy";

export type SocialLink = {
  id: SocialPlatformId;
  label: string;
  href: string;
};

const PLATFORM_IDS: Record<(typeof SOCIAL_PLATFORMS)[number]["settingKey"], SocialPlatformId> = {
  social_instagram: "instagram",
  social_pinterest: "pinterest",
  social_tiktok: "tiktok",
  social_facebook: "facebook",
  social_youtube: "youtube",
  social_x: "x",
  social_linkedin: "linkedin",
  social_etsy: "etsy",
};

export function isActiveSocialUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.length > 0 && trimmed !== "#";
}

export function getSocialLinks(settings: SocialSettings): SocialLink[] {
  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const href = settings[platform.settingsProp];
    if (!isActiveSocialUrl(href)) return [];

    return [
      {
        id: PLATFORM_IDS[platform.settingKey],
        label: platform.label,
        href: href.trim(),
      },
    ];
  });
}

export function getSocialUrls(settings: SocialSettings): string[] {
  return getSocialLinks(settings).map((link) => link.href);
}
