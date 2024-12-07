<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ExchangeRatesData } from '../types/exchange';
import { CURRENCIES } from '../constants/currencies';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  data: ExchangeRatesData;
  selectedCurrencies: string[];
  dateRange: { start: Date; end: Date };
}>();

const chartData = computed(() => {
  const dates = Object.keys(props.data)
    .filter(date => {
      const currentDate = new Date(date);
      return currentDate >= props.dateRange.start && currentDate <= props.dateRange.end;
    })
    .sort();

  return {
    labels: dates,
    datasets: props.selectedCurrencies.map(currency => ({
      label: `${CURRENCIES[currency]?.flag || ''} ${currency.toUpperCase()}`,
      data: dates.map(date => props.data[date]?.[currency]?.sell || null),
      borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      fill: false,
      tension: 0.1
    }))
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Rial Exchange Rates'
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
};
</script>

<template>
  <div class="h-[600px]">
    <Line
      v-if="chartData.datasets.length > 0"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="flex items-center justify-center h-full">
      Please select at least one currency to display the chart
    </div>
  </div>
</template>