function getFutureDate(offsetDays) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
}

const mockAvailability = {
  "court-1": {
    [getFutureDate(0)]: ["09:00", "10:00", "11:00", "17:00"],
    [getFutureDate(1)]: ["08:00", "09:00", "18:00"],
    [getFutureDate(2)]: ["07:00", "12:00", "19:00"]
  },
  "court-2": {
    [getFutureDate(0)]: ["13:00", "14:00", "15:00"],
    [getFutureDate(2)]: ["09:00", "11:00", "16:00"],
    [getFutureDate(3)]: ["08:00", "10:00", "18:00"]
  },
  "court-3": {
    [getFutureDate(1)]: ["07:30", "08:30", "17:30"],
    [getFutureDate(2)]: ["09:30", "10:30", "18:30"],
    [getFutureDate(4)]: ["08:00", "12:00", "13:00"]
  },
  "court-4": {
    [getFutureDate(1)]: ["16:00", "17:00"],
    [getFutureDate(3)]: ["09:00", "10:00", "11:00"],
    [getFutureDate(5)]: ["14:00", "15:00", "18:00"]
  }
};

export default mockAvailability;
