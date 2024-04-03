const router = require("express").Router();

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
router.get("/houses", async (req, res, next) => {
  try {
    const housesData = await pool.query(`select * from ${table};`);

    return res.status(200).json({
      status: true,
      message: "Successfully get all data",
      data: housesData.rows,
    });
  } catch (error) {
    next(error);
  }
});

// GETTING A RESOURCE
router.get("/houses/:houseId", async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const houseData = await pool.query(`select * from ${table} where id=$1;`, [houseId]);

    if (houseData.rows.length < 1) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully get data",
      data: houseData.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// CREATING A RESOURCE
router.post("/houses", async (req, res, next) => {
  try {
    const { address, owner_name, num_rooms, has_garden } = req.body;

    if (!address || !owner_name || !num_rooms || has_garden == null) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the required data",
        data: null,
      });
    }

    const createData = await pool.query(`insert into ${table}(address,owner_name,num_rooms,has_garden) values ($1,$2,$3,$4);`, [address, owner_name, num_rooms, has_garden]);

    return res.status(201).json({
      status: true,
      message: "Successfully create data",
      data: createData.rowCount,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATING A RESOURCE
router.put("/houses/:houseId", async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const { address, owner_name, num_rooms, has_garden } = req.body;

    if (!address || !owner_name || !num_rooms || !has_garden) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the required data",
        data: null,
      });
    }

    const houseData = await pool.query(`select * from ${table} where id=$1;`, [houseId]);

    if (houseData.rows.length < 1) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
        data: null,
      });
    }

    const editData = await pool.query(
      `update ${table}
      set address=$1,owner_name=$2,num_rooms=$3,has_garden=$4
      where id=$5;`,
      [address, owner_name, num_rooms, has_garden, houseId]
    );

    return res.status(200).json({
      status: true,
      message: "Successfully edit data",
      data: editData.rowCount,
    });
  } catch (error) {
    next(error);
  }
});

// DELETING A RESOURCE
router.delete("/houses/:houseId", async (req, res, next) => {
  try {
    const { houseId } = req.params;

    const houseData = await pool.query(`select * from ${table} where id=$1;`, [houseId]);

    if (houseData.rows.length < 1) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
        data: null,
      });
    }

    const deleteData = await pool.query(
      `delete from ${table}
        where id=$1;`,
      [houseId]
    );

    return res.status(200).json({
      status: true,
      message: "Successfully delete data",
      data: deleteData.rowCount,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
