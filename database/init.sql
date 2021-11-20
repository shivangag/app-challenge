CREATE USER appuser;

CREATE DATABASE app_challenge_db;
GRANT ALL PRIVILEGES ON DATABASE app_challenge_db TO appuser;
ALTER USER  appuser PASSWORD 'secret';
CREATE EXTENSION IF NOT EXISTS citext SCHEMA public;
