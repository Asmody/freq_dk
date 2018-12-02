
import { mount } from '@vue/test-utils'
import '@/plugins/element-ui.js'
import App from '@/App.vue'
jest.mock('@/api/freq_dk')

describe('App.vue', () => {
  const wrapper = mount(App)
  it('loads freq table then mounted', () => {
    //expect(wrapper.vm.freqTable).toBeArray()
    expect(wrapper.vm.freqTable).toBeArrayOfSize(3) // from __mock__/freq_dk.js
  })
  it('ranges contains uniq values', () => {
    expect(wrapper.vm.ranges).toBeArrayOfSize(2) // from __mock__/freq_dk.js
  })
  it('if uncheck switch_1, switch_2 must be checked', () => {
    wrapper.find('input#Mirror_channel_1').setChecked(false)
    expect(wrapper.vm.mirrors.Mirror_channel_1).toBe(false)
    expect(wrapper.find('table.el-table__body tr.el-table__row:first-child td:nth-child(10)').classes()).toContain('mirror-off')
    expect(wrapper.vm.mirrors.Mirror_channel_2).toBe(true)
    expect(wrapper.find('table.el-table__body tr.el-table__row:first-child td:nth-child(11)').classes()).not.toContain('mirror-off')

    wrapper.find('input#Mirror_channel_2').setChecked(false)
    expect(wrapper.vm.mirrors.Mirror_channel_1).toBe(true)
    expect(wrapper.find('table.el-table__body tr.el-table__row:first-child td:nth-child(11)').classes()).not.toContain('mirror-off')
    expect(wrapper.vm.mirrors.Mirror_channel_2).toBe(false)
    expect(wrapper.find('table.el-table__body tr.el-table__row:first-child td:nth-child(11)').classes()).toContain('mirror-off')

  })
})