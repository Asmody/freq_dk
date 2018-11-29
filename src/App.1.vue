<template>
  <v-app>
    <v-toolbar app dense scroll-off-screen scroll-threshold="150">
      <v-toolbar-title class="headline text-uppercase">
        <span></span>
        <span class="font-weight-light">Таблица частот</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://telcogroup.ru"
        target="_blank"
      >
        <span class="mr-2">TELCOGROUP.RU</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container fluid>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="freqTable"
        select-all
        :item-key="id"
        :rows-per-page-items="[-1]"
        hide-actions
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th style="width: 50px">
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                disabled
              ></v-checkbox>
            </th>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :style="{'width':header.width}"
            >
              <v-switch
                v-if="header.value.indexOf('Mirror') == 0"
                v-model="mirrors[header.value]"
                primary
                hide-details
                @change="mirrorChange(header.value)"
              >
                <template slot="label">
                  <span v-html="header.text"></span>
                </template>
              </v-switch>
              <span v-else v-html="header.text"></span>
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected" :style="{'background': rangeColor(props.item.Range_name)}">
            <td>
              <v-checkbox
                :input-value="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td class="text-xs-center">{{ props.item.id }}</td>
            <td class="text-xs-center">{{ props.item.Range_name }}</td>
            <td :class="{'deep-orange lighten-4': inSelectedMirror(props.item.Cannel_name), 'font-weight-bold red--text lighten-4': props.selected && inMirror(props.item.Cannel_name)}">{{ props.item.Cannel_name }}</td>
            <td class="text-xs-center">{{ props.item.Range_freq }}</td>
            <td class="text-xs-center">{{ props.item.Carrier_freq_V }}</td>
            <td class="text-xs-center">{{ props.item.Carrier_freq_A }}</td>
            <td class="text-xs-center">{{ props.item.Carrier_LO_1 }}</td>
            <td class="text-xs-center">{{ props.item.Carrier_LO_2 }}</td>
            <td class="text-xs-center" :class="{'font-weight-bold deep-orange--text accent-4': props.selected && mirrors.Mirror_channel_1 && inList(props.item.Mirror_channel_1), 'red lighten-4': mirrors.Mirror_channel_1 && inSelected(props.item.Mirror_channel_1), 'blue-grey--text': !mirrors.Mirror_channel_1}">{{ props.item.Mirror_channel_1 }}</td>
            <td class="text-xs-center" :class="{'font-weight-bold deep-orange--text accent-4': props.selected && mirrors.Mirror_channel_2 && inList(props.item.Mirror_channel_2), 'red lighten-4': mirrors.Mirror_channel_2 && inSelected(props.item.Mirror_channel_2), 'blue-grey--text': !mirrors.Mirror_channel_2}">{{ props.item.Mirror_channel_2 }}</td>
          </tr>
        </template>
      </v-data-table>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Color from 'color'
import loadData from '@/api/freq_dk.js'

export default {
  name: 'App',
  data () {
    return {
      freqTable: [],
      headers: [
        { text: '№', value: 'id', width: '10px' },
        { text: 'Диапазон', value: 'Range_name' },
        { text: 'Канал', value: 'Cannel_name' },
        { text: 'Полоса,<br> МГц', value: 'Range_freq' },
        { text: 'Несущая ИЗ,<br> МГц', value: 'Carrier_freq_V' },
        { text: 'Несущая ЗВ,<br> МГц', value: 'Carrier_freq_A' },
        { text: 'Гетеродин<br>ПЧ=38,0, МГц', value: 'Carrier_LO_1' },
        { text: 'Гетеродин<br>ПЧ=38,9, МГц', value: 'Carrier_LO_2' },
        { text: 'Зеркальный канал<br>ПЧ=38,0, МГц', value: 'Mirror_channel_1', width: '120px'},
        { text: 'Зеркальный канал<br>ПЧ=38,9, МГц', value: 'Mirror_channel_2', width: '120px'},
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
        return sel.Cannel_name == itm
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
        return sel.Cannel_name == itm
      })
    },
    mirrorChange (itm) {
      if (!(this.mirrors.Mirror_channel_1 || this.mirrors.Mirror_channel_2))
        this.mirrors['Mirror_channel_' + (itm=='Mirror_channel_1' ? '2' : '1')] = true
    },
    rangeColor (range) {
      return Color('#FAE9E9').rotate(300 * this.ranges.indexOf(range)/this.ranges.length)
    }
  }  
}
</script>

<style>
table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {
    padding: 0 14px;
}
table.v-table thead th, 
table.v-table thead th span{
  font-weight: bold;
  font-size: 13px;
}
table.v-table tbody td {
  word-wrap: none;
  overflow: hidden;
}
.theme--light.v-table tbody tr[active] {
  background: #E3F2FD !important;
}


</style>
