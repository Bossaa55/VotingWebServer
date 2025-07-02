CREATE DATABASE IF NOT EXISTS voting_db;
USE voting_db;

CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    participant_id VARCHAR(255) NOT NULL REFERENCES participants(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO participants (id, name) VALUES 
    ('1', 'Participant 1'),
    ('2', 'Participant 2'),
    ('3', 'Participant 3'),
    ('4', 'Participant 4')
ON DUPLICATE KEY UPDATE name = VALUES(name);

CREATE OR REPLACE VIEW vote_counts AS
SELECT
    p.id,
    p.name,
    COALESCE(v.vote_count, 0) as votes
FROM participants p
LEFT JOIN (
    SELECT participant_id, COUNT(*) as vote_count
    FROM votes
    GROUP BY participant_id
) v ON p.id = v.participant_id
ORDER BY votes DESC, p.name;
