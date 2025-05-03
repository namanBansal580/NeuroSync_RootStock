
import { cva } from "class-variance-authority";

export const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-purple/50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-app-purple to-app-purple-dark text-white shadow-md hover:shadow-lg hover:translate-y-[-1px]",
        secondary: "bg-white/10 backdrop-blur-sm text-white hover:bg-white/15 shadow-sm",
        outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
        ghost: "bg-transparent hover:bg-white/10 text-white",
        icon: "bg-transparent hover:bg-white/10 text-white p-0",
      },
      size: {
        sm: "text-xs px-3 py-1.5 h-8 rounded-md",
        md: "text-sm px-4 py-2 h-10",
        lg: "text-base px-5 py-2.5 h-12",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const inputStyles = cva(
  "flex w-full border rounded-lg bg-white/5 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-app-purple/50 focus:border-app-purple/60 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
      withIcon: {
        true: "pl-10",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      withIcon: false,
    },
  }
);

export const cardStyles = cva(
  "overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-black/20 backdrop-blur-lg border border-white/10 shadow-xl",
        gradient: "bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl",
      },
      rounded: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-3xl",
        xl: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      rounded: "lg",
    },
  }
);

export const messageStyles = cva(
  "p-3 rounded-lg shadow-md backdrop-blur-sm max-w-[70%]",
  {
    variants: {
      type: {
        sent: "bg-gradient-to-r  from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700  text-white",
        received: "bg-white/10 text-white",
      },
    },
    defaultVariants: {
      type: "sent",
    },
  }
);

export const avatarStyles = cva(
  "flex items-center justify-center rounded-full text-white shadow-md",
  {
    variants: {
      size: {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
      },
      variant: {
        default: "bg-gradient-to-br from-app-purple to-app-purple-dark",
        alt: "bg-gradient-to-br from-app-purple-dark to-app-purple-light",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);