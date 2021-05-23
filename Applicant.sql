CREATE TABLE Personal (
    PersonID UUID DEFAULT uuid_generate_v4(),
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    PreferredName VARCHAR(255),
    Email VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    Address VARCHAR(255),
    City VARCHAR(255) NOT NULL,
    Province VARCHAR(255) NOT NULL,
    WebsiteOne VARCHAR(255),
    WebsiteTwo VARCHAR(255),
    WebsiteThree VARCHAR(255),
    resumelink VARCHAR(255) NOT NULL,
    PRIMARY KEY(PersonID)
);

CREATE TABLE Education (
    PersonID UUID,
    InstName VARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    Degree VARCHAR(255),
    Major VARCHAR(255),
    Minor VARCHAR(255),
    OTHER VARCHAR(255),
    FOREIGN KEY (PersonID) REFERENCES Personal(PersonID)
);

CREATE TABLE Experience (
    PersonID UUID,
    CompanyName VARCHAR(255),
    Position VARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    Description VARCHAR(5000),
    City VARCHAR(255),
    Province VARCHAR(255),
    FOREIGN KEY (PersonID) REFERENCES Personal(PersonID)
);

CREATE TABLE Skill (
    PersonID UUID,
    SkillName VARCHAR(255),
    FOREIGN KEY(PersonID) REFERENCES Personal(PersonID)
);