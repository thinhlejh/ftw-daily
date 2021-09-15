export const mapValuesToEntries = values => {
  const { daysOfWeek, ...rest } = values;
  const entries = [];
  daysOfWeek.forEach(day => {
    rest[day].forEach(timeSlot => {
      entries.push({
        ...timeSlot,
        dayOfWeek: day,
        seats: 1,
      })
    })
  });
  console.log(entries);
  return entries;
};
