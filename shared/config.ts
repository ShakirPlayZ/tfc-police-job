export const TFC_POLICE_JOB_CONFIG = {
    //SET PERMISSIONS FOR COMMAND ACCESS HERE
    //CHECK IF PLAYER IS IN ONE OF THE FACTIONS IN FACTION_LIST
    CHECK_FACTIONS: true,
    FACTION_LIST: [
        { name: 'LSPD' }
    ],
    //CHECK SERVER PERMISSION
    CHECK_PERMISSIONS: true,
    PERMISSION_LIST: [
        { name: 'MODERATOR', level: 2 },
        { name: 'ADMIN', level: 4 },
    ],
}
