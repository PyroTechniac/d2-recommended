import { type FC } from 'react';
import { useManifest } from '../hooks';

export const ItemIcon: FC = () => {
	const data = useManifest();

	const all = data!.InventoryItem.getAll();

	const firstKey = parseInt(Object.keys(all)[100]);

	console.log(all[firstKey]);

	return null;
};

ItemIcon.whyDidYouRender = true;

ItemIcon.displayName = 'ItemLoader';

export default ItemIcon;
