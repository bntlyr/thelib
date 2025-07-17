"use client"

import { Search, Filter, SortAsc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface SearchAndFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  totalResults: number
}

export default function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  totalResults,
}: SearchAndFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search manga, manhwa, anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="hiatus">Hiatus</SelectItem>
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
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="chapter">Chapter #</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <Badge variant="secondary" className="bg-slate-800 text-slate-300">
          {totalResults} results
        </Badge>
      </div>

      {/* Active Filters */}
      {(searchQuery || statusFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
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
  )
}
