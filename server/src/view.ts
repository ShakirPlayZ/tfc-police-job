import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { command } from '@AthenaServer/decorators/commands';
import { CHARACTER_PERMISSIONS, PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { isFlagEnabled } from '@AthenaShared/utility/flags';
import { TfcPoliceWebViewEvents } from '../../shared/viewInfo';
import { TFCPOLICE_EVENTS } from './events';
import { ANIMATION_FLAGS } from '@AthenaShared/flags/animationFlags';
import sync from '@AthenaClient/extensions/vehicleFuncs/sync';
import { LocaleController } from '@AthenaShared/locale/locale';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { FactionHandler } from '../../../athena-plugin-factions/server/src/handler';
import { TFC_POLICE_JOB_CONFIG } from '../../shared/config';

const InternalFuncs = {
    reanimateplayer(player: alt.Player, id: string) {
        alt.log('REANIMATE player: ', player.name);
        alt.log('REANIMATE target: ', id);

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }
        if (!target.data.isDead) {
            return;
        }
        Athena.player.set.respawned(target, target.pos);
    },
};

export class TfcPoliceWebViewServer {
    static init() {
        console.log(`Commands for TFC PD Job Created`);
        alt.onClient(TfcPoliceWebViewEvents.WebViewToServer.REQUEST_REFRESH, TfcPoliceWebViewServer.handleRefresh);

        alt.onClient(TFCPOLICE_EVENTS.TO_SERVER.REANIMATEPLAYER, InternalFuncs.reanimateplayer);
    }

    static checkConfigPermissions(player: alt.Player): boolean {
        alt.logWarning('tfc-police-job: Checking Permissions...');
        let playerFaction = FactionHandler.get(player.data.faction) ? FactionHandler.get(player.data.faction).name : '';
        let playerIsInFaction = TFC_POLICE_JOB_CONFIG.FACTION_LIST.find((fl) => fl.name === playerFaction)
            ? true
            : false;
        let playerPermission = player.accountData.permissionLevel;
        let playerHasPermission = TFC_POLICE_JOB_CONFIG.PERMISSION_LIST.find((pl) => pl.level === playerPermission)
            ? true
            : false;

        if (TFC_POLICE_JOB_CONFIG.CHECK_FACTIONS && !playerIsInFaction) {
            Athena.player.emit.notification(player, 'You ~r~dont have permission~w~ to perform this action (Faction)');
            alt.logWarning('tfc-police-job: Faction is false');
            return false;
        } else if (TFC_POLICE_JOB_CONFIG.CHECK_PERMISSIONS && !playerHasPermission) {
            Athena.player.emit.notification(
                player,
                'You ~r~dont have permission~w~ to perform this action (Permission)',
            );
            alt.logWarning('tfc-police-job: Permission is false');
            return false;
        }

        alt.logWarning('tfc-police-job: Player has Permission');
        return true;
    }

    @command('pdjob', '/pdjob - Job Menü anzeigen', PERMISSIONS.NONE)
    static handleCommand(player: alt.Player) {
        if (TfcPoliceWebViewServer.checkConfigPermissions(player)) {
            alt.emitClient(
                player,
                TfcPoliceWebViewEvents.ClientServer.OPEN,
                TfcPoliceWebViewServer.getAvailablePlayers(),
            );
        }
    }

    private static handleRefresh(player: alt.Player) {
        //console.log('got refresh event');

        Athena.webview.emit(
            player,
            TfcPoliceWebViewEvents.ServerToWebView.REFRESH_PLAYERS,
            TfcPoliceWebViewServer.getAvailablePlayers(),
        );
    }

    private static getAvailablePlayers(): Array<any> {
        return [...alt.Player.all]
            .filter((x) => x.valid && x.data && x.data._id)
            .map((t) => {
                const id = Athena.systems.identifier.getIdByStrategy(t);
                return {
                    id,
                    name: t.data.name,
                    ping: t.ping,
                };
            });
    }
}
