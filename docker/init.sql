--
-- PostgreSQL database dump
--

CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';

ALTER DATABASE $POSTGRES_DB OWNER TO $POSTGRES_USER;

\connect $POSTGRES_DB

-- Create tables

CREATE TYPE channel_status_enum AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');
CREATE TYPE game_status_enum AS ENUM ('IN_PROGRESS', 'FINISH', 'DEMAND');
CREATE TYPE rel_user_channel_status_enum AS ENUM ('MEMBER', 'OWNER', 'ADMIN', 'BAN');
CREATE TYPE user_ball_enum AS ENUM ('DEFAULT', 'COMET', 'TENIS', 'PONG');

DROP TABLE IF EXISTS "channel";
DROP SEQUENCE IF EXISTS channel_id_seq;
CREATE SEQUENCE channel_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."channel" (
	"id" integer DEFAULT nextval('channel_id_seq') NOT NULL,
	"name" character varying NOT NULL,
	"status" channel_status_enum DEFAULT 'PUBLIC' NOT NULL,
	"password" character varying,
	CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE ("name")
) WITH (oids = false);


DROP TABLE IF EXISTS "game";
DROP SEQUENCE IF EXISTS game_id_seq;
CREATE SEQUENCE game_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."game" (
	"id" integer DEFAULT nextval('game_id_seq') NOT NULL,
	"user1Id" integer NOT NULL,
	"user2Id" integer NOT NULL,
	"points1" integer DEFAULT '0' NOT NULL,
	"points2" integer DEFAULT '0' NOT NULL,
	"status" game_status_enum DEFAULT 'IN_PROGRESS' NOT NULL,
	CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "message";
DROP SEQUENCE IF EXISTS message_id_seq;
CREATE SEQUENCE message_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."message" (
	"id" integer DEFAULT nextval('message_id_seq') NOT NULL,
	"message" character varying NOT NULL,
	"userIdFrom" integer NOT NULL,
	"userIdTo" integer,
	"channelIdTo" integer,
	CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "rel_block";
DROP SEQUENCE IF EXISTS rel_block_id_seq;
CREATE SEQUENCE rel_block_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."rel_block" (
	"id" integer DEFAULT nextval('rel_block_id_seq') NOT NULL,
	"userIdWhoBlock" integer NOT NULL,
	"userIdIsBlock" integer NOT NULL,
	CONSTRAINT "PK_eefb053a5713ef7af33e538cd76" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "rel_demand";
DROP SEQUENCE IF EXISTS rel_demand_id_seq;
CREATE SEQUENCE rel_demand_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."rel_demand" (
	"id" integer DEFAULT nextval('rel_demand_id_seq') NOT NULL,
	"userIdDemand" integer NOT NULL,
	"userIdWhoDemand" integer,
	"channelIdWhoDemand" integer,
	CONSTRAINT "PK_9092d67e79ba94011f6afac12ad" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "rel_friend";
DROP SEQUENCE IF EXISTS rel_friend_id_seq;
CREATE SEQUENCE rel_friend_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."rel_friend" (
	"id" integer DEFAULT nextval('rel_friend_id_seq') NOT NULL,
	"user1Id" integer NOT NULL,
	"user2Id" integer NOT NULL,
	CONSTRAINT "PK_24cdc007c68ec8eb7fdace4a60a" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "rel_user_channel";
DROP SEQUENCE IF EXISTS rel_user_channel_id_seq;
CREATE SEQUENCE rel_user_channel_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."rel_user_channel" (
	"id" integer DEFAULT nextval('rel_user_channel_id_seq') NOT NULL,
	"status" rel_user_channel_status_enum DEFAULT 'MEMBER' NOT NULL,
	"userId" integer NOT NULL,
	"channelId" integer NOT NULL,
	CONSTRAINT "PK_2e57e4cb6a57b2137bf780966f6" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "user";
DROP SEQUENCE IF EXISTS user_id_seq;
CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."user" (
	"id" integer DEFAULT nextval('user_id_seq') NOT NULL,
	"twoFactorAuthenticationSecret" character varying,
	"isTwoFactorAuthenticationEnabled" boolean NOT NULL,
	"login" character varying NOT NULL,
	"urlImg" character varying NOT NULL,
	"wallet" integer NOT NULL,
	"email" character varying NOT NULL,
	"ball" user_ball_enum DEFAULT 'DEFAULT' NOT NULL,
	"color" character varying DEFAULT '#121212' NOT NULL,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
	CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"),
	CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
) WITH (oids = false);


ALTER TABLE ONLY "public"."game" ADD CONSTRAINT "FK_8c2a5454985e4dc7a87b55cacc7" FOREIGN KEY ("user2Id") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."game" ADD CONSTRAINT "FK_cf8f3988639395bfeb47655b749" FOREIGN KEY ("user1Id") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."message" ADD CONSTRAINT "FK_3e544cb748265908265d3de691a" FOREIGN KEY ("userIdFrom") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."message" ADD CONSTRAINT "FK_550b018e9056e2d70f6da2382a4" FOREIGN KEY ("channelIdTo") REFERENCES channel(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."message" ADD CONSTRAINT "FK_8ce41665d233e8981f2061a18ab" FOREIGN KEY ("userIdTo") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."rel_block" ADD CONSTRAINT "FK_6661cea9949a1c9ae0f2b782317" FOREIGN KEY ("userIdWhoBlock") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."rel_block" ADD CONSTRAINT "FK_ac221a76442f671296cef2180fd" FOREIGN KEY ("userIdIsBlock") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."rel_demand" ADD CONSTRAINT "FK_2c7c694ca64e6c1c9b814a1c628" FOREIGN KEY ("channelIdWhoDemand") REFERENCES channel(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."rel_demand" ADD CONSTRAINT "FK_385c6997cdc1cbb8ad201e51017" FOREIGN KEY ("userIdDemand") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."rel_demand" ADD CONSTRAINT "FK_d3360b1b726fa3266f1a819ebd3" FOREIGN KEY ("userIdWhoDemand") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."rel_friend" ADD CONSTRAINT "FK_6f98bcd38b318c6d72bab38c804" FOREIGN KEY ("user2Id") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."rel_friend" ADD CONSTRAINT "FK_9ef127bd254dbd3c9b7a61b8f7e" FOREIGN KEY ("user1Id") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."rel_user_channel" ADD CONSTRAINT "FK_0d836fd16134db121e9acc22368" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."rel_user_channel" ADD CONSTRAINT "FK_56196cdd7f4bac22600d04431a2" FOREIGN KEY ("channelId") REFERENCES channel(id) ON DELETE CASCADE NOT DEFERRABLE;

--
-- PostgreSQL database dump complete
--