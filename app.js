// express라는 이름을 갖는 express 모듈
const express = require('express');
// application 객체 반환
const app = express();
const port = 3000;
const connect = require("./schemas");
connect();

const Error = require("./schemas/Error.js");

const goodsRouter = require("./routes/goods");
const CommentRouter = require("./routes/comment");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

// app.set('trust proxy', true);
app.use(express.json());
app.use("/api", [goodsRouter, postRouter, CommentRouter, userRouter]);
// app.use("/api", [goodsRouter]);
// app.use("/api", [postRouter]);
// app.use("/api", [CommentRouter]);
// app.use("/api", [userRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// error-handling middleware
app.use((err, req, res, next) => {
    // handler에서 찍으면 찍히는데 안찍고 error에서 바로 찍으면 안찍히는데?
    const clientIp = req.ip;
    const proxyIps = req.ips;

    // console.log("==================");
    // console.log(err.name);
    // console.log(err.stack);
    // console.log(err.message);
    // console.log("==================");

    try {
        Error.create({
          "clientIp": clientIp,
          "proxyIp" : proxyIps,
          "name"    : err.name,
          "msg"     : err.stack,
          "stack"   : err.message
        })
    } catch(err){
        return
    }

    res.status(500).send(err.message);
})

//  404 responses
app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});