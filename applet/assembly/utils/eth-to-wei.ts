export function stringToFloat(value: string): f64 {
  const valueFloat = parseFloat(value);

  if (isNaN(valueFloat)) {
    throw new Error("Value is not a number");
  }

  return valueFloat;
}
