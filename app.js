const express = require('express');
const app = express();
const port = 3000;
const connect = require("./schemas");
connect();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const Error = require("./schemas/Error.js");

const CommentRouter = require("./routes/comment.js");
const postRouter = require("./routes/post.js");
const userRouter = require("./routes/user.js");
const loginRouter = require("./routes/login.js");

app.use(express.json());

app.use((req, res, next) => {
    const date = new Date();
    const clientIp = req.ip;
    const proxyIps = req.ips;
    const params = req.body;

    console.log();
    console.log("=============== [", req.method, "]", req.url, "===============");
    console.log("date: ", date);
    console.log("client Ip: ", clientIp);
    console.log("proxy Ips: ", proxyIps);
    Object.keys(params).forEach((key) => {
        const value = params[key];
        console.log(key, "=", value);
    });
    console.log();
    
    next();
});

app.use("/api", [postRouter, CommentRouter, userRouter, loginRouter]);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//  404 responses
app.use(function(req, res, next) {
    res.status(404).send("404 Not Found");
});

// error-handling middleware
app.use((err, req, res, next) => {
    const clientIp = req.ip;
    const proxyIps = req.ips;

    console.log(err.stack);

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

    res.json({"success": false, "msg": err.message})
       .status(500)
       .send(err.message);
})

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});