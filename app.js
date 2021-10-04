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
 *     ######  ##     ##    ###    ##    ## ######## ##        ######  
 *    ##    ## ##     ##   ## ##   ###   ## ##       ##       ##    ## 
 *    ##       ##     ##  ##   ##  ####  ## ##       ##       ##       
 *    ##       ######### ##     ## ## ## ## ######   ##        ######  
 *    ##       ##     ## ######### ##  #### ##       ##             ## 
 *    ##    ## ##     ## ##     ## ##   ### ##       ##       ##    ## 
 *     ######  ##     ## ##     ## ##    ## ######## ########  ######  
 */

const chanels = {
    1: {
        canJoin: true,
        player: {},
    },
    2: {
        canJoin: true,
        player: {},
    },
    3: {
        canJoin: true,
        player: {},
    },
    4: {
        canJoin: true,
        player: {},
    },
}

const gods = []

 /***
 *    ########  ##          ###    ##    ## ######## ########   ######  
 *    ##     ## ##         ## ##    ##  ##  ##       ##     ## ##    ## 
 *    ##     ## ##        ##   ##    ####   ##       ##     ## ##       
 *    ########  ##       ##     ##    ##    ######   ########   ######  
 *    ##        ##       #########    ##    ##       ##   ##         ## 
 *    ##        ##       ##     ##    ##    ##       ##    ##  ##    ## 
 *    ##        ######## ##     ##    ##    ######## ##     ##  ######  
 */
function add_player(client, chanel) {
    chanels[chanel].canJoin = false
    chanels[chanel].player['client'] = client
    chanels[chanel].player['pos'] = { x:0, y:0 }
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
app.ws('/socket/:chanel', (ws, req) => {

    const possible_chanels = [1,2,3,4,"god"]
    const chanel = parseInt(req.params.chanel)
    if(!possible_chanels.includes(chanel)) return ws.send('__invalid_chanel__')

    ws.on('message', (msg) => {

        const json = JSON.parse(msg)
        const code = json.code
        const action = json.action
        const data = json.data

        if(code === "__join__") {
            if(chanel !== "god") {
                if(chanels[chanel].canJoin === true) {
                    add_player(ws, chanel)
                    ws.send(JSON.stringify({ code:"__joined__", data:chanels[chanel].player['pos']}))
                }else{
                    ws.send(JSON.stringify({ code:"__too_many_players__", data:""}))
                }
            }else{
                gods.push(ws)
            }
        }
        else if(code === "__action__") {
            // if(action.length < 1) return ws.send('incorrect input.')

            if(action === "move") {
                chanels[chanel].player['pos'] = data
                console.log(chanels[chanel].player['pos']);
            }

            if(action === "exit") {
                chanels[chanel] = {
                    canJoin: true,
                    player: {},
                }
            }
        }

        gods.forEach(god => {
            god.send(JSON.stringify({ chanel: chanel, msg: msg }))
        })


    })
 
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