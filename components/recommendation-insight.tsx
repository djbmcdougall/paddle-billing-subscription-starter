"use client"

import { Badge } from "@/components/ui/badge"

interface RecommendationInsightProps {
  reasons: string[]
  confidence: number
  className?: string
}

export default function RecommendationInsight({ reasons, confidence, className }: RecommendationInsightProps) {
  return (
    <div className={`mt-2 p-3 bg-blue-50 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-900">Why this recommendation?</span>
        <Badge variant="outline" className="text-xs">
          {confidence}% match
        </Badge>
      </div>
      <div className="space-y-1">
        {reasons.map((reason, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm text-blue-800">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
