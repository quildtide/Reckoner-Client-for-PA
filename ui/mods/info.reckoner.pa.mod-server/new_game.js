var loaded_reckoner;

function display_reckoner() {
    const RECKONER_URL = "http://pa.reckoner.info/";

    const BASIC_RATING = RECKONER_URL + "basic_rating/";

    if (loaded_reckoner) {
        return;
    }

    loaded_reckoner = true;

    var ratings = {};

    model.reckoner_ratings = ko.observable( {} );

    function please_work(ready) {
        model.reckoner_ratings()[this.pid] = {rating: ready}
        console.log(this.pid)
        
        model.reckoner_ratings.valueHasMutated();
    }

    function refresh_ratings() {
        var i;
        var j;
        for (i = 0; i < model.armies().length; i++) {
            for (j = 0; j < model.armies()[i].slots().length; j++) {
                var slot = model.armies()[i].slots()[j];
                if (slot.isPlayer() && !(slot.ai())) {
                    $.get(BASIC_RATING + slot.playerId()).then(
                            _.bind(please_work, {pid: slot.playerId()}));
                }
            }
        }
    }

    $('div.slot-player-text.truncate').after(
        '<!-- ko with: model.reckoner_ratings()[slot.playerId()] -->\
        (<span data-bind="text: rating"></span>)\
        <!-- /ko -->');

    setTimeout(refresh_ratings, 2000);

    setInterval(refresh_ratings, 15000)
    
    

}

display_reckoner()

