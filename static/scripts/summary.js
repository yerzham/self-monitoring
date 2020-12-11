const handleMonthChange = async() => {
	const month = document.querySelector('input[type="month"]').value;
	const response = await fetch('/behaviour/summary/month/'+month.substr(month.length - 2));
	if (response.status === 200){
		const obj = JSON.parse(await response.text());
		Object.keys(obj).forEach((key) => {
			if (obj[key] !== null) 
				document.getElementById(key+"-month").innerHTML = obj[key];
			else
				document.getElementById(key+"-month").innerHTML = "No data";
		})
	}
}

const handleWeekChange = async() => {
	const week = document.querySelector('input[type="week"]').value;
	const response = await fetch('/behaviour/summary/week/'+week.substr(week.length - 2));
	if (response.status === 200){
		const obj = JSON.parse(await response.text());
		Object.keys(obj).forEach((key) => {
			if (obj[key] !== null) 
				document.getElementById(key+"-week").innerHTML = obj[key];
			else
				document.getElementById(key+"-week").innerHTML = "No data";
		})
	}
}