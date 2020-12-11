import * as summaryService from "../../services/summaryService.js";

const getAveragesForAll = async({params, response}) => {
	response.headers.set("Content-Type", "application/json");
	response.body = await summaryService.getAveragesForAll(params.year + "-" + parseInt(params.month).toString().padStart(2, 0)+ "-" + parseInt(params.day).toString().padStart(2, 0));
}

const getPastSevenDayAveragesForAll = async({response}) => {
	const today = new Date();
	const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
	response.headers.set("Content-Type", "application/json");
	response.body = await summaryService.getAveragesForAllBetween(date, today);
}

export {getAveragesForAll, getPastSevenDayAveragesForAll}