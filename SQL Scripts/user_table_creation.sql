USE node_app_dev;

CREATE TABLE users (
  id int NOT NULL,
  username varchar(20) NOT NULL,
  password varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE  users;