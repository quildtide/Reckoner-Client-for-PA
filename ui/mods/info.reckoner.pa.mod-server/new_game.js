var loaded_reckoner;

function display_reckoner() {
    if (loaded_reckoner) {
        return;
    }
    
    loaded_reckoner = true;

    // Algorithm from Numerical Recipes in C, 2nd edition, page 221
    // Thanks to https://github.com/errcw/gaussian for direction
    function error_func(x) {
        var z = Math.abs(x)
        var t = 1 / (1 + 0.5 * z);
        var ans = t * Math.exp(-z * z - 1.26551223 + t * (
            1.00002368 + t * (
                0.37409196 + t * (
                    0.09678418 + t * (
                        -0.18628806 + t * (
                            0.27886807 + t * (
                                -1.13520398 + t * (
                                    1.48851587 + t * (
                                        -0.82215223 + t * 0.17087277
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ))

        return (x > 0) ? (1 - ans) : (-1 - ans)
    };

    function normal_cdf(mu, sd, x) {
        return 0.5 * (1 + error_func((x - mu) / (sd * Math.SQRT2)))
    }

    // From Soranzo and Epure section 3.2
    function normal_quantile(mu, sd, p) {
        var p_e = (p > 0.5) ? p : (1 - p)

        var x_e = 10 / Math.log(41) * log(1 - (log(-log(p_e)) / log(2)) / log(22))

        return (p > 0.5) ? x_e : -x_e
    }

    const RECKONER_URL = "http://pa.reckoner.info/";

    const RATING_URL = RECKONER_URL + "api/cached_rating";

    const DEFAULT_RATING = {
        "rating_1v1": 1500.0,
        "rating_team": 1500.0,
        "rating_ffa": 1500.0,
        "rating_multiteam": 1500.0,
        "sd_1v1": 350.0,
        "sd_team": 350.0,
        "sd_ffa": 350.0,
        "sd_multiteam": 350.0
    }

    model.reckoner_ratings = ko.observable( {
        "pa inc": {}, 
        "aiDiff": {}, 
        "EMPTY": {
            "EMPTY": DEFAULT_RATING
        }
    } );

    model.reckoner_loading = ko.observable(false);

    model.reckoner_uberid_matcher = {};

    model.player_type = function (slot) {
        if (!slot.isPlayer()) {
            return "EMPTY"
        } else if (slot.ai()) {
            return "aiDiff"
        } else {
            return "pa inc"
        }
    }

    model.player_id = function (slot) {
        if (!slot.isPlayer()) {
            return "EMPTY"
        } else if (slot.ai()) {
            return slot.aiPersonality()
        } else {
            var pid = slot.playerId()
            if (pid === slot.playerName()) {
                return model.reckoner_uberid_matcher[pid]
            } else {
                return pid
            }
        }
    }

    model.teamCount = ko.computed(function() {
        return model.armies().length
    })

    model.meanTeamSize = ko.computed(function() {
        if (model.isFFAGame()) {
            return true
        } else {
            return model.playerCount() / model.teamCount()
        }
    })

    model.reckoner_game_type = ko.computed(function() {
        if (model.isFFAGame()) {
            if (model.teamCount() == 2) {
                return "_1v1"
            } else {
                return "_ffa"
            }
        } else {
            if (model.teamCount() == 2) {
                return "_team"
            } else {
                return "_multiteam"
            }
        }
    })

    model.reckoner_rating_type = ko.computed(function() {
        return "rating" + model.reckoner_game_type()
    })

    model.reckoner_sd_type = ko.computed(function() {
        return "sd" + model.reckoner_game_type()
    })

    model.reckoner_player_ratings = ko.computed(function() {
        out = {}
        for (var player_type in model.reckoner_ratings()) {
            out[player_type] = {}
            for (var player_id in model.reckoner_ratings()[player_type]) {
                var ratings = model.reckoner_ratings()[player_type][player_id]
                out[player_type][player_id] = {
                    "mean": ratings[model.reckoner_rating_type()],
                    "sd": ratings[model.reckoner_sd_type()] 
                }
            }
        }
        return out
    })

    model.reckoner_rating_known = function (slot) {
        return (model.player_id(slot) in model.reckoner_ratings()[model.player_type(slot)])
    }

    var change_occured = true;
    var instance_count = 0;

    function check_loading() {
        if (instance_count == 0) {
            model.reckoner_loading(false);
        }
        return;
    }

    function flag_change() {
        change_occured = true;
        model.reckoner_loading(true);
    }

    function handle_result(result) {
        new_ratings = JSON.parse(result).ratings
        console.log(new_ratings)
        for (r of new_ratings) {
            model.reckoner_ratings()[r.player_type][r.player_id] = r;
        }
        model.reckoner_ratings.valueHasMutated();
        instance_count -= 1;
        check_loading();
        // console.log(model.reckoner_ratings())
        // model.reckoner_ratings.valueHasMutated();
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

        var player_types = [];
        var player_ids = [];
        var count_unknown_id = 0;

        for (var i = 0; i < model.armies().length; i++) {
            var team_size = model.armies()[i].slots().length
            for (var j = 0; j < team_size; j++) {
                var slot = model.armies()[i].slots()[j];
                if (model.reckoner_rating_known(slot)) {
                    continue
                }

                if (!slot.ai()) {
                    var pid = slot.playerId()
                    if (pid === slot.playerName()) {
                        // playerId is not an uberid (!!)
                        if (model.reckoner_uberid_matcher[pid]) {
                            // we've cached the result already in this case
                            player_types.push("pa inc");
                            player_ids.push(model.reckoner_uberid_matcher[pid]);
                        } else {
                            count_unknown_id += 1
                            api.net.ubernet('/GameClient/UserId?' + $.param({TitleDisplayName: pid}), 'GET', 'text').then(
                                _.bind(
                                    function (result) {
                                        model.reckoner_uberid_matcher[this.pid] = JSON.parse(result).UberId;
                                    }, {pid: pid})
                            );
                        }
                    } else {
                        player_types.push("pa inc");
                        player_ids.push(pid)
                    }
                }
                else {
                    player_types.push("aiDiff");
                    player_ids.push(slot.aiPersonality())
                }
            }
        }

        if (count_unknown_id == 0) {
            change_occured = false
        }
        
        if (player_types.length > 0) {
            try {
                $.get(RATING_URL, "context=" + encodeURIComponent(JSON.stringify({
                    "player_types": player_types, 
                    "player_ids": player_ids
                }))).then(handle_result);
            }
            catch(err) {
                instance_count -= 1;
                check_loading();
            }
        } else {
            instance_count -= 1;
            check_loading();
        }

    }
        

    $('div.slot-player-text.truncate').after(
        '<!-- ko with: model.reckoner_player_ratings()[model.player_type(slot)][model.player_id(slot)] -->\
        (<span data-bind="text: (mean - 1500).toFixed(0)"></span> &#xB1 <span data-bind="text: (2 * sd).toFixed(0)"></span>)\
        <!-- /ko -->\
        <!-- ko ifnot: model.reckoner_rating_known(slot) -->\
        (FETCHING RATING)\
        <!-- /ko -->');
        
    // $('span.army-id').after(
    //     '<!-- ko with: model.reckoner_ratings()["team_stats"][$index()] -->\
    //     &#8212 EFFECTIVE RATING: (<span data-bind="text: team_rating_mean.toFixed(0) - 1500"></span> &#xB1 <span data-bind="text: (2 * team_rating_std).toFixed(0)"></span>) \
    //     &#8212 <span data-bind="text: (100 * win_chance).toFixed(2)"></span>% CHANCE OF WINNING\
    //     <!-- /ko -->\
    //     <!-- ko if: model.reckoner_loading() -->\
    //     <img class="working small" src="coui://ui/main/shared/img/working.svg" data-bind="tooltip: "Fetching Ratings"" />\
    //     <!-- /ko -->');  


    model.armies.subscribe(flag_change);
    model.armies.subscribe(function() {
        for (var i = 0; i < model.armies().length; i++) {
            army = model.armies()[i];
            army.numberOfEmptySlots.subscribe(flag_change);
            army.numberOfSlots.subscribe(flag_change);
            for (var j = 0; j < army.slots().length; j++) {
                slot = army.slots()[j];
                slot.aiPersonality.subscribe(flag_change);
            }
            army.numberOfSlots.subscribe(function() {
                for (var j = 0; j < army.slots().length; j++) {
                    slot = army.slots()[j];
                    slot.aiPersonality.subscribe(flag_change);
                }
            })
        }
    })

    setInterval(refresh_ratings, 1000)
}

display_reckoner()

