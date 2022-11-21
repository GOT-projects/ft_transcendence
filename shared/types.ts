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
    export class User {
        id: number;
        idIntra?: number;
        login: string;
        username: string;
        urlImg: string;
        wallet: number;
        // TODO add 2FA
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
    export class Friend extends User {
        status: ProfileStatus;
    }

    /**
     * redefinition of a string - for a token
     */
    export type Token = string;

    /**
     * Information of a user about games
     */
    export class StatUser {
        victory: number;
        defeat: number;
        rank: number;
    }

    /**
     * Information of 1 game
     */
    export class Party {
        user1: User;
        user2: User;
        points1: number;
        points2: number;
    }

    /**
     * All information of a user for leaderboard
     */
    export class ProfileLeaderBoard {
        userInfos: User;
        stat: StatUser;
        inGame: number | undefined; // id de la game ou pas visualiser
    }

    /**********************************************************/
    /*******************        HTTP       ********************/
    /**********************************************************/

    /**
     * Information after connection
     * 
     * Route: POST /auth/connect_intra
     * Front: NaN
     */
    export class Login {
        access_token: Token;
        user: User;
    }
    
    /**
     * Information of user who is connected (scrolling menu in header)
     * 
     * Route: Get /profil
     * Front: Header (Profil)
     */
    export class Profile {
        userInfos: User;
        stat: StatUser;
        notif: User[];  // users waiting responce to be friend
    }
    
    /**
     * Get user information and his information about game
     * 
     * Route: GET /profil/:login
     * Front: UserProfil (leaderboard)
     */
    export class HistoryParties {
        userInfos: User;
        stat: StatUser;
        parties: Party[];
    }

    /**
     * Route: PATCH /change_username
     * @param: {username: string}
     * Front: Header (menu)
     */

    /**
     * Route: PATCH /change_image
     * @param: { ... } //TODO image
     * Front: Header (menu)
     */

    //TODO route 2FA CRUD

    /**********************************************************/
    /*******************       Socket      ********************/
    /**********************************************************/
    
    /****************************************************/
    /**************** Server to clients *****************/
    /****************************************************/

    /**
     * Get all friends
     * Route:
     *  WS: /get_friends
     * Front: Header (friend)
     * @return Friend[]
     */

    /**
     * Get a new friend or update
     * Route:
     *  WS: /get_friend
     * Front: Header (friend)
     * @return Friend
     */

    /**
     * Get a new notif
     * Route:
     *  WS: /get_notif
     * Front: Notification
     * @return User
     */

    /**
     * Get the leaderboard (print or refresh)
     * Route:
     *  WS: /get_leaderboard
     * Front: Leaderboard
     */
    export class LeaderBoard {
        users: ProfileLeaderBoard[];
    }

    /****************************************************/
    /**************** Clients to server *****************/
    /****************************************************/

    /**
     * Send the choice of the friend demand
     * Route:
     *  WS: /set_new_friend
     * Front: Notification
     */
    export class NotifChoice {
        user: User;
        accept: boolean;
    }

    /**
     * Demand user as a friend
     * Route:
     *  WS: /demand_friend
     * Front: Leaderboard
     * @param { login }
     */

}