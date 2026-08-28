import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "color" | "light";
};

/**
 * Auratech logo mark — uses the official brand PNG asset.
 *
 * - variant="color"  → original deep green on transparent (use on light bg)
 * - variant="light"  → pure white on transparent (use on dark green bg)
 */
export function AuratechMark({ className, variant = "color" }: Props) {
  const src =
    variant === "light"
      ? "/logos/auratech-mark-light.png"
      : "/logos/auratech-mark.png";

  return (
    <Image
      src={src}
      alt="Auratech"
      width={592}
      height={983}
      priority
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}

/**
 * Full lockup: official Auratech wordmark PNG.
 * Use `variant="light"` on dark green surfaces (nav, footer).
 */
export function AuratechLogo({
  className,
  variant = "color",
}: Props) {
  const src =
    variant === "light"
      ? "/logos/auratech-wordmark-light.png"
      : "/logos/auratech-wordmark.png";

  return (
    <Image
      src={src}
      alt="Auratech"
      width={1850}
      height={368}
      priority
      className={cn("h-7 w-auto object-contain", className)}
    />
  );
}
