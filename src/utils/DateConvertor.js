export const dateConvertor = async (data) => {
  const dateObj = new Date(date);

  const options = { year: "numeric", month: "long", day: "numeric" };

  const formattedDate = await dateObj.toLocaleDateString("en-US", options);

  const day = await dateObj.getDate();

  // Determine the day number suffix
  let daySuffix;
  if (day >= 11 && day <= 13) {
    daySuffix = "th";
  } else {
    switch (day % 10) {
      case 1:
        daySuffix = "st";
        break;
      case 2:
        daySuffix = "nd";
        break;
      case 3:
        daySuffix = "rd";
        break;
      default:
        daySuffix = "th";
    }
  }

  // Rearrange the date components
  const rearrangedDate = formattedDate.replace(
    /(\d+)([^\d]+)/,
    `$1${daySuffix}$2`
  );

  return rearrangedDate;
};
