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
          edjdata.player.pos.starsystem = logItem.StarSystem;
          edjdata.player.pos.docked = logItem.Docked;
          edjdata.player.pos.starposition = logItem.StarPos;
          edjdata.player.pos.body = logItem.Body;
          edjdata.player.pos.bodytype = logItem.BodyType;
          break;
        case 'StartJump':
          edjdata.player.pos.starsystem = logItem.StarSystem;
          edjdata.player.pos.docked = false;
          edjdata.player.pos.body = null;
          edjdata.player.pos.starposition = null
          edjdata.player.pos.bodytype = null;
          edjdata.player.pos.scoopable = ed_scoopables.findIndex(function (item) { return item == logItem.StarClass; }) !== -1;
          break;
        case 'FSDJump':
          edjdata.player.pos.starsystem = logItem.StarSystem;
          edjdata.player.pos.docked = false;
          edjdata.player.pos.starposition = logItem.StarPos;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          break;
        case 'SupercruiseExit':
          edjdata.player.pos.docked = false;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          break;
        case 'Undocked':
          edjdata.player.pos.docked = false;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          break;
        case 'Docked':
          edjdata.player.pos.starsystem = logItem.StarSystem;
          edjdata.player.pos.docked = true;
          edjdata.player.pos.starposition = logItem.StarPos;
          edjdata.player.pos.body = logItem.StationName;
          edjdata.player.pos.bodytype = logItem.StationType;
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