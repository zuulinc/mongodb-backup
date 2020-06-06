# [@zuul/mongodb-backup](https://github.com/zuulinc/mongodb-backup)

[![NPM version](https://img.shields.io/npm/v/mongodb-backup.svg)](https://www.npmjs.com/package/mongodb-backup)
[![Linux Status](https://img.shields.io/travis/zuulinc/mongodb-backup.svg?label=linux)](https://travis-ci.org/zuulinc/mongodb-backup)
[![Windows Status](https://img.shields.io/appveyor/ci/zuulinc/mongodb-backup.svg?label=windows)](https://ci.appveyor.com/project/zuulinc/mongodb-backup)
[![Dependency Status](https://img.shields.io/david/zuulinc/mongodb-backup.svg)](https://david-dm.org/zuulinc/mongodb-backup)
[![Coveralls](https://img.shields.io/coveralls/zuulinc/mongodb-backup.svg)](https://coveralls.io/r/zuulinc/mongodb-backup)

Backup for mongodb

Look at [`mongodb-backup-cli`](https://github.com/zuulinc/mongodb-backup-cli) for command line usage, similar to [mongodump](http://docs.mongodb.org/manual/reference/program/mongodump/)

Look at [`mongodb-restore`](https://github.com/zuulinc/mongodb-restore) for restore data

## Installation

Install through NPM

```bash
npm install mongodb-backup
```
or
```bash
git clone git://github.com/zuulinc/mongodb-backup.git
```

Bson@0.4.11 has been pulled out, so versions >= `1.3.0` and <= `1.4.1` are deprecated

## API

inside nodejs project
```js
var backup = require('mongodb-backup');

backup({
  uri: 'uri', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
  root: __dirname
});
```

### backup(options)

#### options

 - `uri` - **String** [URI](http://mongodb.github.io/node-mongodb-native/2.0/tutorials/urls/) for MongoDb connection *(default "required")*
 - `root`- **String** Path where save data *(default "required")*
 - `[parser]` - **String | Function** Data parser (bson, json) or custom *(default "bson")*
 - `[collections]` - **Array** Select which collections save *(default "disabled")*
 - `[callback]` - **Function** Callback when done *(default "disabled")*
 - `[stream]`- **Object** Send `.tar` file to Node stream *(default "disabled")*
 - `[tar]` - **String** Pack files into a .tar file *(default "disabled")*
 - `[query]` - **Object** Query that optionally limits the documents included *(default "{}")*
 - `[numCursors]` - **Number** Set number of cursor for [parallelCollectionScan](https://docs.mongodb.org/v3.0/reference/command/parallelCollectionScan) without query *(default "disabled")*
 - `[logger]` - **String** Path where save a .log file *(default "disabled")*
 - `[metadata]` - **Boolean** Save metadata of collections as Index, ecc *(default "false")*
 - `[options]` - **Object** MongoDb [options](http://mongodb.github.io/node-mongodb-native/2.0/tutorials/connecting/#toc_7) *(default)*

## Examples

Take a look at my [examples](https://github.com/zuulinc/mongodb-backup/tree/1.6/examples)

### [License Apache2](https://github.com/zuulinc/mongodb-backup/blob/1.6/LICENSE)
