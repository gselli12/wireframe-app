DROP TABLE IF EXISTS wireframes;

CREATE TABLE wireframes(
    id SERIAL PRIMARY KEY,
    url_string VARCHAR(20) NOT NULL,
    wireframe_object TEXT NOT NULL,
    background_color VARCHAR(20),
    fill_color VARCHAR(20),
    font_color VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
