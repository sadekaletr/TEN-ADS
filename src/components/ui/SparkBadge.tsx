"use client";



import { SparkAmount } from "@/components/ui/SparkAmount";

import { formatSyp, sparkToSyp } from "@/lib/spark";

import { cn } from "@/lib/utils";



interface SparkBadgeProps {

  amount: number;

  sparkUnit?: number;

  className?: string;

  size?: "sm" | "md" | "lg";

}



export function SparkBadge({

  amount,

  sparkUnit = 50_000,

  className,

  size = "md",

}: SparkBadgeProps) {

  const syp = sparkToSyp(amount, sparkUnit);

  const iconSize = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";



  return (

    <span className={cn("inline-flex flex-col items-start gap-1", className)}>

      <SparkAmount amount={amount} size={iconSize} />

      <span className="font-mono text-xs text-dim">{formatSyp(syp)}</span>

    </span>

  );

}

