"use client"

import { useState } from "react"
import FilterSidebar from "./filter-sidebar"
import DataTable from "./data-table"
import ExportSection from "./export-section"
import GoogleSheetsModal from "./google-sheets-modal"
import { ArrowLeft } from "lucide-react"

export default function MainContent() {
  const [dataType, setDataType] = useState<"phone" | "email" | null>(null)
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
      // const url='https://lynnette-hyperglycaemic-lilyana.ngrok-free.dev/api/query'
      
      const body={
        dataType,
        filters
      }
      // const url='http://172.28.188.197:3000/api/query'
      const url='https://mango-data.vercel.app/api/query'
      const data_res=await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
      })

      const results=await data_res.json()

      // Mock data based on filters
      // const mockData = generateMockData(filters)
      setData(results.data)
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

  const OnDataType=async()=>{
    if (data.length>0){
      setData([])
    }
    setDataType(null)

  }

  const handlesheets=async()=>{
    console.log("checking auth...")
    if (data.length===0) return

    

    const authCheck = await fetch("https://mango-data.vercel.app/api/check_auth");
    if (authCheck.status === 401) {
      // Not authenticated → redirect to Google login
      const redirectUrl = encodeURIComponent(window.location.href); // current page
      window.location.href = `https://mango-data.vercel.app/api/auth/google?redirect=${redirectUrl}`;
      return; // stop here — Google will redirect back later
    }
    setShowSheetsModal(false)
  }



  const handleUploadSheets = async (spreadsheetUrl: string) => {
    console.log("Uploading to:", spreadsheetUrl)
    if (data.length===0) return

    const url='https://mango-data.vercel.app/api/update_sheets'
      const data_res=await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({spreadsheetUrl,data})
      })

      const results=await data_res.json()
      alert(results.success?results.success:results.error)
    // In production, this would send the data to your backend
    // which would then update the Google Sheet
    setShowSheetsModal(false)
  }

  const display_d=data.sort(()=>Math.random()-0.5).slice(0,30)
 if (dataType === null) {
    return (
      <main className="flex items-center justify-center h-[calc(100vh-90px)] bg-background">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Choose Data Type</h1>
            <p className="text-muted-foreground">Select which contact information you'd like to retrieve</p>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => setDataType("phone")}
              className="flex flex-col items-center justify-center gap-4 px-12 py-8 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              <div className="text-5xl">📱</div>
              <span className="text-xl font-semibold text-foreground">Phone Numbers</span>
            </button>

            <button
              onClick={() => setDataType("email")}
              className="flex flex-col items-center justify-center gap-4 px-12 py-8 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              <div className="text-5xl">✉️</div>
              <span className="text-xl font-semibold text-foreground">Email Addresses</span>
            </button>
          </div>
        </div>
      </main>
    )
  }


  return (
    <main className="flex h-[calc(100vh-90px)]">
     

      <FilterSidebar filters={filters} setFilters={setFilters} dataType={dataType} OnDataType={OnDataType} onRetrieveData={handleRetrieveData} loading={loading} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {data.length > 0 && (
            <ExportSection
              onExportCSV={handleExportCSV}
              onUploadSheets={() => setShowSheetsModal(true)}
              recordCount={data.length}
            />
          )}

          <DataTable data={display_d} loading={loading} totalRecords={data.length} />
        </div>
      </div>

      {showSheetsModal && <GoogleSheetsModal onClose={handlesheets } onSubmit={handleUploadSheets} />}
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
