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
  source: string,
}

interface CompanyEventProps {
  companyEvent: CompanyEvent[]
}

// Color mapping for different sources (for the buttons and tags)
const getSourceColor = (source: string) => {
  const sourceMap: Record<string, { bg: string; text: string }> = {
    "Investor Relations": {
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    "Press Release": {
      bg: "bg-blue-100 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-400",
    },
    "Company Blog": {
      bg: "bg-purple-100 dark:bg-purple-950/40",
      text: "text-purple-700 dark:text-purple-400",
    },
    Webinar: {
      bg: "bg-amber-100 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
    },
    Conference: {
      bg: "bg-pink-100 dark:bg-pink-950/40",
      text: "text-pink-700 dark:text-pink-400",
    },
  }

  // Default color if source doesn't match
  return (
    sourceMap[source] || {
      bg: "bg-sky-100 dark:bg-sky-950/40",
      text: "text-sky-700 dark:text-sky-400",
    }
  )
}

export default function RainbowBorderCards({ companyEvent }: CompanyEventProps) {
  
  const sourceColor = getSourceColor(companyEvent.source)
  return (
    <div className="space-y-8">
          <div
            className="relative p-[3px] rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 to-yellow-500 to-green-500 to-blue-500 animate-gradient-x"
          >
            <Card className="rounded-[6px] overflow-hidden h-full">
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
          </div>
    </div>
  )
}
