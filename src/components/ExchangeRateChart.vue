<script setup lang="ts">
import {computed} from 'vue';
import {Line} from 'vue-chartjs';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import {DateRange, ExchangeRatesData} from '../types/exchange';
import {CURRENCIES} from '../constants/currencies';

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
  dateRange: DateRange;
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
    datasets: props.selectedCurrencies.map(currency => {
      const currencyData = CURRENCIES[currency];
      // background color with alpha
      const alpha = 0.5;
      const hex = currencyData.color.substring(1);
      const rgb = {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
      const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      return {
        label: `${currencyData?.flag || ''} ${currency.toUpperCase()}`,
        data: dates.map(date => props.data[date]?.[currency]?.sell || null),
        backgroundColor: backgroundColor,
        borderColor: currencyData.color,
        fill: true,
        tension: 0,
        borderWidth: 2.3,
      };
    }),
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
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