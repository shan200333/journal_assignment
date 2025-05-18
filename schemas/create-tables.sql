CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('Teacher', 'Student')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Journals (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES Users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Journal_Students (
  journal_id INTEGER REFERENCES Journals(id),
  student_id INTEGER REFERENCES Users(id),
  PRIMARY KEY (journal_id, student_id)
);

CREATE TABLE Attachments (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER NOT NULL REFERENCES Journals(id),
  type VARCHAR(20) CHECK (type IN ('Image', 'Video', 'URL', 'PDF')) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES Users(id),
  journal_id INTEGER NOT NULL REFERENCES Journals(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);