"use client"

import { useState } from "react"
import { Clock, Star, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Manga {
  id: string
  title: string
  currentChapter: string
  status: string
  imgPath?: string
  rating?: number
  updatedAt: string
  source?: string
  description?: string
  genres?: string[]
  author?: string
}

interface MangaCardProps {
  manga: Manga
}

export default function MangaCard({ manga }: MangaCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-green-500 hover:bg-green-600"
      case "ended":
        return "bg-blue-500 hover:bg-blue-600"
      case "season end":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "dropped":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-700">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-700 animate-pulse flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-slate-500" />
              </div>
            )}
            <img
              src={manga.imgPath || "/placeholder.svg"}
              alt={manga.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-slate-500" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <Badge className={`absolute top-2 right-2 text-xs font-medium ${getStatusColor(manga.status)}`}>
          {manga.status}
        </Badge>

        {/* Rating */}
        {manga.rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-medium">{manga.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {manga.source ? (
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
              <a href={manga.source} target="_blank" rel="noopener noreferrer">
                Continue Reading
              </a>
            </Button>
          ) : (
            <Button size="sm" className="w-full bg-slate-600" disabled>
              No Source Available
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {manga.title}
          </h3>
          <p className="text-slate-400 text-xs mt-1">Chapter {manga.currentChapter}</p>
        </div>

        {/* Updated Date */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{formatDate(manga.updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
