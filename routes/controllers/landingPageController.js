import * as landingPageService from "../../services/landingPageService.js";

const showLandingPage = async({render, session}) => {
	const data = {
		authenticated: await session.get('authenticated'),
		user: await session.get('user'),
		moodAverage: null,
		moodYesterday: null,
		moodToday: null
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