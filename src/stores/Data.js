const replacePath = (path) => {
	return path.replace('../', '').replace('/data.json', '');
};

async function getFromModules(res) {
	let array = [];
	let i = 0;
	for (const path in res) {
		i += 1;
		await res[path]().then((mod) => {
			array = [
				...array,
				{
					...mod.default,
					id: i,
					event_photo: `/src/${replacePath(path)}/${mod.event_photo}`,
					assets: {
						slides: { path: `${replacePath(path)}/${mod.assets.slides}`, name: mod.assets.slides }
					},
					video: {
						...mod.video,
						name: `${replacePath(path)}/${mod.video.name}`,
						title: mod.video.name
					}
				}
			];
		});
	}

	return array;
}

async function importJsons() {
	const modules = import.meta.glob('../lib/event_data/*/*.json');

	return Promise.resolve(modules).then((res) => getFromModules(res));
}

export const jsonEvents = async () => {
	return await importJsons();
};
