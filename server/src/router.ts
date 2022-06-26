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
  const record = LoginUser(req.body);
  if (record && record.id == req.body.id) {
    res.status(200).send();
  } else {
    res.status(200).send(record);
  }
});
apiRouter.post("/msi/logout", (req, res) => {
  const record = LogoutUser(req.body);
  if (record) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }
});
apiRouter.post("/msi/user", (req, res) => {
  try {
    const ret = InsertUser(req.body.user);
    res.status(200).send(ret);
  } catch (err) {
    res.status(500).send(err);
  }
});
apiRouter.put("/msi/user/pwd", (req, res) => {
  const ret = ChangePwd(req.body);
  res.status(200).send(ret);
});
apiRouter.get("/msi/activities", (req, res) => {
  const acts = AllActivity();
  res.status(200).send(acts);
});
apiRouter.get("/msi/activities/templates", (req, res) => {
  const templates = ActivityTemplates();
  res.status(200).send(templates);
});

// customer email management
apiRouter.post("/msi/emails", (req, res) => {
  const ret = postEmailAddr(req.body);
  res.status(200).send(ret);
});
apiRouter.get("/msi/emails", (req, res) => {
  const records = allEmails();
  res.status(200).send(records);
});
apiRouter.delete("/msi/emails/:email", (req, res) => {
  const ret = deleteEmail(req.params.email);
  res.status(200).send(ret);
});
apiRouter.delete("/msi/emails/groups/:group", (req, res) => {
  const ret = deleteEmailGroup(req.params.group);
  res.status(200).send(ret);
});
apiRouter.get("/msi/emails/groups", (req, res) => {
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
  const ret = postEmailGroup(req.body);
  res.status(200).send(ret);
});

apiRouter.post("/msi/activities", (req, res) => {
  const id = InsertActivity(req.body);
  res.status(200).send({ id: id });
});
apiRouter.put("/msi/activities", (req, res) => {
  const id = UpdateActivity(req.body);
  if (id) {
    res.status(200).send({ id: id });
  } else {
    res.status(500).send({ err: "update failed." });
  }
});
apiRouter.delete("/msi/activities/:id", (req, res) => {
  const ret = DeleteActivity(req.params.id);
  if (ret == true) {
    res.status(200).send();
  } else {
    res.status(500).send({ err: "failed" });
  }
});

apiRouter.post("/msi/activities/email", async (req, res) => {
  const ret = await emailActivity(req.body);
  res.status(200).send(ret);
});

export default apiRouter;
