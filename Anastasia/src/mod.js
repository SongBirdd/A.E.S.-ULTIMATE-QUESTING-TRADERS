"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
// New trader settings
const baseJson = __importStar(require("../db/base.json"));
const assortJson = __importStar(require("../db/assort.json"));
class SampleTrader {
    mod;
    logger;
    configServer;
    ragfairConfig;
    constructor() {
        this.mod = "Anastasia";
    }
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        Traders_1.Traders[baseJson._id] = baseJson._id;
        this.setupTraderUpdateTime(traderConfig);
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    postAkiLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const configServer = container.resolve("ConfigServer");
    }
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const jsonUtil = container.resolve("JsonUtil");
        const tables = databaseServer.getTables();
        this.addTraderToDb(baseJson, tables, jsonUtil);
        this.addTraderToLocales(tables, baseJson.name, "Anastasia", baseJson.nickname, baseJson.location, "A Russian girl that provides the best weapons accessories in Tarkov. She don't care if you're BEAR or USEC.");
        this.ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
    registerProfileImage(preAkiModLoader, imageRouter) {
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Anastasia.jpg`);
    }
    setupTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = { traderId: baseJson._id, seconds: 3600 };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    addTraderToDb(Anastasia, tables, jsonUtil) {
        tables.traders[Anastasia._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)),
            base: jsonUtil.deserialize(jsonUtil.serialize(Anastasia)),
            questassort: {
                started: {},
                success: {},
                fail: {}
            }
        };
    }
    addTraderToLocales(tables, fullName, firstName, nickName, location, description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
    addItemToLocales(tables, itemTpl, name, shortName, Description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${itemTpl} Name`] = name;
            locale[`${itemTpl} ShortName`] = shortName;
            locale[`${itemTpl} Description`] = Description;
        }
    }
}
module.exports = { mod: new SampleTrader() };
//# sourceMappingURL=mod.js.map