FROM postgres:12.8-alpine
COPY init.sql /docker-entrypoint-initdb.d/