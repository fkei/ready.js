var sys = require("sys"),
  fs = require("fs"),
  cp = require("child_process");

// Delete all unwanted files
function cleanUp() {
  var rm = function(file) {
    try {
      fs.unlinkSync(file);
    } catch(e) {}
    
    var stat = null;  
    try {
      stat = fs.statSync(file);
    } catch(e) {}
  }

  files = ["./test/example/minified/js.min.js",
    "./test/example/minified/js2.min.js",
    "./test/example/minified/all.js"
  ];
  
  for (var f in files) {
    rm(files[f]);
  }  
  
  try {
    fs.rmdirSync("./test/example/minified/");
  } catch(e) {}
}

// Create a default config
function getConfig(extend) {
  extend = extend || {};
  
  var c = { src : "./test/example/javascripts",
   dest : "./test/example/minified",
   aggregateTo : "./test/example/minified/all.js",
   test : true
  };
  
  for (var p in extend) {
    c[p] = extend[p];
  }
  
  return c;
}

// Execute a ready.js
function exec(config, cb) {
  if (typeof(config) != "string") {
    config = "'" + JSON.stringify(config) + "'";
  } 
  
  var cmd = ["node ready.js ", config].join(" ").toString();
  cp.exec(cmd, cb);
}

exec(getConfig(), function() {
console.log("Before telephone");
  exports["telephone"] = function(a) { 
    a.ok(true, "asdg");
    exports["new test"] = function(a, be) {
      a.ok(true);
    }
  }
});

function aaa() {
  console.log("aaa");
  exports["tv"] = function(a) {
console.log("Test2");
    a.ok(true);
  }
}

tests = [
  function() {
    var config = getConfig();

    exec(config, function(error, stdout, stderr) {
      exports["normal config"] = function(a, be) {
        // Check that all files are there
        var stat = fs.statSync("test/example/minified/js.min.js");
        a.ok(stat.isFile());
        
        stat = fs.statSync("test/example/minified/js2.min.js");
        a.ok(stat.isFile());

        stat = fs.statSync("test/example/minified/all.js", "minified exists");
        a.ok(stat.isFile());
        
        // Check that aggregate has no duplicate
        var code = fs.readFileSync("test/example/minified/all.js").toString();
        a.eql(code.match(/\sjs\.min\.js\s/).length, 1);
        
        tests[1]();
      }
    });
  },
  function() {
    var config = getConfig({runGCompiler:false});

    exec(config, function(error, stdout, stderr) {
      exports["don't compile"] = function(a) {
console.log("IN COMPILE");
        // Check that there's an aggregate
        var stat = fs.statSync(config.aggregateTo);
        var code = fs.readFileSync(config.aggregateTo).toString();

        a.eql(true, stat.isFile());
        
        /*a.eql(code.match(/\/\* js.js \*\//g).length, 1);
        a.eql(code.match(/\/\* js2.js \*\//g).length, 1);
        a.eql(code.match(/\/\* .* \*\//g).length, 2);*/
      }
    });
  }
]

/*
// All the tests
tests = {

  "don't compile" : function(a) {

  },
  "don't aggregate" : function(a) {
    var config = getConfig({aggregateTo:""});
    
    exec(config, function(error, stdout, stderr) {
      a.isNull(error)
    });
  },
}

for (var t in tests) {
  exports[t] = (function(te) {
    return function(a, b) {
      initTest();
      te(a, b);
      initTest();
    }
  })(tests[t]);
}
*/
