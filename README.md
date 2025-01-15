# Next.js AI Application Boilerplate

This project is a boilerplate for creating AI-powered applications using Next.js, Shadcn/ui, OpenAI API, and modern web technologies. It provides a structured foundation for building interactive AI applications.

## 1. Tech Stack
- [TypeScript](https://www.typescriptlang.org/) for static typing
- [Next.js 14](https://nextjs.org/) for server-side rendering and routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [OpenAI API](https://platform.openai.com/docs/api-reference) for AI-powered features

- [Google search API](https://developers.google.com/custom-search/v1/overview) for search 

## 2. Project Structure

- `app/`: Contains the main application code
  - `api/openai/route.ts`: Handles OpenAI API integration, processes requests, and manages API calls to OpenAI
  - `page.tsx`: Main page component rendering the PetNameGenerator
- `components/`: Contains reusable React components
- `hooks/`: 
  - `useOpenAI.ts`: Custom hook for OpenAI API interactions
- `prompts/`: 
  - `ProductInsightsPrompt.ts`: Configuration for product results  [structured outputs](https://platform.openai.com/docs/guides/structured-outputs) should use model gpt-4o-2024-08-06 or later

## 3. Getting Started

### 3.1 Clone the repository

```bash
git clone https://github.com/yobuir/ai-powered-search-eng.git
cd ai-powered-search-eng
```

### 3.2 Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3.3 Add your OpenAI API key

#### 3.3.1 Create a `.env.local` file in the root of the project or rename `.env.example` to `.env.local`
#### 3.3.2.1 Get your OpenAI API keys [here](https://platform.openai.com/api-keys)

#### 3.3.2.2 GOOGLE_API_KEY For Custom search Api [here](https://developers.google.com/custom-search/v1/introduction)

####  3.3.2.3 Google Search engine ID [here](https://programmablesearchengine.google.com/controlpanel/all)




#### 3.3.2 Add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=google_api_key
GOOGLE_CX=get_Search_engine_ID
OPENCAGE_API_KEY=open_cage_api_key
```

### 3.3 Run the development server

#### 3.3.1 Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

#### 3.3.2 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 