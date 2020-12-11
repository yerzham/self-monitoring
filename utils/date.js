function getDate(date) {
	if (!date) {
		date = new Date();
	}
	return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
				 '-' + date.getDate().toString().padStart(2, 0);
}

function getYear(date) {
	if (!date) {
		date = new Date();
	}
	return date.getFullYear();
}

function getMonth(date) {
	if (!date) {
		date = new Date();
	}
	return (date.getMonth() + 1).toString().padStart(2, 0);
}

function getWeek(date) {
	if (!date) {
		date = new Date.UTC();
	} else {
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	}
	date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
	var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
	var weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
	return [date.getUTCFullYear().toString(), String(weekNo).padStart(2, 0)];
}

export {getDate, getYear, getMonth, getWeek}