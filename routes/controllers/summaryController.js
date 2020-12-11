import * as summaryService from "../../services/summaryService.js";
import {getWeek, getYear, getMonth} from "../../utils/date.js"

var averagesForWeek = {}
var averagesForMonth = {}

const getAvaragesForWeek = async (userID, week, request) => {
  averagesForWeek = {
		genericMood: null,
		sleepQuality: null,
		eatingQuality: null,
		sleepDuration: null,
		exercisesDuration: null,
		studyDuration: null
	};

	let res = [];
  if (request) {
    const body = request.body();
		const params = await body.value;
		res = await summaryService.getAvaragesForWeek(userID, params.get("week"));
	} else {
		res = await summaryService.getAvaragesForWeek(userID, week);
	}
	if (res.length > 0){
		averagesForWeek.genericMood = res[0].generic_mood;
		averagesForWeek.sleepQuality =  res[0].sleep_quality;
		averagesForWeek.eatingQuality = res[0].eating_quality;
		averagesForWeek.sleepDuration = res[0].sleep_duration;
		averagesForWeek.exercisesDuration = res[0].exercises_duration;
		averagesForWeek.studyDuration = res[0].study_duration;
	}
};

const getAvaragesForMonth = async (userID, month, request) => {
  averagesForMonth = {
		genericMood: null,
		sleepQuality: null,
		eatingQuality: null,
		sleepDuration: null,
		exercisesDuration: null,
		studyDuration: null
	};

	let res = [];
  if (request) {
    const body = request.body();
		const params = await body.value;
		res = await summaryService.getAveragesForMonth(userID, params.get("month"));
	} else {
		res = await summaryService.getAveragesForMonth(userID, month);
	}
	if (res.length > 0){
		averagesForMonth.genericMood = res[0].generic_mood;
		averagesForMonth.sleepQuality =  res[0].sleep_quality;
		averagesForMonth.eatingQuality = res[0].eating_quality;
		averagesForMonth.sleepDuration = res[0].sleep_duration;
		averagesForMonth.exercisesDuration = res[0].exercises_duration;
		averagesForMonth.studyDuration = res[0].study_duration;
	}
};

const showSummaryPage = async({render, session}) => {
	const date = new Date();
	var lastMonth = new Date(date.getFullYear(), date.getMonth()-1, date.getDate());
	var lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
	const yearForMonth = getYear(lastMonth);
	const month = getMonth(lastMonth);
	const [yearForWeek, week] = getWeek(lastWeek);
	let user = await session.get('user');
	await getAvaragesForWeek(user.user_id, week);
	await getAvaragesForMonth(user.user_id, week);
	render('/behaviour/summary.ejs', {
		authenticated: await session.get('authenticated'),
		user,
		week: yearForWeek + "-W" + week,
		month: yearForMonth + "-" + month,
		averagesForWeek,
		averagesForMonth
	});
}

const getMonthData = async({session, params, response}) => {
	let user = await session.get('user');
	await getAvaragesForMonth(user.user_id, params.month);
	response.body = averagesForMonth;
}

const getWeekData = async({session, params, response}) => {
	let user = await session.get('user');
	await getAvaragesForWeek(user.user_id, params.week);
	response.body = averagesForWeek;
}

export {showSummaryPage, getMonthData, getWeekData}