var loaded_reporter;

function push_reporter() {
    if (loaded_reporter) {
        return 0;
    }

    loaded_reporter = true;

    function report_to_reporter() {
        if (model.serverMode() != "playing") {
            setTimeout(report_to_reporter, 2000)
            return 0;
        }

        var report = {
            reporter_name: model.playerName(),
            reporter_id: model.uberId(),
            report_timestamp: Date.now(),
            sandbox: model.gameOptions.sandbox(),
            dynamic_alliances: model.gameOptions.dynamic_alliances(),
            commanders: model.playerData().commanders,
            alliance_id: [],
            alliance_length: [],
            ai: [],

        };

        for (var player of model.players()) {
            report.alliance_id.push(player.alliance_group);
            report.ai.push(player.ai);
            report.alliance_length.push(player.allies.length);
        }

        if (model.isSpectator()) {
            report.army_index = -1;
        } else {
            report.army_index = model.armyIndex();
        }

        if (typeof(model.lobbyId()) === "undefined") {
            report.lobby_id = "no lobbyid";
        } else {
            report.lobby_id = model.lobbyId();
        }

        var report_string = JSON.stringify(report);

        // console.log(report_string);
        $.post("http://pa.reckoner.info/api/reporter", report_string)

        return 0;
    }

    report_to_reporter();
    return 0;
}

push_reporter();
