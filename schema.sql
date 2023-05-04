DROP TABLE IF EXISTS PromoCodes;
CREATE TABLE PromoCodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    discount INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO PromoCodes (code, discount) VALUES ('PROMO10', 10);
INSERT INTO PromoCodes (code, discount) VALUES ('PROMO20', 20);
INSERT INTO PromoCodes (code, discount) VALUES ('PROMO30', 30);


DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders (
    name TEXT NOT NULL,
    social TEXT NOT NULL,
    email TEXT NOT NULL,
    zone TEXT NOT NULL,
    services TEXT NOT NULL,
    total INTEGER NOT NULL,
    discount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Admin;
CREATE TABLE Admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Admin (username, password) VALUES ('admin', '2597a7caf656e89e9ab35e12326d557ebfe9b7b5dcbe4c564e74070fa5cfcbe5');

