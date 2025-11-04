"use client"

import { useState } from "react"
import FilterSidebar from "./filter-sidebar"
import DataTable from "./data-table"
import ExportSection from "./export-section"
import GoogleSheetsModal from "./google-sheets-modal"

export default function MainContent() {
  const [filters, setFilters] = useState({
    headcount: [],
    industry: [],
    jobTitle: [],
    entriesToRetrieve: 100,
  })
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSheetsModal, setShowSheetsModal] = useState(false)

  const handleRetrieveData = async () => {
    setLoading(true)
    try {
      // Simulate API call - in production, this would fetch from your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data based on filters
      const mockData = generateMockData(filters)
      setData(mockData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csv = [headers.join(","), ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mango-data-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleUploadSheets = (spreadsheetUrl: string) => {
    console.log("Uploading to:", spreadsheetUrl)
    // In production, this would send the data to your backend
    // which would then update the Google Sheet
    setShowSheetsModal(false)
  }

  return (
    <main className="flex h-[calc(100vh-90px)]">
      <FilterSidebar filters={filters} setFilters={setFilters} onRetrieveData={handleRetrieveData} loading={loading} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {data.length > 0 && (
            <ExportSection
              onExportCSV={handleExportCSV}
              onUploadSheets={() => setShowSheetsModal(true)}
              recordCount={data.length}
            />
          )}

          <DataTable data={data} loading={loading} totalRecords={12000} />
        </div>
      </div>

      {showSheetsModal && <GoogleSheetsModal onClose={() => setShowSheetsModal(false)} onSubmit={handleUploadSheets} />}
    </main>
  )
}

function generateMockData(filters: any) {
  const headcounts = ["less than 200", "200-500", "500-1000", "1000-5000", "5000+"]
  const industries = ["Tech", "Finance", "Healthcare", "Retail", "Manufacturing", "Education"]
  const jobTitles = ["Engineer", "Manager", "Designer", "Product Manager", "Data Scientist", "Sales", "Marketing"]
  const companies = ["Acme Corp", "Tech Solutions", "Global Industries", "Startup Hub", "Fortune 500 Co"]
  const firstNames = ["John", "Sarah", "Michael", "Emily", "David", "Jessica"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"]
  const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Boston, MA", "Denver, CO"]

  const count = Math.min(filters.entriesToRetrieve, 30)
  const data = []

  for (let i = 0; i < count; i++) {
    data.push({
      ID: i + 1,
      "Full Name": `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      Company: companies[Math.floor(Math.random() * companies.length)],
      "Job Title": jobTitles[Math.floor(Math.random() * jobTitles.length)],
      Industry: industries[Math.floor(Math.random() * industries.length)],
      Headcount: headcounts[Math.floor(Math.random() * headcounts.length)],
      Email: `user${i}@example.com`,
      Location: locations[Math.floor(Math.random() * locations.length)],
    })
  }

  return data
}
