import express from "express"
import session, { MemoryStore } from "express-session"

const mongoose = require("mongoose")
const MongoStore = require('connect-mongo')(session)

/* Middleware and controllers */
import cors from "cors"
import bodyParser from "body-parser"

import * as apiController from "./controllers/api"

import CAS from "./controllers/auth"
import { CASOptionsDev, CASOptionsPro} from "./lib/CASOptions"

/* Initialise app */
const app = express()
app.set("port", process.env.PORT || 8080)

/* Session store */
let store;
if (app.get("env") === 'testing' || process.env.FAS_USE_DEV_MEMSTORE === 'true') {
    // Memorystore for testing environment to avoid mongodb connections
    // NOTE: NOT suitable for production.
    store = new MemoryStore()
}
else { // Use real database connection when not testing.
    app.set("mongourl", "mongodb://localhost:27017/FAS")
    mongoose.promise = Promise
    mongoose.connect(
        app.get("mongourl"), 
        { useNewUrlParser: true , useUnifiedTopology: true }
    );
    store = new MongoStore({
        // connection through mongoose has better connection
        // cleanup than using url: app.get("mongourl")
        mongooseConnection: mongoose.connection
    });
}

/* Set up a session store, exposes req.session. */
app.use( session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : false,
    store             : store
}));


/* Middleware setup */
// exposes json request attributes on req.body
app.use(bodyParser.json())

let casAuth; // initialise depending on environment below

switch (app.get("env")){
    case "production":
        casAuth = CAS(CASOptionsPro) // production settings
        break
    case "testing":
        casAuth = CAS(CASOptionsDev) // development settings
        // this route is for testing
        app.get("/block_unauthorized", casAuth.block, (req,res)=>res.send("Your request was not blocked"))
        break
    default: // development
        const corsOptions = {
            origin: 'http://localhost:3000',  // react frontend during development
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }
        app.use(cors(corsOptions))
        casAuth = CAS(CASOptionsDev) // development settings
        break
}

/* API routes */
app.get("/api/groups", casAuth.block, apiController.getGroups)
app.get("/api/me",  casAuth.block, (req,res) => res.json({name:req.session['cas_user']}))

/* Other routes */
app.get("/login", casAuth.bounce_redirect) // requires 
app.get("/logout", casAuth.logout)
app.get("/", casAuth.bounce, (req,res) => res.send("Temporary homepage"))


export default app
