import React, { useEffect, useState } from "react";
import "./App.css";
import Cards from "./components/Cards/Cards.jsx";
import Map from "./components/Map/Map.jsx";
import Table from "./components/Table/Table.jsx";
import Chart from "./components/Chart/Chart.jsx";
import { sortData, prettyPrintStat } from "./utils.js";
import "leaflet/dist/leaflet.css";

import {
	Card,
	FormControl,
	Select,
	MenuItem,
	CardContent,
} from "@material-ui/core";

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("Global");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({
		lat: 34.80746,
		lng: -40.4796,
	});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getCountriesApi = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					const sortedData = sortData(data);
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};
		getCountriesApi();
	}, []);

	const handleDrop = async (e) => {
		const countryIso = e.target.value;

		const url =
			countryIso === "Global"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryIso}`;
		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryIso);
				setCountryInfo(data);
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(3);
			});
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>Covid-19</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							onChange={handleDrop}
							value={country}
						>
							<MenuItem value="Global">Global</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__cards">
					<Cards
						isRed
						active={casesType === "cases"}
						onClick={(e) => setCasesType("cases")}
						title="Corona virus Cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
					/>
					<Cards
						active={casesType === "recovered"}
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
					/>
					<Cards
						isRed
						active={casesType === "deaths"}
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
					/>
				</div>
				<div className="app__map">
					<Map
						casesType={casesType}
						countries={mapCountries}
						center={mapCenter}
						zoom={mapZoom}
					/>
				</div>
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live cases by Country</h3>
					<Table countries={tableData} />
					<h3 className="app__chartTitle">Global new {casesType}</h3>
					<Chart className="app__chart" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
