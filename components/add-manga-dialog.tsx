"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Link } from "lucide-react"

interface AddMangaDialogProps {
  isOpen: boolean
  onClose: () => void
  onMangaAdded: () => void
}

export function AddMangaDialog({ isOpen, onClose, onMangaAdded }: AddMangaDialogProps) {
  const [formData, setFormData] = useState({
    mangaLink: "",
    rating: 0,
    status: "ONGOING",
  })
  const [parsedData, setParsedData] = useState({
    title: "",
    currentChapter: 0,
  })

  const parseMangaLink = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")
      // Find series and chapter parts
      const seriesIndex = pathParts.findIndex((part) => part === "series")
      const chapterIndex = pathParts.findIndex((part) => part === "chapter")
      let title = ""
      let currentChapter = 0
      if (seriesIndex !== -1 && pathParts[seriesIndex + 1]) {
        // Parse title from series slug
        const seriesSlug = pathParts[seriesIndex + 1]
        // Remove ID part (everything after the last dash followed by numbers/letters)
        const titlePart = seriesSlug.replace(/-[a-f0-9]+$/i, "")
        // Convert dashes to spaces and capitalize
        title = titlePart
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      }
      if (chapterIndex !== -1 && pathParts[chapterIndex + 1]) {
        // Parse chapter number
        const chapterStr = pathParts[chapterIndex + 1]
        currentChapter = Number.parseInt(chapterStr) || 0
      }
      return { title, currentChapter }
    } catch (error) {
      console.error("Error parsing manga link:", error)
      return { title: "", currentChapter: 0 }
    }
  }

  useEffect(() => {
    if (formData.mangaLink) {
      const parsed = parseMangaLink(formData.mangaLink)
      setParsedData(parsed)
    } else {
      setParsedData({ title: "", currentChapter: 0 })
    }
  }, [formData.mangaLink])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!parsedData.title) {
      console.error("No title parsed from the URL")
      return
    }

    try {
      const response = await fetch("/api/manga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: parsedData.title,
          currentChapter: parsedData.currentChapter.toString(),
          status: formData.status,
          rating: formData.rating > 0 ? formData.rating * 2 : null, // Convert 1-5 to 1-10 scale
          source: formData.mangaLink,
          imgPath: "/placeholder.svg?height=400&width=300",
        }),
      })

      if (response.ok) {
        resetForm()
        onMangaAdded() // Trigger a refresh in the parent component
      } else {
        const errorData = await response.json()
        console.error("Failed to add manga:", errorData.error)
      }
    } catch (error) {
      console.error("Error adding manga:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      mangaLink: "",
      rating: 0,
      status: "ONGOING",
    })
    setParsedData({
      title: "",
      currentChapter: 0,
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingChange(i)}
          className="hover:scale-110 transition-transform"
        >
          <Star
            className={`h-6 w-6 ${
              i <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-slate-600 text-slate-600 hover:fill-yellow-200 hover:text-yellow-200"
            }`}
          />
        </button>,
      )
    }
    return stars
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">Add New Manga</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Add a new manga to your collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mangaLink" className="text-slate-300">
              Manga Link
            </Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="mangaLink"
                type="url"
                placeholder="https://asuracomic.net/series/manga-name/chapter/1"
                value={formData.mangaLink}
                onChange={(e) => handleInputChange("mangaLink", e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          {/* Preview parsed data */}
          {parsedData.title && (
            <div className="bg-slate-800 p-3 rounded-md border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Preview:</p>
              <p className="font-medium text-white">{parsedData.title}</p>
              <p className="text-sm text-slate-400">Chapter {parsedData.currentChapter}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-slate-300">Rating</Label>
            <div className="flex items-center space-x-1">
              {renderStars(formData.rating)}
              <span className="ml-2 text-sm text-slate-400">
                {formData.rating > 0 ? `${formData.rating}/5` : "No rating"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-slate-300">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="ONGOING" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                  Ongoing
                </SelectItem>
                <SelectItem value="DROPPED" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                  Dropped
                </SelectItem>
                <SelectItem value="SEASON_END" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                  Season End
                </SelectItem>
                <SelectItem value="ENDED" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                  Ended
                </SelectItem>
                {/* Removed NO_SOURCE and DISCONTINUED as they were not in the provided list */}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={!parsedData.title}>
              Add Manga
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
