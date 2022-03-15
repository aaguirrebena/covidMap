import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const buildChart = (data, casesType = "cases") => {
	let chartData = [];
	let lastDataPoint;
	// data[casesType].forEach((date) => {
	for (let date in data.cases) {
		if (lastDataPoint) {
			let newDataPoint = {
				x: date,
				y: data[casesType][date] - lastDataPoint,
			};
			chartData.push(newDataPoint);
		}
		lastDataPoint = data[casesType][date];
	}
	return chartData;
};

function Chart({ casesType = "cases" }) {
	const [data, setData] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			await fetch(
				"https://disease.sh/v3/covid-19/historical/all?lastdays=120"
			)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					let chartData = buildChart(data);
					setData(chartData);
				});
		};
		fetchData();
	}, [casesType]);

	return (
		<div>
			{console.log(data)}
			{data?.length > 0 && (
				<Line
					data={{
						options: {
							legend: {
								display: false,
								labels: {
									fontColor: "rgb(255, 0, 0)",
								},
							},
						},
						datasets: [
							{
								backgroundColor: "rgba(255, 0, 0, 0.5)",
								borderColor: "#CC1034",
								data: data,
							},
						],
					}}
				/>
			)}
		</div>
	);
}

export default Chart;
