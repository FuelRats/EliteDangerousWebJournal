edjLogparser = {
  parseLogLine(line) {
    if (edj.isJson(line)) {
      const logItem = JSON.parse(line);
      console.log(logItem);
      switch (logItem.event) {
        case 'LoadGame':
          delete logItem.event;
          delete logItem.timestamp;
          edjdata.player.cmdr = logItem;
          edjdata.player.fuel.max = logItem.FuelCapacity;
          edjdata.player.fuel.current = logItem.FuelLevel;
          edjdata.gamemode = logItem.GameMode;
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
          edjdata.player.pos.starposition = null;
          edjdata.player.pos.bodytype = null;
          edjdata.player.pos.scoopable = edScoopables.findIndex((item) => item === logItem.StarClass) !== -1;
          break;
        case 'FSDJump':
          edjdata.player.pos.starsystem = logItem.StarSystem;
          edjdata.player.pos.docked = false;
          edjdata.player.pos.starposition = logItem.StarPos;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          edjdata.player.fuel.current = logItem.FuelLevel;
          break;
        case 'FuelScoop':
          edjdata.player.fuel.current = logItem.Total;
          break;
        case 'RefuelAll':
          edjdata.player.fuel.current = edjdata.player.fuel.max;
          break;
        case 'SupercruiseEntry':
          edjdata.player.pos.docked = false;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          edjdata.player.pos.supercruise = true;
          break;
        case 'SupercruiseExit':
          edjdata.player.pos.docked = false;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          edjdata.player.pos.supercruise = false;
          break;
        case 'Undocked':
          edjdata.player.pos.docked = false;
          edjdata.player.pos.body = null;
          edjdata.player.pos.bodytype = null;
          break;
        case 'Docked':
          edjdata.player.pos.starsystem = logItem.StarSystem;
          edjdata.player.pos.docked = true;
          edjdata.player.pos.body = logItem.StationName;
          edjdata.player.pos.bodytype = logItem.StationType;
          edjdata.player.pos.supercruise = false;
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
        default:
          break;
      }
    }
  },
};
