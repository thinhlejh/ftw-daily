import config from "../../config";

export const filterOutSelectedRange = (fields, duration, index) => {
  const { value } = fields;
  const result = [...config.timeRange];
  value.map((val, i) => {
    if (i === index) {
      return;
    }
    const start = result.findIndex(v => v === val.startTime);
    result.splice(start, duration + 1);
  });
  return result.filter(time => {
    const endTimeRaw = parseInt(time.split(':')[0]) + duration;
    const endTime = endTimeRaw > 9 ? `${endTimeRaw}:00` : `0${endTimeRaw}:00`;
    return result.includes(endTime);
  });
};

export const selectEndTime = (duration, startTime) => {
  const endTimeRaw = parseInt(startTime.split(':')[0]) + duration;
  return endTimeRaw > 9 ? `${endTimeRaw}:00` : `0${endTimeRaw}:00`;
};
