function CSVtoArr (csv) {
    rows  = csv.split("\n");
    return rows.map(function (row) {
    	return row.split(",");
    });
};