var dateFmt = d3.timeParse("%m/%d/%Y");

height = window.innerHeight / 5
timelineWidth = window.innerWidth / 2.3
barWidth = timelineWidth

const weekDays = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
}

const yearMonths = {
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

var chartTimeline = timeSeriesChart()
    .width(timelineWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var chartPayment = timeSeriesChart()
    .width(timelineWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var chartPurchase = timeSeriesChart()
    .width(timelineWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var chartBalance = timeSeriesChart()
    .width(timelineWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartWeekdayCount = barChart(weekDays)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartMonthCount = barChart(yearMonths)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartWeekdaySum = barChart(weekDays)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

var barChartMonthSum = barChart(yearMonths)
    .width(barWidth).height(height)
    .x(function (d) { return d.key; })
    .y(function (d) { return d.value; });

d3.csv("static/HW2/data/data.csv",
    function (d) {
        d.Date = dateFmt(d.date);
        return d;
    },
    function (err, data) {
        if (err) throw err;

        var csData = crossfilter(data);

        csData.dimTime = csData.dimension(function (d) { return d.Date; });
        csData.dimWeekdayCount = csData.dimension(function (d) { return (d.Date.getDay() + 1).toString(); });
        csData.dimMonthCount = csData.dimension(function (d) {
            currentMonth = (d.Date.getMonth() + 1).toString();
            if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
            return currentMonth
        });
        csData.dimWeekdaySum = csData.dimension(function (d) { return d.Date.toLocaleString('en-us', { weekday: 'long' }); });
        csData.dimMonthSum = csData.dimension(function (d) { return d.Date.toLocaleString('en-us', { month: 'long' }); });

        csData.date = csData.dimTime.group(d3.timeWeek);
        csData.payment = csData.dimTime.group(d3.timeWeek).reduceSum(
            function (d) {
                amount = +d.amount
                if (amount > 0)
                    return amount;
                return 0;
            });
        csData.purchase = csData.payment;

        csData.balance = csData.dimTime.group(d3.timeWeek).reduce(function (p, v) { return p - +v.amount; }, function (p, v) { return p + +v.amount; }, function () { return 1370; })
        csData.weekdayCount = csData.dimWeekdayCount.group();
        csData.monthCount = csData.dimMonthCount.group();

        csData.weekdaySum = csData.dimWeekdaySum.group().reduceSum(
            function (d) {
                amount = +d.amount
                if (amount > 0)
                    return amount;
                return 0;
            });
        csData.monthSum = csData.dimMonthSum.group().reduceSum(
            function (d) {
                amount = +d.amount
                if (amount > 0)
                    return amount;
                return 0;
            });


        _onBrushed = function (selected) {
            if (!selected)
                csData.dimTime.filterAll()
            else
                csData.dimTime.filter(selected);
            update();
        }

        _setGraphOnMouseOverCallback = function (graph, data) {
            graph.onMouseOver(function (d) {
                data.filter(d.key);
                update();
            }).onMouseOut(function () {
                data.filterAll();
                update();
            });
        }
        chartTimeline.onBrushed(function (element, selected) { _onBrushed(selected); });
        chartPayment.onBrushed(function (element, selected) { _onBrushed(selected); });
        chartPurchase.onBrushed(function (element, selected) { _onBrushed(selected); });
        chartBalance.onBrushed(function (element, selected) { _onBrushed(selected); });

        _setGraphOnMouseOverCallback(barChartWeekdayCount, csData.dimWeekdayCount);
        _setGraphOnMouseOverCallback(barChartMonthCount, csData.dimMonthCount);
        _setGraphOnMouseOverCallback(barChartWeekdaySum, csData.dimWeekdaySum);
        _setGraphOnMouseOverCallback(barChartMonthSum, csData.dimMonthSum);

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
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#monthCount")
                .datum(csData.monthCount.all())
                .call(barChartMonthCount)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#weekdaySum")
                .datum(csData.weekdayCount.all())
                .call(barChartWeekdaySum)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");

            d3.select("#monthSum")
                .datum(csData.monthCount.all())
                .call(barChartMonthSum)
                .select(".x.axis")
                .selectAll(".tick text")
                .attr("transform", "translate(-8,-1) rotate(-45)");
        }

        update();
    }
); 