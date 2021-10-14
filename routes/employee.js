const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmplyee,
  suspendEmployee,
  activateEmployee,
} = require("../controller/employee");
const router = express.Router();

router.route("/").post(createEmployee).get(getAllEmployees);
router
  .route("/:id")
  .put(updateEmployee)
  .delete(deleteEmplyee)
  .patch(suspendEmployee);
router.route("/modify/suspend/:id").patch(suspendEmployee);
router.route("/modify/activate/:id").patch(activateEmployee);
module.exports = router;
