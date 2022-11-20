
/*export namespace GOT {
    */
    // Utils

    // TODO add 2FA stat
    export interface User {
        id: number;
        idIntra?: number;
        login: string;
        username: string;
        urlImg: string;
        wallet: number;
    }

    export enum ProfileStatus {
        offline,
        online,
        inGame
    }

    export interface Friend extends User {
        status: ProfileStatus;
    }

    // A token
    type Token = string;

    
    export interface StatUser {
        victory: number;
        defeat: number;
        rank: number;
    }

    export interface ProfileLeaderBoard {
        userInfos: User;
        stat: StatUser;
        inGame: number | undefined; // id de la game ou pas visualiser
    }

    export interface Party {
        user1: User;
        user2: User;
        points1: number;
        points2: number;
    }

    // API POST /auth/connect_intra
    export interface Login {
        token: Token;
        userInfos: User;
    }

    // API GET /profil (déroulant)
    export interface Profile {
        userInfos: User;
        stat: StatUser;
        notif: User[];  // user en attente
    }

    // WS /get_friends - /set_friends
    type Friends = Friend[];

    // API PATCH /change_profile ( {username: string} ) [header profile]
    // API PATCH /change_image ( { ... } ) [header profile] // TODO

    // TODO 2FA

    // WS /set_profile_friend [Header friend]
    // return Friend (l'ami ajouter ou changer)

    // WS /get_profile_friend -- validation de la notif [notif]
    export interface NotifChoice {
        user: User;
        accept: boolean;
    }

    // WS /get_create_notif [leaderboard] -- demande ami
    ///// UserId / login


    // WS /set_leaderboard [leaderboard]
    export interface LeaderBoard {
        users: ProfileLeaderBoard[];
    }

    // API /profil/:login
    export interface HistoryParties {
        userInfos: User;
        stat: StatUser;
        parties: Party[];
    }
//}
