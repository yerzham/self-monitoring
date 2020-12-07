import * as reportingService from "../../services/reportingService.js";

const showReportingPage = async({render, session}) => {
	let authenticated = await session.get('authenticated');
	let user = await session.get('user');
	if (!authenticated){
		authenticated = false;
		user = {}
	}
	render('behaviour/reporting.ejs', {authenticated, user});
}

export {showReportingPage}