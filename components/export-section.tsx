"use client"

import { Download, Share2 } from "lucide-react"

interface ExportSectionProps {
  onExportCSV: () => void
  onUploadSheets: () => void
  recordCount: number
}

export default function ExportSection({ onExportCSV, onUploadSheets, recordCount }: ExportSectionProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Exporting Records</p>
        <p className="text-2xl font-bold text-foreground">
          {recordCount.toLocaleString()} <span className="text-base font-normal text-muted-foreground">of {recordCount.toLocaleString()} </span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          Download as CSV
        </button>
        <button
          onClick={onUploadSheets}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all text-sm border border-gray-200"
        >
          <Share2 className="w-4 h-4" />
          Upload to Spreadsheet
        </button>
      </div>
    </div>
  )
}
