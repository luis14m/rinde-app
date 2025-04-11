export const formatRut = (rut: string): string => {
  if (!rut) return '';
  
  // Remove all non-alphanumeric characters except K/k
  let value = rut.replace(/[^0-9Kk]/g, '');
  
  // Convert to uppercase
  value = value.toUpperCase();
  
  if (value.length <= 1) return value;
  
  // Add only the dash before the verification digit
  const dv = value.slice(-1);
  const rutBody = value.slice(0, -1);
  
  return `${rutBody}-${dv}`;
};