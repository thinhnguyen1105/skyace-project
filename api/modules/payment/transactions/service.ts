import * as Joi from 'joi';
import * as transactionRespository from './respository';
import * as path from 'path';
import * as moment from 'moment';
const Invoice = require('nodeice');
import { IFindTransactionDetail, ICreateTransactionInput, IFindTransactionsQuery, IFindTransactionsResult } from './interface';
let nodeXlsx = require('node-xlsx');

const findTransactions = async (tenantId: string, query: IFindTransactionsQuery): Promise<IFindTransactionsResult> => {
  return await transactionRespository.findTransactions(tenantId, query);
};

const createTransaction = async (tenantId: string, transaction: ICreateTransactionInput): Promise<IFindTransactionDetail | undefined> => {
  try {
    const validationRule = Joi.object().keys({
    });
    const { error } = Joi.validate(transaction, validationRule, {
      allowUnknown: true,
    });
    if (error) {
      throw new Error(error.details[0].message);
    }

    const newTrans = await transactionRespository.create(tenantId, transaction);
    const result = await transactionRespository.findById(newTrans._id);
    if (result && result.tuition) {
      const invoiceObj = {
        invoice: {
          tuitionReferenceID: result.tuition? result.tuition.referenceId : '',
          studentName: result.student ? result.student.fullName : '',
          studentEmail : result.student ? result.student.email : '',
          studentPhone  : result.student ? result.student.phone ? result.student.phone.phoneID || '' + result.student.phone.phoneNumber || '' : '' : '',
          tutorName: result.tutor ? result.tutor.fullName : '',
          tutorEmail: result.tutor ? result.tutor.email : '',
          tutorPhone  : result.tutor ? result.tutor.phone ? result.tutor.phone.phoneID || '' + result.tutor.phone.phoneNumber || '' : '' : '',
          createdAt: `${moment(result.createdAt).format('DD MMM YYYY')}`,
          paymentStatus : result.option === 'partiallyPay' ? 'Partially Paid' : 'Full Paid',
          transactionID: result._id,
          hourlyRate: result.tuition ? result.tuition.courseForTutor ? result.tuition.courseForTutor.hourlyRate : 0 : 0,
          hourPerSession: result.tuition ? result.tuition.course ? result.tuition.course.hourPerSession : 0 : 0,
          session: result.tuition ? result.tuition.course ? result.tuition.course.session : 0 : 0,
          recurrence: result.tuition ? result.tuition.course ? result.tuition.sessions && result.tuition.sessions.length ? (Number(result.tuition.sessions.length) / Number(result.tuition.course.session))  : 0 : 0 : 0,
          totalAmount: result.totalAmount,
          commission : Number(result.totalAmount) * 0.25,
          receiveAmount: Number(result.totalAmount) * 0.75,
          paidAmount: result.option === 'partiallyPay' ? result.tuition.course && result.tuition.courseForTutor ? (Number(result.tuition.courseForTutor.hourlyRate) * Number(result.tuition.course.session) * Number(result.tuition.course.hourPerSession)) : result.startAmount : result.startAmount,
          payableAmount: Number(result.totalAmount) - Number(result.option === 'partiallyPay' ? result.tuition.course ? (Number(result.tuition.courseForTutor.hourlyRate) * Number(result.tuition.course.session) * Number(result.tuition.course.hourPerSession)) : result.totalAmount : result.totalAmount),
        }
      }
      await createInvoiceForStudent(invoiceObj);
      await createInvoiceForTutor(invoiceObj);
      await transactionRespository.update({_id: result._id, invoice: `/static/invoices/${result._id}-student.pdf`});
    }
    return newTrans;
  } catch (err) {
    console.log(err);
  }
};

const update = async (transaction: any): Promise<IFindTransactionDetail> => {
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
  });
  const { error } = Joi.validate(transaction, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  return await transactionRespository.update(transaction);
};

const exportTransactions = async (tenant: string, query: string): Promise<any> => {
  var data = await transactionRespository.findAllTransactions(query ? query : tenant);
  let dataExcel = [] as any;
  
  let arrHeaderTitle = [] as any;
  arrHeaderTitle.push('Date Of Transaction');
  arrHeaderTitle.push('PayPal ID');
  arrHeaderTitle.push('Tutor Email');
  arrHeaderTitle.push('Student Email');
  arrHeaderTitle.push('Status');
  arrHeaderTitle.push('Amount Of Money');
  dataExcel.push(arrHeaderTitle);

  if (data && data.length) {
    for (let item of data) {
      if (item && item._doc) {
        let rowItemValue = [] as any;
        const createdAt = item._doc.createdAt ? new Date(item._doc.createdAt).toDateString() : "N/A"
        rowItemValue.push(createdAt || "N/A");
        rowItemValue.push(item._doc.paymentToken || "N/A");
        rowItemValue.push(item._doc.tutor ? item._doc.tutor.email : "N/A");
        rowItemValue.push(item._doc.student ? item._doc.student.email : "N/A");
        const status = item._doc.paid ? 'Paid' : item._doc.canceled ? 'Canceled' : 'N/A';
        rowItemValue.push(status || "N/A");
        let total: number = 0;
        let amountMoney = "";
        if (item._doc.paymentDetail && item._doc.paymentDetail.transactions && item._doc.paymentDetail.transactions.length) {
          for (let val of item._doc.paymentDetail.transactions) {
            if (val.amount) {
              total += Number(val.amount.total);
            }
          }
          amountMoney = `${total} ${item.paymentDetail.transactions[0].amount.currency}`
        }
        rowItemValue.push(amountMoney || "N/A");
        dataExcel.push(rowItemValue);
      }
    }
  }

  let buffer = nodeXlsx.build([{name: "List Transactions", data: dataExcel}])
  return buffer;
}

const createInvoiceForStudent = async (_body: any): Promise<any> => {
  try {
    let myInvoice = new Invoice({
      config: {
          template: path.resolve(__dirname , `../../../../../../static/email-template/student-invoice.html`),
          tableRowBlock: path.resolve(__dirname , `../../../../../../static/email-template/student-invoice.html`)
      }, 
      data: _body
    }); 
    await myInvoice.toPdf(path.resolve(__dirname + `../../../../../../../static/invoices/${_body.invoice.transactionID}-student.pdf`));
  } catch (err) {
    console.log(err);
  }
}

const createInvoiceForTutor = async (_body: any): Promise<any> => {
  try {
    let myInvoice = new Invoice({
      config: {
          template: path.resolve(__dirname , `../../../../../../static/email-template/tutor-invoice.html`),
          tableRowBlock: path.resolve(__dirname , `../../../../../../static/email-template/tutor-invoice.html`)
      }, 
      data: _body
    }); 
    await myInvoice.toPdf(path.resolve(__dirname + `../../../../../../../static/invoices/${_body.invoice.transactionID}-tutor.pdf`));
  } catch (err) {
    console.log(err);
  }
}

export default {
  findTransactions,
  createTransaction,
  exportTransactions,
  update,
  createInvoiceForStudent,
  createInvoiceForTutor
};