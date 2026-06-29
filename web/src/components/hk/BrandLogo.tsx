import Image from "next/image";
import Link from "next/link";
import {
  brandImageSrc,
  pickBrandAsset,
  type BrandBackground,
  type SiteAsset,
} from "@/lib/brand";

type BrandLogoProps = {
  assets: SiteAsset[];
  /** Background the logo sits on — picks the matching wordmark file */
  background: BrandBackground;
  href?: string;
  /** Display height in px (width scales from asset aspect ratio) */
  height?: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  assets,
  background,
  href = "/",
  height = 36,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const asset =
    pickBrandAsset(assets, "wordmark", background) ??
    pickBrandAsset(assets, "wordmark", "light");

  if (!asset) return null;

  const width = Math.round(
    height * ((asset.width ?? 623) / (asset.height ?? 152)),
  );

  const img = (
    <Image
      src={brandImageSrc(asset)}
      alt={asset.alt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${className}`}
      sizes={`${width}px`}
    />
  );

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}

type BrandIconProps = {
  assets: SiteAsset[];
  background: BrandBackground;
  size?: number;
  className?: string;
};

export function BrandIcon({
  assets,
  background,
  size = 32,
  className = "",
}: BrandIconProps) {
  const asset =
    pickBrandAsset(assets, "icon", background) ??
    pickBrandAsset(assets, "icon", "neutral");

  if (!asset) return null;

  return (
    <Image
      src={brandImageSrc(asset)}
      alt={asset.alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
