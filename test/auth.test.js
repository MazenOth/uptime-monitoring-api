const mongoose = require("mongoose");
const request = require("supertest");
const config = require("../config");
const app = require ("../app.js");
const bcrypt = require ("../utils/bcrypt");
const ApplicationUser = require ("../models/ApplicationUser");

const userData = {
  email: "myemail@gmail.com",
  password: "123456789",
};

beforeAll(async () => {
  await ApplicationUser.findOneAndDelete({ email: userData.email });
  await ApplicationUser.findOneAndDelete({ email: "redhat@mail.com" });
});
  describe("GET test api", () => {
    it("should return hello", async () => {
      const res = await request(app).get("/");
      console.log("sample test ||  " + res.text);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("POST /signup", () => {
    it("should create the user and send email to verify ", async () => {
      const res = await request(app).post("/signup").send(userData);
      expect(res.statusCode).toBe(201);
    });

    it("should give 401 error as the user already exists", async () => {
      const res = await request(app).post("/signup").send(userData);
      expect(res.statusCode).toBe(401);
    });

    it("should give 400 error as as there is no password", async () => {
      const res = await request(app)
        .post("/signup")
        .send({ email: "mohamed@mail.com" });
      expect(res.statusCode).toBe(400);
    });

    it("should give 400 error as as there is no email", async () => {
      const res = await request(app)
        .post("/signup")
        .send({ password: "21323123" });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /verification", () => {
    it("should verify my email ", async () => {
      const user = await ApplicationUser.findOne({ email: userData.email });

      const res = await request(app).get(`/verification/${user.verificationId}`);
      expect(res.statusCode).toBe(200);
    });

    it("should return 404 because there is not user found  ", async () => {
      const user = await ApplicationUser.findOne({ email: userData.email });
      const res = await request(app).get(`/verification/9999999`);
      expect(res.statusCode).toBe(404);
    });

    it("should return 400 as the email is already verified ", async () => {
      const user = await ApplicationUser.findOne({ email: userData.email });
      const res = await request(app).get(`/verification/${user.verificationId}`);
      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /signin", () => {
    it("should return 200 and sign the user in by sending token", async () => {
      const res = await request(app).post("/signin").send(userData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ accessToken: expect.any(String) })
      );
    });

    it("should return 400 if the email is missing ", async () => {
      const res = await request(app)
        .post("/signin")
        .send({ password: "151515151515" });
      expect(res.statusCode).toBe(400);
    });

    it("should return 400 if the password is missing ", async () => {
      const res = await request(app)
        .post("/signin")
        .send({ email: "myemail@gmail.com" });
      expect(res.statusCode).toBe(400);
    });

    it("should return 400 if the password is incorrect ", async () => {
      const res = await request(app)
        .post("/signin")
        .send({ email: "myemail@gmail.com", password: "101010101010" });
      expect(res.statusCode).toBe(400);
    });

    it("should return 401 when the email is not verified ", async () => {
      const user = await new ApplicationUser({
        email: "redhat@mail.com",
        password: bcrypt.encryptPassword("123456789"),
      }).save();
      const res = await request(app)
        .post("/signin")
        .send({ email: "redhat@mail.com", password: "123456789" });
      expect(res.statusCode).toBe(401);
    });
  });

