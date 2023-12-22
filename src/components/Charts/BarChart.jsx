import React from "react";
import {Bar} from "react-chartjs-2";
import {Chart as Chart} from "chart.js/auto";

export default function BarChart({chartData}) {
    return <Bar data={chartData}/>;
}

