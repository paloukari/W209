/* global d3, crossfilter, timeSeriesChart, barChart */

// 2015-05-01 00:43:28
var dateFmt = d3.timeParse("%m/%d/%Y");

height = 200
width = 760
var chartTimeline = timeSeriesChart()
    .width(width).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var chartPayment = timeSeriesChart()
    .width(width).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var chartPurchase = timeSeriesChart()
    .width(width).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var chartBalance = timeSeriesChart()
    .width(width).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartWeekday = barChart()
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartMonth = barChart()
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

d3.csv("data/data.csv",
    function (d) {
        // This function is applied to each row of the dataset
        d.Date = dateFmt(d.date);
        return d;
    },
    function (err, data) {
        if (err) throw err;

        data.sort((a, b) => (a.Date > b.Date) ? 1 : -1)

        minDate = data.reduce((min, p) => p.Date < min ? p.Date : min, data[0].Date);
        maxDate = data.reduce((max, p) => p.Date > max ? p.Date : max, data[0].Date);

        for (var d = minDate; d <= maxDate; d.setDate(d.getDate() + 1)) {
            var found = data.find(function (element) { return element.Date == d; });
            if (found == false)
                data.push(new { Date: d, amount: "0", balance: "0" });
        }
  
        var csData = crossfilter(data);
        // We create dimensions for each attribute we want to filter by
        csData.dimTime = csData.dimension(function (d) { return d.Date; });
        csData.dimWeekday = csData.dimension(function (d) { return d.Date.toLocaleString('en-us', { weekday: 'long' }); });
        csData.dimMonth = csData.dimension(function (d) { return d.Date.toLocaleString('en-us', { month: 'long' }); });

        // We bin each dimension
        csData.date = csData.dimTime.group();
        csData.payment = csData.dimTime.group(d3.timeDay).reduceSum(function (d) {
            amount = +d.amount
            if (amount > 0)
                return amount;
            return 0;
        });;
        csData.purchase = csData.dimTime.group(d3.timeDay).reduceSum(function (d) {
            amount = +d.amount
            if (amount < 0)
                return -amount;
            return 0;
        });;
        csData.balance = csData.dimTime.group(d3.timeDay).reduceSum(function (d) {
            return +d.balance;
        });;
        csData.weekday = csData.dimWeekday.group();
        csData.month = csData.dimMonth.group();

        chartTimeline.onBrushed(function (selected) {
            csData.dimTime.filter(selected);
            update();
        });

        chartPayment.onBrushed(function (selected) {
            csData.dimTime.filter(selected);
            update();
        });

        chartPurchase.onBrushed(function (selected) {
            csData.dimTime.filter(selected);
            update();
        });

        chartBalance.onBrushed(function (selected) {
            csData.dimTime.filter(selected);
            update();
        });

        barChartWeekday.onMouseOver(function (d) {
            csData.dimWeekday.filter(d.key);
            update();
        }).onMouseOut(function () {
            // Clear the filter
            csData.dimWeekday.filterAll();
            update();
        });

        barChartMonth.onMouseOver(function (d) {
            csData.dimMonth.filter(d.key);
            update();
        }).onMouseOut(function () {
            // Clear the filter
            csData.dimMonth.filterAll();
            update();
        });

        function update() {
            d3.select("#timeline")
                .datum(csData.date.all())
                .call(chartTimeline);

            d3.select("#payment")
                .datum(csData.payment.all())
                .call(chartPayment);

            d3.select("#purchase")
                .datum(csData.purchase.all())
                .call(chartPurchase);

            d3.select("#balance")
                .datum(csData.balance.all())
                .call(chartBalance);

            d3.select("#weekday")
                .datum(csData.weekday.all())
                .call(barChartWeekday)
                .select(".x.axis") //Adjusting the tick labels after drawn
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#month")
                .datum(csData.month.all())
                .call(barChartMonth)
                .select(".x.axis") //Adjusting the tick labels after drawn
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");
        }

        update();
    }
); 