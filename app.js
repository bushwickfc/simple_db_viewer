var ownerTable = $('table')[0];

// We can assume that all of the rows of data will have the same keys -
// so grab a sample row and pull the keys off to be used in the table header and as a reference for the other rows.
var makeRowKeys = function(sampleRow) {
	return Object.keys(sampleRow);
};

// Populate either kind of row - either header or just 'normal' data.
var populateRow = function(cellType, rowKeys, owner) {
	var tableRow = document.createElement('tr');

	for (var i = 0; i < rowKeys.length; i++) {
		var tableCell = document.createElement(cellType);
		tableCell.innerHTML = owner ? owner[rowKeys[i]] : rowKeys[i];
		tableRow.append(tableCell);
	};

	return tableRow;
};

var makeHeader = function(rowKeys) {
	var tableHead = document.createElement('thead');
	var headerRow = populateRow('th', rowKeys);

	tableHead.append(headerRow);

	return tableHead;
};

var makeBody = function(rowKeys, ownerData) {
	var tableBody = document.createElement('tbody');

	for (var i = 0; i < ownerData.length; i++) {
		var dataRow = populateRow('td', rowKeys, ownerData[i])
		tableBody.append(dataRow);
	};

	return tableBody;
};

// Populate the rows and append them to the table in the DOM.
// Passed as a callback to fetchOwnerData().
var makeTableContent = function(ownerData) {
	var rowKeys = makeRowKeys(ownerData[0]);

	return {
		tableHeader: makeHeader(rowKeys),
		tableBody: makeBody(rowKeys, ownerData),
	}
};

// Sort the owners by last name.
// Note that, for the purposes of evaluating alphabetical position, last names will be lowercased.
var sortByLastName = function(a, b) {
	if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) {
		return -1;
	} else if (a.last_name > b.last_name) {
		return 1;
	}

	return 0;
};

var makeTable = function(tableContent) {
	ownerTable.append(tableContent.tableHeader)
	ownerTable.append(tableContent.tableBody)
}

var fetchOwnerData = function(callback) {
	$.post('./get_all_owners.php', {}, function(ownerData) {
		if (ownerData.length > 0) {
			var sortedOwnerData = JSON.parse(ownerData).sort(sortByLastName);
			var tableContent = makeTableContent(sortedOwnerData);
			return callback(tableContent);
		}
	});
};

$(document).ready(function() {
	return fetchOwnerData(makeTable);
});
