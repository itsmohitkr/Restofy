

async function generateInvoice(bill) {
  console.log(bill);
  
  const PDFDocument = require("pdfkit");
  const doc = new PDFDocument({ margin: 40 });
  let buffers = [];

  return new Promise((resolve, reject) => {
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ---------------- Header ----------------
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    // ---------------- Restaurant Info ----------------
    doc.fontSize(12).font("Helvetica-Bold").text("Restaurant Information:");
    doc
      .font("Helvetica")
      .text(`Name: ${bill.restaurantName}`)
      .text(`Address: ${bill.restaurantAddress}`)
      .text(`Email: ${bill.restaurantEmail}`)
      .text(`Phone: ${bill.restaurantPhoneNumber}`);
    doc.moveDown();

    // ---------------- Customer Info ----------------
    doc.font("Helvetica-Bold").text("Customer Information:");
    doc
      .font("Helvetica")
      .text(`Name: ${bill.customerName}`)
      .text(`Email: ${bill.customerEmail}`)
      .text(`Phone: ${bill.customerPhoneNumber}`);
    doc.moveDown();

    // ---------------- Bill Info ----------------
    doc.font("Helvetica-Bold").text("Bill Details:");
    doc
      .font("Helvetica")
      .text(`Bill ID: ${bill.id}`)
      .text(`Order ID: ${bill.orderId}`)
      .text(`Date: ${new Date(bill.createdAt).toLocaleString()}`);
    doc.moveDown();

    // ---------------- Items Table ----------------
    const tableTop = doc.y; // starting Y for table
    const itemX = 50;
    const qtyX = 200;
    const priceX = 270;
    const totalX = 350;
    const rowHeight = 20;

    // Header row
    doc.font("Helvetica-Bold");
    doc.text("Item", itemX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Price", priceX, tableTop);
    doc.text("Total", totalX, tableTop);

    // Draw line under header
    doc
      .moveTo(itemX, tableTop + 15)
      .lineTo(450, tableTop + 15)
      .stroke();

    // Table rows
    doc.font("Helvetica");
    let y = tableTop + rowHeight;

    if (Array.isArray(bill.billItems) && bill.billItems.length > 0) {
      bill.billItems.forEach((item) => {
        doc.text(item.itemName, itemX, y);
        doc.text(item.quantity.toString(), qtyX, y);
        doc.text(`${item.price}`, priceX, y);
        doc.text(`${item.totalPrice}`, totalX, y);
        y += rowHeight;
      });
    } else {
      doc.text("No items found.", itemX, y);
      y += rowHeight;
    }

    // ---------------- Total ----------------
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text(`Total Amount: RS ${bill.totalAmount}`, { align: "center" });

    // End the document
    doc.end();
  });
}

module.exports = generateInvoice;