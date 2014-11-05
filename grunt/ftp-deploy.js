module.exports = {
	build: {
		auth: {
			host: 'comandeer.pl'
			,port: 21
			,authKey: 'personal'
		}
		,src: './'
		,dest: '/'
		,exclusions: [
			'bower.json'
			,'grunt'
			,'Gruntfile.js'
			,'LICENSE'
			,'node_modules'
			,'package.json'
			,'README.md'
			,'.bowerrc'
			,'.editorconfig'
			,'.git'
			,'.gitignore'
			,'.ftppass'
		]
	}	
};
