"use client"

import { Calendar, ExternalLink, Building, Tag } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CompanyEvent {
  title: string
  companyName: string
  Description: string
  url: string
  source: string
}

interface CompanyEventsProps {
  companyEvents: CompanyEvent[]
}

// Color mapping for different sources
const getSourceColor = (source: string) => {
  const sourceMap: Record<string, { bg: string; text: string; accent: string }> = {
    "Investor Relations": {
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      accent: "border-l-emerald-500",
    },
    "Press Release": {
      bg: "bg-blue-100 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-400",
      accent: "border-l-blue-500",
    },
    "Company Blog": {
      bg: "bg-purple-100 dark:bg-purple-950/40",
      text: "text-purple-700 dark:text-purple-400",
      accent: "border-l-purple-500",
    },
    Webinar: {
      bg: "bg-amber-100 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      accent: "border-l-amber-500",
    },
    Conference: {
      bg: "bg-pink-100 dark:bg-pink-950/40",
      text: "text-pink-700 dark:text-pink-400",
      accent: "border-l-pink-500",
    },
  }

  // Default color if source doesn't match
  return (
    sourceMap[source] || {
      bg: "bg-sky-100 dark:bg-sky-950/40",
      text: "text-sky-700 dark:text-sky-400",
      accent: "border-l-sky-500",
    }
  )
}

export default function ColorfulDetailedEvents({ companyEvents }: CompanyEventsProps) {
  if (companyEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          No events to display
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          When company events become available, they will be displayed here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {companyEvents.map((companyEvent, index) => {
        const sourceColor = getSourceColor(companyEvent.source)

        return (
          <Card
            key={index}
            className={cn("overflow-hidden border-l-4 transition-all hover:shadow-lg", sourceColor.accent)}
          >
            <CardHeader className={cn("pb-4", sourceColor.bg)}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold leading-tight">{companyEvent.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Building className="mr-1 h-4 w-4" />
                    <span>{companyEvent.companyName}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full flex items-center",
                    sourceColor.bg,
                    sourceColor.text,
                  )}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {companyEvent.source}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{companyEvent.Description}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t py-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <div className="text-sm text-muted-foreground">Source: {companyEvent.source}</div>
              <Button
                asChild
                className={cn("transition-all", sourceColor.bg, sourceColor.text, "border-none hover:opacity-90")}
              >
                <Link href={companyEvent.url} target="_blank" rel="noopener noreferrer">
                  Visit Event <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
