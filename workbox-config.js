module.exports = {
	globDirectory: 'public/',
	globPatterns: ['**/*.{html,ico,json,css,js}', 'src/images/*.{jpg,png}'],
	swDest: 'public/service-worker.js',
	swSrc: 'public/sw-base.js',
	globIgnores: ['help/**', 'sw.js', 'service-worker.js', '404.html'],
};
