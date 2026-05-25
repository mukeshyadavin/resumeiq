CREATE DATABASE resumeiq;
USE resumeiq;

CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  file_name   VARCHAR(255),
  parsed_text LONGTEXT,
  uploaded_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE analyses (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT       NOT NULL,
  resume_id        INT       NOT NULL,
  job_description  LONGTEXT,
  match_score      INT,
  matched_skills   JSON,
  missing_skills   JSON,
  rewritten_resume LONGTEXT,
  cover_letter     LONGTEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id),
  FOREIGN KEY (resume_id) REFERENCES resumes(id)
);


SHOW TABLES;