
//const freq_dk = jest.genMockFromModule('../freq_dk')

// eslint-disable-next-line no-undef
export default jest.fn(() => {
  return [
    {
      id: 1,
      Range_name: 'Range 1',
      Channel_name: 'Can 1',
      Range_freq: '206,0-214,0',
      Carrier_freq_V: '',
      Carrier_freq_A: '',
      Carrier_LO_1: '',
      Carrier_LO_2: '',
      Mirror_channel_1: 'Can 2',
      Mirror_channel_2: 'Can 3'
    },
    {
      id: 2,
      Range_name: 'Range 1',
      Channel_name: 'Can 2',
      Range_freq: '206,0-214,0',
      Carrier_freq_V: '',
      Carrier_freq_A: '',
      Carrier_LO_1: '',
      Carrier_LO_2: '',
      Mirror_channel_1: 'Can 1',
      Mirror_channel_2: 'Can 3'
    },
    {
      id: 3,
      Range_name: 'Range 2',
      Channel_name: 'Can 3',
      Range_freq: '206,0-214,0',
      Carrier_freq_V: '',
      Carrier_freq_A: '',
      Carrier_LO_1: '',
      Carrier_LO_2: '',
      Mirror_channel_1: 'Can 1',
      Mirror_channel_2: 'Can 2'
    },
  ]
})