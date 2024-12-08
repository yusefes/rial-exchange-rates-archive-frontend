<script setup lang="ts">
import {computed} from 'vue';
import {Line} from 'vue-chartjs';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {DateRange, ExchangeRatesData} from '../types/exchange';
import {CURRENCIES} from '../constants/currencies';
import {hexToRGBA} from "../services/utils.ts";

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const props = defineProps<{
  data: ExchangeRatesData;
  selectedCurrencies: string[];
  dateRange: DateRange;
}>();

const filteredDates = computed(() => {
  return Object.keys(props.data)
      .filter(date => {
        const currentDate = new Date(date);
        return currentDate >= props.dateRange.start && currentDate <= props.dateRange.end;
      })
      .sort();
});

const chartData = computed(() => {
  return {
    labels: filteredDates.value,
    datasets: props.selectedCurrencies.map(currency => {
      const lastMonthRange = (props.dateRange.end.getTime() - props.dateRange.start.getTime()) / (1000 * 60 * 60 * 24) <= 31;
      const currencyData = CURRENCIES[currency];

      return {
        label: `${currencyData?.flag || ''} ${currency.toUpperCase()}`,
        data: filteredDates.value.map(date => props.data[date]?.[currency]?.sell || null),
        backgroundColor: hexToRGBA(currencyData.color, 0.5),
        borderColor: currencyData.color,
        fill: false,
        tension: 0,
        borderWidth: 2.3,
        pointRadius: lastMonthRange ? 4 : 0,
        pointHoverRadius: lastMonthRange ? 6 : 4,
      };
    }),
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Disable vertical grid lines
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        position: 'nearest',
        intersect: false,
      },
      title: {
        display: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };
});
</script>

<template>
  <div class="h-[600px]">
    <Line
        id="canvas"
        v-if="chartData.datasets.length > 0"
        :data="chartData"
        :options="chartOptions"
        aria-label="Exchange rate chart"
        role="img"
    />
    <div v-else class="flex items-center justify-center h-full">
      Please select at least one currency to display the chart
    </div>
  </div>
</template>