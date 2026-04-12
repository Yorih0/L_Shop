import request from "supertest";
import fs from "fs";
import path from "path";
import app from "./server";

const DB_PATH = path.join(process.cwd(), "src/db/users.json");

beforeAll(() => {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
});

beforeEach(() => {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
});

describe("USERS API (JWT + cookies)", () => {

  test("POST /register → should create user", async () => {
    const user = {
      login: "testuser",
      password: "123456",
      repeatPassword: "123456",
      phone: "+375 29 123 4567"
    };

    const res = await request(app)
      .post("/api/users/register")
      .send(user);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /login → should return JWT cookie", async () => {
    const user = {
      login: "testuser",
      password: "123456",
      repeatPassword: "123456",
      phone: "+375 29 123 4567"
    };

    await request(app).post("/api/users/register").send(user);

    const res = await request(app)
      .post("/api/users/login")
      .send({ login: user.login, password: user.password });

    expect(res.status).toBe(200);

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/session=/);
  });

  test("GET /me → should return user decoded from JWT", async () => {
    const user = {
      login: "testuser",
      password: "123456",
      repeatPassword: "123456",
      phone: "+375 29 123 4567"
    };

    await request(app).post("/api/users/register").send(user);

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ login: user.login, password: user.password });

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const res = await request(app)
      .get("/api/users/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.login).toBe(user.login);
    expect(res.body.phone).toBe(user.phone);
  });

  test("POST /login → wrong password should fail", async () => {
    const user = {
      login: "testuser",
      password: "123456",
      repeatPassword: "123456",
      phone: "+375 29 123 4567"
    };

    await request(app).post("/api/users/register").send(user);

    const res = await request(app)
      .post("/api/users/login")
      .send({ login: user.login, password: "wrong" });

    expect([400, 401]).toContain(res.status);
  });

  test("POST /logout → should clear JWT cookie", async () => {
    const user = {
      login: "testuser",
      password: "123456",
      repeatPassword: "123456",
      phone: "+375 29 123 4567"
    };

    await request(app).post("/api/users/register").send(user);

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ login: user.login, password: user.password });

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const res = await request(app)
      .post("/api/users/logout")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);

    const logoutCookies = res.headers["set-cookie"];
    expect(logoutCookies[0]).toMatch(/session=;/);
  });
});
