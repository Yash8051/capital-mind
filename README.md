# CapitalMind AI — AI Investment Research Agent

An AI-powered investment research tool that analyzes any public company and delivers an investment verdict. Built with **Next.js**, **LangGraph.js**, and **Google Gemini**.

Enter a company name → the AI agent searches the web, analyzes the results, and returns a structured **Invest / Pass / Watch** recommendation with confidence level, reasoning, strengths, and risks.

---

## How to Run It

### Prerequisites

- **Node.js 18+** and **npm**
- A **Google Gemini API key** ([get one here](https://aistudio.google.com/apikey))
- A **Tavily API key** ([get one here](https://tavily.com))

### Setup

```bash
# 1. Clone the repo (or download)
git clone <your-repo-url>
cd capitalmind-ai

# 2. Install dependencies
npm install

# 3. Create your .env.local from the template
cp .env.local.example .env.local

# 4. Add your API keys to .env.local
#    GOOGLE_API_KEY=your_gemini_key_here
#    TAVILY_API_KEY=your_tavily_key_here

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

### Architecture

The app is a full-stack Next.js application with:

- **Frontend**: A single React page (`app/page.tsx`) with a search input and results display
- **Backend**: A Next.js API route (`app/api/research/route.ts`) that runs the LangGraph agent
- **AI Pipeline**: A 3-node LangGraph graph that processes the request through sequential stages

### Graph Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Input                           │
│              (company name string)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Node 1: gatherData                                     │
│  ─ Calls Tavily search API                              │
│  ─ Query: "{company} financials news risks              │
│    competitors 2026"                                    │
│  ─ Returns: searchResults[]                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Node 2: analyze                                        │
│  ─ Sends search results to Gemini                       │
│  ─ Prompt: structured 5-section analysis                │
│    (business model, financials, competition,            │
│     risks, news sentiment)                              │
│  ─ Returns: analysis (plain text)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Node 3: decide                                         │
│  ─ Sends analysis to Gemini                             │
│  ─ Prompt: produce JSON verdict                         │
│  ─ Returns: { decision, confidence, reasoning,          │
│              keyRisks[], keyStrengths[] }                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  API Response                           │
│        Full state returned as JSON to frontend          │
└─────────────────────────────────────────────────────────┘
```

### Shared State

```typescript
{
  companyName: string           // Input: the company to research
  searchResults: SearchResult[] // From gatherData: web search hits
  analysis: string              // From analyze: structured text analysis
  decision: string              // From decide: "Invest" | "Pass" | "Watch"
  confidence: string            // From decide: "High" | "Medium" | "Low"
  reasoning: string             // From decide: explanation paragraph
  keyRisks: string[]            // From decide: risk bullet points
  keyStrengths: string[]        // From decide: strength bullet points
}
```

### File Structure

```
src/
├── app/
│   ├── api/research/route.ts   ← POST endpoint, runs the graph
│   ├── globals.css              ← Tailwind base styles
│   ├── layout.tsx               ← Root layout with Inter font
│   └── page.tsx                 ← Single-page UI (client component)
└── lib/
    ├── llm.ts                   ← Gemini client singleton
    └── agent/
        ├── state.ts             ← LangGraph Annotation state schema
        ├── graph.ts             ← Wires nodes into StateGraph
        ├── nodes/
        │   ├── gatherData.ts    ← Node 1: Tavily web search
        │   ├── analyze.ts       ← Node 2: Gemini analysis
        │   └── decide.ts        ← Node 3: Gemini verdict
        └── tools/
            └── tavilySearch.ts  ← Tavily REST API wrapper
```

---

## Key Decisions & Trade-offs

<!-- 
TODO: Write this section yourself in your own words.
Some angles to consider:
- Why gemini-2.0-flash over gemini-1.5-pro?
- Why Tavily over scraping or other search APIs?
- Why a linear 3-node graph vs. parallel agents?
- Why JSON response vs. SSE streaming?
- Why a single-page UI vs. multi-page?
- Trade-offs in prompt engineering approach
-->

---

## Example Runs

<!--
TODO: Run 2-3 test companies and paste the actual outputs here.
Example format:

### Apple (AAPL)
- **Decision**: Invest
- **Confidence**: High
- **Reasoning**: ...
- **Key Strengths**: ...
- **Key Risks**: ...
-->

---

## What I'd Improve With More Time

<!--
TODO: Write this section yourself.
Some ideas:
- Add SSE streaming for real-time progress updates
- Add financial data APIs (Alpha Vantage, Finnhub) for real numbers
- Add caching to avoid redundant searches
- Add authentication and rate limiting
- Parallel search queries for richer data
- Persistent storage for past analyses
- PDF export of the analysis
- Better error recovery and retry logic
- More sophisticated prompt engineering
- Unit tests and integration tests
-->
