CREATE TABLE houses(  
    id BIGSERIAL PRIMARY KEY,
    address VARCHAR(255),
    owner_name VARCHAR(255),
    num_rooms INT,
    has_garden BOOLEAN
);