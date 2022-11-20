
namespace GOT {
    
    // Utils

    // TODO add 2FA stat
    interface User {
        id: number;
        idIntra?: number;
        login: string;
        username: string;
        urlImg: string;
        wallet: number;
    }

    enum ProfileStatus {
        offline,
        online,
        inGame
    }

    interface Friend extends User {
        status: ProfileStatus;
    }

    // A token
    type Token = string;

    
    interface StatUser {
        victory: number;
        defeat: number;
        rank: number;
    }

    interface ProfileLeaderBoard {
        userInfos: User;
        stat: StatUser;
        inGame: number | undefined; // id de la game ou pas visualiser
    }

    interface Party {
        user1: User;
        user2: User;
        points1: number;
        points2: number;
    }

    // API POST /auth/connect_intra
    interface Login {
        token: Token;
        userInfos: User;
    }

    // API GET /profil (déroulant)
    interface Profile {
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
    interface NotifChoice {
        user: User;
        accept: boolean;
    }

    // WS /get_create_notif [leaderboard] -- demande ami
    ///// UserId / login


    // WS /set_leaderboard [leaderboard]
    interface LeaderBoard {
        users: ProfileLeaderBoard[];
    }

    // API /profil/:login
    interface HistoryParties {
        userInfos: User;
        stat: StatUser;
        parties: Party[];
    }
}
