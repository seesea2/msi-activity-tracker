import { dbOpen } from "../db-ops";
import { createHash } from "crypto";

const dbUserColumns = [
  "id",
  "pwd",
  "email",
  "team",
  "role",
  "created",
  "updated",
  "status",
];

// eslint-disable-next-line
const allLoginUsers: any = [];

// eslint-disable-next-line
function InsertUser(data: any) {
  // console.log("InsertUser", data);
  if (!data || !data.id || !data.pwd) {
    return { err: "ID & Password are required!" };
  }

  try {
    let fields = "created";
    let values = `'${new Date().toISOString()}'`;
    for (const val of dbUserColumns) {
      if (data[val]) {
        data[val] = data[val].replace(/'/g, "''");
        fields += `,"${val}"`;
        if (val != "pwd") {
          values += `,'${data[val]}'`;
        } else {
          const pwdHash = createHash("sha1").update(data[val]).digest("hex");
          values += `,'${pwdHash}'`;
        }
      }
    }

    const sql = `insert into "Users"(${fields}) values(${values});`;
    // console.log("sql: ", sql);
    const db = dbOpen();
    const stmt = db.prepare(sql);
    const ret = stmt.run();
    db.close();
    if (ret && ret.changes) {
      return { msg: "Done" };
    }
    return { err: "Create user failed." };
  } catch (e) {
    // console.log(typeof e, e);
    return { err: e };
  }
}

// eslint-disable-next-line
function ChangePwd(data: any) {
  if (!data || !data.oldPwd || !data.newPwd) {
    return { err: 'Invalid inputs.' };
  }

  try {
    const oldPwdHash = createHash("sha1").update(data.oldPwd).digest("hex");
    const newPwdHash = createHash("sha1").update(data.newPwd).digest("hex");

    const sql = `update "Users" set "pwd"='${newPwdHash}' where "id"='${data.id}' and "pwd"='${oldPwdHash}'`;

    const db = dbOpen();
    const stmt = db.prepare(sql);
    const ret = stmt.run();
    db.close();
    console.log("ret", ret)
    if (ret && ret.changes) {
      return { msg: "Done" };
    }
    return { err: "No record is changed." };
  } catch (e) {
    console.log(e);
    return { err: e };
  }
}

function DeleteUser(id: string) {
  try {
    const db = dbOpen();
    const stmt = db.prepare(`delete from Users where id='${id}';`);
    stmt.run();
    db.close();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function LoginUser(data: any) {
  try {
    if (!data.id || !data.pwd) {
      return;
    }

    for (const i in allLoginUsers) {
      if (allLoginUsers[i].id == data.id) {
        return allLoginUsers[i];
      }
    }

    const hash = createHash("sha1").update(data.pwd).digest("hex");
    const sql = `select * from Users where id='${data.id}' and pwd='${hash}';`;
    const db = dbOpen();
    const stmt = db.prepare(sql);
    const record = stmt.get();
    db.close();
    if (record) {
      allLoginUsers.push(record);
      return record;
    } else {
      return { err: "user or password not correct." };
    }
  } catch (e) {
    console.log(e);
    return e.message;
  }
}

function LogoutUser(data: any) {
  try {
    for (const i in allLoginUsers) {
      if (allLoginUsers[i].id == data.id) {
        allLoginUsers.splice(i, 1);
        return true;
      }
    }
  } catch (e) {
    console.log(e);
    return e.message;
  }
}

function AllUsers() {
  try {
    const db = dbOpen();
    const stmt = db.prepare(`select * from Users;`);
    const items = stmt.all();
    db.close();
    return items;
  } catch (e) {
    console.log(e);
  }
}

// for initial user
const user = {
  id: "test",
  pwd: "test",
};
InsertUser(user);

export {
  AllUsers,
  ChangePwd,
  DeleteUser,
  InsertUser,
  LoginUser,
  LogoutUser,
  allLoginUsers,
};
