#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
import * as path from 'path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as serveFavicon from 'serve-favicon'
import * as cors from 'cors'
import * as http from 'http'
import * as os from 'os'
import * as cluster from 'cluster'
import * as mongoose from 'mongoose'

const ENV_CPUS = process.env.NODE_ENV === 'production' ? os.cpus().length : 1,
    log = console.log

export class AdWebServer {
    private app: express.Application
    private server: http.Server
    private port: string | number
    private MONGO_URI: string

    constructor() {
        this.port = process.env.PORT || 4000
        this.app = express()
        this.server = http.createServer(this.app)
        this.MONGO_URI = process.env.MONGO_URI
        this.configs()
        this.routes()
    }

    private configs() {
        this.app.set('view engine', 'pug')
        // this.app.disable('x-powered-by')
        mongoose.connect(this.MONGO_URI, { useNewUrlParser: true }).catch(e => console.log(e))
        this.app.use(cookieParser())
        this.app.use(express.static(path.join(__dirname, '../', 'public')))
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json())
        this.app.use(cors())
        this.app.use(serveFavicon('ads.ico'))
    }
    private routes() {
        // router to handle page view requests
        this.app.use('/page-view', require('../routes/page-routes'))
        // router to handle data requests from advertiser/client
        this.app.use('/api/client', require('../routes/client-routes'))
        // router to handle data requests from publishers
        this.app.use('/api/publisher', require('../routes/publisher-routes'))
        // route all traffic to default page for client-side routing to work
        this.app.use((req, res) => res.render('default', { title: 'Ad Exchange for Publishers | Advertisers' }))
    }
    private normalizePort(port: number) {
        if (typeof port == 'undefined') {
            throw new Error('Expected parameter port number but found none')
        } else if (typeof port == 'function') {
            throw new TypeError('Argument of type function can\'t used as port')
        } else if (typeof port == 'object') {
            throw new TypeError('Argument of type object can\'t be used as port')
        } else if (isNaN(port)) {
            process.exit(1)
        }
        return port
    }
    public async startServer() {
        if (cluster.isMaster) {
            for (let i = 0; i < ENV_CPUS; i++) {
                cluster.fork()
            }
            // spin core on ['disconnect', 'exit']                               
            for await (const event of ['disconnect', 'exit'])
                cluster.on(event, () => cluster.fork())

        } else {
            // @ts-ignore
            let normalizedPort = this.normalizePort(this.port)
            this.server.listen(normalizedPort, () => {
                log(`Server process: ${process.pid} listening on port: ${normalizedPort}`)
            })

            process.on('uncaughtException', async (err) => {
                // @ts-ignore
                if (err.code == 'EADDRINUSE')
                    await this.startServer()
            })
        }
    }
}
