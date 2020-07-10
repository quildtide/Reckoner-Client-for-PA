var loaded_reckoner;

function display_reckoner() {
    const RECKONER_URL_3 = "http://pa.reckoner.info/";

    const BASIC_RATING_3 = RECKONER_URL_3 + "basic_rating/";

    if (loaded_reckoner) {
        return;
    }

    loaded_reckoner = true;

    var ratings = {};

    model.reckoner_ratings = ko.observable( {} );

    function please_work(ready) {
        ratings[this.pid] = {rating: ready}
        console.log(this.pid)
    }

    function refresh_ratings() {
        var i;
        var j;
        for (i = 0; i < model.armies().length; i++) {
            for (j = 0; j < model.armies()[i].slots().length; j++) {
                var slot = model.armies()[i].slots()[j];
                if (slot.isPlayer() && !(slot.ai())) {
                    $.get(BASIC_RATING_3 + slot.playerId()).then(
                            _.bind(please_work, {pid: slot.playerId()}));
                }
            }
        }

        model.reckoner_ratings(ratings);
        model.reckoner_ratings.valueHasMutated();
    }

    setInterval(refresh_ratings, 15000)
    
    $('div.slot-player-text.truncate').after(
        '<!-- ko with: model.reckoner_ratings()[slot.playerId()] -->\
        (<span data-bind="text: rating"></span>)\
        <!-- /ko -->');

}

display_reckoner()

