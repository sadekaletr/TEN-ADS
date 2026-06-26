"use client";

import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Bell } from "@phosphor-icons/react/Bell";
import { BellSlash } from "@phosphor-icons/react/BellSlash";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
import { CaretUp } from "@phosphor-icons/react/CaretUp";
import { Check } from "@phosphor-icons/react/Check";
import { CircleNotch } from "@phosphor-icons/react/CircleNotch";
import { Gift } from "@phosphor-icons/react/Gift";
import { Handshake } from "@phosphor-icons/react/Handshake";
import { House } from "@phosphor-icons/react/House";
import { Lock } from "@phosphor-icons/react/Lock";
import { Megaphone } from "@phosphor-icons/react/Megaphone";
import { Play } from "@phosphor-icons/react/Play";
import { Rocket } from "@phosphor-icons/react/Rocket";
import { SealCheck } from "@phosphor-icons/react/SealCheck";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import { Star } from "@phosphor-icons/react/Star";
import { Storefront } from "@phosphor-icons/react/Storefront";
import { UploadSimple } from "@phosphor-icons/react/UploadSimple";
import { Wallet } from "@phosphor-icons/react/Wallet";
import type { IconWeight } from "@phosphor-icons/react/lib";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export type IconSize = 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 40;

export interface IconProps {
  size?: IconSize;
  weight?: IconWeight;
  className?: string;
  /** Mirror horizontally in RTL for directional icons (arrows). */
  directional?: boolean;
}

type PhosphorIcon = ComponentType<{
  size?: number | string;
  weight?: IconWeight;
  className?: string;
}>;

function makeIcon(IconComponent: PhosphorIcon, directional = false) {
  return function SemanticIcon({
    size = 20,
    weight = "regular",
    className,
    directional: dirProp,
  }: IconProps) {
    const flip = directional || dirProp;
    return (
      <IconComponent
        size={size}
        weight={weight}
        className={flip ? cn("rtl:scale-x-[-1]", className) : className}
      />
    );
  };
}

export const icons = {
  check: makeIcon(Check),
  lock: makeIcon(Lock),
  spark: makeIcon(Sparkle),
  arrowLeft: makeIcon(ArrowLeft, true),
  arrowRight: makeIcon(ArrowRight, true),
  chevronDown: makeIcon(CaretDown),
  chevronUp: makeIcon(CaretUp),
  star: makeIcon(Star),
  gift: makeIcon(Gift),
  wallet: makeIcon(Wallet),
  rocket: makeIcon(Rocket),
  storefront: makeIcon(Storefront),
  sealCheck: makeIcon(SealCheck),
  house: makeIcon(House),
  megaphone: makeIcon(Megaphone),
  play: makeIcon(Play),
  handshake: makeIcon(Handshake),
  bell: makeIcon(Bell),
  bellSlash: makeIcon(BellSlash),
  spinner: makeIcon(CircleNotch),
  upload: makeIcon(UploadSimple),
} as const;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 20,
  weight = "regular",
  className,
  directional,
}: IconProps & { name: IconName }) {
  const Component = icons[name];
  return (
    <Component size={size} weight={weight} className={className} directional={directional} />
  );
}
