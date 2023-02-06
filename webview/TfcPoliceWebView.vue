<template>
    <div class="example-wrapper">
        <div class="toptions mr-2">
            <h2 class="mb-10 mt-2" style="width: 50%">LSPD - Computer</h2>
            <Button color="green" @click="refresh" class="mb-10 mt-2 refresh-button">Update</Button>
            <Button color="red" @click="close" class="mb-10 mt-2 ml-2 close-button">Schließen</Button>
        </div>

        <div class="players" v-if="false">
            <div class="player" style="background-color: #1a5b1c">
                <small class="info overline">Bürger</small>
                <small class="info overline">Aktion</small>
            </div>
            <div v-for="(player, index) in players" :key="index" class="player">
                <div class="info overline">
                    <span>{{ player.name }}</span>
                </div>

                <Button
                    color="red"
                    class="refresh-button"
                    title="Wiederbeleben"
                    @click="treatPlayer(player.id, 'reanimate')"
                >
                    <icon :icon="'icon-hospital-cross'" :size="0" class="icon-hospital-cross">icon-hospital-cross</icon>
                </Button>
            </div>
        </div>

        <div style="margin: auto; height: calc(87%); width: calc(99% - 20px)">
            <iframe src="https://copnet.ch/" width="100%" height="100%">its not working...</iframe>
        </div>
    </div>
</template>

<script lang="ts">
import WebViewEvents from '../../../../../src-webviews/src/utility/webViewEvents';

// Other Imports
import { defineComponent, defineAsyncComponent } from 'vue';
import { TfcPolicePlayerInfo } from '../shared/interfaces';
import { TfcPoliceWebViewEvents } from '../shared/viewInfo';
//import {Athena} from "@AthenaServer/api/athena";
import { LocaleController } from '@AthenaShared/locale/locale';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { TFCPOLICE_EVENTS } from '@plugins/tfc-police-job/server/src/events';

const ComponentName = TfcPoliceWebViewEvents.ViewName;
export default defineComponent({
    name: ComponentName,
    components: {
        // Global Components
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            players: [] as Array<TfcPolicePlayerInfo>,
            treatingOption: '',
        };
    },
    mounted() {
        WebViewEvents.on(TfcPoliceWebViewEvents.ServerToWebView.REFRESH_PLAYERS, this.loadPlayers);
        WebViewEvents.on(TfcPoliceWebViewEvents.ClientToWebView.LOAD_PLAYERS, this.loadPlayers);
        WebViewEvents.emitReady(TfcPoliceWebViewEvents.ViewName);

        // Do not load example data.
        if ('alt' in window) {
            return;
        }

        // Load example data...
        this.loadPlayers([
            { name: 'Johnny_Dillinger', ping: 25, id: 0 },
            { name: 'Ivy_Vilachi', ping: 34, id: 1 },
            { name: 'Ivan_Vilcaova', ping: 99, id: 2 },
            { name: 'Bobby_Burn', ping: 55, id: 3 },
            { name: 'Bob_Burns', ping: 55, id: 4 },
            { name: 'Carl_Burnham', ping: 55, id: 5 },
            { name: 'Konnie_Burnham', ping: 55, id: 6 },
            { name: 'Annie_Adenson', ping: 55, id: 7 },
        ]);
    },
    methods: {
        close() {
            WebViewEvents.emitClose();
        },
        loadPlayers(players: TfcPolicePlayerInfo[]) {
            this.players = players;
        },
        kick(id: number) {
            WebViewEvents.emitServer(TfcPoliceWebViewEvents.WebViewToServer.KICK_PLAYER, id);
        },
        refresh() {
            WebViewEvents.emitServer(TfcPoliceWebViewEvents.WebViewToServer.REQUEST_REFRESH);
        },
        treatPlayer(targetID: any, treatingOption: string) {
            if (treatingOption === 'reanimate') {
                WebViewEvents.emitServer(TFCPOLICE_EVENTS.TO_SERVER.REANIMATEPLAYER, targetID);
                return;
            }
        },
    },
});
</script>

<style scoped>
.example-wrapper {
    position: fixed;
    justify-content: center;
    align-items: center;
    background: rgba(12, 12, 12, 1) !important;
    height: calc(90vh);
    width: calc(70vw);
    border-radius: 6px;
}

.toptions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
}

.players {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 600px;
    overflow-y: scroll;
}

.player {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
    padding-bottom: 12px;
    padding-top: 12px;
    align-items: center;
}

.player .info {
    display: flex;
    min-width: 300px;
    max-width: 300px;
    justify-content: space-between;
}

.player:nth-child(odd) {
    background: rgba(255, 255, 255, 0.1);
}
</style>
