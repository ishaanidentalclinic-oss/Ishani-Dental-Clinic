import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "white" | "outline" | "whatsapp" | "ghost";
export type ButtonSize = "default" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-700 text-white hover:bg-primary-800 focus-visible:outline-primary-700",
  white: "bg-white text-ink-900 hover:bg-primary-50 focus-visible:outline-ink-900",
  outline:
    "border border-primary-700 text-primary-700 bg-transparent hover:bg-primary-50 focus-visible:outline-primary-700",
  whatsapp:
    "border border-primary-600/40 bg-gradient-to-b from-primary-800 to-primary-900 text-white shadow-card transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-[0_16px_40px_-8px_rgba(16,61,52,0.55)] focus-visible:outline-primary-800",
  ghost: "text-primary-700 hover:text-primary-800 bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-6 py-3 text-sm",
  sm: "px-4 py-2 text-sm",
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variant !== "ghost" && sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return <Link href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
