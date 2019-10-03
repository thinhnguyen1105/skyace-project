import { createModel, ModelConfig } from '@rematch/core';
import { IPaypalPageState, ICreateNewTransactionPayload, ISendBookingConfirmEmailInfo, ICreateNewConversation, ICreateOrUpdateNewConversation } from './interfaces';
import { message } from 'antd';
import { getTransactionService, getTuitionsService, getConversationService, getTutorSchedulesService, getSessionsService, getPromoCodeService } from '../../../service-proxies';
import firebase from 'firebase';
import initFirebaseApp from '../../../nextjs/helpers/init-firebase';
import moment from 'moment';

const paypalPageModel: ModelConfig<IPaypalPageState> = createModel({
  state: {
    _id: '',
    address: {
      city: '',
      country_code: '',
      line1: '',
      postal_code: '',
      recipient_name: '',
      state: '',
    },
    cancelled: false,
    email: '',
    paid: false,
    payerID: '',
    paymentId: '',
    paymentToken: '',
    returnUrl: '',
    isBusy: false,
    isPaymentSuccess: false,
    transactionId: '',
    tuitionId: undefined
  },
  reducers: {
    starting: (state: IPaypalPageState): IPaypalPageState => {
      return {
        ...state,
        isBusy: true,
      };
    },
    onPaymentSuccess: (state: IPaypalPageState): IPaypalPageState => {
      return {
        ...state,
        isPaymentSuccess: true,
      };
    },
    fetchTuitionId: (state: IPaypalPageState, payload: string): IPaypalPageState => {
      return {
        ...state,
        tuitionId: payload
      }
    },
    updateTransaction: (state: IPaypalPageState, payload: string): IPaypalPageState => {
      return {
        ...state,
        transactionId: payload
      }
    }
  },
  effects: {
    async createNewTransaction(_payload: ICreateNewTransactionPayload, _rootstate: any): Promise<void> {
      try {
        this.starting();
        
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async updatePaymentSuccess(payload: string[], _rootstate: any): Promise<void> {
      try {
        this.starting();
        const tutorSchedulesService = getTutorSchedulesService();
        tutorSchedulesService.updatePaymentSuccess(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async getAccessToken(_rootstate: any): Promise<void> {
      try {
        this.starting();
        const transactionService = getTransactionService();
        const result = await transactionService.getAccessToken();
        this.getAccessTokenSuccess({ tokenInfo: result });
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async sendBookingConfirmEmail(payload: ISendBookingConfirmEmailInfo, _rootState: any): Promise<void> {
      try {
        const tuitionsService = getTuitionsService();
        await tuitionsService.sendBookingConfirmEmail(payload);
      } catch (error) {
        console.log(error);
      }
    },
    async createNewConversation(payload: ICreateNewConversation, _rootstate: any): Promise<void> {
      try {
        const conversationsService = getConversationService();
        const newConversation = await conversationsService.createConversation({
          participants: payload.participants,
          tuition: payload.tuitionId,
        } as any);

        if (!firebase.apps.length) {
          initFirebaseApp();
        }
        const tuitionsService = getTuitionsService();
        const tuition = await tuitionsService.findByTuitionId(payload.tuitionId);
        const notificationContent = `New course ${tuition.course.subject.slice(0, 2).toUpperCase()}${tuition.course.level.slice(0, 1).toUpperCase()}${String(tuition.course.grade).slice(0, 1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')} has been created`;

        await firebase.database().ref(`skyace-message/${newConversation._id}/messages`).push({
          sender: {
            id: 'system',
            fullName: 'system'
          },
          createdAt: new Date().getTime(),
          content: notificationContent,
          type: 'notification'
        });
        await firebase.database().ref(`skyace-notification/${payload.participants[0]}/${newConversation._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });
        await firebase.database().ref(`skyace-notification/${payload.participants[1]}/${newConversation._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });
      } catch (error) {
        console.log(error);
      }
    },
    async createOrUpdateNewGroupConversation(payload: ICreateOrUpdateNewConversation, _rootstate: any): Promise<void> {
      try {
        const conversationsService = getConversationService();
        const newConversation = await conversationsService.createOrUpdateGroupConversation({
          groupTuition: payload.groupTuition,
        } as any);

        if (!firebase.apps.length) {
          initFirebaseApp();
        }
        const tuitionsService = getTuitionsService();
        const groupTuition = await tuitionsService.getGroupTuitionById(payload.groupTuition);
        const notificationContent = `New student ${payload.studentName} has joined course ${groupTuition.course.subject.slice(0, 2).toUpperCase()}${groupTuition.course.level.slice(0, 1).toUpperCase()}${String(groupTuition.course.grade).slice(0, 1).toUpperCase()}-${moment((groupTuition as any).createdAt).format('YYMMDD')}.`;

        await firebase.database().ref(`skyace-message/${newConversation._id}/messages`).push({
          sender: {
            id: 'system',
            fullName: 'system'
          },
          createdAt: new Date().getTime(),
          content: notificationContent,
          type: 'notification'
        });

        const tutorPromise = firebase.database().ref(`skyace-notification/${payload.tutor}/${newConversation._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });
        const studentPromise = firebase.database().ref(`skyace-notification/${payload.student}/${newConversation._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });
        const studentPromises = groupTuition.students.map(val => {
          return firebase.database().ref(`skyace-notification/${val._id}/${newConversation._id}`).update({
            seen: false,
            lastMessage: 'System Notification',
          });
        })

        await Promise.all([tutorPromise, studentPromise, ...studentPromises]);
      } catch (error) {
        console.log(error);
      }
    },
    async createTuitionAndSessions(payload: {newBookings: any; newTuitionInfo: any, option: string, blockSize: number, transactionData: any}): Promise<void> {
      try {
        const tuitionsService = getTuitionsService();
        const sessionsService = getSessionsService();
        const conversationsService = getConversationService();

        const newTuition = await tuitionsService.createTuition({
          ...payload.newTuitionInfo,
          option: payload.option,
        } as any);
        this.fetchTuitionId(newTuition);
        const newConversation = await conversationsService.createConversation({
          participants: [payload.newTuitionInfo.student, payload.newTuitionInfo.tutor],
          tuition: newTuition._id,
        } as any);

        const sessionsPromise = sessionsService.createSessions({
          // TODO : Sort first
          sessionList: payload.newBookings.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item, index) => ({
            course: payload.newTuitionInfo.course,
            courseForTutor: payload.newTuitionInfo.courseForTutor,
            tuition: newTuition._id,
            tutor: payload.newTuitionInfo.tutor,
            student: payload.newTuitionInfo.student,
            start: item.start,
            end: item.end,
            materials: [],
            isPaid: payload.option === 'partiallyPay' ? (index <= payload.blockSize - 1) ? true : false : true,
            isPaymentNotified: false,
          } as any))
        });

        // Create transaction
        const transactionService = getTransactionService();
        const resultTrans = await transactionService.create({
          ...payload.transactionData,
          tuition: newTuition._id
        } as any);

        // Send confirm email
        const sendMailPromise = tuitionsService.sendBookingConfirmEmail({
          tutorId: payload.newTuitionInfo.tutor,
          studentId: payload.newTuitionInfo.student,
          tuitionId: newTuition._id,
          transactionId: resultTrans._id,
        });

        // Create new conversation
        if (!firebase.apps.length) {
          initFirebaseApp();
        }
        const notificationContent = `New course ${newTuition.referenceId} has been created`;
        const messagePromise = firebase.database().ref(`skyace-message/${newConversation._id}/messages`).push({
          sender: {
            id: 'system',
            fullName: 'system'
          },
          createdAt: new Date().getTime(),
          content: notificationContent,
          type: 'notification'
        });
        const notification1Promise = firebase.database().ref(`skyace-notification/${payload.newTuitionInfo.student}/${newConversation._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });
        const notification2Promise = firebase.database().ref(`skyace-notification/${payload.newTuitionInfo.tutor}/${newConversation._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });

        await Promise.all([sessionsPromise, sendMailPromise, messagePromise, notification1Promise, notification2Promise]);
      } catch (error) {
        console.log(error);
      }
    },
    async useCode(payload: string, _rootstate: any): Promise<void> {
      try {
        const promoCodeService = getPromoCodeService();
        await promoCodeService.useCode(payload);
      } catch (error) {
        message.error(error.message, 4);
      }
    },
    async updateSessions(payload: {newBookings: any; newTuitionInfo: any, option: string, blockSize: number, transactionData: any}): Promise<void> {
      try {
        const tuitionsService = getTuitionsService();
        const sessionsService = getSessionsService();

        const sessionsPromise = sessionsService.updateSessions({
          // TODO : Sort first
          sessionList: payload.newBookings.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((item, index) => ({
            _id: item._id,
            isPaid: payload.option === 'partiallyPay' ? (index <= payload.blockSize - 1) ? true : false : true,
            isPaymentNotified: false,
          } as any))
        });

        // Create transaction
        const transactionService = getTransactionService();
        const resultTrans = await transactionService.create({
          ...payload.transactionData,
          tuition: payload.newTuitionInfo.tuitionId,
        } as any);

        // Send confirm email
        const sendMailPromise = tuitionsService.sendBookingConfirmEmail({
          tutorId: payload.newTuitionInfo.tutor,
          studentId: payload.newTuitionInfo.student,
          tuitionId: payload.newTuitionInfo.tuitionId,
          transactionId: resultTrans._id
        });

        await Promise.all([sessionsPromise, sendMailPromise]);
      } catch (error) {
        console.log(error);
      }
    }
  }
});

export default paypalPageModel;