import { addLimiter, RateLimiterQueue } from './ratelimiter';

export const setupRateLimiter = (): void => {
	addLimiter(new RateLimiterQueue(/www\.bungie\.net\/D1\/Platform\/Destiny\/TransferItem/, 1000));
	addLimiter(new RateLimiterQueue(/www\.bungie\.net\/D1\/Platform\/Destiny\/EquipItem/, 1000));

	// Destiny 2 has a faster rate limit!
	addLimiter(
		new RateLimiterQueue(
			/www\.bungie\.net\/Platform\/Destiny2\/Actions\/Items\/TransferItem/,
			100,
		),
	);
	addLimiter(
		new RateLimiterQueue(
			/www\.bungie\.net\/Platform\/Destiny2\/Actions\/Items\/PullFromPostmaster/,

			100,
		),
	);
	addLimiter(
		new RateLimiterQueue(
			/www\.bungie\.net\/Platform\/Destiny2\/Actions\/Items\/EquipItem/,
			100,
		),
	);
	addLimiter(
		new RateLimiterQueue(
			/www\.bungie\.net\/Platform\/Destiny2\/Actions\/Items\/EquipItems/,
			100,
		),
	);
	addLimiter(
		new RateLimiterQueue(
			/www\.bungie\.net\/Platform\/Destiny2\/Actions\/Items\/InsertSocketPlugFree/,
			500,
		),
	);
	addLimiter(
		new RateLimiterQueue(
			/www\.bungie\.net\/Platform\/Destiny2\/Actions\/Items\/InsertSocketPlug/,
			500,
		),
	);
};

export default setupRateLimiter;
