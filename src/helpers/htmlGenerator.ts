import ejs from "ejs";
import fs from "fs";
import path from "path";
import { MailTemplatesEnum } from "../constants/Enums/mailEnums";
import { IMailMetaData } from "./mailTemplates";

export async function htmlFromEjs(payload: {
  templateName: MailTemplatesEnum;
  metaData: IMailMetaData;
}) {
  let { templateName, metaData } = payload;

  const templateFile = path.join(
    process.cwd(),
    `/src/templates/${templateName}.ejs`
  );

  if (!fs.existsSync(templateFile)) {
    throw new Error(`EJS template not found: ${templateName}.ejs`);
  }

  try {
    const html = await ejs.renderFile(templateFile, { metaData });
    return html;
  } catch (e: any) {
    throw new Error(
      `Error rendering EJS template ${templateName}: ${e.message}`
    );
  }
}
