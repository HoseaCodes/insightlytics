"use client";

import { useState } from "react";
import PlaceForm from "@/components/place-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Page() {
  const [placesData, setPlacesData] = useState([]);
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchBusinesses = async (location, radius, type, keyword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/businesses?location=${location}&radius=${radius}&type=${type}&keyword=${keyword}`);
      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }
      const data = await response.json();
      console.log(data);
      setPlacesData(data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      setError("Failed to fetch businesses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Newly Registered Businesses</h1>
      <PlaceForm onFetchBusinesses={handleFetchBusinesses} setScrapedData={setScrapedData} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mt-6">From Google Places API:</h2>
          {placesData.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vicinity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placesData.map((business, index) => (
                  <TableRow key={index}>
                    <TableCell>{business.name}</TableCell>
                    <TableCell>{business.vicinity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No businesses found from Google Places API.</p>
          )}

          <h2 className="text-xl font-semibold mt-4">Scraped Businesses:</h2>
          {scrapedData.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrapedData.map((business, index) => (
                  <TableRow key={index}>
                    <TableCell>{business.name}</TableCell>
                    <TableCell>{business.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No scraped businesses found.</p>
          )}
        </>
      )}
    </div>
  );
}
