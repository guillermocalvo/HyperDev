"use strict";

var CONFIG_FILE = "./.hyperweb_aws_credentials.json";

// Loading the data in the config file
var fs = require("fs");
var config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));

// creating the DynamoDB object to work with
var AWS = require("aws-sdk");
AWS.config.update(config);

var db = new AWS.DynamoDB({
  apiVersion: "2012-08-10"
});

// ------------------------------
// ASYNCHRONOUS PROMISE-BASED API
//  SEE BELOW FOR SYNCHRONOUS API
// ------------------------------

// Serializes an object to JSON and stores it to the database
function set(key, value) {
  return new Promise(function (resolve, reject) {
    if (typeof(key) !== "string") {
      reject(new DatastoreKeyNeedToBeStringException(key));
    } else {
      try {
        var serializedValue = JSON.stringify(value);
        var params = itemParams(config, key, serializedValue);

        db.putItem(params, function (err, data) {
          if (err) {
            reject(new DatastoreUnderlyingException(params, err));
          } else {
            resolve(data);
          }
        });

      } catch (ex) {
        reject(new DatastoreValueSerializationException(value, ex));
      }
    }
  });
}

// Fetches an object from the DynamoDB instance, deserializing it from JSON
function get(key, consistentRead) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof(key) !== "string") {
        reject(new DatastoreKeyNeedToBeStringException(key));
      } else {
        var params = keyParams(config, key);
        params.ConsistentRead = !!consistentRead;

        db.getItem(params, function (err, data) {
          if (err) {
            reject(new DatastoreUnderlyingException(params, err));
          } else {
            try {
              var value = parseData(data, "Item");
              resolve(value);
            } catch (ex) {
              reject(new DatastoreDataParsingException(data, ex));
            }
          }
        });
      }
    } catch (ex) {
      reject(new DatastoreUnknownException("get", {key: key, consistentRead: consistentRead}, ex));
    }
  });
}

function remove(key, ignoreValue) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof(key) !== "string") {
        reject(new DatastoreKeyNeedToBeStringException(key));
      } else {
        var params = keyParams(config, key);
        params.ReturnValues = "ALL_OLD";

        db.deleteItem(params, function (err, data) {
          if (err) {
            reject(new DatastoreUnderlyingException(params, err));
          } else {
            if (!!ignoreValue) {
              resolve(null);
            } else {
              try {
                var value = parseData(data, "Attributes");
                resolve(value);
              } catch (ex) {
                reject(new DatastoreDataParsingException(data, ex));
              }
            }
          }
        });
      }
    } catch (ex) {
      reject(new DatastoreUnknownException("remove", {key: key, ignoreValue: ignoreValue}, ex));
    }
  });
}

function removeMany(keys, ignoreValues) {
  return Promise.all(keys.map(function (key) {
    return remove(key, ignoreValues);
  }));
}

function removeAll() {
  return keys()
  .then(function (keys) {
    return removeMany(keys, false);
  });
}

function keys(consistentRead) {
  return new Promise(function (resolve, reject) {
    try {
      var params = {
        AttributesToGet: [
          "key"
        ],
        KeyConditions: {
          hyperweb_id: {
            ComparisonOperator: "EQ",
            AttributeValueList: [
              {
                S: config.hyperWebId
              }
            ]
          }
        },
        TableName: config.dynamodbKeyValueTable,
        ConsistentRead: !!consistentRead
      };

      db.query(params, function (err, data) {
        if (err) {
          reject(new DatastoreUnderlyingException(params, err));
        } else {
          var ks = data.Items.map(function (item) {
            return item.key.S;
          });
          resolve(ks);
        }
      });
    } catch (ex) {
      reject(new DatastoreUnknownException("keys", {}, ex));
    }
  });
}

function itemParams(config, key, serializedValue) {
  return {
    Item: {
      hyperweb_id: {
        S: config.hyperWebId
      },
      key: {
        S: key
      },
      value: {
        // The implemented policy does not restrict this to string "S"
        S: serializedValue
      }
    },
    TableName: config.dynamodbKeyValueTable
  };
}

function keyParams(config, key) {
  return {
    Key: {
      hyperweb_id: {
        S: config.hyperWebId
      },
      key: {
        S: key
      }
    },
    TableName: config.dynamodbKeyValueTable
  };
}

function parseData(data, key) {
  if (Object.keys(data).length === 0) {
    return null;
  } else {
    var serializedValue = data[key].value.S;
    return JSON.parse(serializedValue);
  }
}

function DatastoreKeyNeedToBeStringException(keyObject) {
  this.type = this.constructor.name;
  this.description = "Datastore can only use strings as keys, got " + keyObject.constructor.name + " instead.";
  this.key = keyObject;
}

function DatastoreValueSerializationException(value, ex) {
  this.type = this.constructor.name;
  this.description = "Failed to serialize the value to JSON";
  this.value = value;
  this.error = ex;
}

function DatastoreDataParsingException(data, ex) {
  this.type = this.constructor.name;
  this.description = "Failed to deserialize object from JSON";
  this.data = data;
  this.error = ex;
}

function DatastoreUnderlyingException(params, ex) {
  this.type = this.constructor.name;
  this.description = "The underlying DynamoDB instance returned an error";
  this.params = params;
  this.error = ex;
}

function DatastoreUnknownException(method, args, ex) {
  this.type = this.constructor.name;
  this.description = "An unknown error happened during the operation " + method;
  this.method = method;
  this.args = args;
  this.error = ex;
}

// -------------------------------------------
// SYNCHRONOUS WRAPPERS AROUND THE PROMISE API
// -------------------------------------------

var sync = require("synchronize");

function setCallback(key, value, callback) {
  set(key, value)
    .then(function (value) {
      callback(null, value);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function getCallback(key, consistentRead, callback) {
  get(key, consistentRead)
    .then(function (value) {
      callback(null, value);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function removeCallback(key, ignoreValue, callback) {
  remove(key, ignoreValue)
    .then(function (value) {
      callback(null, value);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function removeManyCallback(keys, ignoreValues, callback) {
  removeMany(keys, ignoreValues)
    .then(function (value) {
      callback(null, value);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function removeAllCallback(callback) {
  removeAll()
    .then(function (value) {
      callback(null, value);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function keysCallback(consistentRead, callback) {
  keys(consistentRead)
    .then(function (value) {
      callback(null, value);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function setSync(key, value) {
  return sync.await(setCallback(key, value, sync.defer()));
}

function getSync(key, consistentRead) {
  return sync.await(getCallback(key, consistentRead, sync.defer()));
}

function removeSync(key, ignoreValue) {
  return sync.await(removeCallback(key, ignoreValue, sync.defer()));
}

function removeManySync(keys, ignoreValues) {
  return sync.await(removeManyCallback(keys, ignoreValues, sync.defer()));
}

function removeAllSync() {
  return sync.await(removeAllCallback(sync.defer()));
}

function keysSync(consistentRead) {
  return sync.await(keysCallback(consistentRead, sync.defer()));
}

function initializeApp(app) {
  app.use(function (req, res, next) {
    sync.fiber(next);
  });
}

var asyncDatastore = {
  set: set,
  get: get,
  remove: remove,
  removeMany: removeMany,
  removeAll: removeAll,
  keys: keys
};

var syncDatastore = {
  set: setSync,
  get: getSync,
  remove: removeSync,
  removeMany: removeManySync,
  removeAll: removeAllSync,
  keys: keysSync,
  initializeApp: initializeApp
};

module.exports = {
  async: asyncDatastore,
  sync: syncDatastore
};
