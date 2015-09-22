var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) {sys.puts(stdout)}

var child = exec("start.bat", puts);

// redirects output
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);