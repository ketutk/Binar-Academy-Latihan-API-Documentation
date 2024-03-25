const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// SETUP POSTGRESS
const Pool = require("pg-pool");

const pool = new Pool({
  host: "localhost",
  database: "latihan_ch4",
  user: "postgres",
  password: "lepkomf4",
  port: 5432,
});

const table = "houses";

// LISTING ALL RESOURCE
app.get("/houses", async (req, res, next) => {
  try {
    const housesData = await pool.query(`select * from ${table};`);

    return res.status(200).json({
      message: "Successfully get all data",
      data: housesData.rows,
    });
  } catch (error) {
    next(error);
  }
});

// GETTING A RESOURCE
app.get("/houses/:houseId", async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const houseData = await pool.query(`select * from ${table} where id=$1;`, [houseId]);

    return res.status(200).json({
      message: "Successfully get data",
      data: houseData.rows,
    });
  } catch (error) {
    next(error);
  }
});

// CREATING A RESOURCE
app.post("/houses", async (req, res, next) => {
  try {
    const { address, owner_name, num_rooms, has_garden } = req.body;

    const createData = await pool.query(`insert into ${table}(address,owner_name,num_rooms,has_garden) values ($1,$2,$3,$4);`, [address, owner_name, num_rooms, has_garden]);

    return res.status(201).json({
      message: "Successfully create data",
      row_count: createData.rowCount,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATING A RESOURCE
app.put("/houses/:houseId", async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const { address, owner_name, num_rooms, has_garden } = req.body;

    const editData = await pool.query(
      `update ${table}
      set address=$1,owner_name=$2,num_rooms=$3,has_garden=$4
      where id=$5;`,
      [address, owner_name, num_rooms, has_garden, houseId]
    );

    return res.status(200).json({
      message: "Successfully edit data",
      row_count: editData.rowCount,
    });
  } catch (error) {
    next(error);
  }
});

// DELETING A RESOURCE
app.delete("/houses/:houseId", async (req, res, next) => {
  try {
    const { houseId } = req.params;

    const deleteData = await pool.query(
      `delete from ${table}
        where id=$1;`,
      [houseId]
    );

    return res.status(200).json({
      message: "Successfully delete data",
      row_count: deleteData.rowCount,
    });
  } catch (error) {
    next(error);
  }
});

// ERROR HANDLING MIDDLEWARE

// INTERNAL SERVER ERROR
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    err: err.message,
  });
});

// 404 ERROR
app.use((req, res, next) => {
  res.status(404).json({
    err: `Server not found on ${req.url}`,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
