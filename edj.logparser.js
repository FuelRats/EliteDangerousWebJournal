var edu_logparser = {
  parseLogLine: function (line) {
    if (isJson(line)) {
      var logItem = JSON.parse(line);
      console.log(logItem);
      switch (logItem.event) {
        case 'LoadGame':
          delete logItem.event;
          delete logItem.timestamp;
          edjdata.player.cmdr = logItem;
          break;
        case 'Location':
          edjdata.player.pos = logItem.StarSystem + (logItem.StationName != undefined ? ', ' + logItem.StationName : '');
          break;
        case 'FSDJump':
          edjdata.player.pos = logItem.StarSystem;
          break;
        case 'Docked':
          edjdata.player.pos = logItem.StarSystem + (logItem.StationName != undefined ? ', ' + logItem.StationName : '');
          break;
        case 'Rank':
          edjdata.player.rank.cqc.rank = logItem.CQC;
          edjdata.player.rank.combat.rank = logItem.Combat;
          edjdata.player.rank.empire.rank = logItem.Empire;
          edjdata.player.rank.explore.rank = logItem.Explore;
          edjdata.player.rank.federation.rank = logItem.Federation;
          edjdata.player.rank.trade.rank = logItem.Trade;
          break;
        case 'Progress':
          edjdata.player.rank.cqc.progress = logItem.CQC;
          edjdata.player.rank.combat.progress = logItem.Combat;
          edjdata.player.rank.empire.progress = logItem.Empire;
          edjdata.player.rank.explore.progress = logItem.Explore;
          edjdata.player.rank.federation.progress = logItem.Federation;
          edjdata.player.rank.trade.progress = logItem.Trade;
          break;
      }
    }
  }
};