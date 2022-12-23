/**
 * GOT for common types between back and front
 */
export namespace GOT {

	/**********************************************************/
	/******************** Utils - entities ********************/
	/**********************************************************/

	/**
	 * Information of a user
	 */
	export interface User {
		id: number;
		login: string;
		//username: string;
		urlImg: string;
		wallet: number;
		email: string;
		isTwoFactorAuthenticationEnabled: boolean;
		ball: EnumBall;
		color: string;
	}

	/**
	 * Status that a user can have
	 */
	export enum ProfileStatus {
		offline = 'offline',
		online = 'online',
		inGame = 'inGame'
	}

	/**
	 * Information for friends (information of user + his status)
	 */
	export interface Friend extends User {
		status: ProfileStatus;
	}

	/**
	 * redefinition of a string - for a token
	 */
	export type Token = string;

	/**
	 * Information of a user about games
	 */
	export interface StatUser {
		victory: number;
		defeat: number;
		rank: number;
	}

	/**
	 * Information of 1 game
	 */
	export interface Party {
		user1: User;
		user2: User;
		points1: number;
		points2: number;
	}

	/**
	 * All information of a user for leaderboard
	 */
	export interface ProfileLeaderBoard {
		userInfos: User;
		stat: StatUser;
		inGame: number | undefined; // id de la game ou pas visualiser
	}

	/**********************************************************/
	/*******************        HTTP       ********************/
	/**********************************************************/

	export interface Login {
		access_token: Token;
		user: User;
	}

	export interface Profile {
		userInfos: User;
		stat: StatUser;
		notif: User[];  // users waiting responce to be friend
		notifChannel: Channel[];
		friends: Friend[];
		blocks: User[];
		gameDemands: User[]
	}

	export interface HistoryParties {
		userInfos: User;
		stat: StatUser;
		parties: Party[];
		inGame: number | undefined; // id de la game ou pas visualiser
	}


	/**********************************************************/
	/*******************       Socket      ********************/
	/**********************************************************/

	/****************************************************/
	/**************** Server to clients *****************/
	/****************************************************/

	export type LeaderBoard = ProfileLeaderBoard[];

	/****************************************************/
	/**************** Clients to server *****************/
	/****************************************************/

	export interface NotifChoice {
		user: User | undefined;
		channel: Channel | undefined;
		accept: boolean;
	}

	export interface msg {
		userFrom: User,
		userTo: User,
		msg: string
	}

	export enum ChannelStatus {
		PUBLIC = 'PUBLIC',
		PROTECTED = 'PROTECTED',
		PRIVATE = 'PRIVATE'
	}

	export interface Channel {
		name: string,
		status: ChannelStatus,
		password?: string
	}

	export interface MsgChannel {
		userFrom: User,
		channel: Channel,
		msg: string
	}

	export enum UserChannelStatus {
		MEMBER = 'MEMBER',
		OWNER = 'OWNER',
		ADMIN = 'ADMIN',
		BAN = 'BAN'
	}

	export interface UserChannel extends User {
		status: UserChannelStatus;
	}

	export interface ChannelUsers {
		channel: Channel;
		users: UserChannel[];
	}

	export interface InitGame {
		user1: User;
		user2: User;
		codeParty: number;
		player: boolean;
	}

	export interface Ball {
		x: number;
		y: number;
	}

	export interface ActuGamePlayer {
		ball: Ball;
		enemyY: number;
	}

	export interface ActuGameSpectator {
		ball: Ball,
		player1Y: number;
		player2Y: number;
	}

	export interface ActuGamePoints {
		points1: number;
		points2: number;
	}

	export enum EnumBall {
		DEFAULT = 'DEFAULT',
		COMET = 'COMET',
		TENIS = 'TENIS',
		PONG = 'PONG',
	}

	export interface CustomGame {
		ball: EnumBall,
		color: string
	}
}
