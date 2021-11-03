import { send } from "../deps.js";

const serveFavicon = async (context, next) => {
  if (context.request.url.pathname === "/favicon.ico") {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/static`,
    });
  } else {
    await next();
  }
};

const accessMiddleware = async ({ request, response, state }, next) => {
  if (
    request.url.pathname.startsWith("/auth") ||
    request.url.pathname.startsWith("/api") ||
    request.url.pathname === "/" ||
    (await state.session.get("authenticated"))
  ) {
    await next();
  } else {
    response.redirect("/auth/login");
  }
};

const errorMiddleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    context.response.status = 500;
  }
};

const requestTimingMiddleware = async ({ request, state }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const user = await state.session.get("user");
  if (typeof user !== "undefined" && user !== {}) {
    const userId = (await state.session.get("user")).user_id;
    console.log(
      `[${new Date().toLocaleString()}] ${request.method} ${
        request.url.pathname
      } (by ${userId}) - ${ms} ms`
    );
  } else {
    console.log(
      `[${new Date().toLocaleString()}] ${request.method} ${
        request.url.pathname
      } (by anonymous) - ${ms} ms`
    );
  }
};

const serveStaticFilesMiddleware = async (context, next) => {
  if (context.request.url.pathname.startsWith("/static")) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`,
    });
  } else {
    await next();
  }
};

export {
  errorMiddleware,
  requestTimingMiddleware,
  serveStaticFilesMiddleware,
  serveFavicon,
  accessMiddleware,
};
