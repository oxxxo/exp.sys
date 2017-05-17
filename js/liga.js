var gameStats = [
  {
    value: 300,
    color:"#F7464A",
    highlight: "#FF5A5E",
    label: "5 v 5 Normal"
  },
  {
    value: 50,
    color: "#46BFBD",
    highlight: "#5AD3D1",
    label: "3 v 3 Normal"
  },
  {
    value: 100,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "3 v 3 Ranked"
  },
  {
    value: 40,
    color: "#949FB1",
    highlight: "#A8B3C5",
    label: "5 v 5 Ranked"
  },
  {
    value: 120,
    color: "#4D5360",
    highlight: "#616774",
    label: "Dominion"
  }
];
var ctx = document.getElementById("gameStats").getContext("2d");
ctx.canvas.width = 180;
ctx.canvas.height = 180;
window.myDoughnut = new Chart(ctx).Doughnut(gameStats, {});

var champData = {
    labels: ["Fizz", "Garen", "Ashe", "Lee Sin"],
    datasets: [
        {
            label: "Data",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81]
        },
        {
            label: "Data 2",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19]
        }
    ]
};
var ctx = document.getElementById("champData").getContext("2d");
window.myBarChart = new Chart(ctx).Bar(champData, {responsive: true});

var roleStats = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "AP Mid"
    },
    {
        value: 225,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Jungle"
    },
    {
        value: 240,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "AD Top"
    },
    {
        value: 260,
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "AD Mid"
    },
    {
        value: 220,
        color: "#4D5360",
        highlight: "#616774",
        label: "Support"
    }
];
var ctx = document.getElementById("roleStats").getContext("2d");
ctx.canvas.width = 180;
ctx.canvas.height = 180;
window.myPolarArea = new Chart(ctx).PolarArea(roleStats, {responsive: false});

var timeData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
        {
            label: "This Year",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56]
        },
        {
            label: "Last Year",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86]
        }
    ]
};
var ctx = document.getElementById("timeData").getContext("2d");
window.myLineChart = new Chart(ctx).Line(timeData, {responsive: true});
