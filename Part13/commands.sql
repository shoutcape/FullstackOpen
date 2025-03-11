postgres=# CREATE TABLE blogs (                                         
id SERIAL PRIMARY KEY,
author text,
url text NOT NULL,
title text NOT NULL,
likes integer DEFAULT 0
);

postgres=# insert into blogs (author, url, title) values ('Ville', 'www.youtube.com', 'I dont like windows firewall');
postgres=# insert into blogs (author, url, title) values ('Joona', 'www.youtube.com', 'I use my 3d printer for everything');
