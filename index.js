const express = require('express')
const app = express()
const port = 3000


app.use(express.static(__dirname + '/view')); // store html files in view folder
app.use(express.static(__dirname + '/script')); // store js&css in script folder

app.get('/', (req, res) => res.sendFile('index.html', {
  root: __dirname
}));

app.get(__dirname + '/sitemap', (req, res) => res.sendFile('/sitemap.html'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
