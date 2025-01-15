'use client';
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

dotenv.config();
export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("kigali, Rwanda");
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

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=028813121bef4d9b8c586c2dde7a2468`
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
        <small>Search results for <strong>{query}</strong> </small>
      </div>
      <div className="flex flex-col justify-center items-center">
        {results && (

          <>  
            {aiInsights?.products?.length && aiInsights.products.length > 0 ?(
            <>
                <span className="mt-4"> Sorted product by price</span>
           
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full max-w-[60%]"
                >
                  <CarouselContent>

                    {aiInsights?.products?.map((product, index) => (
                      <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/3">
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square flex-col items-start justify-center p-6">
                              <span className="text-xs"> {product.name}</span>

                              <span className="text-sm font-semibold mt-3">
                                Price: {product.price}
                              </span>
                            </CardContent>

                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
            </>
            ):(
              <div className="text-red-500">
                AI feature key not found
              </div>
            )}

            <div className="mt-8 flex lg:flex-row flex-col gap-5">
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
              <div className="lg:order-last order-first">
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
                      <p><strong>Dis.Advantage: </strong> {product.disadvantages}</p>
                      <p><strong>Side Effect: </strong> {product.sideEffects}</p>
                      <a href={product.link} target="__blank"><strong>Side Effect: </strong> {product.link}</a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </>

        )}
      </div>
    </div>
  );
}
