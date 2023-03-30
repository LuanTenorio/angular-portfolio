export function yearsSinceUtil(date: Date){
  const today = new Date();
  let years = today.getFullYear() - date.getFullYear();

  if (
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
  ) 
    years--;

  return years;
}
