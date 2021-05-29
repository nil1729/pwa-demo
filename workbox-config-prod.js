module.exports = {
	globDirectory: 'prod/',
	globPatterns: [
		'**/*.{html,ico,json,css}',
		'src/images/*.{jpg,png}',
		'src/js/*.min.js',
		'src/images/icons/app-icon-144x144.png',
	],
	swDest: 'prod/service-worker.js',
	swSrc: 'public/sw-prod.js',
	globIgnores: ['help/**', 'service-worker.js', '404.html'],
};
