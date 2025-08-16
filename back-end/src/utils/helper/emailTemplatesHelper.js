

function emailTemplatesHelper(templateName, templateData={}) {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template not found: ${templateName}`);
  }
  // if templateData is not provided, return template
  if (!templateData) {
    return template;
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
