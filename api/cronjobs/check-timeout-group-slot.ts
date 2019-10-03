import * as cron from 'node-cron';
import groupTuitionsService from '../../api/modules/elearning/group-tuitions/service';

const checkTimeoutGroupSlotsJob = cron.schedule('0 */10 * * * *', async () => {
  console.log('Checking Timeout Group Slots ...');

  const timeoutSlotTuitions = await groupTuitionsService.getAllTimeoutSlots();
  const cancelSlotsPromise = timeoutSlotTuitions.map(val => {
    const maxDate = Number(Date.now() - 10 * 60 * 1000);
    return val.slotsHolded.filter(item => item.startTime <= maxDate).map(slot => {
      return groupTuitionsService.cancelSlot(val.tenant, {
        tuition_id : val._id.toString(),
        student_id : slot.student
      })
    })
  })

  const mergedPromises = [].concat.apply([], cancelSlotsPromise);

  await Promise.all(mergedPromises);
  console.log('Done, ' + mergedPromises.length + ' slots have been canceled!');
});

export default checkTimeoutGroupSlotsJob;
