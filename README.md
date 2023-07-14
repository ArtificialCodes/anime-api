# anime-api

Install and Run:

```
git clone https://github.com/ArtificialCodes/anime-api
cd anime-api
npm install
npm start
```

##Routes

Otakudesu:
| route                     | Action            |
| ------------------------- | ----------------- |
| /otakudesu/search/{query} | Search anime name |
| /otakudesu/anime/{id}     | get anime detail  |
| /otakudesu/eps/:id        | get url sreaming  |

Komiku:
| route                     | Action            |
| ------------------------- | ----------------- |
| /komiku/search/{query}    | Search manga name |
| /komiku/manga-detail/{id} | get manga detail  |
| /komiku/chapter/{id}      | get chapter image |
