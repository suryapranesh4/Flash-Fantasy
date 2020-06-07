function add_default_points_to_players(players){
    return new Promise((resolve,reject) => {
        let result = players.map((v)=>{return ({...v,'points':0})});
        console.log("After adding default points to each player",result);
        resolve(result);
    });
}

module.exports = {
    add_default_points_to_players
}