"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { ArrowLeft } from "lucide-react"



interface FilterTag {
  headcount: string[]
  industry: string[]
  jobTitle: string[]
  entriesToRetrieve: number
}

interface FilterSidebarProps {
  filters: FilterTag
  setFilters: (filters: FilterTag) => void
  onRetrieveData: () => void
  loading: boolean
  OnDataType: ()=>void,
  dataType:string
}

export default function FilterSidebar({ filters, setFilters, OnDataType, dataType, onRetrieveData, loading }: FilterSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchInputs, setSearchInputs] = useState({
    headcount: "",
    industry: "",
    jobTitle: "",
  })
  const FILTER_OPTIONS = {
  headcount: ["50", "200", "500", "1000", "5000"],
  industry: ["Tech","Technology","Finance", "Healthcare", "Software", "Information Technology", "Consulting", "Energy", "Telecom"],
  jobTitle: ["Engineer", "Manager", "Founder","Co Founder" ,"Owner","Product Manager", "CEO","Chief Executive Officer","Data Scientist", "Sales", "Marketing", "Executive"],
}

  const toggleFilter = (category: keyof Omit<FilterTag, "entriesToRetrieve">, value: string) => {
    const current = filters[category]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setFilters({ ...filters, [category]: updated })
  }

  const removeFilter = (category: keyof Omit<FilterTag, "entriesToRetrieve">, value: string) => {
    const updated = filters[category].filter((v) => v !== value)
    setFilters({ ...filters, [category]: updated })
  }

  const getFilteredOptions = (category: keyof typeof FILTER_OPTIONS, search: string) => {
    return FILTER_OPTIONS[category].filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
  }

  return (
    <aside className="w-80 border-r border-border bg-card shadow-sm overflow-y-auto ">

      <button
        onClick={OnDataType}
        className="fixed top-24 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors z-40"
        title="Back to home"
      >
        <ArrowLeft className="w-5 h-5 mb-5" />
        {/* <span className="text-sm font-medium">&lt;--</span> */}
      </button>

      <div className="p-6 space-y-6 mt-3">
        <h2 className="text-lg font-semibold text-foreground">{dataType} Filters</h2>

        {/* Headcount Filter */}
        <FilterGroup title="Headcount">
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "headcount" ? null : "headcount")}
              className="w-full flex items-center justify-between px-3 py-2 bg-input border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-sm text-muted-foreground">Select headcount</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "headcount" && (
              <DropdownMenu
                options={getFilteredOptions("headcount", searchInputs.headcount)}
                selectedOptions={filters.headcount}
                onToggle={(value:any) => toggleFilter("headcount", value)}
                search={searchInputs.headcount}
                onSearchChange={(value:any) => setSearchInputs({ ...searchInputs, headcount: value })}
              />
            )}
          </div>
          {filters.headcount.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.headcount.map((tag) => (
                <Tag key={tag} label={tag} onRemove={() => removeFilter("headcount", tag)} />
              ))}
            </div>
          )}
        </FilterGroup>

        {/* Industry Filter */}
        <FilterGroup title="Industry">
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "industry" ? null : "industry")}
              className="w-full flex items-center justify-between px-3 py-2 bg-input border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-sm text-muted-foreground">Select industry</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "industry" && (
              <DropdownMenu
                options={getFilteredOptions("industry", searchInputs.industry)}
                selectedOptions={filters.industry}
                onToggle={(value:any) => toggleFilter("industry", value)}
                search={searchInputs.industry}
                onSearchChange={(value:any) => setSearchInputs({ ...searchInputs, industry: value })}
              />
            )}
          </div>
          {filters.industry.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.industry.map((tag) => (
                <Tag key={tag} label={tag} onRemove={() => removeFilter("industry", tag)} />
              ))}
            </div>
          )}
        </FilterGroup>

        {/* Job Title Filter */}
        <FilterGroup title="Job Title">
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "jobTitle" ? null : "jobTitle")}
              className="w-full flex items-center justify-between px-3 py-2 bg-input border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-sm text-muted-foreground">Select job title</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "jobTitle" && (
              <DropdownMenu
                options={getFilteredOptions("jobTitle", searchInputs.jobTitle)}
                selectedOptions={filters.jobTitle}
                onToggle={(value:any) => toggleFilter("jobTitle", value)}
                search={searchInputs.jobTitle}
                onSearchChange={(value:any) => setSearchInputs({ ...searchInputs, jobTitle: value })}
              />
            )}
          </div>
          {filters.jobTitle.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.jobTitle.map((tag) => (
                <Tag key={tag} label={tag} onRemove={() => removeFilter("jobTitle", tag)} />
              ))}
            </div>
          )}
        </FilterGroup>

        {/* Entries to Retrieve */}
        <FilterGroup title="Entries to Retrieve">
          <input
            type="number"
            min="1"
            max="1000"
            value={filters.entriesToRetrieve}
            onChange={(e) => setFilters({ ...filters, entriesToRetrieve: Number.parseInt(e.target.value) || 100 })}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </FilterGroup>

        {/* Retrieve Data Button */}
        <button
          onClick={onRetrieveData}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Retrieve Data"}
        </button>
      </div>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{title}</label>
      {children}
    </div>
  )
}

function DropdownMenu({ options, selectedOptions, onToggle, search, onSearchChange }: any) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 border-b border-border focus:outline-none bg-input"
      />
      <div className="max-h-48 overflow-y-auto">
        {options.map((option:any) => (
          <label key={option} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => onToggle(option)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-foreground">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
