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
        timer: null,
    },
    2: {
        canJoin: true,
        player: {},
        timer: null,
    },
    3: {
        canJoin: true,
        player: {},
        timer: null,
    },
    4: {
        canJoin: true,
        player: {},
        timer: null,
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
 

// __code__|data


//sockets
app.ws('/socket/:chanel', (ws, req) => {

    const possible_chanels = ["1","2","3","4","god"]
    const chanel = req.params.chanel
    if(!possible_chanels.includes(chanel)) return ws.send('__invalid_chanel__')

    ws.on('message', (msg) => {

        if(isJSON(msg)) {
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
    
                if(action === "move") {
                    chanels[chanel].player['pos'] = data
                }

                if(action === "minigame_complete") {
                    ws.send()
                }
                
                if(action === "exit") {
                    chanels[chanel] = {
                        canJoin: true,
                        player: {},
                    }
                }

            }
            else if(code === "__ping__") {
                clearTimeout(chanels[chanel].timer)
                ws.send('__pong__')

                chanels[chanel].timer = setTimeout(() => {
                    ws.send('__kill__')
                    chanels[chanel] = {
                        canJoin: true,
                        player: {},
                        timer: null
                    }
                }, 1000);
            }

        } else {
            ws.send(msg)
        }



        gods.forEach(god => {
            god.send(JSON.stringify({ chanel: chanel, msg: msg }))
        })


    })
 
 })

 /***
 *    ##     ## ######## #### ##        ######  
 *    ##     ##    ##     ##  ##       ##    ## 
 *    ##     ##    ##     ##  ##       ##       
 *    ##     ##    ##     ##  ##        ######  
 *    ##     ##    ##     ##  ##             ## 
 *    ##     ##    ##     ##  ##       ##    ## 
 *     #######     ##    #### ########  ######  
 */

function isJSON(string) {
    try {
        JSON.parse(string)
    } catch (error) {
        return false
    }
    return true
}
 
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