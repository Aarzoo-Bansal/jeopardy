CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    difficulty INTEGER NOT NULL CHECK (difficulty IN (100, 200, 300, 400, 500)),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    time_limit INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_user_id on questions(user_id);
CREATE INDEX idx_questions_category_id ON questions(category_id);