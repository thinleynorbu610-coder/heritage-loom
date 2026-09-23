import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark" | "light" | "danger" | "link";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-[0_1px_0_rgb(255_255_255/0.12)_inset] hover:bg-primary-hover hover:shadow-soft",
  secondary: "bg-secondary text-ink hover:bg-secondary-hover hover:text-white",
  outline: "border border-border-strong bg-transparent text-text hover:border-text hover:bg-surface",
  ghost: "bg-transparent text-text hover:bg-surface-muted",
  dark: "bg-ink text-background hover:bg-black",
  light: "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-ink",
  danger: "bg-danger text-white hover:brightness-110",
  link: "px-0 text-primary underline-offset-4 hover:underline active:scale-100",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-full px-4 text-sm",
  md: "h-11 rounded-full px-6 text-[0.94rem]",
  lg: "h-13 rounded-full px-8 text-base",
  icon: "size-10 rounded-full",
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

export function buttonClasses({ variant = "primary", size = "md", fullWidth, className }: ButtonStyleProps = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], fullWidth && "w-full", className);
}

type ButtonProps = ButtonStyleProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, className, loading, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
});

type LinkButtonProps = ButtonStyleProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export function LinkButton({ variant, size, fullWidth, className, href, children, ...rest }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, fullWidth, className })} {...rest}>
      {children}
    </Link>
  );
}
