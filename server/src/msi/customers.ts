import { dbOpen } from "../db-ops";

const dbEmailsColumns = [
  "email",
  "name",
  "company",
  "team",
  "role",
  "created",
  "updated",
  "status",
];

function postEmailAddr(data: any) {
  if (!data || !data.email || !data.email.includes("@")) {
    return { err: "Invalid email." };
  }

  try {
    data.email = data.email.toLowerCase();
    if (data.company) {
      data.company = data.company.toUpperCase();
    }
    const db = dbOpen();

    // check if existing
    if (data.orgEmail != data.email) {
      const stmt = db.prepare(
        `select * from Emails where "email"='${data.email}';`
      );
      const record = stmt.get();
      if (record && record.email) {
        db.close();
        return { err: "Issue: Email existed." };
      }
    }

    const dateTimeStr = new Date().toISOString();
    // update existing email address in db:Emails
    if (data.orgEmail) {
      let setInfo = ``;
      for (const val of dbEmailsColumns) {
        if (["created", "updated"].includes(val)) {
          continue;
        }
        if (data[val]) {
          setInfo += `"${val}"='${data[val]}',`;
        }
      }
      setInfo += `"updated"='${dateTimeStr}'`;
      const sql = `update "Emails" 
        set ${setInfo} where "email"='${data.orgEmail}';`;
      console.log(sql);
      const stmt = db.prepare(sql);
      stmt.run();
    }

    // update existing records in db:EmailGroupRelation
    if (data.orgEmail) {
      const sql = `update "EmailGroupRelation" set "email"='${data.email}', "updated"='${dateTimeStr}' where "email"='${data.orgEmail}';`;
      console.log(sql);
      const stmt = db.prepare(sql);
      stmt.run();
    }

    // insert new email address into db:Emails
    if (!data.orgEmail) {
      let fields = "";
      let values = "";
      for (const val of dbEmailsColumns) {
        if (["created", "updated"].includes(val)) {
          continue;
        }
        if (data[val]) {
          fields += `"${val}",`;
          values += `'${data[val]}',`;
        }
      }

      fields += `"created"`;
      values += `'${dateTimeStr}'`;

      const sql = `insert into "Emails"(${fields}) values(${values});`;
      console.log("sql: ", sql);
      const stmt = db.prepare(sql);
      stmt.run();
    }

    // insert new email into group
    for (const group of data.groups) {
      if (data.orgGroups && !data.orgGroups.includes(group)) {
        const sql = `insert into "EmailGroupRelation"('email','group','created') values('${data.email}', '${group}', '${dateTimeStr}');`;
        const stmt = db.prepare(sql);
        stmt.run();
      }
    }

    // remove orgEmail from orgGroup
    for (const orgGroup of data.orgGroups) {
      if (data.groups && !data.groups.includes(orgGroup)) {
        const sql = `delete from "EmailGroupRelation" where "email"='${data.email}' and "group"='${orgGroup}';`;
        const stmt = db.prepare(sql);
        stmt.run();
      }
    }

    db.close();

    return { msg: "Successful." };
    // return record;
  } catch (e) {
    console.log(e);
    return e;
  }
}

function postEmailGroup(data: any) {
  if (!data || !data.group) {
    return { err: "Invalid group name." };
  }

  try {
    const db = dbOpen();

    // check if existing
    if (data.orgGroup != data.group) {
      const stmt = db.prepare(
        `select * from "EmailGroupRelation" where "group"='${data.group}';`
      );
      const record = stmt.get();
      if (record && record.group) {
        db.close();
        return { err: "Issue: Group name existed." };
      }
    }

    const dateTimeStr = new Date().toISOString();
    // update existing email group
    if (data.orgGroup && data.orgGroup != data.group) {
      const sql = `update "EmailGroupRelation" 
        set "group"='${data.group}', "updated"='${dateTimeStr}' 
        where "group"='${data.orgGroup}';`;
      console.log(sql);
      const stmt = db.prepare(sql);
      stmt.run();
    }

    // insert new email into group
    for (const email of data.emails) {
      if (data.orgEmails && !data.orgEmails.includes(email)) {
        const sql = `insert into "EmailGroupRelation"('email','group','created') values('${email}', '${data.group}', '${dateTimeStr}' );`;
        const stmt = db.prepare(sql);
        stmt.run();
      }
    }

    // remove orgEmail from orgGroup
    for (const orgEmail of data.orgEmails) {
      if (data.emails && !data.emails.includes(orgEmail)) {
        const sql = `delete from "EmailGroupRelation" where "email"='${orgEmail}' and "group"='${data.group}';`;
        const stmt = db.prepare(sql);
        stmt.run();
      }
    }

    db.close();

    return { msg: "Successful." };
  } catch (e) {
    console.log(e);
    return e;
  }
}

function deleteEmail(email: string) {
  console.log("deleteEmail:", email);
  try {
    console.log(`delete from Emails where "email"='${email}';`);
    const db = dbOpen();
    let stmt = db.prepare(`delete from Emails where "email"='${email}';`);
    let ret = stmt.run();

    stmt = db.prepare(
      `delete from EmailGroupRelation where "email"='${email}';`
    );
    ret = stmt.run();
    db.close();
    return ret;
  } catch (e) {
    console.log(e);
    return e;
  }
}
function deleteEmailGroup(group: string) {
  console.log("deleteEmailGroup:", group);
  try {
    const db = dbOpen();
    console.log(`delete from EmailGroupRelation where "group"='${group}';`);
    const stmt = db.prepare(
      `delete from EmailGroupRelation where "group"='${group}';`
    );
    const ret = stmt.run();
    console.log(ret);
    db.close();
    return ret;
  } catch (e) {
    console.log(e);
    return e;
  }
}
function allEmails() {
  try {
    const db = dbOpen();
    const stmt = db.prepare(`select * from Emails;`);
    const records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}
function allEmailGroups() {
  try {
    const db = dbOpen();
    const stmt = db.prepare(`select distinct "group" from EmailGroupRelation;`);
    const records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}

function emailsInGroup(group: any) {
  try {
    const db = dbOpen();
    const stmt = db.prepare(
      `select distinct "email" from EmailGroupRelation where "group"='${group}';`
    );
    const records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}

function groupsOfEmail(email: any) {
  try {
    const db = dbOpen();
    const stmt = db.prepare(
      `select distinct "group" from EmailGroupRelation where "email"='${email}';`
    );
    const records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export {
  postEmailAddr,
  allEmails,
  allEmailGroups,
  postEmailGroup,
  deleteEmail,
  deleteEmailGroup,
  emailsInGroup,
  groupsOfEmail,
};
