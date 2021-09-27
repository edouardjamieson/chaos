/***
 *    ########  ######## ########  ######## ##    ## ########  ######## ##    ##  ######  #### ########  ######  
 *    ##     ## ##       ##     ## ##       ###   ## ##     ## ##       ###   ## ##    ##  ##  ##       ##    ## 
 *    ##     ## ##       ##     ## ##       ####  ## ##     ## ##       ####  ## ##        ##  ##       ##       
 *    ##     ## ######   ########  ######   ## ## ## ##     ## ######   ## ## ## ##        ##  ######    ######  
 *    ##     ## ##       ##        ##       ##  #### ##     ## ##       ##  #### ##        ##  ##             ## 
 *    ##     ## ##       ##        ##       ##   ### ##     ## ##       ##   ### ##    ##  ##  ##       ##    ## 
 *    ########  ######## ##        ######## ##    ## ########  ######## ##    ##  ######  #### ########  ######  
 */
 const express = require('express')
 const sockets = require('express-ws')
 
 const app = express()
 sockets(app)
 
 let dead_timeout

 /***
 *    ########  ##          ###    ##    ## ######## ########   ######  
 *    ##     ## ##         ## ##    ##  ##  ##       ##     ## ##    ## 
 *    ##     ## ##        ##   ##    ####   ##       ##     ## ##       
 *    ########  ##       ##     ##    ##    ######   ########   ######  
 *    ##        ##       #########    ##    ##       ##   ##         ## 
 *    ##        ##       ##     ##    ##    ##       ##    ##  ##    ## 
 *    ##        ######## ##     ##    ##    ######## ##     ##  ######  
 */
let players = {}
function add_player(client) {
    const player = `player${Object.keys(players).length}`
    players[players] = client
}


 
 /***
  *    ########   #######  ##     ## ######## ########  ######  
  *    ##     ## ##     ## ##     ##    ##    ##       ##    ## 
  *    ##     ## ##     ## ##     ##    ##    ##       ##       
  *    ########  ##     ## ##     ##    ##    ######    ######  
  *    ##   ##   ##     ## ##     ##    ##    ##             ## 
  *    ##    ##  ##     ## ##     ##    ##    ##       ##    ## 
  *    ##     ##  #######   #######     ##    ########  ######  
  */
 
 //sockets
 app.ws('/socket', (ws, req) => {

    ws.on('connection', (client) => {

        if(Object.keys(players).length <= 4) {
            add_player(client)
            ws.send('__join__')
        }else{
            //Si trop de joueur on kickout le joueur qui essaie de se connecter
            ws.send('__kill__:too_many_players')
        }

    })
 
    ws.on('message', (msg) => {
         
         if(msg === '__pong__') {
             clearTimeout(dead_timeout)
             dead_timeout = setTimeout(() => {
                 ws.send('__kill__')
             }, 2000);
         }
 
     })
 
     setInterval(() => {
         ws.send('__ping__')  
     }, 1000);
 
 })
 
 //public
 app.use(express.static('public'))
 
 /***
  *     ######  ######## ########  ##     ## ######## ########  
  *    ##    ## ##       ##     ## ##     ## ##       ##     ## 
  *    ##       ##       ##     ## ##     ## ##       ##     ## 
  *     ######  ######   ########  ##     ## ######   ########  
  *          ## ##       ##   ##    ##   ##  ##       ##   ##   
  *    ##    ## ##       ##    ##    ## ##   ##       ##    ##  
  *     ######  ######## ##     ##    ###    ######## ##     ## 
  */
 app.listen(process.env.PORT || 3000, () => {
     console.log("Started server");
 })