"use client"

import { Loader } from "lucide-react"

interface DataTableProps {
  data: any[]
  loading: boolean
  totalRecords?: number
}

export default function DataTable({ data, loading, totalRecords = 12000 }: DataTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-foreground font-medium">No data yet</p>
          <p className="text-muted-foreground">Apply filters and click "Retrieve Data" to see results</p>
        </div>
      </div>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Displaying Records</p>
          <p className="text-2xl font-bold text-foreground">
            {data.length}{" "}
            <span className="text-base font-normal text-muted-foreground">of {totalRecords.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-muted border-b border-border sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap"
                >
                  {column.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-card" : "bg-muted/50 hover:bg-muted/70"}>
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-3 text-sm text-foreground border-t border-border whitespace-nowrap"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
