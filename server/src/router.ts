import { Router } from "express";

// import { CheckWord, CheckLemmas } from "./dictionary/dictionary";
import {
  ActivityTemplates,
  AllActivity,
  InsertActivity,
  UpdateActivity,
  DeleteActivity,
  emailActivity,
} from "./msi/activities";
import { ChangePwd, LoginUser, LogoutUser, InsertUser } from "./msi/users";
import {
  allEmails,
  allEmailGroups,
  postEmailAddr,
  postEmailGroup,
  deleteEmail,
  deleteEmailGroup,
  emailsInGroup,
  groupsOfEmail,
} from "./msi/customers";

const apiRouter = Router();

// API for msi
apiRouter.post("/msi/login", (req, res) => {
  // console.log(req.body);
  let record = LoginUser(req.body);
  // res.status(200).send(record);
  if (record && record.id == req.body.id) {
    res.status(200).send();
  } else {
    res.status(200).send(record);
  }
});
apiRouter.post("/msi/logout", (req, res) => {
  // console.log(req.body);
  let record = LogoutUser(req.body);
  if (record) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }
});
apiRouter.post("/msi/user", (req, res) => {
  // console.log(req.body);
  try {
    let ret = InsertUser(req.body.user);
    res.status(200).send(ret);
  } catch (err) {
    res.status(500).send(err);
  }
});
apiRouter.put("/msi/user/pwd", (req, res) => {
  // console.log(req.body);
  let ret = ChangePwd(req.body);
  res.status(200).send(ret);
});
apiRouter.get("/msi/activities", (req, res) => {
  let acts = AllActivity();
  // console.log(typeof acts);
  res.status(200).send(acts);
});
apiRouter.get("/msi/activities/templates", (req, res) => {
  let templates = ActivityTemplates();
  // console.log(templates);
  res.status(200).send(templates);
});

// customer email management
apiRouter.post("/msi/emails", (req, res) => {
  let ret = postEmailAddr(req.body);
  res.status(200).send(ret);
});
apiRouter.get("/msi/emails", (req, res) => {
  let records = allEmails();
  res.status(200).send(records);
});
apiRouter.delete("/msi/emails/:email", (req, res) => {
  console.log("req delete:", req.params.email);
  let ret = deleteEmail(req.params.email);
  res.status(200).send(ret);
});
apiRouter.delete("/msi/emails/groups/:group", (req, res) => {
  console.log("req delete:", req.params.group);
  let ret = deleteEmailGroup(req.params.group);
  res.status(200).send(ret);
});
apiRouter.get("/msi/emails/groups", (req, res) => {
  // console.log("yc debug 1:", req.params);
  // console.log("yc debug 2:", req.query);

  let records = null;
  if (req.query && req.query.email) {
    records = groupsOfEmail(req.query.email);
  } else if (req.query && req.query.group) {
    records = emailsInGroup(req.query.group);
  } else {
    records = allEmailGroups();
  }
  res.status(200).send(records);
});

apiRouter.post("/msi/emails/group", (req, res) => {
  // console.log(req.body);
  let ret = postEmailGroup(req.body);
  // console.log("create group ret:", ret);
  res.status(200).send(ret);
});

apiRouter.post("/msi/activities", (req, res) => {
  // console.log("req post.body:", req.body);
  // console.log("req post.params:", req.params);
  // let data = JSON.parse(req.params);
  // console.log(req.body);

  let id = InsertActivity(req.body);
  res.status(200).send({ id: id });
});
apiRouter.put("/msi/activities", (req, res) => {
  // console.log("req put.body:", req.body);
  // console.log("req put.params:", req.params);
  // let data = JSON.parse(req.params);
  // console.log(req.body);

  let id = UpdateActivity(req.body);
  if (id) {
    res.status(200).send({ id: id });
  } else {
    res.status(500).send({ err: "update failed." });
  }
});
apiRouter.delete("/msi/activities/:id", (req, res) => {
  console.log("req delete:", req.params.id);
  let ret = DeleteActivity(req.params.id);
  if (ret == true) {
    res.status(200).send();
  } else {
    res.status(500).send({ err: "failed" });
  }
});

apiRouter.post("/msi/activities/email", async (req, res) => {
  // console.log("req email:", req.body);
  let ret: any = await emailActivity(req.body);
  res.status(200).send(ret);
});

export default apiRouter;
