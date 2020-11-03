var fs = require('fs');
var angular = JSON.parse(fs.readFileSync('angular.json'));
var index = fs.readFileSync('src/index.html', 'utf-8');

if(process.argv[2]) {
  var moduleName = process.argv[2].replace(/"/g, '');
  index = index.replace(/<title>(.*?)\<\/title>/g, '<title>'+moduleName+'</title>');
  angular.projects[Object.keys(angular.projects)[0]].architect.build.options.baseHref =  '/' + moduleName + '/';
  angular.projects[Object.keys(angular.projects)[0]].architect.build.options.outputPath =  'dist/' + moduleName;
  fs.writeFileSync('angular.json', JSON.stringify(angular));
  fs.writeFileSync('src/index.html', index);
}
