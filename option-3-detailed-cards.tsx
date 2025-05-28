"use client"

import { Calendar, ExternalLink, Building } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export default function DetailedCompanyEvents({ companyEvents }: CompanyEventsProps) {
  if (companyEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-lg">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No events to display</h3>
        <p className="text-muted-foreground text-center max-w-md">
          When company events become available, they will be displayed here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {companyEvents.map((companyEvent, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold leading-tight">{companyEvent.title}</h3>
                <div className="flex items-center text-muted-foreground">
                  <Building className="mr-1 h-4 w-4" />
                  <span>{companyEvent.companyName}</span>
                </div>
              </div>
              <div className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {companyEvent.source}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{companyEvent.Description}</p>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/10 py-4">
            <div className="text-sm text-muted-foreground">Source: {companyEvent.source}</div>
            <Button asChild variant="outline" size="sm">
              <Link href={companyEvent.url} target="_blank" rel="noopener noreferrer">
                Visit Event <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
