import React from 'react';
import { cva} from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 hover:shadow-lg hover:shadow-purple-500/20",
        destructive: "bg-gradient-to-br from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/20",
        outline: "border border-purple-400 bg-transparent text-purple-400 hover:bg-purple-500/10 hover:text-purple-300",
        secondary: "bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 hover:text-purple-300",
        ghost: "bg-transparent text-purple-400 hover:bg-purple-500/10 hover:text-purple-300",
        link: "text-purple-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
