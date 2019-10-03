import { ICreateTransactionInput } from "api/modules/payment/transactions/interface";

export interface IPaypalPageState {
  _id: string;
  address: {
    city: string;
    country_code: string;
    line1: string;
    postal_code: string;
    recipient_name: string;
    state: string;
  };
  cancelled: boolean;
  email: string;
  paid: boolean;
  payerID: string;
  paymentId: string;
  paymentToken: string;
  returnUrl: string;
  isBusy: boolean;
  isPaymentSuccess: boolean;
  tuitionId: string | undefined;
  transactionId: string;
}

export interface ICreateNewTransactionPayload {
  transactionInfo: ICreateTransactionInput;
  tuition?: string;
  groupTuition?: string;
  student: string;
  tutor: string;
  paymentDetail: any;
  startAmount: number;
  totalAmount: number;
  promoCode?: string;
  option: string;
}

export interface ISendBookingConfirmEmailInfo {
  tutorId: string;
  studentId: string;
  tuitionId: string;
  transactionId: string;
}

export interface ICreateNewConversation {
  participants: string[];
  tuitionId: string;
}

export interface ICreateOrUpdateNewConversation {
  groupTuition: string;
  tutor: string;
  student: string;
  studentName: string;
}