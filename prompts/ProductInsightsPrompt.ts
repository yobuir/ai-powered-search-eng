export const productInsightsPrompt = {
  model: "gpt-4o-2024-08-06",
  temperature: 0.7,
  systemPrompt: "You are an assistant that provides insights on products and services.",
  userPrompt: (products: any[], query: string, location: string) =>
    `Analyze the following products and sort the products based on price and user preferences. Provide insights based on ${query} in ${location} and return the results in JSON format:
    - "importance": Why is this product useful?
    - "disadvantages": What are the drawbacks or limitations?
    - "sideEffects": Are there any risks or side effects?
    - "Price": What is the price?

    Only include results that are products or services related to the query.

    Product List:
    ${products
      .filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.snippet.toLowerCase().includes(query.toLowerCase()))
      .map((p, i) => `${i + 1}. ${p.title}: ${p.snippet}, ${p.link}`)
      .join("\n")}
    `,
  responseFormat: {
    type: "json_schema",
    json_schema: {
      name: "productInsightsResponse",
      strict: true,
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            productTitle: {
              type: "string",
              description: "The product name.",
            },
            importance: {
              type: "string",
              description: "Why this product is useful.",
            },
            disadvantages: {
              type: "string",
              description: "Drawbacks or limitations.",
            },
            sideEffects: {
              type: "string",
              description: "Risks or side effects.",
            },
            price: {
              type: "string",
              description: "The price of the product.",
            },
          },
          required: ["productTitle", "importance", "disadvantages", "sideEffects", "price"],
        },
      },
    },
  },
};