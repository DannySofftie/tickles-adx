import { AdWebServer } from './server'

// start AdServer
(async () => {
    await new AdWebServer().startServer().catch(console.error)
})()
