import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./Cards.css";

function Cards({ title, cases, active, isRed, total, ...props }) {
	return (
		<Card
			onClick={props.onClick}
			className={`card ${active && `card--selected`} ${
				isRed && `card--red`
			}`}
		>
			<CardContent>
				<Typography classNames="card__title" color="textSecondary">
					{title}
				</Typography>
				<h2 className={`card__cases ${!isRed && "card__cases--green"}`}>
					{cases}
				</h2>
				<Typography className="card__total" color="textSecondary">
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default Cards;
