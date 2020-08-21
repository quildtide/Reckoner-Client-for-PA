var loaded_reckoner;

function display_reckoner() {
    if (loaded_reckoner) {
        return;
    }
    
    loaded_reckoner = true;

    const RECKONER_URL = "http://pa.reckoner.info/";

    const RATING_URL = RECKONER_URL + "api/full_rating";

    model.reckoner_ratings = ko.observable( {player_stats: {}, team_stats: {}} );

    model.reckoner_uberid_matcher = {};

    model.reckoner_id = function (slot) {
        if (!slot.isPlayer()) {
            return "EMPTY"
        } else if (slot.ai()) {
            return slot.playerName()
        } else {
            var pid = slot.playerId()
            if (isNaN(pid)) {
                return model.reckoner_uberid_matcher[pid]
            } else {
                return pid
            }
        }
    }

    var change_occured = true;
    var instance_count = 0;

    

    function flag_change() {
        change_occured = true;
    }

    function please_work(result) {
        model.reckoner_ratings(JSON.parse(result))
        change_occured = false
        instance_count -= 1
        // console.log(model.reckoner_ratings())
        // model.reckoner_ratings.valueHasMutated();
    }

    // function i_hate_js(res) {
    //     $.get(BASIC_RATING + JSON.parse(res).UberId).then(
    //         _.bind(please_work, {pid: this.pid})
    //     )
    // }

    function unique_id(slot) {
        return model.reckoner_id(slot);
    }
    
    function refresh_ratings() {
        if (!change_occured) {
            return;
        }
        if (instance_count > 1) {
            // triggers if 2 instances already running
            return;
        }
        instance_count += 1;

        var game_context = {
            team_sizes: [], shared: [], 
            player_types: [], player_ids: [], 
            ecos: [], titans: false, 
            unique_ids: []};

        try {
            game_context.titans = (model.requiredContent()[0] == "PAExpansion1");
        }
        catch(err) {
            game_context.titans = false;
        }

        var i;
        var j;
        var c = 0;
        var known = 0;
        for (i = 0; i < model.armies().length; i++) {
            var shared = model.armies()[i].sharedArmy();
            var team_size = model.armies()[i].slots().length
            game_context.shared[i] = shared;
            game_context.team_sizes[i] = team_size
            for (j = 0; j < team_size; j++) {
                var slot = model.armies()[i].slots()[j];
                game_context.shared[c] = shared;
                if (!slot.isPlayer()) {
                    game_context.player_types[c] = "default";
                    game_context.player_ids[c] = "default";
                    known = known + 1;
                } else if (!slot.ai()) {
                    var pid = slot.playerId()
                    game_context.player_types[c] = "pa inc";
                    if (isNaN(pid)) {
                        if (model.reckoner_uberid_matcher[pid]) {
                            // we've cached the result already in this case
                            game_context.player_ids[c] = model.reckoner_uberid_matcher[pid]
                            known = known + 1;
                        } else {
                            api.net.ubernet('/GameClient/UserId?' + $.param({TitleDisplayName: pid}), 'GET', 'text').then(
                                _.bind(
                                    function (result) {
                                        model.reckoner_uberid_matcher[pid] = JSON.parse(result).UberId;
                                        game_context.player_ids[this.c] = model.reckoner_uberid_matcher[pid];
                                        game_context.unique_ids[this.c] = model.reckoner_uberid_matcher[pid];
                                        known = known + 1;
                                    }, {c: c})
                            );
                        }
                    } else {
                        game_context.player_ids[c] = pid;
                        known = known + 1;
                    }
                }
                else {
                    game_context.player_types[c] = "aiDiff";
                    game_context.player_ids[c] = slot.aiPersonality()
                    known = known + 1;
                }

                if (shared) {
                    // use eco of first slot on team for shared armies
                    var team_first = model.armies()[i].slots()[0]

                    if (team_first.isPlayer()) {
                        game_context.ecos[c] = team_first.serverEconFactor();
                    } 
                    else {
                        game_context.ecos[c] = 1
                    }
                } 
                else if (slot.isPlayer()){
                    // otherwise use this slot's eco
                    game_context.ecos[c] = slot.serverEconFactor();     
                } 
                else {
                    // if player is empty, assume default
                    game_context.ecos[c] = 1;
                }

                game_context.unique_ids[c] = unique_id(slot);
                c = c + 1
            }
        }
        

        function send_reckoner() {
            if (known < c) {
                setTimeout(send_reckoner, 200)
            } else {
                try {
                    $.get(RATING_URL, "context=" + encodeURIComponent(JSON.stringify(game_context))).then(please_work)
                }
                catch(err) {
                    instance_count -= 1;
                }
            }
        }

        send_reckoner()
    }

    $('div.slot-player-text.truncate').after(
        '<!-- ko with: model.reckoner_ratings()["player_stats"][model.reckoner_id(slot)] -->\
        (<span data-bind="text: rating_mean.toFixed(0)"></span> &#xB1 <span data-bind="text: rating_std.toFixed(0)"></span>)\
        <!-- /ko -->');

    $('span.army-id').after(
        '<!-- ko with: model.reckoner_ratings()["team_stats"][$index()] -->\
        &#8212 EFFECTIVE RATING: (<span data-bind="text: team_rating_mean.toFixed(0)"></span> &#xB1 <span data-bind="text: team_rating_std.toFixed(0)"></span>) \
        &#8212 <span data-bind="text: win_chance.toFixed(2)"></span>% CHANCE OF WINNING\
        <!-- /ko -->');  

    // function delayed_refresh_ratings() {
    //     setTimeout(refresh_ratings, 500);
    // }

    // model.isFFAGame.subscribe(refresh_ratings);
    // model.numberOfEmptySlots.subscribe(delayed_refresh_ratings);
    // model.playerCount.subscribe(refresh_ratings);

    model.isFFAGame.subscribe(flag_change);
    model.numberOfEmptySlots.subscribe(flag_change);
    model.playerCount.subscribe(flag_change);

    setInterval(refresh_ratings, 1000)
}

display_reckoner()

