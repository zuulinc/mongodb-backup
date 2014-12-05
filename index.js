'use strict';
/**
 * @file mongodb-backup main
 * @module mongodb-backup
 * @package mongodb-backup
 * @subpackage main
 * @version 0.0.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
  // node
  var fs = require('fs');
  var resolve = require('path').resolve;
  // module
  var client = require('mongodb').MongoClient;
  var BSON;
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * functions
 */
function makeDir(path, next) {

  fs.stat(path, function(err, stats) {

    if (err !== null && err.code === 'ENOENT') {
      fs.mkdir(path, next(null, path));
    } else if (stats !== undefined && stats.isDirectory() === false) {
      fs.unlink(path, function() {

        fs.mkdir(path, next(new Error('path was a file'), path));
      });
    } else {
      next(null, path);
    }
  });
}

function toJson(name, docs, next) {

  var last = docs.length - 1;
  docs.forEach(function(doc, index) {

    // no async. EMFILE error
    fs.writeFileSync(name + doc._id + '.json', JSON.stringify(doc), {
      encoding: 'utf8'
    });
    if (last === index) {
      next();
    }
  });
}

function toBson(name, docs, next) {

  var last = docs.length - 1;
  docs.forEach(function(doc, index) {

    // no async. EMFILE error
    fs.writeFileSync(name + doc._id + '.bson', BSON.serialize(doc), {
      encoding: null
    });
    if (last === index) {
      next();
    }
  });
}

function allCollections(db, name, parser, next) {

  db.collections(function(err, collections) {

    if (err !== null) {
      return;
    }
    var last = collections.length - 1;
    collections.forEach(function(collection, index) {

      makeDir(name + collection.collectionName + '/', function(err, name) {

        collection.find().toArray(function(err, docs) {

          if (err !== null) {
            return;
          }
          parser(name, docs, function() {

            if (last === index) {
              next();
            }
          });
        });
      });
    });
  });
}

function someCollections(db, name, parser, next, collections) {

  var last = collections.length - 1;
  collections.forEach(function(collection, index) {

    db.collection(collection, function(err, collection) {

      if (err !== null) {
        return;
      }
      makeDir(name + collection.collectionName + '/', function(err, name) {

        collection.find().toArray(function(err, docs) {

          if (err !== null) {
            return;
          }
          parser(name, docs, function() {

            if (last === index) {
              next();
            }
          });
        });
      });
    });
  });
}

function wrapper(my) {

  var parser = toJson;
  if (my.parser === 'bson') {
    BSON = require('bson').BSONPure.BSON;
    parser = toBson;
  }
  var discriminator = allCollections;
  if (Array.isArray(my.collections) === true) {
    discriminator = someCollections;
  }

  client.connect(my.uri, function(err, db) {

    // waiting for `db.fsyncLock()` on node driver
    makeDir(my.root + db.databaseName + '/', function(err, name) {

      discriminator(db, name, parser, function() {

        db.close();
      }, my.collections);
    });
  });
}

function backup(options) {

  var opt = options || Object.create(null);
  if (!opt.uri) {
    throw new Error('missing uri options');
  } else if (!opt.root) {
    throw new Error('missing root options');
  }
  var my = {
    dir: __dirname,
    uri: String(opt.uri),
    root: resolve(String(opt.root)) + '/',
    parser: String(opt.parser || 'json'),
    collections: opt.collections || false
  };
  return wrapper(my);
}
module.exports = backup;