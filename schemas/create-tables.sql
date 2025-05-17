CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Teacher', 'Student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Journals (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Journal_Students (
  journal_id INTEGER REFERENCES Journals(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_id, student_id)
);

CREATE TABLE Attachments (
  id SERIAL PRIMARY KEY,
  journal_id INTEGER NOT NULL REFERENCES Journals(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Image', 'Video', 'URL', 'PDF')),
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journals_teacher_id ON Journals(teacher_id);
CREATE INDEX idx_journal_students_student_id ON Journal_Students(student_id);