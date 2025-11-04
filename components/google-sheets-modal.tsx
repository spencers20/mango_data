"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface GoogleSheetsModalProps {
  onClose: () => void
  onSubmit: (url: string) => void
}

export default function GoogleSheetsModal({ onClose, onSubmit }: GoogleSheetsModalProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    if (!url.includes("docs.google.com/spreadsheets")) {
      setError("Please enter a valid Google Sheets URL")
      return
    }

    onSubmit(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full mx-4 border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Upload to Spreadsheet</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your Google Spreadsheet URL to upload the filtered data.
          </p>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Google Spreadsheet URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
