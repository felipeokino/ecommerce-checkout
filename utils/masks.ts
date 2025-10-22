export const cardNumberMask = (value: string) => {
  return value
    .replace(/\D/g, '') 
    .replace(/(.{4})/g, '$1 ') 
    .trim(); 
}