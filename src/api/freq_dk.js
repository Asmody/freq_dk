import freqCSV from '../../data/freq_dk.csv'

const splitCSV = (csv, sep) => {
  for (var foo = csv.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
}

const loadData = () => {
  let csvLines = freqCSV.split(/\r\n|\n/)
  const headers = splitCSV(csvLines.shift(), ',')

  const lines = csvLines.map(itm => {
    const row = splitCSV(itm, ',').reduce((r, v, i) => {
      r[headers[i]] = v
      return r
    }, {})
    return row
  })
  return lines
}

export default loadData