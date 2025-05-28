"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function CompanyEventsList({ companyEvents }: CompanyEventsProps) {
  if (companyEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
        <h3 className="text-xl font-medium mb-2">No company events yet</h3>
        <p className="text-muted-foreground">Check back later for company updates and events.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {companyEvents.map((companyEvent, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{companyEvent.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{companyEvent.companyName}</p>
                  </div>
                  <Badge className="ml-2">{companyEvent.source}</Badge>
                </div>
                <p className="text-sm line-clamp-2">{companyEvent.Description}</p>
              </div>
              <Link
                href={companyEvent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline shrink-0"
              >
                View Details <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
