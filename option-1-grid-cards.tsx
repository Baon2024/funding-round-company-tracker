"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function CompanyEventsGrid({ companyEvents }: CompanyEventsProps) {
  if (companyEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
        <h3 className="text-xl font-medium mb-2">No company events yet</h3>
        <p className="text-muted-foreground">Company events will appear here once they become available.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companyEvents.map((companyEvent, index) => (
        <Card key={index} className="h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{companyEvent.title}</CardTitle>
              <Badge variant="outline">{companyEvent.source}</Badge>
            </div>
            <CardDescription className="font-medium">{companyEvent.companyName}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-4">{companyEvent.Description}</p>
          </CardContent>
          <CardFooter>
            <Link
              href={companyEvent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Learn More <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
