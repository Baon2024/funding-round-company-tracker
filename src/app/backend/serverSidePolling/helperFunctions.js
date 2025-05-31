





const getTimestampOneHourAgo = (pollingFrequency) => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - pollingFrequency * 60 * 1000);
    return oneHourAgo.toISOString(); // News API expects ISO 8601
  };

  const getFixedTimestamp = () => {
    return new Date('2025-05-27T00:00:00Z').toISOString();
  };
  
  

const fetchRecentFundingNews = async (companyName, pollingFrequency) => {
    const from = /*getTimestampOneHourAgo(pollingFrequency)*/ getFixedTimestamp() ; //replace with getTimestampOneHourAgo()
    const apiKey = '4828a727596840cebc75e9f7f3ae239f';
    const query = companyName;
  
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${from}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
  
    const res = await fetch(url);
    const data = await res.json();

    console.log("data is: ", data)
  
    console.log(data.articles);
    return data.articles;
  };

  function parseLLMOutput(llmString) {
    // Remove ```json and ``` fences with optional whitespace
    const jsonStr = llmString
      .replace(/^```json\s*/, '')  // Remove starting ```json with possible spaces/newlines
      .replace(/\s*```$/, '');     // Remove ending ```
    
    // Now parse the JSON string
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON from LLM output:", e);
      return null;
    }
  }

  async function insertToSupabase(articlesFlat, supabase) {

    const { data, error } = await supabase
    .from('companyEvents')
    .insert(articlesFlat)
    .select() 
  
    if (error) {
      console.error("Error inserting data:", error);
      return error;
    } else {
      console.log("Data after insertion to Supabase:", data);
      return data;
    }

    
  }


  module.exports = { fetchRecentFundingNews, parseLLMOutput, insertToSupabase };


  