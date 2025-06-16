db.createUser(
    {
        user: process.env.MONGO_INITDB_ROOT_USERNAME || "defaultUser",
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD || "defaultPassword",
        roles: [
            {
                role: "readWrite",
                db: process.env.MONGO_INITDB_DATABASE || "defaultDB"
            }
        ]
    }
);