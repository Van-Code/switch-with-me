import * as React from "react"
import { cn } from "@/lib/utils"



const Avatar = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function Avatar({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
})

const AvatarImage = React.forwardRef<HTMLImageElement, React.HTMLAttributes<HTMLImageElement>>(
  function AvatarImage({ className, ...props }, ref) {
  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
})

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function AvatarFallback({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
})

export { Avatar, AvatarImage, AvatarFallback }