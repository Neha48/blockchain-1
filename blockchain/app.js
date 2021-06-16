var xpress = require('express');
var app = xpress();
var bodyParser = require('body-parser');
var chain = require('./index.js');
const { Wallet } = require('./index.js');
// var mongoose = require('mongoose');
// var book = require('./Book.model');

// var db = 'mongodb://localhost/test';
// mongoose.connect(db);//,{useNewUrlParser: true,useUnifiedTopology: true });
// const dbdemo = mongoose.connection;
// dbdemo.on('error',console.error.bind(console,"connection error"));
// dbdemo.once('open',()=>console.log("connected"));
var port=8088;

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
// enable CORS without external module
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.get('/',(req,res)=>res.send("I'm here!"));
app.get('/blocks',function(req,res){
//     res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    minedChain = {mined:chain.Chain.instance.mining,chain:chain.Chain.instance.chain};
  res.json(minedChain);
});
// app.get('/books/:id',(req,res)=>{
//     book.findOne({
//         _id:req.params.id
//     }).exec(function(err,data){
//         if(err)
//             res.send("Error");
//         else
//             res.json(data);
//     })
// })

// app.post('/book',function(req,res){
//     let newbook = new book();
//     newbook.title=req.body.title;
//     newbook.author=req.body.author;
//     newbook.category=req.body.category;
//     newbook.published=req.body.published;
//     newbook.save((err,b)=>{
//         if(err)
//             res.send("Error while saving");
//         else
//             res.send(b);
//     });
// });
app.post('/crWlt',(req,res)=>{
    const name = req.body.name;
    let sen = {privateKey:undefined,publicKey:undefined};
    const satoshi = new Wallet(sen);
    const pbk = satoshi.publicKey;
    const pvk = satoshi.privateKey;
    res.json({PublicKey:pbk, PrivateKey:pvk});
})
app.post('/mine',(req,res)=>{
    const amt = req.body.amt;
    let sen=undefined;
    if(typeof req.body.pvK!==undefined && typeof req.body.pbk!==undefined)
        sen = {privateKey:req.body.pvK,publicKey:req.body.pbK};
    const rec = req.body.recKey;

})
app.post('/send',(req,res)=>{
    // const satoshi = new Wallet();
    // res.header("Access-Control-Allow-Origin", req.get('origin'));
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let values = JSON.parse(Object.keys(req.body)[0]);
    const amt = values.amt;
    let sen={privateKey:req.body.pvK,publicKey:req.body.pbK};
    // if(req.body.pvK!==undefined && req.body.pbk!==undefined)
    //     sen = {privateKey:req.body.pvK,publicKey:req.body.pbK};
    const rec = values.recKey;
    console.log(values.amt);
    const satoshi = new Wallet(sen);
    const t = satoshi.sendMoney(amt,rec);
    res.json(t);
    // book.create(req.body,(err,b)=>{
    //     if(err)
    //         res.send("error while saving");
    //     else
    //         res.send(b);
    // });
});
// app.put('/book/:id',(req,res)=>{
//     book.findOneAndUpdate({
//         _id:req.params.id
//     },{$set:{title:req.body.title}},{upsert:true},
//     function(err,newBook){
//         if(err)
//             res.send("Could not update");
//         else
//             res.send(newBook);
//     }
//     );
// })
// app.delete('/book/:id',(req,res)=>{
//     book.findOneAndRemove({
//         _id:req.params.id
//     },function(err,data){
//         if(err)
//             res.send("error while delete");
//         else
//             res.send(data);
//     });
// })
// const hlt = new book({title:'Study of brain',author:'Matt G',category:'Health'});
// hlt.save();
app.listen(port,()=>console.log(`App listening on ${port}`));