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

#### Games

##### Retours

```json
[
    {
        "points1":12,
        "points2":85,
        "user1":{
            "id":1,
            "idIntra":649854985654465,
            "login":"aartiges",
            "username":"aartiges",
            "urlImg":"https://docs.nestjs.com/assets/logo-small.svg",
            "wallet":185},
        "user2": {
            "id":3,
            "idIntra":null,
            "login":"test",
            "username":"test",
            "urlImg":"https://docs.nestjs.com/assets/logo-small.svg",
            "wallet":-1
        }
    },
    ...
]
```

##### Routes

`/games` toutes les parties finies

`/games/user/:id` toutes les parites finies de l'utilisateur aant l'id :id

