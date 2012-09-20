load("jshint/lib/vendor/jshint.js");
var src     = project.getProperty('src') || '',
    options = project.getProperty('options'),
    passed  = [],
    failed  = [];

function lintFiles(src, options) {
    console.log('Linting javascript files...');
    
    if(!src.length) {
      console.log('No files to lint');
      return;
    }

    src.forEach(function(file) {
        if(!file) return;

        var srcContents = readFile(file);
        var result = JSHINT(srcContents, options);

        if(result) {
            passed.push(file);
            console.log("\u2713" + ' ' + file);
        } else {
            failed.push([file, JSHINT.errors]);
        }
    });

    if(failed.length === 0) {
        console.log('All files linted successfully.');
    } else {
        console.log("\n");
        console.log('Linting failed for ' + failed.length + (failed.length > 1 ? ' files:' : ' file:'));
        failed.forEach(function(failure) {
            var file   = failure[0],
                errors = failure[1],
                output = "\n";

            output += "\u2717 " + file + ' (' + errors.length + (errors.length > 1 ? ' Problems' : ' Problem') + ')' + ':';
            output += "\n";
            console.log(output);
            
            errors.forEach(function(error) {
                console.log("\t", 'Line: ', error.line);
                console.log("\t", 'Character: ', error.character);
                console.log("\t", 'Problem: ', error.reason);
                console.log("\t", '>> ', error.evidence);
                console.log("\n\n");
            });
        });

        fail('Linting failed for one or more javascript files. Please correct the above issues and try again.');
    }
}

try {
    options = options ? JSON.parse(options) : {};
} catch(e) {
    fail('Unable to parse options. Options must be in JSON format.');
}

src = String(src);
src = src.length ? src.split(/[\s,\n]+/) : [];
lintFiles(src, options);
