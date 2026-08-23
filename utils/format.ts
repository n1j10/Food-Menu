

export const formatCurrency = (amount:number | null) => {

    const value = amount || 0;

    return new Intl.NumberFormat('en-US',{    
     
        style:'currency',
        currency:'IQD'
    }).format(value)


}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Baghdad',
  }).format(date);
};
