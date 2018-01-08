function initChart() {
    google.charts.load("current", {packages:["calendar"]});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Fare' });

        data = data.map((day) => ([new Date(day[0]), day[1]]));

        dataTable.addRows(data);

        var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

        var options = {
            title: "Takings Per Day",
            height: 500,
        };

        chart.draw(dataTable, options);
    }
};