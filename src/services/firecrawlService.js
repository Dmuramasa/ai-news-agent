const Firecrawl = require('@mendable/firecrawl-js');
const FirecrawlApp = Firecrawl.FirecrawlApp || Firecrawl.default || Firecrawl;
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_KEY });

exports.scrapeUrl = async (url) => {
  try {
    const result = await firecrawl.scrape(url, { formats: ['markdown'] });
    
    // If success is missing but markdown exists, it's actually a win!
    if (!result.success && !result.markdown) {
      console.error("Full Firecrawl Debug:", JSON.stringify(result, null, 2));
      throw new Error(result.error || "Unknown Firecrawl Error");
    }

    // Google News markdown is sometimes directly on the result object
    let content = result.markdown || result.data?.markdown || "";
    
    // Clean and Trim
    content = content.replace(/\n\s*\n/g, '\n').trim();
    const LIMIT = 10000;
    if (content.length > LIMIT) {
      const lastSpace = content.lastIndexOf(' ', LIMIT);
      content = content.substring(0, lastSpace > 0 ? lastSpace : LIMIT) + "... [Truncated]";
    }

    return content;
  } catch (error) {
    throw new Error(`Scraper Connection Failed: ${error.message}`);
  }
};