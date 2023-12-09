import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { IQuestConfig } from "@spt-aki/models/spt/config/IQuestConfig";

// New trader settings
import * as baseJson from "../db/base.json";
import * as assortJson from "../db/assort.json";

class SampleTrader implements IPreAkiLoadMod, IPostDBLoadMod {
    mod: string
    logger: ILogger
    private configServer: ConfigServer;
    private ragfairConfig: IRagfairConfig; 

    constructor() {
        this.mod = "Svetlana";
    }

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        
        this.registerProfileImage(preAkiModLoader, imageRouter);
        Traders[baseJson._id] = baseJson._id
        this.setupTraderUpdateTime(traderConfig);
        
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }

    public postAkiLoad(container: DependencyContainer): void {

        const logger = container.resolve<ILogger>("WinstonLogger");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
    }
    
    public postDBLoad(container: DependencyContainer): void {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes.RAGFAIR);
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig(ConfigTypes.TRADER);
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        const tables = databaseServer.getTables();
        this.addQuestZones(container);
        this.addTraderToDb(baseJson, tables, jsonUtil);

        this.addTraderToLocales(tables, baseJson.name, "Svetlana", baseJson.nickname, baseJson.location, "A trained Bear that supervises the entrances and exits of one of the hundreds of Bear centers in Tarkov.");
        this.ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    private addQuestZones(container: DependencyContainer): void 
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();

        databaseTables.globals["QuestZones"].push(
    {
        zoneId: "SanatoriumEntier",
        zoneName: "SanatoriumEntier",
        zoneLocation: "Shoreline",
        zoneType: "Visit",
        position: {
        x: "-252.2328",  
        y: "-4.4738",
        z: "-118.1287",
        },
        rotation: {
        x: "0",
        y: "0",
        z: "0",
        },
        scale: {  
        x: "249.2356",    
        y: "6.2255",
        z: "120.7516",
        },
    }
      );
    }

    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void
    {
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Svetlana.jpg`);
    }

    private setupTraderUpdateTime(traderConfig: ITraderConfig): void
    {
        const traderRefreshRecord: UpdateTime = { traderId: baseJson._id, seconds: 3600 }
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    
    private  addTraderToDb(Svetlana: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void
    {
        tables.traders[Svetlana._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort, // assorts are the 'offers' trader sells, can be a single item (e.g. carton of milk) or multiple items as a collection (e.g. a gun)
            base: jsonUtil.deserialize(jsonUtil.serialize(Svetlana)) as ITraderBase,
            questassort: {
                started: {},
                success: {
                    "144acb6fa89442c015e73543":"Hum?",
                    "50e6c49e1ce6a7ba93d99eea":"Hum?",
                    "553f7ecb90185c2bae5f4b31":"Hum?",
                    "1081028d79903025c7b34093": "InformationGathering",
                    "7e9cf41af17e5d4040c3ded8":"InformationGathering",
                    "020cfc44d140a727c2ab9698":"InformationGathering",
                    "8b6c81b7a3e8d2bc76a56456":"Fortifying",
                    "290e7771297903d8bec2745e":"Fortifying",
                    "356a82200fe3538df9daac00":"Fortifying",
                    "620bfc2784cb093f6edf4058":"Fortifying",
                    "2e0151042f44269a1212547f":"Fortifying",
                    "0d55e43ed7bad732ac455929":"StressConditioning",
                    "40ab87d173c4ec2c41e6f762":"StressConditioning",
                    "64407208accd51bb14b0254b":"StressConditioning",
                    "83eb3200345a042380c20025":"GearedUpForTheTerrain",
                    "dbfe69e540145f7873c0c8b8":"GearedUpForTheTerrain",
                    "b153ccd74c75d71be9d1c635":"LackOfComponents",
                    "5f29b9e31d303dcec01939d0":"LackOfComponents",
                    "d2101ec0d38b76d259b81659":"AKS-uMastery",
                    "cccd055f36a4ce9fab734ccb":"AKS-uMastery",
                    "db8f0216ff4d5a3574c7b08e":"AKS-uMastery",
                    "4fc7e6a6e69db67de2c47b7b":"AKS-uMastery",
                    "930ff847451006221acb9361":"AKS-uMastery",
                    "756fb42260e1529bc4f9ba44":"ForTheMotherOfRussia",
                    "fc941dc3398c29ffc3225bc7":"ForTheMotherOfRussia",
                    "ek4v7nbceksdmr1h742sqs2k":"ForTheMotherOfRussia",
                    "5e023d34e8a400319a28ed44":"ForTheMotherOfRussia",
                    "94debc522ef3628df2ab9ba8":"WantedTagilla",
                    "a26895869a17b4e104b73101":"WantedTagilla",
                    "c130cc6c7b390193a6308c9d":"WantedReshala",
                    "44dee5f0129f840d0169d188":"WantedReshala",
                    "0d43cdaade29a078acc3256f":"WantedReshala",
                    "bca4a2d00fed29ecc0bf1142":"WantedReshala",
                    "1e8dc4bf0bad16e84a119e59":"WantedShturman",
                    "6c348ed163524a0c9ce69ef8":"WantedShturman",
                    "7447e74a61435811feab35de":"WantedSanitar",
                    "ec8555ad70f16dca6c7c7839":"WantedSanitar",
                    "6w4chilcl80zlohtzs4foho2":"WantedSanitar",
                    "89c0a8821fe30e509f87203a":"BlackFriday",
                    "b7f7cdb63771353817c71306":"BlackFriday",
                    "7c20f7463b44f365ac18b547":"BlackFriday",
                    "60c88ca8e593169bc31cd07d":"BackToOurLand",
                    "97c5a320d2d908fc055fb846":"BackToOurLand",
                    "9d42631196cb83114bf61f3e":"NightInvestigation",
                    "92b5334e31c3fbba7c874f85":"NightInvestigation",
                    "bfc18e8ca113fa3ea407d0d1":"NightInvestigation",
                    "dughm35xmystwf0g6755seg5":"NightInvestigation",
                    "i95vnxibjyk9y68lgnahs9vg":"NightInvestigation",
                    "jose44n4zs9ss8fp7o88wb3k":"NightInvestigation",
                    "7nx5fg42g6xn17okhf6ni4zz":"NightInvestigation",
                    "6b4c03511d63b62dad9ec923":"NightInvestigation",
                    "e880fcca5c2d317d0864670b":"PirojkisOutdoors",
                    "5a7e6c35ced762de3134be68":"PirojkisOutdoors",
                    "m9lga9a55jqcbg4oxv3u5sps":"PromotionJuniorLieutenant",
                    "s218hincuvmniaamncdvqu5b":"PromotionJuniorLieutenant",
                    "m9lga9a55jqcqg4oxv3u5sps":"PromotionLieutenant",
                    "y05c72waeeognicelpjzenkh":"PromotionSeniorLieutenant",
                    "fpytym7tqiq4qpp8sitf807s":"PromotionCaptain",
                    "dv3harbz6uolkonp793sdfc4":"PromotionCaptain",
                    "p3l54pr8c2zrhkh5yxhrkbdx":"PromotionMajor",
                    "tpirh7eu2x2vhwwsn2idwsih":"PromotionLieutenantColonel",
                    "eh56niobx8na0jdahregzw8g":"PromotionColonel",
                    "fh58cmrlyvk65vcl2d41rvlp":"PromotionMajorGeneral"
                },
                fail: {}
            }
        };
    }

    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string,)
    {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }

    private addItemToLocales(tables: IDatabaseTables, itemTpl: string, name: string, shortName: string, Description: string)
    {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${itemTpl} Name`] = name;
            locale[`${itemTpl} ShortName`] = shortName;
            locale[`${itemTpl} Description`] = Description;
        }
    }
}
module.exports = { mod: new SampleTrader() }