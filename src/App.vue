<template>
  <el-container>
      <el-table
        ref="freqTable"
        :data="freqTable"
        style="width: 100%"
        height="100vh"
        border
        size="mini"
        :row-class-name="rowClass"
        :row-style="rowStyle"
        :cell-class-name="cellClass"
        @selection-change="onSelectionChange"
        @row-click="onRowClick"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="column in columns"
          :key="column.key"
          :prop="column.key"
          :width="column.width"
          :min-width="column['min-width']"
          :align="column.align"
        >
          <template slot="header" slot-scope="props">
            <el-switch
              v-if="column.key.indexOf('Mirror') == 0"
              v-model="mirrors[column.key]"
              :id="column.key"
              @change="mirrorChange(column.key)"
            ></el-switch>
            <span v-html="column.title"></span>
          </template>
        </el-table-column>
      </el-table>
  </el-container>
</template>

<script>
import Color from 'color'
import loadData from '@/api/freq_dk.js'

export default {
  name: 'App',
  data () {
    return {
      freqTable: [],
      columns: [
        { title: '№', key: 'id', align: 'right', width: '40' },
        { title: 'Диапазон', key: 'Range_name', align: 'center', width: '120' },
        { title: 'Канал', key: 'Channel_name', align: 'center', width: '100' },
        { title: 'Полоса,<br> МГц', key: 'Range_freq', align: 'center', 'min-width': '120' },
        { title: 'Несущая ИЗ,<br> МГц', key: 'Carrier_freq_V', align: 'center', 'min-width': '120' },
        { title: 'Несущая ЗВ,<br> МГц', key: 'Carrier_freq_A', align: 'center', 'min-width': '120' },
        { title: 'Гетеродин<br>ПЧ=38,0, МГц', key: 'Carrier_LO_1', align: 'center', 'min-width': '120' },
        { title: 'Гетеродин<br>ПЧ=38,9, МГц', key: 'Carrier_LO_2', align: 'center', 'min-width': '120' },
        { title: 'Зеркальный канал<br>ПЧ=38,0, МГц', key: 'Mirror_channel_1', align: 'center', 'min-width': '180'},
        { title: 'Зеркальный канал<br>ПЧ=38,9, МГц', key: 'Mirror_channel_2', align: 'center', 'min-width': '180'},
      ],
      selected: [],
      mirrors: {
        Mirror_channel_1: true,
        Mirror_channel_2: true
      }
    }
  },
  computed: {
    ranges () {
      return [... new Set(this.freqTable.map(itm => itm.Range_name))]
    }
  },
  mounted () {
    this.freqTable = loadData()
  },
  methods: {
    inSelectedMirror (itm) {
      return !!this.selected.find(sel => {
        return (this.mirrors.Mirror_channel_1 && sel.Mirror_channel_1 == itm)
            || (this.mirrors.Mirror_channel_2 && sel.Mirror_channel_2 == itm)
      })
    },
    inSelected (itm) {
      return !!this.selected.find(sel => {
        return sel.Channel_name == itm
      })
    },
    inMirror (itm) {
      return !!this.freqTable.find(sel => {
        return (this.mirrors.Mirror_channel_1 && sel.Mirror_channel_1 == itm)
            || (this.mirrors.Mirror_channel_2 && sel.Mirror_channel_2 == itm)
      })
    },
    inList (itm) {
      return !!this.freqTable.find(sel => {
        return sel.Channel_name == itm
      })
    },
    mirrorChange (itm) {
      if (!(this.mirrors.Mirror_channel_1 || this.mirrors.Mirror_channel_2))
        this.mirrors['Mirror_channel_' + (itm=='Mirror_channel_1' ? '2' : '1')] = true
    },
    rangeColor (range) {
      return Color('#FAE9E9').rotate(300 * this.ranges.indexOf(range)/this.ranges.length)
    },
    onSelectionChange (val) {
      this.selected = val
    },
    onRowClick (row) {
      this.$refs.freqTable.toggleRowSelection(row)
    },
    rowClass ({row, rowIndex}) {
      if (this.selected.indexOf(row) != -1) {
        return 'row-selected'
      }
      return ''
    },
    rowStyle ({row, rowIndex}) {
      return 'background-color: ' + this.rangeColor(row.Range_name)
    },
    cellClass ({row, column, rowIndex, columnIndex}) {
      if (column.property && column.property.indexOf('Mirror') == 0 && !this.mirrors[column.property]) {
        return 'mirror-off'
      }
      if ([3, 9, 10].indexOf(columnIndex) != -1) {
        const rowSelected = (this.selected.indexOf(row) != -1)
        let cls = []
        if (columnIndex == 3) {
          if (this.inSelectedMirror(row.Channel_name)) cls.push('list-slave')
          if (rowSelected && this.inMirror(row.Channel_name)) cls.push('list-master')
        }
        if (columnIndex == 9 && this.mirrors.Mirror_channel_1) {
          if (this.inSelected(row.Mirror_channel_1)) cls.push('mirror-slave')
          if (rowSelected && this.inList(row.Mirror_channel_1)) cls.push('mirror-master')
        }
        if (columnIndex == 10 && this.mirrors.Mirror_channel_2) {
          if (this.inSelected(row.Mirror_channel_2)) cls.push('mirror-slave')
          if (rowSelected && this.inList(row.Mirror_channel_2)) cls.push('mirror-master')
        }
        return cls.join(' ')
      }
      return ''
    }
  }  
}
</script>

<style>
.el-table th {
  text-align: center;
}
.el-table th span {
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: inline-flex;
}
.el-table th div.el-switch {
  display: inline-flex;
}
.el-table tr.row-selected {
  background-color: #E3F2FD !important;
}
.list-master {
  font-weight: bold !important;
  color: #B71C1C;
}
.list-slave {
  background-color: #FFCCBC !important;
}
.mirror-master {
  font-weight: bold !important;
  color: #FF6D00 !important;
}
.mirror-slave {
  background-color: #FFCDD2  !important;
}
.mirror-off {
  color: #B0BEC5 !important;
}
</style>
