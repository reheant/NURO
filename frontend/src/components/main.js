import getData from './data';
import * as agCharts from "ag-charts-community";
const dateFormatter = new Intl.DateTimeFormat("en-US");
const tooltip = {
  renderer: ({ title, datum, xKey, yKey }) => ({
    title,
    content: `${dateFormatter.format(datum[xKey])}: ${datum[yKey]}`,
  }),
};

const options = {
  container: document.getElementById("myChart"),
  data: getData(),
  title: {
    text: "Road Fuel Prices",
  },
  footnote: {
    text: "Source: Department for Business, Energy & Industrial Strategy",
  },
  series: [
    {
      type: "line",
      xKey: "date",
      yKey: "petrol",
      tooltip,
    },
    {
      type: "line",
      xKey: "date",
      yKey: "diesel",
      tooltip,
    },
  ],
  axes: [
    {
      position: "bottom",
      type: "time",
      title: {
        text: "Date",
      },
      label: {
        format: "%b",
      },
    },
    {
      position: "left",
      type: "number",
      title: {
        text: "Price in Pence",
      },
    },
  ],
};

agCharts.AgCharts.create(options);