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

        const code = get_code(msg)

        /***
         *                            
         *          #  ####  # #    # 
         *          # #    # # ##   # 
         *          # #    # # # #  # 
         *          # #    # # #  # # 
         *     #    # #    # # #   ## 
         *      ####   ####  # #    # 
         *                            
         */
        if(code === "__join__") {
            if(chanel !== "god") {
                if(chanels[chanel].canJoin === true) {
                    add_player(ws, chanel)
                    ws.send("__joined__")
                }else{
                    ws.send("__too_many_players__")
                }
            }else{
                ws.send("__joined_gods__")
                gods.push(ws)
            }
        }
        /***
         *                                 
         *     #    #  ####  #    # ###### 
         *     ##  ## #    # #    # #      
         *     # ## # #    # #    # #####  
         *     #    # #    # #    # #      
         *     #    # #    #  #  #  #      
         *     #    #  ####    ##   ###### 
         *                                 
         */
        else if(code === "__move__") {
            // STRUCTURE
            // __move__|x:10;y:10
            const positions = {}
            const content = get_content(msg)
            const positions_string = content.split(';')
            positions_string.forEach(pos => {
                const p = pos.split(':')
                positions[p[0]] = p[1]
            })
            chanels[chanel].player['pos'] = positions
            ws.send(`__moved__|x:${positions.x};y${positions.y}`)
        }
        /***
         *                                         
         *       ##    ####  ##### #  ####  #    # 
         *      #  #  #    #   #   # #    # ##   # 
         *     #    # #        #   # #    # # #  # 
         *     ###### #        #   # #    # #  # # 
         *     #    # #    #   #   # #    # #   ## 
         *     #    #  ####    #   #  ####  #    # 
         *                                         
         */
        else if(code === "__action__") {

            ws.send('__action_pressed__')

            // if(action === "move") {
            //     chanels[chanel].player['pos'] = data
            // }

            // if(action === "minigame_complete") {
            //     ws.send()
            // }
            
            // if(action === "exit") {
            //     chanels[chanel] = {
            //         canJoin: true,
            //         player: {},
            //     }
            // }

        }

        /***
         *                                                   
         *     #    # # #    # #  ####    ##   #    # ###### 
         *     ##  ## # ##   # # #    #  #  #  ##  ## #      
         *     # ## # # # #  # # #      #    # # ## # #####  
         *     #    # # #  # # # #  ### ###### #    # #      
         *     #    # # #   ## # #    # #    # #    # #      
         *     #    # # #    # #  ####  #    # #    # ###### 
         *                                                   
         */
        else if(code === "__minigame_done__") {
            
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


        gods.forEach(god => {
            god.send(`__channel_${chanel}__|${msg}`)
            // if(chanel !== "god") {
            // }
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

function get_code(string) {
    const code = string.split('|')
    return code[0]
}
function get_content(string) {
    const code = string.split('|')
    return code[1]
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