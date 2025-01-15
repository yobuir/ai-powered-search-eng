'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ results: { link: string; title: string; snippet: string }[] } | null>(null);
  const [aiInsights, setAiInsights] = useState<{ products: { link: string; name: string; price: string; importance: string; disadvantages: string; sideEffects: string }[] } | null>(null);

  useEffect(() => {
    const fetchUserLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Use OpenCage to reverse geocode
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              setLocation(data.results[0].formatted);
            } else {
              alert("Unable to fetch location details.");
            }
          } catch (error) {
            alert("Failed to get location.");
          }
        },
        (error) => {
          alert("Failed to get your location.");
        }
      );
    };

    fetchUserLocation();
  }, []); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });

      const data = await response.json();
      setResults(data);
      setAiInsights(JSON.parse(data.insights));
      console.log(data.insights)
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-center mb-6">AI-Powered Search</h1>
        <form onSubmit={handleSearch} className="flex  justify-center gap-1">
          <input
            type="text"
            placeholder="Search for products or services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-3 px-6 lg:min-w-[60%] border rounded-full"
            required
          />
          <input
            type="text" 
            hidden
            placeholder="Fetching location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 rounded-full border "
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </form>
        <small>Search results for <strong>{query}</strong> in location : {location}</small>
      </div>
      <div>
        {results && (
          <div className="mt-8 flex gap-5">
            <div>
              <h2 className="text-xl font-semibold">Results:</h2>
              <ul className="mt-4">
                {results?.results?.map((result, i) => (
                  <li key={i} className="border-b py-4">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {result.title}
                    </a>
                    <p>{result.snippet}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mt-8">AI Insights:</h2>
              <ul className="mt-4 gap-4 grid grid-col-2">
                {aiInsights?.products?.map((product, i) => (
                  <li key={i} className="border-b py-4 px-4 rounded-lg shadow-md bg-white ">
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {product.name}
                    </a>
                    <p><strong>Price: </strong>{product.price}</p>
                    <p><strong>Importance: </strong>{product.importance}</p>
                    <p><strong>Dis.Adv: </strong> {product.disadvantages}</p>
                    <p><strong>Side Effect: </strong> {product.sideEffects}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
