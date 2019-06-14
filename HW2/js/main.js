/* global d3, crossfilter, timeSeriesChart, barChart */

// 2015-05-01 00:43:28
var dateFmt = d3.timeParse("%m/%d/%Y");

height = 180
width = 680
barWidth = width

const week = {
    // "sunday": 0, // << if sunday is first day of week
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
}

const year = {
    4: "April",
    8: "August",
    12: "December",
    2: "February",
    1: "January",
    7: "July",
    6: "June",
    3: "March",
    5: "May",
    11: "November",
    10: "October",
    9: "September"
}

function sortDayMonths(a, b) {
    byDay = sortByDay(a, b)
    if (!isNaN(byDay))
        return byDay
    return sortByMonth(a, b);
}
function sortByDay(a, b) {
    let day1 = a.key.toLowerCase();
    let day2 = b.key.toLowerCase();
    return week[day1] - week[day2];
}

function sortByMonth(a, b) {
    let month1 = a.key.toLowerCase();
    let month2 = b.key.toLowerCase();
    return year[month1] - year[month2];
}

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

var barChartWeekdayCount = barChart(week)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartMonthCount = barChart(year)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartWeekdaySum = barChart(week)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartMonthSum = barChart(year)
    .width(barWidth).height(height)
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

        //mousedown
        data.sort((a, b) => (a.Date > b.Date) ? 1 : -1)

        minDate = data.reduce((min, p) => p.Date < min ? p.Date : min, data[0].Date);
        maxDate = data.reduce((max, p) => p.Date > max ? p.Date : max, data[0].Date);

        for (var d = minDate; d <= maxDate; d.setDate(d.getDate() + 1)) {
            var found = data.find(function (element) {
                return element.Date === d;
            });
            if (!found)
                data.push(new { Date: d, amount: "0", balance: "0" });
        }

        var csData = crossfilter(data);
        // We create dimensions for each attribute we want to filter by
        csData.dimTime = csData.dimension(function (d) { return d.Date; });
        csData.dimWeekdayCount = csData.dimension(function (d) {
            // return d.Date.toLocaleString('en-us', { weekday: 'long' }); });
            //return d.Date.toLocaleString('en-us', { month: 'long' });  
            return (d.Date.getDay() + 1).toString();
        });

        csData.dimMonthCount = csData.dimension(function (d) {
            //return d.Date.toLocaleString('en-us', { month: 'long' });  
            currentMonth = (d.Date.getMonth() + 1).toString();
            if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
            return currentMonth
        });
        csData.dimWeekdaySum = csData.dimension(function (d) { return d.Date.toLocaleString('en-us', { weekday: 'long' }); });
        csData.dimMonthSum = csData.dimension(function (d) { return d.Date.toLocaleString('en-us', { month: 'long' }); });

        // We bin each dimension
        csData.date = csData.dimTime.group(d3.timeWeek);
        csData.payment = csData.dimTime.group(d3.timeWeek).reduceSum(function (d) {
            amount = +d.amount
            if (amount > 0)
                return amount;
            return 0;
        });;
        csData.purchase = csData.dimTime.group(d3.timeWeek).reduceSum(function (d) {
            amount = +d.amount
            if (amount < 0)
                return -amount;
            return 0;
        });
        csData.balance = csData.dimTime.group(d3.timeWeek).reduceSum(function (d) {
            return +d.balance;
        });

        csData.weekdayCount = csData.dimWeekdayCount.group();

        csData.monthCount = csData.dimMonthCount.group();

        csData.weekdaySum = csData.dimWeekdaySum.group().reduceSum(function (d) {
            amount = +d.amount
            if (amount > 0)
                return amount;
            return 0;
        });
        csData.monthSum = csData.dimMonthSum.group().reduceSum(function (d) {
            amount = +d.amount
            if (amount > 0)
                return amount;
            return 0;
        });

        _onBrushed = function (element, selected) {
            if (!selected)
                csData.dimTime.filterAll()
            else
                csData.dimTime.filter(selected);
            update();
        }
        chartTimeline.onBrushed(function (element, selected) {
            _onBrushed(element, selected);
        });

        chartPayment.onBrushed(function (element, selected) {
            _onBrushed(element, selected);
        });

        chartPurchase.onBrushed(function (element, selected) {
            _onBrushed(element, selected);
        });

        chartBalance.onBrushed(function (element, selected) {
            _onBrushed(element, selected);
        });

        barChartWeekdayCount.onMouseOver(function (d) {
            csData.dimWeekdayCount.filter(d.key);
            update();
        }).onMouseOut(function () {
            // Clear the filter
            csData.dimWeekdayCount.filterAll();
            update();
        });

        barChartMonthCount.onMouseOver(function (d) {
            csData.dimMonthCount.filter(d.key);
            update();
        }).onMouseOut(function () {
            // Clear the filter
            csData.dimMonthCount.filterAll();
            update();
        });

        barChartWeekdaySum.onMouseOver(function (d) {
            csData.dimWeekdaySum.filter(d.key);
            update();
        }).onMouseOut(function () {
            // Clear the filter
            csData.dimWeekdaySum.filterAll();
            update();
        });

        barChartMonthSum.onMouseOver(function (d) {
            csData.dimMonthSum.filter(d.key);
            update();
        }).onMouseOut(function () {
            // Clear the filter
            csData.dimMonthSum.filterAll();
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

            d3.select("#weekdayCount")
                .datum(csData.weekdayCount.all())
                .call(barChartWeekdayCount)
                .select(".x.axis") //Adjusting the tick labels after drawn
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#monthCount")
                .datum(csData.monthCount.all())
                .call(barChartMonthCount)
                .select(".x.axis") //Adjusting the tick labels after drawn
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#weekdaySum")
                .datum(csData.weekdayCount.all())
                .call(barChartWeekdaySum)
                .select(".x.axis") //Adjusting the tick labels after drawn
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#monthSum")
                .datum(csData.monthCount.all())
                .call(barChartMonthSum)
                .select(".x.axis") //Adjusting the tick labels after drawn
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");
        }

        update();
    }
); 