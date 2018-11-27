const express = require('express')
const app = express();
const port = 8000;

const cache = require('memory-cache');

const mongoose = require('mongoose');

// mem-cache stuff

cache.put('foo', 'bar');
console.log(cache.get('foo'));

cache.put('houdini', 'disappear', 100, function(key, value) {
  console.log(key + ' ' + value);
});

console.log('Houdini will now ' + cache.get('houdini'));

setTimeout(function() {
  console.log('Houdini is ' + cache.get('houdini'));
}, 200);



//

// mongoose.connect('mongodb://localhost/my_database');
//
// // ------------ examples -- look at https://www.npmjs.com/package/mongoose
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
//
// const BlogPost = new Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date
// });
//
// // --
// const Comment = new Schema({
//   name: {
//     type: String,
//     default: 'hahaha'
//   },
//   age: {
//     type: Number,
//     min: 18,
//     index: true
//   },
//   bio: {
//     type: String,
//     match: /[a-z]/
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   buff: Buffer
// });
// // setter
// Comment.path('name').set((v) => {
//   return capitalize(v)
// });
// //middleware
// Comment.pre('save', (next) => {
//   notify(this.get('email'));
//   next();
// });
//
// //
//
// const myModel = mongoose.model('ModelName', mySchema); // accessing a model you
//
// //
//
// const instance = new MyModel();
// instance.my.key = 'ahoy';
// instance.save((err) => console.error(err));
//
// //
//
// MyModel.find({}, (err, docs) => {
//   // docs.forEach basically
// });


// ------------ end of examples

app.use(express.static(__dirname + '/view')); // store html files in view folder
app.use(express.static(__dirname + '/script')); // store js&css in script folder

app.get('/', (req, res) => res.sendFile('index.html', {
  root: __dirname
}));

app.get(__dirname + '/sitemap', (req, res) => res.sendFile('/sitemap.html'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
