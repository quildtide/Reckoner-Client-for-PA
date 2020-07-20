var loaded_reckoner;

function display_reckoner() {
    const RECKONER_URL = "http://pa.reckoner.info/";

    const BASIC_RATING = RECKONER_URL + "basic_rating/";

    if (loaded_reckoner) {
        return;
    }

    loaded_reckoner = true;

    model.reckoner_ratings = ko.observable( {} );

    var change_occured = true;

    function flag_change() {
        change_occured = true;
    }

    function please_work(ready) {
        model.reckoner_ratings()[this.pid] = {rating: ready}
        console.log(this.pid)
        
        model.reckoner_ratings.valueHasMutated();
    }

    function i_hate_js(res) {
        $.get(BASIC_RATING + JSON.parse(res).UberId).then(
            _.bind(please_work, {pid: this.pid})
        )
    }
    function refresh_ratings() {
        if (!change_occured) {
            return;
        }
        var i;
        var j;
        for (i = 0; i < model.armies().length; i++) {
            for (j = 0; j < model.armies()[i].slots().length; j++) {
                var slot = model.armies()[i].slots()[j];
                if (slot.isPlayer() && !(slot.ai())) {
                    var pid = slot.playerId()
                    if (isNaN(pid)) {
                        api.net.ubernet('/GameClient/UserId?' + $.param({TitleDisplayName: pid }), 'GET', 'text').then(
                            _.bind(i_hate_js, {pid: pid})
                        );
                    } else {
                        $.get(BASIC_RATING + pid).then(
                            _.bind(please_work, {pid: pid})
                        );
                    }

                    
                }
            }
        }
        change_occured = false
    }

    $('div.slot-player-text.truncate').after(
        '<!-- ko with: model.reckoner_ratings()[slot.playerId()] -->\
        (<span data-bind="text: rating"></span>)\
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

    setInterval(refresh_ratings, 2000)
}

display_reckoner()

