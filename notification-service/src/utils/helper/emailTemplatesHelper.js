const emailTemplates = require("../templates/emailTemplates");


function emailTemplatesHelper(templateName, templateData) {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template not found: ${templateName}`);
  }

  // Replace placeholders in the template with actual data
  const populatedTemplate = {
    subject: template.subject.replace(/\{\{(\w+)\}\}/g, (_, key) => templateData[key] || ""),
    text: template.text.replace(/\{\{(\w+)\}\}/g, (_, key) => templateData[key] || ""),
    html: template.html.replace(/\{\{(\w+)\}\}/g, (_, key) => templateData[key] || ""),
  };

  return populatedTemplate;
}

module.exports = emailTemplatesHelper;
