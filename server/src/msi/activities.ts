import { randomUUID } from "crypto";
import { dbOpen } from "../db-ops";
import { emailActivity as sendEmail } from "./email";

const dbActivitiesColumns = [
  "title",
  "status",
  "affectedSystems",
  "startDateTime",
  "endDateTime",
  "impact",
  "noImpact",
  "stakeholders",
  "teams",
  "riskAndMitigation",
  "remarks",
  "contactPersons",
  "createDateTime",
  "updateDateTime",
  "type", // Activity, Issue, Template
];

const dbTemplatesColumns = ["id", "group1", "group2", "created", "updated"];

function InsertActivity(data: any) {
  if (!data || !data.title) return;

  try {
    let fields = `"id"`;
    const id = randomUUID();
    let values = "'" + id + "'";

    for (const val of dbActivitiesColumns) {
      if (["createDateTime", "updateDateTime"].includes(val)) {
        continue;
      }
      if (data[val]) {
        // console.log(data[val]);
        data[val] = data[val].replace(/'/g, "''");
        fields += `,"${val}"`;
        values += `,'${data[val]}'`;
      }
    }

    fields += `,"createDateTime"`;
    values += ",'" + new Date().toISOString() + "'";
    // console.log(fields.length, fields);
    // console.log(values.length, values);

    let sql = `insert into "Activities"(${fields}) values(${values});`;
    console.log("sql: ", sql);
    let db = dbOpen();
    let stmt = db.prepare(sql);
    stmt.run();
    db.close();

    if (data["type"] == "Template") {
      fields = `"id"`;
      values = "'" + id + "'";
      fields += `,"group1"`;
      values += `,'${data["group1"]}'`;
      fields += `,"group2"`;
      values += `,'${data["group2"]}'`;
      fields += `,"created"`;
      values += ",'" + new Date().toISOString() + "'";
      sql = `insert into "Templates"(${fields}) values(${values});`;
      console.log(sql);
      db = dbOpen();
      stmt = db.prepare(sql);
      stmt.run();
      db.close();
    }

    return id;
  } catch (e) {
    console.log(e);
    return "";
  }
}

function UpdateActivity(data: any) {
  if (!data || !data.id || !data.title) return;

  try {
    // for Activities table
    let sql = `update "Activities" set `;
    for (const val of dbActivitiesColumns) {
      if (val == "updateDateTime") {
        continue;
      }
      if (data[val]) {
        // console.log(data[key]);
        data[val] = data[val].replace(/'/g, "''");
        sql += `"${val}"='${data[val]}',`;
      }
    }
    sql += `"updateDateTime"='${new Date().toISOString()}' `;
    sql += `where "id"='${data.id}';`;
    console.log("sql: ", sql);
    const db = dbOpen();
    const stmt = db.prepare(sql);
    stmt.run();
    db.close();

    // for Templates table
    if (data["type"] == "Template") {
      let sql = `update "Templates" set `;
      for (const val of dbTemplatesColumns) {
        if (["id", "updated"].includes(val)) {
          continue;
        }
        if (data[val]) {
          // console.log(data[key]);
          data[val] = data[val].replace(/'/g, "''");
          sql += `"${val}"='${data[val]}',`;
        }
      }
      sql += `"updated"='${new Date().toISOString()}' `;
      sql += `where "id"='${data.id}';`;
      console.log("update template sql: ", sql);
      const db = dbOpen();
      const stmt = db.prepare(sql);
      stmt.run();
      db.close();
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function DeleteActivity(id: string) {
  try {
    const db = dbOpen();
    let stmt = db.prepare(`delete from Activities where id='${id}';`);
    stmt.run();
    stmt = db.prepare(`delete from Templates where id='${id}';`);
    stmt.run();
    db.close();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function SelectActivity(id: string) {
  try {
    const db = dbOpen();
    const stmt = db.prepare(`select * from Activities where id='${id}';`);
    const record = stmt.get();
    db.close();
    return record;
  } catch (e) {
    console.log(e);
    return e;
  }
}

function AllActivity() {
  try {
    const db = dbOpen();
    const stmt = db.prepare(
      `select * from Activities where id not in (select id from Templates) order by "startDateTime" desc;`
    );
    const items = stmt.all();
    // console.log(items);
    // console.log(typeof items);
    db.close();
    return items;
  } catch (e) {
    console.log(e);
  }
}
function ActivityTemplates() {
  try {
    const db = dbOpen();
    const stmt = db.prepare(
      `select a.*,t.group1,t.group2 from Activities a, Templates t where a.id=t.id order by "group1","group2";`
    );
    const items = stmt.all();
    db.close();
    return items;
  } catch (e) {
    console.log(e);
  }
}

async function emailActivity(data: any) {
  const ret = await sendEmail(data);
  return ret;
}

// yc for testing
const startDate = new Date();
startDate.setDate(new Date().getDate() - 5);
for (let i = 0; i < 10; ++i) {
  const act1: any = {};
  for (const val of dbActivitiesColumns) {
    act1[val] = "act" + i;
  }
  act1.startDateTime = startDate.toISOString();
  act1.endDateTime = startDate.toISOString();
  startDate.setDate(startDate.getDate() + 1);
  // InsertActivity(act1);
}
// DeleteActivity("0c081a21-60fd-4f4e-9cba-00c202e6f866");
// DeleteActivity("1741edd5-e1f7-4af5-8690-ff389b1dd3db");
// DeleteActivity("5f543ef6-b1d8-426e-9936-0c3ec40c5d84");
// SelectActivity("4af12771-91e3-4dd7-8e32-c04b61b769d2");
// let items: Activity[] = AllActivity();
// items.forEach((item) => {
//   console.log(JSON.stringify(item));
// });

// let j = { type: "INSERT" };
// console.log(JSON.stringify(j));

export {
  ActivityTemplates,
  AllActivity,
  InsertActivity,
  UpdateActivity,
  DeleteActivity,
  emailActivity,
  dbActivitiesColumns,
};
