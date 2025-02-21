import React, { useState, useEffect } from "react";
import "./CountrySearch.css"; // Import CSS file

const CountrySearch = () => {
    const [countries, setCountries] = useState([]); // Stores all countries
    const [filteredCountries, setFilteredCountries] = useState([]); // Stores search results
    const [searchTerm, setSearchTerm] = useState(""); // User input

    const API_URL = "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";

    // Fetch countries on initial render
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error("Failed to fetch countries");
                }
                const data = await response.json();
                console.log("API Response:", data); // ✅ Debug API response

                // ✅ Ensure correct field names (`common` for country name, `png` for flag)
                const formattedData = data.map((country, index) => ({
                    name: country.common || "Unknown", // ✅ Ensure country name exists
                    flag: country.png || "https://via.placeholder.com/120x80", // ✅ Fallback image if flag is missing
                    id: index, // ✅ Use index as key if there's no unique ID
                }));

                setCountries(formattedData);
                setFilteredCountries(formattedData); // ✅ Show all countries initially
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    // ✅ Filter countries dynamically
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredCountries(countries); // ✅ Show all countries if search is empty
        } else {
            setFilteredCountries(
                countries.filter((country) =>
                    country.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, countries]);

    return (
        <div className="container">
            <h2>Country Search</h2>
            <input
                type="text"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="countryGrid">
                {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                        <div key={country.id} className="countryCard">
                            <img
                                src={country.flag}
                                alt={`${country.name} flag`}
                                onError={(e) => (e.target.src = "https://via.placeholder.com/120x80")} // ✅ Replace broken images
                            />
                            <p>{country.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No matching countries found.</p>
                )}
            </div>
        </div>
    );
};

export default CountrySearch;
