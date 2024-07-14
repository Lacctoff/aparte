"use client";

import React, { useState } from 'react';

const TestGoogleAPI = () => {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState('');

  const fetchPlaces = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}`
    );
    const data = await response.json();
    setPlaces(data.results);
  };

  return (
    <div>
      <h1>Test Google Places API</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a place"
      />
      <button onClick={fetchPlaces}>Search</button>
      <ul>
        {places.map((place) => (
          <li key={place.place_id}>{place.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestGoogleAPI;
