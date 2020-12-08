db.createUser(
    {
        user: "homestead",
        pwd: "password",
        roles: [
            {
                role: "readWrite",
                db: "homestead"
            }
        ]
    }
);
