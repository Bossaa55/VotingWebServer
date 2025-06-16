#!/bin/bash
# Wait for MongoDB to start

echo "Initializinf database..."

until mongosh --eval "print(\"waited for connection\")"
do
    sleep 2
done

# Drop the existing database
mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin <<EOF
use voting_data
db.dropDatabase()
use voting_data
db.createCollection("votes")
db.createCollection("users")
db.createCollection("participants")
EOF

echo "Database initialization complete."