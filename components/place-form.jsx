"use client";
import { useState } from "react";

export default function PlaceForm({ onFetchBusinesses, setScrapedData }) {
  const [locationInput, setLocationInput] = useState("San Francisco, CA"); // Default input
  const [location, setLocation] = useState("37.7749,-122.4194"); // Default to San Francisco coordinates
  const [radius, setRadius] = useState(5000); // 5 km
  const [type, setType] = useState("store");
  const [keyword, setKeyword] = useState("new");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertToLatLng = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch geocode data");
      }

      const data = await response.json();
      console.log(data);
      if (data.results.length === 0) {
        throw new Error("No results found for the specified location");
      }

      const { lat, lng } = data.results[0].geometry.location;
      return `${lat},${lng}`;
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const latLng = await convertToLatLng(locationInput);
      setLocation(latLng);
      onFetchBusinesses(latLng, radius, type, keyword);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form Fields for location, radius, type, and keyword */}
      <div className="mb-4">
        <label className="block mb-1">Location (City, State):</label>
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Radius (meters):</label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Type:</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Keyword:</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Businesses"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
