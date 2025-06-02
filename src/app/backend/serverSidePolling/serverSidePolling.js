//need to make server do polling on a set scheduale
let { fetchRecentFundingNews, parseLLMOutput, insertToSupabase } = require("./helperFunctions");
const { CohereClient } = require('cohere-ai');
const { Resend } = require("resend");
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

//NEXT_PUBLIC_SUPABASE_URL=https://xmcyvimeuarsivupecuv.supabase.co
//NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtY3l2aW1ldWFyc2l2dXBlY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MzY2OTcsImV4cCI6MjA1MjExMjY5N30.0fsBw3u56U2Fv3yD4gtyhqJ31U-QHGr-EyJcXCRml_8

console.log("value of RESEND_API_KEY is: ", process.env.RESEND_API_KEY);
console.log("value of RESEND_API_KEY is: ", process.env.COHERE_CLIENT_API_TOKEN);
console.log("value of NEXT_PUBLIC_SUPABASE_ANON_KEY is: ", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log("value of NEXT_PUBLIC_SUPABASE_URL is: ", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("value of RESEND_ACCOUNT_EMAIL: ", process.env.RESEND_ACCOUNT_EMAIL);
console.log("value of NEWS_API_KEY: ", process.env.NEWS_API_KEY);


const resend = new Resend(process.env.RESEND_API_KEY);

const cohere = new CohereClient({
    token: process.env.COHERE_CLIENT_API_TOKEN,
  });

//might not need to be a server? could just have code that runs every x period of time
//and gets company names from supabase

const sampleCompaniesList = [
    "Tesla",
    "Berkshire Hathaway",
    "Revolut"
]

//replace this with selecting companies from supabase table



async function serverSidePolling() {

    const companies = []
    //first, need to retrieve companies from supabase
    //but can test by using hard-coded list of companies
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
    
      const { data, error } = await supabase
      .from('companyWatchlist')
      .select('*')  // use specific columns like 'title, description' if needed
    
    if (error) {
      console.error('Error fetching data:', error)
    } else {
      console.log('Fetched entries:', data)
    }

    data.map(company => companies.push(company.companyName))

    console.log("value of companies is now:", companies);

    //return;
    
    let newArticles = {};
    //function to query News Api for each company
    for (const company of companies) {
        const companyName = company;
        console.log("value of companyName inside of company iteration is:", companyName);
        const results = await fetchRecentFundingNews(company, process.env.POLLING_FREQUENCY, process.env.NEWS_API_KEY);
        //console.log("results looks like:", results);

        if (results) {

        const editedResults = results.map(article => ({
          title: article.title,
          source: article.source.name,
          description: article.description,
          url: article.url  
        }))
        //console.log("editedResults are:", editedResults);
        //const articles = result.articles //or whatever the response data is
        //if result has any articles
        //or 
        newArticles[companyName] = editedResults;
       }
    }
    console.log("value of newArticles is now:", newArticles);
    //it looks like [Object][Object]., but that's just how Node renders complex nested objects
    

    const fundingEventCompanyArticles = {};


    for (const [company, articles] of Object.entries(newArticles)) {
        console.log(`Checking articles for: ${company}`);

        // Step 1: Pre-filter using simple keyword matching
        const fundingKeywords = ["raised", "funding", "series A", "series B", "seed", "venture capital", "round", "invested"];
        

        const candidateArticles = articles.filter(article => {
          const title = article.title?.toLowerCase() || "";
          const description = article.description?.toLowerCase() || "";
          const lowerCompany = company.toLowerCase();
  
          const mentionsFunding = fundingKeywords.some(keyword =>
              title.includes(keyword) || description.includes(keyword)
          );
  
          const mentionsCompanyInTitle = title.includes(lowerCompany);
  
          return mentionsFunding && mentionsCompanyInTitle;
        });

        console.log(`Pre-filtered ${candidateArticles.length} potential funding articles for ${company}`);
        console.log("candidateArticles are:", candidateArticles);

    //call to LLM to check that the articles are about funding



    if (candidateArticles.length > 0) {

    //const prompt = `You need to check whether these articles about ${company} are about a funding round: ${candidateArticles}. If an article is, return it in the same format as part of an array: with title, source, description and url. DO NOT RETURN DATA OUTSIDE OF THE DATA YOU ARE GIVEN. DO NOT USE ANY DATA IN YOUR TRAINING SET.  Only output JSON, no comments`
    
    const prompt = `
You are given an array of news articles about the company ${company}. 

For each article, determine whether it is explicitly about a funding round. 
A funding round means the company **announced receiving money from investors**, such as a Series A, B, C, seed funding, venture capital, or strategic investment.

IMPORTANT - Ignore general business news, partnerships, earnings calls, or product announcements — these do not count as funding rounds.

Respond with an array of true/false values in the same order as the articles.
ONLY return the JSON array. No comments, no article info, no explanations.

${candidateArticles}`

    const response1 = await cohere.chat({
        model: 'command-r',
        message: prompt,
        chatHistory: [
          {
            role: 'SYSTEM',
            message:
              "Answer the user's query. Never generate fictional articles. Annotate original input only",
          },
        ],
        temperature: 0.1,
        maxTokens: 512,
      });

      console.log("value of checking whether any articles are about funding is:", response1);

      const classifications = JSON.parse(response1.text);
      console.log("classificatiosn are:", classifications)

      const articlesToAdd = []

      
for (let i = 0; i < candidateArticles.length; i++) {
    if (classifications[i] === true) {
      articlesToAdd.push(candidateArticles[i]);
    }
  }

    
     console.log("value fo articlesToAdd:", articlesToAdd);
    fundingEventCompanyArticles[company] = articlesToAdd
    }
    }
    console.log("value of fundingEventCompanyArticles after llm calls are:", fundingEventCompanyArticles);

    //return;

    /*const parsedArticlesByCompany = {};
for (const [company, rawString] of Object.entries(fundingEventCompanyArticles)) {
  // extract JSON from the string
  const parsed = parseLLMOutput(rawString);
  parsedArticlesByCompany[company] = parsed;
}

    console.log("cleaned-up and parsed funding articles:", parsedArticlesByCompany);*/
    
    const hasCompanies = Object.keys(fundingEventCompanyArticles).length > 0;
console.log('has companies:', hasCompanies);

    if (hasCompanies) {

      await new Promise(resolve => setTimeout(resolve, 60000));

      const entriesWithArticles = Object.entries(fundingEventCompanyArticles).filter(
        ([_, articles]) => articles.length > 0
      );
      
      const articlesForHTML = await Promise.all(
        entriesWithArticles.map(async ([company, articles]) => {
          await new Promise(resolve => setTimeout(resolve, 10000));
      
          const prompt = `Construct an outreach blurb for the company ${company}. You are Mirror Ai... ${articles}`;
      
          const response1 = await cohere.chat({
            model: 'command-r',
            message: prompt,
            chatHistory: [
              {
                role: 'SYSTEM',
                message:
                  "Generate an outrearch blurb, as the company Mirror: Ai for revenue retention",
              },
            ],
            temperature: 0.1,
            maxTokens: 512,
          });
      
          const blurb = response1.text;
          console.log("blurb is", blurb);
      
          return {
            company,
            articles,
            outreachBlurb: blurb
          };
        })
      );

        console.log("value of articlesForHtml after new code is:", articlesForHTML);


        const companiesHTML = articlesForHTML.map(({ company, articles, outreachBlurb }) => {



            // Map each article to HTML
            const articlesHTML = articles.map(({ title, source, description, url }) =>  
              `
              <li style="margin-bottom: 15px;">
                <a href="${url}" style="font-weight: bold; color: #1a0dab; text-decoration: none;" target="_blank" rel="noopener noreferrer">${title}</a><br />
                <small style="color: #555;">Source: ${source}</small><br />
                <p style="margin-top: 5px;">${description}</p>
              </li>
            `).join('');
          
            return `
              <section style="margin-bottom: 30px;">
                <h2 style="color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px;">${company}</h2>
                <ul style="list-style-type: disc; padding-left: 20px;">
                  ${articlesHTML}
                </ul>
                 <h3>Outreach Blurb</h3>
                <p>${outreachBlurb}</p>
              </section>
            `;
          }).join('');


        const emailHtml = `
        <html>
          <body>
            <h1>Company Funding Update!</h1>
            <p>Hey CSM, here are the latest funding rounds articles:</p>
            <div>${companiesHTML}</div>
          </body>
        </html>
      `;
    
    
        // Send the email using Resend API
        const response = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>", //this email can be changed, but lets you get free api usage
          to: process.env.RESEND_ACCOUNT_EMAIL, //make this dynamic? at leadt dependent on a env
          subject: "Fundings News Updates",
          html: emailHtml,
        });
        console.log("email response is:", response);

    //okay, now need to add each article to funding events table
    const articlesToInsert = Object.entries(fundingEventCompanyArticles).map(([company, articles]) => {
      return articles.map(article => [article, company])
    })

    console.log("value of articlesToInsert is:", articlesToInsert);

    //now use company name in each array to retrieve correct foreign key from companies ids?
    const articlesForInsertion = articlesToInsert.map((articleGroup) => {
        return articleGroup.map(([articleObj, artCompany]) => {
        const matchedCompany = data.find((company) => company.companyName === artCompany) 
        console.log("matchedCompany is:", matchedCompany);
        const companyId = matchedCompany.id;
        
        return [articleObj, artCompany, companyId];
        
        })
    })

    console.log("value of articlestoInsert after mapping data to get ids:", articlesForInsertion);

    //Now insert new events into companyEvents table

    const articlesFlat = articlesForInsertion.flatMap(articleGroup =>
  articleGroup.map(([article, companyName, companyId]) => ({
    title: article.title,
    source: article.source,
    Description: article.description,
    url: article.url,
    CompanyName: companyName,
    company_id: companyId // This matches your FK in Supabase
  }))
);

console.log("articlesFlat before insertion:", articlesFlat);

    //thne insert to table
    const result = await insertToSupabase(articlesFlat, supabase)
    console.log("result from insertToSupabase is:", result);
   


    }

    //and then email each to my email with resend - company name, event type, and a ready-to-copy outreach blurb
    //and add each to supabase events table, retrieving companies table to get correct foreign keys

    //remember to clean newArticles array at end, so its empty

}

console.log("POLLING_FREQUENCY is: ", process.env.POLLING_FREQUENCY);

setInterval(serverSidePolling, process.env.POLLING_FREQUENCY * 60 * 1000) //
//you to do server-side-polling at this interval
//run once on start
serverSidePolling()

module.exports = serverSidePolling;