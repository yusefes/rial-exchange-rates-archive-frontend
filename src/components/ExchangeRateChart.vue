<script setup lang="ts">
import {computed} from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import {DateRange, ExchangeRatesData} from '../types/exchange';
import {CURRENCIES} from '../constants/currencies';

const props = defineProps<{
  data: ExchangeRatesData;
  selectedCurrencies: string[];
  dateRange: DateRange;
}>();

const chartData = computed(() => {
  const dates = Object.keys(props.data)
      .filter(date => {
        const currentDate = new Date(date);
        return currentDate >= props.dateRange.start && currentDate <= props.dateRange.end;
      })
      .sort();

  return props.selectedCurrencies.map(currency => {
    const currencyData = CURRENCIES[currency];
    return {
      name: `${currencyData?.flag || ''} ${currency.toUpperCase()}`,
      data: dates.map(date => props.data[date]?.[currency]?.sell || null),
    };
  });
});

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: {
      enabled: false
    },
    animation: {
      // disable if date range bigger than 2 years
      enabled: (props.dateRange.end.getTime() - props.dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 365) <= 2,
    }
  },
  xaxis: {
    type: 'datetime',
    categories: Object.keys(props.data)
        .filter(date => {
          const currentDate = new Date(date);
          return currentDate >= props.dateRange.start && currentDate <= props.dateRange.end;
        })
        .sort(),
  },
  yaxis: {
    labels: {
      formatter: (value: number) => value.toLocaleString('en-US'),
    },
    title: {
      text: 'Price'
    },
    tickAmount: 10,
  },
  stroke: {
    curve: 'straight',
    width: 3,
  },
  fill: {
    type: 'solid',
    opacity: 0.5,
  },
  markers: {
    // only if less than 31 days
    size: (props.dateRange.end.getTime() - props.dateRange.start.getTime()) / (1000 * 60 * 60 * 24) <= 31 ? 4 : 0,
  },
  tooltip: {
    shared: true,
    intersect: false,
    x: {
      format: 'dd MMM yyyy',
    },
  },
  legend: {
    position: 'top',
  },
}));
</script>

<template>
  <div class="h-[600px]">
    <VueApexCharts
        v-if="chartData.length > 0"
        type="line"
        :options="chartOptions"
        :series="chartData"
        height="600"
    />
    <div v-else class="flex items-center justify-center h-full">
      Please select at least one currency to display the chart
    </div>
  </div>
</template>