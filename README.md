# ft_transcendence
 Un site web pour participer à une compétition du célèbre jeu Pong!

## Notes

[draw](https://excalidraw.com/#room=abaf3fe998bb25b4e653,leo5BnA3X1O4sU7JC70sTA)

### TS

[doc officiel](https://www.typescriptlang.org/docs/handbook/intro.html)

[promise (js)](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[connexion db](https://www.npmjs.com/package/nestjs-pgpromise)

### NestJs

[npm page](https://www.npmjs.com/~nestjscore)

[doc](https://docs.nestjs.com/)

[yt](https://www.youtube.com/channel/UCcE2YngHoargpdjIzkCNY2Q/videos)

```
npm i -g @nestjs/cli


```

### Database

[doc officiel](https://www.postgresql.org/docs/current/index.html)

### Docker

[docker ref](https://docs.docker.com/engine/reference/builder/)

[compose ref](https://docs.docker.com/compose/compose-file/)

### API

#### HTTP


##### Image

`PUT /upload`
- Params:
    - `file` une image
- Return:
    - file

`GET /images/:file`
- Params:
    - `:file` nom du fichier
- Return:
    - file


##### Image

`POST /auth/connect_intra`
- Params:
    - `code` code de l'intra
- Return:
    - status '201'

`POST /auth/invite`
- Params:
    - `login` login de l'utilisateur à créer
- Return:
    - status '201'

`POST /auth/2fa/generate`
- Header token
- Return:
    - status '201'
    - une string qrcode

`POST /auth/2fa/activate`
- Header: token
- Return:
    - status '201'

`POST /auth/2fa/authenticate`
- Header: token
- Return:
    - status '201'
    - une string étant un jwt

`GET /auth/get_intra_url`
- Return:
    - status '200'
    - une string étant un l'url de l'intra

#### Socket

##### General

`server_profil`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.Profile` on `client_profil` (information du profil de la personne connecté)

`server_profil_login`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `login`: `string` login de la personne dont on veut le profil
- Return:
    - `GOT.Profile` on `client_profil_login` (information du profil de la personne voulu)

`server_change_username`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `username`: `string` nouveau username de la personne connecté
- Return:
    - `GOT.Profile` on `client_profil` (information du profil de la personne conneté)


##### Leaderboard

`server_leaderboard`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.LeaderBoard` on `client_leaderboard` (tout le leaderboard)

##### Amis

`server_demand_friend`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `login`: `string` login de la personne que l'on veut ajouter en amis
- Return:
    - `GOT.User[]` on `client_notif` (toutes les demandes d'amis en cours à la personne connecté)
    - `GOT.Friend[]` on `client_friends` (touts les amis de la personne connecté)

`server_reply_notification`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `reply`: `GOT.NotifChoice` la réponse à la demande d'amis en notification
- Return:
    - `GOT.User[]` on `client_notif` (toutes les demandes d'amis en cours à la personne connecté)
    - `GOT.Friend[]` on `client_friends` (touts les amis de la personne connecté)

`server_friends`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.Friend[]` on `client_friends` (touts les amis de la personne connecté)

`server_block_somebody`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `login`: `string` login de la personne que l'on veut bloquer
- Return:
    - `GOT.User[]` on `client_notif` (toutes les demandes d'amis en cours à la personne connecté)
    - `GOT.Friend[]` on `client_friends` (touts les amis de la personne connecté)

`server_unblock_somebody`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `login`: `string` login de la personne que l'on veut dé bloquer
- Return:
    - `GOT.User[]` on `client_notif` (toutes les demandes d'amis en cours à la personne connecté)
    - `GOT.Friend[]` on `client_friends` (touts les amis de la personne connecté)

##### Chat

`server_privmsg`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `login`: `string` login de la personne avec qui sera la discution retournée
- Return:
    - `GOT.msg[]` on `client_privmsg` (messages entre les 2 utilisateurs)

`server_privmsg_users`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.User[]` on `client_privmsg_users` (utilisateurs avec qui la personnes connecté à reçu ou envoyé au moins un message)

`server_privmsg_send`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `login`: `string` login de la personne à qui l'on veut envoyer le message
    - `msg`: `string` message à envoyer
- Return:
    - `GOT.msg` on `client_privmsg_send` (message reçu par un autre utilisateur)

`server_users`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.User[]` on `client_users` (liste des utilisateurs du server)


###### Channel


`server_chanmsg`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `chanName`: `string` nom du channel dont la discution sera retournée
- Return:
    - `GOT.MsgChannel[]` on `client_chanmsg` (messages du channel)

`server_channels_in`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.Channel[]` on `client_channels_in` (channels sur lesquels la personnes connecté est)

`server_chanmsg_send`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `chanName`: `string` nom du channel ou l'on veut envoyer le message
    - `msg`: `string` message à envoyer
- Return:
    - `GOT.MsgChannel` on `client_chanmsg_send` (message reçu par un autre utilisateur sur le channel)

`server_channels`
- Params:
    - `Authorization`: `GOT.Token` (string)
- Return:
    - `GOT.Channel[]` on `client_channels` (liste des channels du server visible pour l'utilisateur)

`server_chanmsg_join`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `chanName`: `string` nom du channel ou l'on veut rejoindre
    - `password`: `string` mdp
- Return:
    - `GOT.Channel[]` on `client_channels_in` (message reçu par un autre utilisateur)

`server_chanmsg_invite`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `chanName`: `string` nom du channel que la personne va rejoindre
    - `login`: `string` login de la personne qui va rejoindre le channel
- Return:
    - `GOT.Channel[]` on `client_channels_in` (message reçu par un autre utilisateur)

`server_chan_create`
- Params:
    - `Authorization`: `GOT.Token` (string)
    - `chan`: `GOT.Channel` channel à créer
- Return:
    - `GOT.Channel[]` on `client_channels_in` (message reçu par un autre utilisateur)
