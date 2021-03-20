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
    user_id UUID DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_first_name VARCHAR(255) NOT NULL,
    user_last_name VARCHAR(255) NOT NULL,
    CompanyName VARCHAR(255) NOT NULL,
    City VARCHAR(255)
);
