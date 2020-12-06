import * as landingPageService from "../../services/landingPageService.js";

const showLandingPage = async({render, session}) => {
	let authenticated = await session.get('authenticated');
	let user = await session.get('user');
	if (!authenticated){
		authenticated = false;
		user = {}
	}
	render('index.ejs', {authenticated, user});
}

export {showLandingPage}