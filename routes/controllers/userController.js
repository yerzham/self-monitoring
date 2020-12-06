import * as userService from "../../services/userService.js";
import { validate, required, isEmail, minLength } from "../../deps.js"

const validationRules = {
	email: [required, isEmail],
	password: [required, minLength(4)]
};

const getRegistrationData = async (request) => {
  const data = {
		email: "",
		password: "",
		verification: "",
    errors: {}
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
		data.email = params.get("email");
		data.password = params.get("password");
		data.verification = params.get("verification");
  }

  return data;
};

const showLoginForm = async({render}) => {
  render('auth/login.ejs');
}

const showRegistrationForm = async({render}) => {
  render('auth/registration.ejs', await getRegistrationData());
}

const register = async({request, response, session, render}) => {
  const data = await getRegistrationData(request);

	var [passes, errors] = await validate(data, validationRules);

	if (data.password !== data.verification) {
		errors.verification = {
			match: "The entered passwords did not match."
		}
		passes = false;
	}
	
	if (passes){
		const existingUsers = await userService.getUsersByEmail(data.email);
		console.log(existingUsers);
		if (existingUsers.rowCount > 0) {
			response.status = 403;
			data.errors = {
				email: {
					reserved: "The email is already reserved."
				}
			}
			render('auth/registration.ejs', data);
			return;
		}
		await session.set('authenticated', null);
		await session.set('user', null);
		userService.registerUser(data.email, data.password);
		render('auth/registration-success.ejs');
	} else {
		response.status = 400;
		data.errors = errors;
		render('auth/registration.ejs', data);
	}
};

const login = async({request, response, session, render}) => {
  const body = request.body();
	const params = await body.value;
	const email = params.get("email");
	const password = params.get("password");

	const [authenticated, userObj] = await userService.authenticateUser(email, password);
  if (!authenticated) {
			response.status = 401;
			render('auth/login.ejs', {success: false});
      return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
      user_id: userObj.user_id,
      email: userObj.email
  });
  response.redirect('/');
};

const logout = async({response, session}) => {
	await session.set('authenticated', null);
	await session.set('user', {});

	response.redirect('/');
}

export {showLoginForm, showRegistrationForm, register, login, logout}