"use client"

import { useState } from "react"
import ColorfulDetailedEvents from "./colorful-detailed-cards"

// Sample data with various sources to show color variations
const sampleEvents = [
  {
    title: "Q3 Earnings Call",
    companyName: "Acme Corporation",
    Description:
      "Join us for our Q3 earnings call where we'll discuss financial results and future outlook. Our CEO and CFO will present the latest financial data and answer questions from investors and analysts.",
    url: "https://example.com/earnings",
    source: "Investor Relations",
  },
  {
    title: "Product Launch: Nova Series",
    companyName: "TechGiant Inc",
    Description:
      "Exclusive unveiling of our revolutionary Nova Series products with live demonstrations and Q&A. Be the first to see our groundbreaking technology that will change the industry.",
    url: "https://example.com/launch",
    source: "Press Release",
  },
  {
    title: "Industry Conference Presentation",
    companyName: "Future Innovations",
    Description:
      "Our CEO will be presenting our sustainability initiatives at the annual Global Tech Conference. Learn about our commitment to reducing carbon footprint and creating sustainable technology.",
    url: "https://example.com/conference",
    source: "Company Blog",
  },
  {
    title: "Advanced AI Implementation Webinar",
    companyName: "DataSmart Solutions",
    Description:
      "Join our technical team for an in-depth webinar on implementing AI solutions in enterprise environments. We'll cover practical examples and best practices.",
    url: "https://example.com/webinar",
    source: "Webinar",
  },
  {
    title: "Annual Developer Conference",
    companyName: "CodeCraft Technologies",
    Description:
      "Our annual developer conference brings together the brightest minds in software development. Network with peers and learn about cutting-edge technologies.",
    url: "https://example.com/devcon",
    source: "Conference",
  },
]

export default function ColorfulEventDisplayDemo() {
  const [events] = useState(sampleEvents)

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
        Colorful Company Events
      </h1>
      <p className="text-muted-foreground mb-8">Color-coded by event source for better visual organization</p>

      <div className="mb-10">
        <ColorfulDetailedEvents companyEvents={events} />
      </div>

      <div className="mt-8 p-6 rounded-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <h3 className="text-xl font-medium mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Empty State Demo
        </h3>
        <ColorfulDetailedEvents companyEvents={[]} />
      </div>
    </div>
  )
}
