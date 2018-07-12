edjLogparser = {
  parseLogLine(line) {
    if (edj.isJson(line)) {
      const logItem = JSON.parse(line);
      switch (logItem.event) {
        case 'Fileheader':
        case 'ShipTargeted':
        case 'CollectCargo':
        case 'UnderAttack':
        case 'NpcCrewPaidWage':
        case 'Missions':
        case 'Repair':
        case 'BuyDrones':
        case 'Reputation':
        case 'MissionAccepted':
        case 'Shutdown':
        case 'SellExplorationData':
        case 'StoredShips':
        case 'Statistics':
        case 'DiscoveryScan':
        case 'Scan':
        case 'Screenshot':
        case 'ModuleInfo':
        case 'JetConeBoost':
        case 'Powerplay':
        case 'HeatWarning':
        case 'RebootRepair':
        case 'AfmuRepairs':
          // We'll just ignore these events, since they contain nothing funny at the moment.
        break;
        case 'Commander':
        edjdata.player.cmdr = { Commander: logItem.Name };
        break;
        case 'LoadGame':
          delete logItem.event;
          delete logItem.timestamp;
          edjdata.player.cmdr = logItem;
          if (typeof logItem.FuelCapacity !== 'undefined') {
            edjdata.player.fuel.max = logItem.FuelCapacity;
          }
          if (typeof logItem.FuelLevel !== 'undefined') {
            edjdata.player.fuel.current = logItem.FuelLevel;
          }
          edjdata.gamemode = logItem.GameMode;
          break;
        case 'Location':
          edjdata.player.pos = {
            ...edjdata.player.pos,
            ...logItem
          };
          break;
        case 'StartJump':
        edjdata.player.pos = {
          ...edjdata.player.pos,
          ...logItem
        };
          edjdata.player.pos.Docked = false;
          edjdata.player.pos.Body = null;
          edjdata.player.pos.StarPos = null;
          edjdata.player.pos.BodyType = null;
          edjdata.player.pos.Scoopable = edScoopables.findIndex((item) => item === logItem.StarClass) !== -1;
          break;
        case 'FSDJump':
        edjdata.player.pos = {
          ...edjdata.player.pos,
          ...logItem
        };
          edjdata.player.pos.Docked = false;
          edjdata.player.pos.Body = null;
          edjdata.player.pos.BodyType = null;
          if (typeof logItem.FuelLevel !== 'undefined') {
            edjdata.player.fuel.current = logItem.FuelLevel;
          }
          break;
        case 'Shipyard':
        edjdata.player.pos = {
          ...edjdata.player.pos,
          ...{
            StarSystem: logItem.StarSystem,
            Body: logItem.StationName
          }
        };
          break;
        case 'FuelScoop':
          edjdata.player.fuel.current = logItem.Total;
          break;
        case 'RefuelAll':
          edjdata.player.fuel.current = edjdata.player.fuel.max;
          break;
        case 'SupercruiseEntry':
          edjdata.player.pos.Docked = false;
          edjdata.player.pos.Body = null;
          edjdata.player.pos.BodyType = null;
          edjdata.player.pos.SuperCruise = true;
          break;
        case 'SupercruiseExit':
          edjdata.player.pos.Docked = false;
          edjdata.player.pos.Body = null;
          edjdata.player.pos.BodyType = null;
          edjdata.player.pos.SuperCruise = false;
          break;
        case 'Undocked':
          edjdata.player.pos.Docked = false;
          edjdata.player.pos.Body = null;
          edjdata.player.pos.BodyType = null;
          break;
        case 'Docked':
        edjdata.player.pos = {
          ...edjdata.player.pos,
          ...logItem
        };
          edjdata.player.pos.Docked = true;
          edjdata.player.pos.Body = logItem.StationName;
          edjdata.player.pos.BodyType = logItem.StationType;
          edjdata.player.pos.SuperCruise = false;
          break;
        case 'DockingRequested':
        // TODO: Add notification to client-kiwi that they have reached a station
          break;
        case 'DockingGranted':
        // TODO: See above
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
        case 'Loadout':
          // We want to see what type of ship the user is using.
        break;
        case 'SendText':
        case 'ReceiveText':
          // TODO: Add a chatbox, where you can see all communication
          break;
        case 'Music':
        case 'Friends':
        case 'LaunchDrone':
        case 'FactionKillBond':
        case 'MissionRedirected':
          break;
        case 'Materials':
          let hasIronForSynth = false;
          let hasNickelForSynth = false;

          for (let index = 0; index < logItem.Raw.length; index++) {
            const element = logItem.Raw[index];
            if(element.Name === 'iron' && element.Count >= 2) {
              hasIronForSynth = true;
            } else if(element.Name === 'nickel' && element.Count >= 1) {
              hasNickelForSynth = true;
            }
          }
          
          edjdata.cansynthesizelifesupport = (hasIronForSynth && hasNickelForSynth);
          edjdata.player.materials =  {
            ...edjdata.player.materials,
            ...{
              Raw: logItem.Raw,
              Manufactured: logItem.Manufactured
            }
          };
          break;
        case 'MaterialCollected':
        // TODO: Increase the stored materials, and update the `cansynthesizelifesupport`-variable
        console.log(logItem);
          break;
        case 'Synthesis':
        // TODO: Decrease the stored materials, and update the `cansynthesizelifesupport`-variable
        console.log(logItem);
        break;
        default:
        console.log(line);
          break;
      }
    }
  },
};
