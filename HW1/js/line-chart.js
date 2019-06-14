$(function () {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 1024 - margin.left - margin.right,
        height = 768 - margin.top - margin.bottom;

    // parse the date
    var parseDate = d3.timeParse("%m/%d/%Y");

    var getDate = function (d) {
        return d.value.date;
    }

    var getCredit = function (d) { return d.value["credit"]; }
    var getDebit = function (d) { return d.value["debit"]; }

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var creditLine = d3.line()
        .x(function (d) {
            var _x = x(getDate(d));
            return _x;
        })
        .y(function (d) {
            var _y = y(getCredit(d));
            return _y;
        });

    var debitLine = d3.line()
        .x(function (d) {
            var _x = x(getDate(d));
            return _x;
        })
        .y(function (d) {
            var _y = y(getDebit(d));
            return _y;
        });

    var title = d3.select("body")
        .append("text")
        .attr("class", "text")
        .text("Credit Card Transactions");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("data/data.csv", function (error, data) {
        if (error)
            throw error;

        // format the data
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.amount = +d.amount;
        });

        var nested_data = d3.nest()
            .key(function (d) {
                return d3.timeSunday(d.date);
            })
            .rollup(function (records) {
                return {
                    "date": d3.timeSunday(records[0].date),
                    "credit": d3.sum(records, function (d) { return d.amount < 0 ? d.amount : 0; }),
                    "debit": d3.sum(records, function (d) { return d.amount > 0 ? d.amount : 0; })
                }
            })
            .entries(data);

        nested_data.sort(function (a, b) {
            return +a.value.date - +b.value.date;
        });

        // Scale the range of the data
        x.domain(d3.extent(nested_data, function (d) {
            return getDate(d);
        }));
        y.domain([
            d3.min(nested_data, function (d) {
                var _c = getCredit(d);
                return _c;
            }),
            d3.max(nested_data, function (d) {
                var _c = getDebit(d)
                return _c;
            })
        ]);

        // Add the paths.
        svg.append("path")
            .data([nested_data])
            .attr("class", "line credit")
            .attr("d", creditLine);

        svg.append("path")
            .data([nested_data])
            .attr("class", "line debit")
            .attr("d", debitLine);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x))
            .attr("class", "axis");

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("class", "axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("USD * factor");

        var legend = svg.append("g")
            .attr('class', 'legend')
            .selectAll("g")
            .data(["credit", "debit"]);

        var label = legend.enter()
            .append('g')
            .attr('class', 'label');

        label.append('rect')
            .attr('class', function (d) {
                return "rect " + d;
            })
            .attr('x', width - 20)
            .attr('y', function (d, i) {
                return i * 25;
            })
            .attr('width', 10)
            .attr('height', 10);

        label.append('text')
            .attr('x', width - 8)
            .attr('y', function (d, i) {
                return (i * 20) + 9;
            })
            .text(function (d) {
                return d;
            });
    });
});