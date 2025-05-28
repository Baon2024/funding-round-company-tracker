'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import RainbowBorderCards from "../../rainbow-border-cards";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {


  const [ data, setData ] = useState([])
  const [ companyNames, setCompanyNames ] = useState([])
  const [ companyEvents, setCompanyEvents ] = useState([])

  

  



console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)




  async function handleCSVFile(e) {
    const data = e.target.files[0]
    setData(data);

    const formData = new FormData();
    formData.append('file', data);

    const response = await fetch('http://localhost:5000/extractCompanyNames', {
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
    for (const company of companyNames) {
      console.log("company inside of companyNames iteration is:", company)
      console.log("supabase client:", supabase);


      const { data, error } = await supabase
  .from('companyWatchlist')
  .insert([
    { companyName: company},
  ])
  .select()

    console.log("data after company insertion is:", data);
    alert(`${company} successfully added to watchlist!`)
    }
  

  }




  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        { companyEvents.length > 0 ? (
          <div>
                <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
        Most recent company funding events
      </h1>
      <p className="text-muted-foreground mb-8">Events with animated rainbow borders for maximum visual impact</p>
      </div>
            { companyEvents.map((companyEvent) => {
              return (
                <div className="mb-10">
                <RainbowBorderCards companyEvent={companyEvent} />
              </div>
            )})}
          </div>
        ) : (
          <p>no company events yet..</p>
        )}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div>
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
          
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <label>Upload Company CSV file</label>
        <input type="file" accept=".csv,.xls, xlsx" onChange={(e) => handleCSVFile(e)} />
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
