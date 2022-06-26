import * as nodemailer from "nodemailer";
// import { writeFileSync } from "fs";

import { createHtmlJson, htmlJsonToString } from "./html-json";

const kHtmlHeader =
  "<head>" +
  '<meta charset="utf-8" />' +
  '<meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
  '<meta name="viewport" content="width=device-width,initial-scale=1.0" />' +
  "</head>";

const outlook = {
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  requireTLS: true,
  port: 587,
  auth: {
    user: "a@b.com",
    pass: "abcdefg",
  },
  debug: false,
  logger: false,
};

async function emailActivity(data: any) {
  try {
    const html = buildHtml(data.activity);
    // writeFileSync("./testHtmlStr.html", html);
    // console.log("buildHtml data:", data);
    // console.log("buildHtml:", html);
    // return;

    // let smtpTransport = nodemailer.createTransport(msiGlobal);
    const smtpTransport = nodemailer.createTransport(outlook);
    const info = await smtpTransport.sendMail({
      from: "a@b.com",
      to: data.emails.toString(),
      subject: "MSI Activity Notification", // Subject line
      text: "MSI Activity Notification.", // plain text content
      html: html, // html content
    });

    const ret = { msg: "Accepted: " + info.accepted.toString() };
    return ret;
  } catch (e) {
    console.log(e);
    return { err: "Server failure." };
  }
}

function buildJsonForActivity(activity: any) {
  const tableJson = createHtmlJson("table");
  try {
    tableJson.styles.push(
      "width: 100%;border-collapse: collapse;border-style:solid"
    );
    tableJson.properties.push(`border="1px"`);

    const styleStr =
      "border: 1px solid;margin: 2px 2px 2px 2px; padding:2px 2px 2px 2px";
    const elmThead = createHtmlJson("thead");
    elmThead.styles.push(styleStr);
    tableJson.children.push(elmThead);
    const elmTheadTr = createHtmlJson("tr");
    elmTheadTr.styles.push(styleStr);
    elmThead.children.push(elmTheadTr);
    let elmTheadTrTh = createHtmlJson("th");
    elmTheadTr.children.push(elmTheadTrTh);
    elmTheadTrTh.innerText = "Item";
    elmTheadTrTh.styles.push(styleStr);
    elmTheadTrTh = createHtmlJson("th");
    elmTheadTr.children.push(elmTheadTrTh);
    elmTheadTrTh.innerText = "Description";
    elmTheadTrTh.styles.push(styleStr);

    const elmTbody = createHtmlJson("tbody");
    tableJson.children.push(elmTbody);
    elmTbody.styles.push(styleStr);

    if (activity["title"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Title";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["title"];
    }
    if (activity["startDateTime"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Date time";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = new Date(
        activity["startDateTime"]
      ).toLocaleString();
      elmTbodyTrTd.innerText += " - ";
      elmTbodyTrTd.innerText += new Date(
        activity["endDateTime"]
      ).toLocaleString();
      elmTbodyTrTd.styles.push(styleStr);
    }
    if (activity["affectedSystems"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Affected Systems";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = activity["affectedSystems"];
      elmTbodyTrTd.styles.push(styleStr);
    }
    if (activity["impact"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Impact";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["impact"];
    }
    if (activity["noImpact"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "No Impact";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["noImpact"];
    }
    if (activity["stakeholders"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Stakeholders";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["stakeholders"];
    }
    if (activity["teams"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Implementation Teams";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["teams"];
    }
    if (activity["contactPersons"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Contact Persons";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["contactPersons"];
    }
    if (activity["riskAndMitigation"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Risk & Mitigation";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["riskAndMitigation"];
    }
    if (activity["remarks"]) {
      const elmTbodyTr = createHtmlJson("tr");
      elmTbodyTr.styles.push(styleStr);
      elmTbody.children.push(elmTbodyTr);
      let elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.innerText = "Remarks";
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.styles.push("font-weight: bold");
      elmTbodyTrTd = createHtmlJson("td");
      elmTbodyTr.children.push(elmTbodyTrTd);
      elmTbodyTrTd.styles.push(styleStr);
      elmTbodyTrTd.innerText = activity["remarks"];
    }
  } catch (e) {
    console.log(e);
  }

  return tableJson;
}

function buildHtml(activity: any): string {
  const bodyJson = createHtmlJson("body");

  try {
    let elm = createHtmlJson("b");
    elm.innerText = "Dear Stakeholders,";
    bodyJson.children.push(elm);

    // email intro
    elm = createHtmlJson("p");
    elm.innerText =
      "Please be informed that activity '" +
      activity.title +
      "' has been planned.";
    // elm.styles.push("margin-top: 30px");
    bodyJson.children.push(elm);
    elm = createHtmlJson("p");
    elm.innerText = "Kindly refer to the below schedule and impact details:";
    bodyJson.children.push(elm);

    // activity details
    const activityJson = buildJsonForActivity(activity);
    bodyJson.children.push(activityJson);

    // email farewell
    elm = createHtmlJson("p");
    elm.innerText = "Please let us know if any queries.";
    bodyJson.children.push(elm);
    elm = createHtmlJson("p");
    elm.innerText = "Thanks.";
    bodyJson.children.push(elm);
    elm = createHtmlJson("p");
    elm.innerText = "MSI Team";
    bodyJson.children.push(elm);
  } catch (e) {
    console.log(e);
  }
  const html = "<html>" + kHtmlHeader + htmlJsonToString(bodyJson) + "</html>";
  return html;
}

export { emailActivity };
