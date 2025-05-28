"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CompanyEventsGrid from "./option-1-grid-cards"
import CompanyEventsList from "./option-2-list-view"
import DetailedCompanyEvents from "./option-3-detailed-cards"

// Sample data
const sampleEvents = [
  {
    title: "Q3 Earnings Call",
    companyName: "Acme Corporation",
    Description: "Join us for our Q3 earnings call where we'll discuss financial results and future outlook.",
    url: "https://example.com/earnings",
    source: "Investor Relations",
  },
  {
    title: "Product Launch: Nova Series",
    companyName: "TechGiant Inc",
    Description: "Exclusive unveiling of our revolutionary Nova Series products with live demonstrations and Q&A.",
    url: "https://example.com/launch",
    source: "Press Release",
  },
  {
    title: "Industry Conference Presentation",
    companyName: "Future Innovations",
    Description: "Our CEO will be presenting our sustainability initiatives at the annual Global Tech Conference.",
    url: "https://example.com/conference",
    source: "Company Blog",
  },
]

export default function EventDisplayDemo() {
  const [events] = useState(sampleEvents)

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Company Events Display Options</h1>

      <Tabs defaultValue="grid">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid Cards</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <h2 className="text-xl mb-4">Option 1: Grid Layout</h2>
          <CompanyEventsGrid companyEvents={events} />
        </TabsContent>

        <TabsContent value="list">
          <h2 className="text-xl mb-4">Option 2: List View</h2>
          <CompanyEventsList companyEvents={events} />
        </TabsContent>

        <TabsContent value="detailed">
          <h2 className="text-xl mb-4">Option 3: Detailed Cards</h2>
          <DetailedCompanyEvents companyEvents={events} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 border rounded-md bg-muted/20">
        <h3 className="text-lg font-medium mb-2">Empty State Demo</h3>
        <Tabs defaultValue="grid-empty">
          <TabsList className="mb-4">
            <TabsTrigger value="grid-empty">Grid</TabsTrigger>
            <TabsTrigger value="list-empty">List</TabsTrigger>
            <TabsTrigger value="detailed-empty">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="grid-empty">
            <CompanyEventsGrid companyEvents={[]} />
          </TabsContent>

          <TabsContent value="list-empty">
            <CompanyEventsList companyEvents={[]} />
          </TabsContent>

          <TabsContent value="detailed-empty">
            <DetailedCompanyEvents companyEvents={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
