CREATE TABLE Personal (
    PersonID INT,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    PreferredName VARCHAR(255),
    Email VARCHAR(50),
    PhoneNumber VARCHAR(15),
    Address VARCHAR(255) NOT NULL,
    City VARCHAR(255) NOT NULL,
    Province VARCHAR(255) NOT NULL,
    Country VARCHAR(25) NOT NULL,
    WebsiteOne VARCHAR(255),
    WebsiteTwo VARCHAR(255),
    WebsiteThree VARCHAR(255),
    PRIMARY KEY(PersonID)
);

CREATE TABLE Education (
    PersonID INT,
    InstName VARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    Degree VARCHAR(255),
    Major VARCHAR(255),
    Minor VARCHAR(255),
    FOREIGN KEY (PersonID) REFERENCES Personal(PersonID)
);

CREATE TABLE Experience (
    PersonID INT,
    CompanyName VARCHAR(255),
    Position VARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    Description VARCHAR(5000),
    City VARCHAR(255),
    Province VARCHAR(255),
    Country VARCHAR(255),
    FOREIGN KEY (PersonID) REFERENCES Personal(PersonID)
);

CREATE TABLE Skill (
    PersonID INT,
    SkillName VARCHAR(255),
    FOREIGN KEY(PersonID) REFERENCES Personal(PersonID)
);