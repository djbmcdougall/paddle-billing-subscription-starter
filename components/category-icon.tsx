import { UtensilsCrossed, ShoppingCart, Clapperboard, BookOpen, Sparkles, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

type CategoryIconType = "food" | "travel" | "shopping" | "entertainment" | "custom" | "books" | "all"

interface CategoryIconProps {
  type: CategoryIconType
  className?: string
  size?: number
}

export default function CategoryIcon({ type, className, size = 24 }: CategoryIconProps) {
  // Modern icon designs with gradients and styling
  const renderIcon = () => {
    const iconProps = {
      size: size,
      className: "relative z-10",
    }

    switch (type) {
      case "food":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-2 shadow-lg">
              <UtensilsCrossed {...iconProps} className="text-white" />
            </div>
          </div>
        )
      case "travel":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-2 shadow-lg">
              <Compass {...iconProps} className="text-white" />
            </div>
          </div>
        )
      case "shopping":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-2 shadow-lg">
              <ShoppingCart {...iconProps} className="text-white" />
            </div>
          </div>
        )
      case "entertainment":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-purple-400 to-pink-500 rounded-full p-2 shadow-lg">
              <Clapperboard {...iconProps} className="text-white" />
            </div>
          </div>
        )
      case "books":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full p-2 shadow-lg">
              <BookOpen {...iconProps} className="text-white" />
            </div>
          </div>
        )
      case "all":
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-gray-400 to-gray-600 rounded-full p-2 shadow-lg">
              <Sparkles {...iconProps} className="text-white" />
            </div>
          </div>
        )
      default:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full p-2 shadow-lg">
              <Sparkles {...iconProps} className="text-white" />
            </div>
          </div>
        )
    }
  }

  return <div className={cn("flex items-center justify-center", className)}>{renderIcon()}</div>
}
