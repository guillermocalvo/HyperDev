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

// Q is used for promises
var Q = require("q");

// Serializes an object to JSON and stores it to the database
// Returns a Promise
function set(key, value) {
    var deferred = Q.defer();

    if (typeof(key) !== "string") {
        deferred.reject(new DatastoreKeyNeedToBeStringException(key));
    }

    try {
        var serializedValue = JSON.stringify(value);
    } catch (err) {
        deferred.reject(new DatastoreValueSerializationException(value, err));
    }

    var params = {
        Item: {
            hyperweb_id: {
                S: config["hyperWebId"]
            },
            key: {
                S: key
            },
            value: {
                S: serializedValue
            }
        },
        TableName: config["dynamodbKeyValueTable"]
    };

    db.putItem(params, function(err, data) {
        if (err) {
            deferred.reject(new DatastoreUnderlyingException(err));
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

// Fetches an object from the DynamoDB instance, deserializing it from JSON
// Returns a Promise
function get(key, consistentRead) {
    var deferred = Q.defer();

    consistentRead = !!consistentRead;

    if (typeof(key) !== "string") {
        deferred.reject(new DatastoreKeyNeedToBeStringException(key));
    }

    var params = {
        Key: {
            hyperweb_id: {
                S: config["hyperWebId"]
            },
            key: {
                S: key
            }
        },
        TableName: config["dynamodbKeyValueTable"],
        ConsistentRead: consistentRead
    };

    db.getItem(params, function(err, data) {
        if (err) {
            deferred.reject(new DatastoreUnderlyingException(err));
        } else {
            try {
                var serializedValue = data["Item"]["value"]["S"];
                var value = JSON.parse(serializedValue);
                deferred.resolve(value);
            } catch (err) {
                // No such element
                deferred.resolve(null);
                //deferred.reject(new DatastoreValueDeserializationException(err));
            }
        }
    });

    return deferred.promise;
}

function DatastoreKeyNeedToBeStringException(keyObject) {
    this.description = "Datastore can only use strings as keys, got " + keyObject.constructor.name + " instead.";
    this.key = keyObject;
}

function DatastoreValueSerializationException(value, error) {
    this.description = "Failed to serialize the value to JSON";
    this.value = value;
    this.error = error;
}

function DatastoreValueDeserializationException(error) {
    this.description = "Failed to deserialize object from JSON";
    this.error = error;
}

function DatastoreUnderlyingException(error) {
    this.description = "The underlying DynamoDB instance returned an error";
    this.error = error;
}

module.exports = {
    set: set,
    get: get
};
