import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function VerifiedBadge({ className, size = "sm" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0",
        sizeClasses[size],
        className,
      )}
    >
      <Check className="w-2.5 h-2.5" strokeWidth={3} />
    </div>
  )
}
