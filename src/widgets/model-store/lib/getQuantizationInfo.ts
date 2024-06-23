export function getQuantizationInfo(val: string) {
  const bit = val[1];
  const type = val.split(/[-_]/)[1]?.toUpperCase();
  const size = val[5];
  let info = `${bit} Bit`;

  if (type?.match(/\d/)) {
    info += ` Quantization`;
  } else {
    info += ` ${type}-Quantization`;
  }

  if (size) {
    info += ` (${size})`;
  }

  return info;
}
