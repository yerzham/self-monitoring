// var date = new Date();
// const dateValue = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
// 									'-' + date.getDate().toString().padStart(2, 0);
// document.querySelectorAll('input[type="date"]').forEach((element) =>{
// 	element.value = dateValue;
// })
showEveningForm = () => {
	document.getElementById("morning-form").classList.add("d-none");
	document.getElementById("evening-form").classList.remove("d-none");
}
showMorningForm = () => {
	document.getElementById("evening-form").classList.add("d-none");
	document.getElementById("morning-form").classList.remove("d-none");
}