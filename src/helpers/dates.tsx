export const getInitSdate = (): string => {
  const today = new Date();
  const initStartDate = new Date(today.setMonth(today.getMonth() - 3));
  const initSdate = `${initStartDate.getFullYear()}${(
    initStartDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${initStartDate.getDate().toString().padStart(2, "0")}`;
  return initSdate;
};

export const getInitEdate = (): string => {
  const initEndDate = new Date();
  const initEdate = `${initEndDate.getFullYear()}${(initEndDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${initEndDate.getDate().toString().padStart(2, "0")}`;
  return initEdate;
};
