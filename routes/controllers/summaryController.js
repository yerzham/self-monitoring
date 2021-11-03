import * as summaryService from "../../services/summaryService.js";
import { getWeek, getYear, getMonth } from "../../utils/date.js";

const getAverages = (res) => {
  const data = {
    genericMood: null,
    sleepQuality: null,
    eatingQuality: null,
    sleepDuration: null,
    exercisesDuration: null,
    studyDuration: null,
  };
  if (res.length > 0) {
    data.genericMood = res[0].generic_mood;
    data.sleepQuality = res[0].sleep_quality;
    data.eatingQuality = res[0].eating_quality;
    data.sleepDuration = res[0].sleep_duration;
    data.exercisesDuration = res[0].exercises_duration;
    data.studyDuration = res[0].study_duration;
  }
  return data;
};

const getAvaragesForWeek = async (userID, week) => {
  return getAverages(await summaryService.getAvaragesForWeek(userID, week));
};

const getAvaragesForMonth = async (userID, month) => {
  return getAverages(await summaryService.getAveragesForMonth(userID, month));
};

const showSummaryPage = async ({ render, state }) => {
  const date = new Date();
  var lastMonth = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    date.getDate()
  );
  var lastWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 7
  );
  const yearForMonth = getYear(lastMonth);
  const month = getMonth(lastMonth);
  const [yearForWeek, week] = getWeek(lastWeek);
  let user = await state.session.get("user");
  await getAvaragesForMonth(user.user_id, week);
  render("/behaviour/summary.ejs", {
    authenticated: await state.session.get("authenticated"),
    user,
    week: yearForWeek + "-W" + week,
    month: yearForMonth + "-" + month,
    averagesForWeek: await getAvaragesForWeek(user.user_id, week),
    averagesForMonth: await getAvaragesForMonth(user.user_id, month),
  });
};

const getMonthData = async ({ state, params, response }) => {
  let user = await state.session.get("user");
  response.body = await getAvaragesForMonth(user.user_id, params.month);
};

const getWeekData = async ({ state, params, response }) => {
  let user = await state.session.get("user");
  response.body = await getAvaragesForWeek(user.user_id, params.week);
};

export { showSummaryPage, getMonthData, getWeekData };
