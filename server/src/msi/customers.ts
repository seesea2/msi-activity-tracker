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
    let db = dbOpen();

    // check if existing
    if (data.orgEmail != data.email) {
      let stmt = db.prepare(
        `select * from Emails where "email"='${data.email}';`
      );
      let record = stmt.get();
      if (record && record.email) {
        db.close();
        return { err: "Issue: Email existed." };
      }
    }

    let dateTimeStr = new Date().toISOString();
    // update existing email address in db:Emails
    if (data.orgEmail) {
      let setInfo = ``;
      for (let val of dbEmailsColumns) {
        if (["created", "updated"].includes(val)) {
          continue;
        }
        if (data[val]) {
          setInfo += `"${val}"='${data[val]}',`;
        }
      }
      setInfo += `"updated"='${dateTimeStr}'`;
      let sql = `update "Emails" 
        set ${setInfo} where "email"='${data.orgEmail}';`;
      console.log(sql);
      let stmt = db.prepare(sql);
      let ret = stmt.run();
      console.log(ret);
    }

    // update existing records in db:EmailGroupRelation
    if (data.orgEmail) {
      let sql = `update "EmailGroupRelation" set "email"='${data.email}', "updated"='${dateTimeStr}' where "email"='${data.orgEmail}';`;
      console.log(sql);
      let stmt = db.prepare(sql);
      let ret = stmt.run();
      console.log(ret);
    }

    // insert new email address into db:Emails
    if (!data.orgEmail) {
      let fields = "";
      let values = "";
      for (let val of dbEmailsColumns) {
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

      let sql = `insert into "Emails"(${fields}) values(${values});`;
      console.log("sql: ", sql);
      let stmt = db.prepare(sql);
      let record = stmt.run();
      console.log("insert record result:", record);
    }

    // insert new email into group
    for (let group of data.groups) {
      if (data.orgGroups && !data.orgGroups.includes(group)) {
        let sql = `insert into "EmailGroupRelation"('email','group','created') values('${data.email}', '${group}', '${dateTimeStr}');`;
        console.log("insert EmailGroupRelation sql:", sql);
        let stmt = db.prepare(sql);
        let ret = stmt.run();
        console.log(ret);
      }
    }

    // remove orgEmail from orgGroup
    for (let orgGroup of data.orgGroups) {
      if (data.groups && !data.groups.includes(orgGroup)) {
        let sql = `delete from "EmailGroupRelation" where "email"='${data.email}' and "group"='${orgGroup}';`;
        console.log("delete from EmailGroupRelation sql:", sql);
        let stmt = db.prepare(sql);
        let ret = stmt.run();
        console.log(ret);
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
    let db = dbOpen();

    // check if existing
    if (data.orgGroup != data.group) {
      let stmt = db.prepare(
        `select * from "EmailGroupRelation" where "group"='${data.group}';`
      );
      let record = stmt.get();
      if (record && record.group) {
        db.close();
        return { err: "Issue: Group name existed." };
      }
    }

    let dateTimeStr = new Date().toISOString();
    // update existing email group
    if (data.orgGroup && data.orgGroup != data.group) {
      let sql = `update "EmailGroupRelation" 
        set "group"='${data.group}', "updated"='${dateTimeStr}' 
        where "group"='${data.orgGroup}';`;
      console.log(sql);
      let stmt = db.prepare(sql);
      let ret = stmt.run();
      console.log(ret);
    }

    // insert new email into group
    for (let email of data.emails) {
      if (data.orgEmails && !data.orgEmails.includes(email)) {
        let sql = `insert into "EmailGroupRelation"('email','group','created') values('${email}', '${data.group}', '${dateTimeStr}' );`;
        console.log("insert EmailGroupRelation sql:", sql);
        let stmt = db.prepare(sql);
        stmt.run();
      }
    }

    // remove orgEmail from orgGroup
    for (let orgEmail of data.orgEmails) {
      if (data.emails && !data.emails.includes(orgEmail)) {
        let sql = `delete from "EmailGroupRelation" where "email"='${orgEmail}' and "group"='${data.group}';`;
        console.log("delete from EmailGroupRelation sql:", sql);
        let stmt = db.prepare(sql);
        let ret = stmt.run();
        console.log(ret);
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
    let db = dbOpen();
    let stmt = db.prepare(`delete from Emails where "email"='${email}';`);
    let ret = stmt.run();
    console.log(ret);

    console.log(`delete from EmailGroupRelation where "email"='${email}';`);
    stmt = db.prepare(
      `delete from EmailGroupRelation where "email"='${email}';`
    );
    ret = stmt.run();
    console.log(ret);
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
    let db = dbOpen();
    console.log(`delete from EmailGroupRelation where "group"='${group}';`);
    let stmt = db.prepare(
      `delete from EmailGroupRelation where "group"='${group}';`
    );
    let ret = stmt.run();
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
    let db = dbOpen();
    let stmt = db.prepare(`select * from Emails;`);
    let records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}
function allEmailGroups() {
  try {
    let db = dbOpen();
    let stmt = db.prepare(`select distinct "group" from EmailGroupRelation;`);
    let records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}

function emailsInGroup(group: any) {
  try {
    let db = dbOpen();
    let stmt = db.prepare(
      `select distinct "email" from EmailGroupRelation where "group"='${group}';`
    );
    let records = stmt.all();
    db.close();
    return records;
  } catch (e) {
    console.log(e);
    return e;
  }
}

function groupsOfEmail(email: any) {
  try {
    let db = dbOpen();
    let stmt = db.prepare(
      `select distinct "group" from EmailGroupRelation where "email"='${email}';`
    );
    let records = stmt.all();
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
