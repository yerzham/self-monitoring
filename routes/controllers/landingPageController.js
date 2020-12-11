import * as landingPageService from "../../services/landingPageService.js";
import * as summaryService from "../../services/summaryService.js";

const getAverages = (res) => {
	const data = {
		genericMood: null,
		sleepQuality: null,
		eatingQuality: null,
		sleepDuration: null,
		exercisesDuration: null,
		studyDuration: null
	};
	if (res){
		data.genericMood = res.generic_mood;
		data.sleepQuality =  res.sleep_quality;
		data.eatingQuality = res.eating_quality;
		data.sleepDuration = res.sleep_duration;
		data.exercisesDuration = res.exercises_duration;
		data.studyDuration = res.study_duration;
	}
	return data;
}

const getPastSevenDayAveragesForAll = async() => {
	const today = new Date();
	const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
	const res = await summaryService.getAveragesForAllBetween(date, today);
	return getAverages(res);
};

const showLandingPage = async({render, session}) => {
	const data = {
		authenticated: await session.get('authenticated'),
		user: await session.get('user'),
		moodAverage: null,
		moodYesterday: null,
		moodToday: null,
		averagesForWeek: await getPastSevenDayAveragesForAll()
	}
	if (!data.authenticated){
		data.authenticated = false;
		data.user = {};
	} else {
		const today = new Date();
		const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
		data.moodYesterday = await landingPageService.getMoodFor(data.user.user_id, yesterday);
		data.moodToday = await landingPageService.getMoodFor(data.user.user_id, today);
		data.moodAverage = (data.moodYesterday + data.moodToday)/2.0
	}
	render('index.ejs', data);
}

export {showLandingPage}