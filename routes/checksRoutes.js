const express = require("express");
const authentication = require("../middleware/auth.js");
const {addCheck, getAllChecks, getCheckById, deleteCheck, updateCheck} = require("../controllers/checkController.js")

const router = express.Router();

router.post("/urlCheck", authentication, addCheck);
router.get("/urlCheck", authentication, getAllChecks);
router.get("/urlCheck/:id", authentication, getCheckById);
router.put("/urlCheck/:id", authentication, updateCheck);
router.delete("/urlCheck/:id", authentication, deleteCheck);

module.exports = router;
