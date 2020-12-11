# Self Monitoring web application
Course Project for Aalto University Web Software Development course. https://wsd.cs.aalto.fi/web-software-development/

#### CREATE TABLE queries for tables used in the application:
```
CREATE TABLE users
(
    user_id serial NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE (email)
);

CREATE TABLE reports
(
    report_id serial NOT NULL,
    user_id integer NOT NULL,
    reporting_date date NOT NULL,
    sleep_duration real,
    exercises_duration real,
    study_duration real,
    eating_quality smallint,
  	sleep_quality smallint,
    generic_mood_morning smallint,
  	generic_mood_evening smallint,
  	generic_mood real NOT NULL,
    PRIMARY KEY (report_id),
  	UNIQUE (user_id, reporting_date),
    FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);
```
