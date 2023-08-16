import type {
	AllDestinyManifestComponents,
	DestinyActivityDefinition,
	DestinyActivityModeDefinition,
	DestinyActivityModifierDefinition,
	DestinyBreakerTypeDefinition,
	DestinyClassDefinition,
	DestinyCollectibleDefinition,
	DestinyDamageTypeDefinition,
	DestinyDestinationDefinition,
	DestinyEventCardDefinition,
	DestinyFactionDefinition,
	DestinyGenderDefinition,
	DestinyInventoryBucketDefinition,
	DestinyInventoryItemDefinition,
	DestinyItemCategoryDefinition,
	DestinyItemTierTypeDefinition,
	DestinyLoadoutColorDefinition,
	DestinyLoadoutConstantsDefinition,
	DestinyLoadoutIconDefinition,
	DestinyLoadoutNameDefinition,
	DestinyMaterialRequirementSetDefinition,
	DestinyMetricDefinition,
	DestinyMilestoneDefinition,
	DestinyObjectiveDefinition,
	DestinyPlaceDefinition,
	DestinyPlugSetDefinition,
	DestinyPowerCapDefinition,
	DestinyPresentationNodeDefinition,
	DestinyProgressionDefinition,
	DestinyRaceDefinition,
	DestinyRecordDefinition,
	DestinySandboxPerkDefinition,
	DestinySeasonDefinition,
	DestinySeasonPassDefinition,
	DestinySocketCategoryDefinition,
	DestinySocketTypeDefinition,
	DestinyStatDefinition,
	DestinyStatGroupDefinition,
	DestinyTraitDefinition,
	DestinyVendorDefinition,
	DestinyVendorGroupDefinition,
} from 'bungie-api-ts/destiny2';
import { warnLogCollapsedStack } from '../utils';

export class HashLookupFailure extends Error {
	public constructor(
		public table: string,
		public id: number,
	) {
		super(`hashLookupFailure: ${table}[${id}]`);
		this.name = 'HashLookupFailure';
	}
}

export interface DefinitionTable<T> {
	readonly get: (hash: number, requestor?: { hash: number } | string | number) => T;
	readonly getAll: () => { [hash: number]: T };
}

export interface DestinyManifestDefinitions {
	InventoryItem: DefinitionTable<DestinyInventoryItemDefinition>;
	Objective: DefinitionTable<DestinyObjectiveDefinition>;
	SandboxPerk: DefinitionTable<DestinySandboxPerkDefinition>;
	Stat: DefinitionTable<DestinyStatDefinition>;
	StatGroup: DefinitionTable<DestinyStatGroupDefinition>;
	Progression: DefinitionTable<DestinyProgressionDefinition>;
	ItemCategory: DefinitionTable<DestinyItemCategoryDefinition>;
	Activity: DefinitionTable<DestinyActivityDefinition>;
	ActivityModifier: DefinitionTable<DestinyActivityModifierDefinition>;
	Vendor: DefinitionTable<DestinyVendorDefinition>;
	SocketCategory: DefinitionTable<DestinySocketCategoryDefinition>;
	SocketType: DefinitionTable<DestinySocketTypeDefinition>;
	MaterialRequirementSet: DefinitionTable<DestinyMaterialRequirementSetDefinition>;
	Season: DefinitionTable<DestinySeasonDefinition>;
	SeasonPass: DefinitionTable<DestinySeasonPassDefinition>;
	Milestone: DefinitionTable<DestinyMilestoneDefinition>;
	Destination: DefinitionTable<DestinyDestinationDefinition>;
	Place: DefinitionTable<DestinyPlaceDefinition>;
	VendorGroup: DefinitionTable<DestinyVendorGroupDefinition>;
	PlugSet: DefinitionTable<DestinyPlugSetDefinition>;
	PresentationNode: DefinitionTable<DestinyPresentationNodeDefinition>;
	Record: DefinitionTable<DestinyRecordDefinition>;
	Metric: DefinitionTable<DestinyMetricDefinition>;
	Trait: DefinitionTable<DestinyTraitDefinition>;
	PowerCap: DefinitionTable<DestinyPowerCapDefinition>;
	BreakerType: DefinitionTable<DestinyBreakerTypeDefinition>;
	DamageType: DefinitionTable<DestinyDamageTypeDefinition>;
	Collectible: DefinitionTable<DestinyCollectibleDefinition>;
	EventCard: DefinitionTable<DestinyEventCardDefinition>;
	LoadoutName: DefinitionTable<DestinyLoadoutNameDefinition>;
	LoadoutColor: DefinitionTable<DestinyLoadoutColorDefinition>;
	LoadoutIcon: DefinitionTable<DestinyLoadoutIconDefinition>;

	InventoryBucket: { [hash: number]: DestinyInventoryBucketDefinition };
	Class: { [hash: number]: DestinyClassDefinition };
	Gender: { [hash: number]: DestinyGenderDefinition };
	Race: { [hash: number]: DestinyRaceDefinition };
	Faction: { [hash: number]: DestinyFactionDefinition };
	ItemTierType: { [hash: number]: DestinyItemTierTypeDefinition };
	ActivityMode: { [hash: number]: DestinyActivityModeDefinition };
	LoadoutConstants: { [hash: number]: DestinyLoadoutConstantsDefinition };
}

type ManifestTablesShort = keyof DestinyManifestDefinitions;

const lazyTables: ManifestTablesShort[] = [
	'InventoryItem',
	'Objective',
	'SandboxPerk',
	'Stat',
	'StatGroup',
	'DamageType',
	'Progression',
	'ItemCategory',
	'Activity',
	'ActivityModifier',
	'Vendor',
	'SocketCategory',
	'SocketType',
	'MaterialRequirementSet',
	'Season',
	'SeasonPass',
	'Milestone',
	'Destination',
	'Place',
	'VendorGroup',
	'PlugSet',
	'Collectible',
	'PresentationNode',
	'Record',
	'Metric',
	'Trait',
	'PowerCap',
	'BreakerType',
	'EventCard',
	'LoadoutName',
	'LoadoutIcon',
	'LoadoutColor',
];

const eagerTables: ManifestTablesShort[] = [
	'InventoryBucket',
	'Class',
	'Gender',
	'Race',
	'Faction',
	'ItemTierType',
	'ActivityMode',
	'LoadoutConstants',
];

export const allTables: ManifestTablesShort[] = [...eagerTables, ...lazyTables];

const UNSET_PLUG_HASH = 2166136261;

export const buildDefinitionsFromManifest = (
	db: AllDestinyManifestComponents,
): DestinyManifestDefinitions => {
	const defs: { [table: string]: any } = {};

	for (const tableShort of lazyTables) {
		const table = `Destiny${tableShort}Definition` as const;
		const dbTable = db[table];
		if (!dbTable) {
			throw new Error(`Table ${table} does not exist in the manifest`);
		}

		defs[tableShort] = {
			get: (id: number, requestor?: { hash: number } | string | number) => {
				const dbEntry = dbTable[id];
				if (!dbEntry && tableShort !== 'Record') {
					if (id !== UNSET_PLUG_HASH) {
						warnLogCollapsedStack('hashLookupFailure', `${table}[${id}]`, requestor);
					}
				}

				return dbEntry;
			},
			getAll: () => dbTable,
		};
	}

	for (const tableShort of eagerTables) {
		const table = `Destiny${tableShort}Definition` as const;
		defs[tableShort] = db[table];
	}

	return defs as DestinyManifestDefinitions;
};
