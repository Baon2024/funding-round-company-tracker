'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import RainbowBorderCards from "../../rainbow-border-cards";
import { FloatingWatchlistBar } from "@/components/floating-watchlist-bar";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { FloatingUploadBar } from "@/components/floatingUploadBar";
import React from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {


  const [ data, setData ] = React.useState<File | null>(null);
  const [ companyNames, setCompanyNames ] = useState([])
  const [ companyEvents, setCompanyEvents ] = React.useState<any[]>([]);
  const { toast } = useToast()

  

  



console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const correctURl = process.env.NEXT_PUBLIC_MODE === 'live' ? 'https://funding-round-company-tracker-extract.onrender.com' : 'http://localhost:5000'


  async function handleCSVFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files

    if (!files || files.length === 0) {
      // No file selected, handle this case or just return
      return;
    }
    
    const data = files[0]
    setData(data);

    const formData = new FormData();
    formData.append('file', data);

    const response = await fetch(`${correctURl}/extractCompanyNames`, {
      method: "POST",
      body: formData
    })

    const data2 = await response.json();
    console.log("result from extractCompanyNames api call is:", data2);

    setCompanyNames(data2.companyNames)
  }

  useEffect(() => {
    console.log("value of data is:", data)
    console.log("value of companyNames is:", companyNames)
    console.log("value of companyEvents:", companyEvents)
  },[data, companyNames, companyEvents])

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Your repeated code here, e.g., fetching data, updating state

      async function fetchData() {
        const { data, error } = await supabase
  .from('companyEvents')
  .select('*')
  .order('created_at', { ascending: false })  // newest first
  .limit(10)
  
        if (error) {
          console.error('Error fetching data:', error)
          return
        }
  
        console.log('Data from table:', data)
        setCompanyEvents(data);
        // You can update state here if needed
      }
      fetchData()


    }, 10000); // interval in milliseconds
  
    // Cleanup function to clear interval when component unmounts or deps change
    return () => clearInterval(intervalId);
  }, []); // dependency array (empty = run once on mount)

  async function uploadCompaniesSupabase() {
    //for each company in companyNames
    //insert to supabase Companies table

    //delete existing companies, and existing events
    //const deleteCompanyEvents = await deleteCompanyEventsFunction()
    const { error: deleteCompanyEventsError } = await supabase
  .from('companyEvents')
  .delete()
  .not('id', 'is', null); 

  if (deleteCompanyEventsError) {
    console.log("error when deleting companyEvents:", deleteCompanyEventsError)
  }

  const { error: deleteCompaniesError } = await supabase
  .from('companyWatchlist')
  .delete()
  .not('id', 'is', null); 

  if (deleteCompaniesError) {
    console.log("error when deleting companyEvents:", deleteCompaniesError)
  }



    for (const company of companyNames) {
      console.log("company inside of companyNames iteration is:", company)
      console.log("supabase client:", supabase);


      const { data, error } = await supabase
  .from('companyWatchlist')
  .insert([
    { companyName: company},
  ])
  .select()

  console.log(`data from upload of company ${company} is: `, data)

    //console.log("data after company insertion is:", data);
    if (data) {
      toast({
        title: "Success! 🎉",
          description: `Successfully added ${company} to your watchlist.`
      })
    //alert(`${company} successfully added to watchlist!`)
    }
    }
  

  }




  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <FloatingUploadBar handleCSVFile={handleCSVFile} />
      <Toaster />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        { companyEvents.length > 0 ? (
          <div>
                <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
        Most recent company funding events
      </h1>
      <p className="text-muted-foreground mb-8">Events with animated rainbow borders for maximum visual impact</p>
      </div>
            { companyEvents.map((companyEvent, index) => {
              return (
                <div className="mb-10" key={index} >
                <RainbowBorderCards companyEvent={companyEvent} />
              </div>
            )})}
          </div>
        ) : (
          <p>no company events yet..</p>
        )}
       

        {/*<div>
          { companyNames.length > 0 ? (
            <div>
              {companyNames.map((companyName, index) =>
                <p key={index}>{companyName}</p>
              )}
              <button onClick={uploadCompaniesSupabase}>Upload companies to watchlist??</button>
            </div>
          ): (
            <p>No companies uploaded yet..</p>
          )}
          
        </div>*/}

        
        <FloatingWatchlistBar companyNames={companyNames} onUpload={uploadCompaniesSupabase} />
      

        <div className="flex gap-4 items-center flex-col sm:flex-row">
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/*<label>Upload Company CSV file</label>
        <input type="file" accept=".csv,.xls, xlsx" onChange={(e) => handleCSVFile(e)} />*/}
        
        
      </footer>
      
    </div>
  );
}
