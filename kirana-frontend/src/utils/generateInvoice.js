// src/utils/generateInvoice.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 👈 Direct function import kiya

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  // 1. BRANDING & HEADER SECTION
  doc.setFillColor(14, 165, 233); // Sky Blue Color
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SACHIN DEPARTMENTAL STORE", 15, 25);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Premium Quality Groceries & Wholesale Supplies", 15, 32);

  // 2. METADATA SECTION INFO
  doc.setTextColor(51, 65, 85); 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("INVOICE STATEMENT", 15, 53);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const customerName = order.userId?.name || "Valued Customer";
  doc.text(`Customer Name: ${customerName.toUpperCase()}`, 15, 61);

  doc.text(`Invoice Ref Id: #INV-${order._id.slice(-6).toUpperCase()}`, 15, 67);

  const secureDateObj = new Date(order.createdAt);

  const orderDate = secureDateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const orderTime = secureDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  doc.text(`Order Date & Time: ${orderDate} | ${orderTime}`, 15, 73);
  doc.text(`Payment ID: ${order.paymentId || 'Razorpay Online'}`, 15, 79);
  doc.text(`Transaction Status: ${order.status}`, 15, 85);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 90, 195, 90);

  // 3. TABLE BODY MAPPING DATA
  const tableRows = [];
  order.items.forEach((item, index) => {
    const name = item.productId?.name || "Wholesale Inventory Item";
    const price = item.price;
    const qty = item.quantity;
    const unit = item.productId?.unit || "Pcs";
    const total = price * qty;
    
    tableRows.push([
      index + 1,
      name,
      `Rs. ${price}`,
      `${qty} ${unit}`,
      `Rs. ${total}`
    ]);
  });

  // 4. GENERATING TABLE LAYOUT (🔥 doc.autoTable ki jagah direct function use kiya)
  autoTable(doc, {
    startY: 95,
    head: [['S.No', 'Product Particulars', 'Wholesale Price', 'Quantity', 'Net Amount']],
    body: tableRows,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { font: "helvetica", fontSize: 9, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 85 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 }
    }
  });

  // 5. TOTAL PAYABLE
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Gross Total Amount: Rs. ${order.totalAmount}`, 135, finalY);

  // Footer Greeting Note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for choosing Sachin Departmental Store! Have a great day ahead.", 15, finalY + 20);

  // 6. DOWNLOAD TRIGGER
  doc.save(`Invoice_SachinStore_${order._id.slice(-6).toUpperCase()}.pdf`);
};