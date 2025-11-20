const getDate = (date: string | number | Date) => {
  const newDate = new Date(date);
  return newDate.toDateString();
};

export default getDate;