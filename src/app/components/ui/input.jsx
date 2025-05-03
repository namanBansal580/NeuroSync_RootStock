import * as React from "react";
import { cn } from "../../lib/utils";


const Input = React.forwardRef(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-purple-500/20 bg-dark-lighter px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-red-500/50 focus-visible:ring-red-500/40",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
