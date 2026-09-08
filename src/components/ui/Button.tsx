"use client";

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "lg" | "xl"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white hover:bg-blue-700 shadow-sm": variant === "default",
            "border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50": variant === "outline",
            "hover:bg-slate-200 text-slate-800": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 shadow-sm": variant === "destructive",
            "h-14 px-6 py-4 text-xl": size === "default",
            "h-16 px-8 text-2xl": size === "lg",
            "h-24 px-12 text-3xl font-bold": size === "xl",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
