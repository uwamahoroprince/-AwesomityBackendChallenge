const supertest = require("supertest");
const app = require("../server");
const Employee = require("../model/employee");

const request = supertest(app);
const EmployeeForPositiveTests = {
  name: "prince",
  nationalId: "1234567891234567",
  phoneNumber: "+250789312195",
  email: "princeu356@gmail.com",
  status: "ACTIVE",
  position: "DEVELOPER",
  dateOfBirth: "2002,12,09",
  password: "abc123",
};
const employee = {
  name: "thierry",
  nationalId: "123223567891234567",
  phoneNumber: "+250789312125",
  email: "thierryprince84@gmail.com",
  status: "ACTIVE",
  position: "DEVELOPER",
  dateOfBirth: "2002,12,09",
  password: "abc123123",
};
const EmployeeForNegativeTests = {
  phoneNumber: "+250789312195",
  email: "princeu356@gmail.com",
  status: "ACTIVE",
  position: "DEVELOPER",
  dateOfBirth: "2002,12,09",
  password: "abc123",
};
afterEach(async () => {
  await Employee.deleteMany({});
});
let data = "";
beforeEach(async () => {
  await Employee.deleteMany({});
  await Employee.create(employee);
  data = await Employee.find({});
});
//TEST CREATE EMPLOYEE ENDPOINT
describe("POST /api/employee", () => {
  //POSITIVE TESTS
  describe("give all required employee parameters", () => {
    test("should respond with 201 status code", async () => {
      const responce = await request
        .post("/api/employee")
        .send(EmployeeForPositiveTests);
      expect(responce.status).toBe(201);
    });
    test("should specify json in the content type header", async () => {
      const responce = await request
        .post("/api/employee")
        .send(EmployeeForPositiveTests);
      expect(responce.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  //NEGATIVE TEST
  describe("missing required employee parameters", () => {
    test("should respond with 400 status code", async () => {
      const responce = await request
        .post("/api/employee")
        .send(EmployeeForNegativeTests);
      expect(responce.status).toBe(500);
    });
  });
});

//TEST FIND EMPLOYEE ENDPOINT
describe("GET /api/employee", () => {
  //POSITIVE TESTS
  describe("sending GET REQUEST", () => {
    test("should respond with 200 status code", async () => {
      const responce = await request
        .get("/api/employee")
        .send(EmployeeForPositiveTests);
      expect(responce.status).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const responce = await request
        .get("/api/employee")
        .send(EmployeeForPositiveTests);
      expect(responce.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  //NEGATIVE TEST
  describe("sending request to unknown route", () => {
    test("should respond with 404 status code", async () => {
      const responce = await request
        .get("/api/")
        .send(EmployeeForNegativeTests);
      expect(responce.status).toBe(404);
    });
  });
});
//TEST UPDATE EMPLOYEE ENDPOINT
describe("UPDATE /api/employee", () => {
  //POSITIVE TESTS
  describe("sending PUT REQUEST", () => {
    test("should respond with 200 status code", async () => {
      const responce = await request
        .put(`/api/employee/${data[0]._id}`)
        .send(EmployeeForPositiveTests);
      expect(responce.status).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const responce = await request
        .put(`/api/employee/${data[0]._id}`)
        .send(EmployeeForPositiveTests);
      expect(responce.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  //NEGATIVE TEST
  describe("sending request to unknown route", () => {
    test("should respond with 404 status code", async () => {
      const responce = await request
        .put(`/api/${data[0]._id}`)
        .send(EmployeeForNegativeTests);
      expect(responce.status).toBe(404);
    });
  });
});
//TEST DELETE EMPLOYEE ENDPOINT
describe("DELETE /api/employee", () => {
  //POSITIVE TESTS
  describe("sending DELETE REQUEST", () => {
    test("should respond with 200 status code", async () => {
      const responce = await request
        .delete(`/api/employee/${data[0]._id}`)
        .send(EmployeeForPositiveTests);
      expect(responce.status).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const responce = await request
        .delete(`/api/employee/${data[0]._id}`)
        .send(EmployeeForPositiveTests);
      expect(responce.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  //NEGATIVE TEST
  describe("sending request to unknown route", () => {
    test("should respond with 404 status code", async () => {
      const responce = await request
        .delete(`/api/${data[0]._id}`)
        .send(EmployeeForNegativeTests);
      expect(responce.status).toBe(404);
    });
  });
});
//TEST DELETE EMPLOYEE ENDPOINT
describe("PATCH /api/employee", () => {
  //POSITIVE TESTS
  describe("sending DELETE REQUEST", () => {
    test("should respond with 200 status code", async () => {
      const responce = await request
        .patch(`/api/employee/${data[0]._id}`)
        .send(EmployeeForPositiveTests);
      expect(responce.status).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const responce = await request
        .patch(`/api/employee/${data[0]._id}`)
        .send(EmployeeForPositiveTests);
      expect(responce.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  //NEGATIVE TEST
  describe("sending request to unknown route", () => {
    test("should respond with 404 status code", async () => {
      const responce = await request
        .patch(`/api/${data[0]._id}`)
        .send(EmployeeForNegativeTests);
      expect(responce.status).toBe(404);
    });
  });
});
