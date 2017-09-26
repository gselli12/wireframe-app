DROP TABLE IF EXISTS wireframes;

CREATE TABLE wireframes(
    id SERIAL PRIMARY KEY,
    url_string VARCHAR(20) NOT NULL,
    wireframe_object TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
