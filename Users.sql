CREATE EXTENSION pgcrypto;

CREATE TABLE Admin (
    ID SERIAL UNIQUE,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL
);
-- ('johndoe@mail.com',
--  crypt('johnspassword', gen_salt('bf'))
-- sample entry using the pgcrypto extension for postgres, this will enter the passwords
-- as encrypted salts and not as plaintext to protect the user 

CREATE TABLE Sponsor (
    ID SERIAL UNIQUE,
    CompanyName VARCHAR(255) NOT NULL,
    City VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL
);
