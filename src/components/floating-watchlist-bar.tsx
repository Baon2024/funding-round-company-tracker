"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FloatingWatchlistBarProps {
  companyNames?: string[]
  onUpload?: () => void
  onClose?: () => void
}

export function FloatingWatchlistBar({ companyNames = [], onUpload, onClose }: FloatingWatchlistBarProps) {
  const uploadCompaniesSupabase = () => {
    // Your upload logic here
    console.log("Uploading companies to watchlist:", companyNames)
    onUpload?.()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-[3px] bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-indigo-500">
      <div className="bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {companyNames.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                    {companyNames.map((companyName, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm font-medium"
                      >
                        {companyName}
                      </span>
                    ))}
                  </div>
                  <Button onClick={uploadCompaniesSupabase} className="w-full sm:w-auto" size="sm">
                    Upload companies to watchlist
                  </Button>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No companies uploaded yet..</p>
              )}
            </div>

            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="ml-4 p-1 h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}