edjLogparser = {
    parseLogLine(line) {
        if (edj.isJson(line)) {
            const logItem = JSON.parse(line);
            switch (logItem.event) {
                case 'Continued':
                    // TODO: Handle continued logs
                    break;
                case 'AfmuRepairs':
                case 'ApproachBody':
                case 'ApproachSettlement':
                case 'BuyAmmo':
                case 'BuyDrones':
                case 'Bounty':
                case 'BuyExplorationData':
                case 'BuyTradeData':
                case 'CapShipBond':
                case 'Cargo':
                case 'CargoDepot':
                case 'ChangeCrewRole':
                case 'CollectCargo':
                case 'CommunityGoal':
                case 'CommunityGoalDiscard':
                case 'CommunityGoalJoin':
                case 'CommunityGoalReward':
                case 'ClearSavedGame':
                case 'CrewAssign':
                case 'CrewFire':
                case 'CrewHire':
                case 'CrewLaunchFighter':
                case 'CrewMemberJoins':
                case 'CrewMemberQuits':
                case 'CrewMemberRoleChange':
                case 'DatalinkScan':
                case 'DatalinkVoucher':
                case 'DataScanned':
                case 'DockFigher':
                case 'DockSRV':
                case 'DiscoveryScan':
                case 'EjectCargo':
                case 'EndCrewSession':
                case 'EngineerApply':
                case 'EngineerContribution':
                case 'EngineerCraft':
                case 'EngineerLegacyConvert':
                case 'EngineerProgress':
                case 'FactionKillBond':
                case 'FetchRemoteModule':
                case 'FighterDestroyed':
                case 'FighterRebuilt':
                case 'Fileheader':
                case 'Friends':
                case 'Interdiction':
                case 'HeatWarning':
                case 'JetConeBoost':
                case 'JetConeDamage':
                case 'JoinACrew':
                case 'KickCrewMember':
                case 'MarketBuy':
                case 'MarketSell':
                case 'MassModuleStore':
                case 'MiningRefined':
                case 'MissionAccepted':
                case 'MissionAbandoned':
                case 'MissionCompleted':
                case 'MissionFailed':
                case 'MissionRedirected':
                case 'Missions':
                case 'ModuleInfo':
                case 'ModuleBuy':
                case 'ModuleRetrieve':
                case 'ModuleSell':
                case 'ModuleSellRemote':
                case 'ModuleStore':
                case 'ModuleSwap':
                case 'Music':
                case 'NavBeaconScan':
                case 'NewCommander':
                case 'NpcCrewPaidWage':
                case 'NpcCrewRank':
                case 'LaunchDrone':
                case 'LaunchFighter':
                case 'LaunchSRV':
                case 'LeaveBody':
                case 'Outfitting':
                case 'Passengers':
                case 'PayBounties':
                case 'PayFines':
                case 'PayLegacyFines':
                case 'Powerplay':
                case 'PowerplayCollect':
                case 'PowerplayDefect':
                case 'PowerplayDeliver':
                case 'PowerplayFastTrack':
                case 'PowerplayJoin':
                case 'PowerplayLeave':
                case 'PowerplaySalary':
                case 'PowerplayVote':
                case 'PowerplayVoucher':
                case 'Promotion':
                case 'PVPKill':
                case 'QuitACrew':
                case 'RebootRepair':
                case 'RedeemVoucher':
                case 'Repair':
                case 'RepairDrone':
                case 'RepairAll':
                case 'Reputation':
                case 'Ressurect':
                case 'RestockVehicle':
                case 'Scan':
                case 'Scanned':
                case 'ScientificResearch':
                case 'Screenshot':
                case 'SearchAndRescue':
                case 'SellExplorationData':
                case 'SellDrones':
                case 'SellShipOnRebuy':
                case 'SetUserShipName':
                case 'Shipyard':
                case 'ShipyardBuy':
                case 'ShipyardNew':
                case 'ShipyardSell':
                case 'ShipyardTransfer':
                case 'ShipyardSwap':
                case 'ShipTargeted':
                case 'Shutdown':
                case 'Statistics':
                case 'StoredShips':
                case 'StoredModules':
                case 'TechnologyBroker':
                case 'Touchdown':
                case 'UnderAttack':
                case 'USSDrop':
                case 'VehicleSwitch':
                    // We'll just ignore these events, since they contain nothing funny at the moment.
                    break;
                case 'Died':
                    // TODO: Notification about client dead
                    break;
                case 'EscapeInterdiction':
                    break;
                case 'HeatDamage':
                    break;
                case 'HullDamage':
                    break;
                case 'Interdicted':
                    break;
                case 'Commander':
                    edjdata.player.cmdr = {
                        Commander: logItem.Name
                    };
                    break;
                case 'CommitCrime':
                    break;
                case 'CockpitBreached':
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
                case 'ShieldState':
                    break;
                case 'FuelScoop':
                    edjdata.player.fuel.current = logItem.Total;
                    break;
                case 'RefuelAll':
                    edjdata.player.fuel.current = edjdata.player.fuel.max;
                    break;
                case 'RefuelPartial':
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
                case 'DockingCancelled':
                    break;
                case 'DockingDenied':
                    break;
                case 'DockingTimeout':
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
                case 'SRVDestroyed':
                    break;
                case 'SendText':
                case 'ReceiveText':
                    // TODO: Add a chatbox, where you can see all communication
                    break;
                case 'Materials':
                    let hasIronForSynth = false;
                    let hasNickelForSynth = false;

                    for (let index = 0; index < logItem.Raw.length; index++) {
                        const element = logItem.Raw[index];
                        if (element.Name === 'iron' && element.Count >= 2) {
                            hasIronForSynth = true;
                        } else if (element.Name === 'nickel' && element.Count >= 1) {
                            hasNickelForSynth = true;
                        }
                    }

                    edjdata.cansynthesizelifesupport = (hasIronForSynth && hasNickelForSynth);
                    edjdata.player.materials = {
                        ...edjdata.player.materials,
                        ...{
                            Raw: logItem.Raw,
                            Manufactured: logItem.Manufactured
                        }
                    };
                    break;
                case 'SelfDestruct':
                    break;
                case 'SystemsShutdown':
                    break;
                case 'MaterialTrade':
                    break;
                case 'MaterialCollected':
                    // TODO: Increase the stored materials, and update the `cansynthesizelifesupport`-variable
                    console.log(logItem);
                    break;
                case 'MaterialDiscovered':
                    break;
                case 'MaterialDiscarded':
                    break;
                case 'Synthesis':
                    // TODO: Decrease the stored materials, and update the `cansynthesizelifesupport`-variable
                    console.log(logItem);
                    break;
                case 'WingAdd':
                    break;
                case 'WingInvite':
                    break;
                case 'WingLeave':
                    break;
                case 'WingJoin':
                    break;
                default:
                    console.log(line);
                    break;
            }
        }
    },
};