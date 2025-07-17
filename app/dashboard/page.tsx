"use client"

import { Button } from "@/components/ui/button"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MangaCard from "@/components/manga-card"
import { mangaData } from "@/lib/data"
import { Search, Filter, SortAsc, PlusCircle } from "lucide-react" // Added PlusCircle icon
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AddMangaDialog } from "@/components/add-manga-dialog" // Import the new dialog

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [isAddMangaDialogOpen, setIsAddMangaDialogOpen] = useState(false) // State for dialog

  // For frontend-only, we'll use a local state for manga data
  // In a real app, you'd refetch from an API or use a global state manager
  const [localMangaData, setLocalMangaData] = useState(mangaData)

  const filteredAndSortedManga = useMemo(() => {
    const filtered = localMangaData.filter((manga) => {
      // Use localMangaData
      const matchesSearch = manga.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || manga.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })

    // Sort the results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "chapter":
          return Number.parseInt(b.current_chapter) - Number.parseInt(a.current_chapter)
        case "latest":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return filtered
  }, [searchQuery, statusFilter, sortBy, localMangaData]) // Add localMangaData to dependencies

  const handleMangaAdded = () => {
    // In a real app, you'd refetch data from your backend here.
    // For this frontend-only example, we'll just log and close.
    console.log("Manga added successfully! (Simulated)")
    // If you want to see the new manga appear, you'd need to add it to localMangaData
    // For now, we'll just close the dialog.
    setIsAddMangaDialogOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Continue Reading</h1>
                <p className="text-slate-400 text-sm sm:text-base mt-1">Pick up where you left off</p>
              </div>

              {/* Search Bar and Add Manga Button */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search manga, manhwa, anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <Button
                  onClick={() => setIsAddMangaDialogOpen(true)}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Manga
                </Button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="all" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        All Status
                      </SelectItem>
                      <SelectItem value="ongoing" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Ongoing
                      </SelectItem>
                      <SelectItem value="dropped" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Dropped
                      </SelectItem>
                      <SelectItem value="season end" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Season End
                      </SelectItem>
                      <SelectItem value="ended" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Ended
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-slate-400" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="latest" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Latest
                      </SelectItem>
                      <SelectItem value="title" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Title A-Z
                      </SelectItem>
                      <SelectItem value="chapter" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        Chapter #
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                {filteredAndSortedManga.length} results
              </Badge>
            </div>

            {/* Active Filters */}
            {(searchQuery || statusFilter !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="outline" className="border-indigo-500 text-indigo-400">
                    Search: {searchQuery}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Status: {statusFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                      onClick={() => setStatusFilter("all")}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {filteredAndSortedManga.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">No results found</div>
              <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredAndSortedManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add Manga Dialog */}
      <AddMangaDialog
        isOpen={isAddMangaDialogOpen}
        onClose={() => setIsAddMangaDialogOpen(false)}
        onMangaAdded={handleMangaAdded}
      />
    </div>
  )
}
