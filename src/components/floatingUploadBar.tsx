"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { X, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"



export function FloatingUploadBar({ handleCSVFile}) {
  



  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-[3px] bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-indigo-500">
      <div className="bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-gray-600" />
                <label htmlFor="csv-upload" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Upload Company CSV file
                </label>
              </div>

              <div className="relative">
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={(e) => handleCSVFile(e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}