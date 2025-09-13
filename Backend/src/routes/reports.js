import express from 'express';
import ExcelJS from 'exceljs';
import { Event } from '../models/Event.js';
import { Contribution } from '../models/Contribution.js';
import { Expense } from '../models/Expense.js';
import { Member } from '../models/Member.js';
import { getEventSummary } from '../services/eventSummary.js';

export const reportsRouter = express.Router({ mergeParams: true });

reportsRouter.get('/excel', async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const [contributions, expenses, summary] = await Promise.all([
    Contribution.find({ event_id: eventId })
      .populate({ path: 'member_id', model: Member, select: 'full_name house_number contact_number' })
      .sort({ payment_date: 1 }),
    Expense.find({ event_id: eventId }).sort({ payment_date: 1 }),
    getEventSummary(eventId)
  ]);

  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet('Summary');
  const contribSheet = workbook.addWorksheet('Member Contributions');
  const expenseSheet = workbook.addWorksheet('Vendor Payments');

  // Summary sheet
  summarySheet.getCell('A1').value = 'Event Name:';
  summarySheet.getCell('B1').value = event.event_name;
  summarySheet.getCell('A2').value = 'Event Year:';
  summarySheet.getCell('B2').value = event.event_year;
  summarySheet.getCell('A4').value = 'Total Collections:';
  summarySheet.getCell('B4').value = summary.totalCollections;
  summarySheet.getCell('A5').value = 'Total Expenses:';
  summarySheet.getCell('B5').value = summary.totalExpenses;
  summarySheet.getCell('A6').value = 'Surplus / Deficit:';
  summarySheet.getCell('B6').value = summary.surplus;

  // Contributions sheet header
  contribSheet.columns = [
    { header: 'House Number', key: 'house_number', width: 15 },
    { header: 'Member Name', key: 'member_name', width: 25 },
    { header: 'Contact Number', key: 'contact_number', width: 18 },
    { header: 'Number of Attendees', key: 'attendees', width: 22 },
    { header: 'Amount Paid', key: 'amount_paid', width: 15 },
    { header: 'Payment Date', key: 'payment_date', width: 18 }
  ];

  for (const c of contributions) {
    contribSheet.addRow({
      house_number: c.member_id?.house_number || '',
      member_name: c.member_id?.full_name || '',
      contact_number: c.member_id?.contact_number || '',
      attendees: c.attendees,
      amount_paid: c.amount_paid,
      payment_date: c.payment_date ? new Date(c.payment_date).toISOString().slice(0, 10) : ''
    });
  }

  // Expenses sheet header
  expenseSheet.columns = [
    { header: 'Vendor Name', key: 'vendor_name', width: 25 },
    { header: 'Service/Purchase Description', key: 'description', width: 35 },
    { header: 'Amount Paid', key: 'amount_paid', width: 15 },
    { header: 'Payment Date', key: 'payment_date', width: 18 }
  ];

  for (const e of expenses) {
    expenseSheet.addRow({
      vendor_name: e.vendor_name,
      description: e.description,
      amount_paid: e.amount_paid,
      payment_date: e.payment_date ? new Date(e.payment_date).toISOString().slice(0, 10) : ''
    });
  }

  const safeName = `${event.event_name.replace(/\s+/g, '_')}_${event.event_year}_Financial_Report.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);

  await workbook.xlsx.write(res);
  res.end();
});

