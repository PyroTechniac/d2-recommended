if (import.meta.env.DEV) {
	const { default: whyDidYouRender } = await import('@welldone-software/why-did-you-render');

	const [React] = await Promise.all([import('react').then((react) => react.default)]);

	whyDidYouRender(React, {
		trackAllPureComponents: true,
		trackHooks: true,
	});
}
