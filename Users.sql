CREATE EXTENSION pgcrypto;

CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) NOT NULL ,
    user_first_name VARCHAR(255) NOT NULL,
    user_last_name VARCHAR(255) NOT NULL,
    CompanyName VARCHAR(255) NOT NULL,
    City VARCHAR(255)
);