<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {fetchExchangeRates, getDateRange} from './services/exchange-rates.ts';
import DateRangeSelector from './components/DateRangeSelector.vue';
import CurrencySelector from './components/CurrencySelector.vue';
import ExchangeRateChart from './components/ExchangeRateChart.vue';
import type {DateRange, ExchangeRatesData} from './types/exchange';
import {LineChart} from 'lucide-vue-next';
import {subMonths} from "date-fns";

const exchangeRates = ref<ExchangeRatesData>({});
const validDataRange = ref<DateRange>({start: new Date(), end: new Date()});
const selectedCurrencies = ref<string[]>([]);
const selectedDateRange = ref<DateRange>({start: new Date(), end: new Date()});
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // fetch exchange rates data
    const data = await fetchExchangeRates();
    exchangeRates.value = data;

    // finding the date range for the data
    validDataRange.value = getDateRange(data);

    // set date range to the last month
    const oneMonthAgo = subMonths(validDataRange.value.end, 1);
    selectedDateRange.value = {start: oneMonthAgo, end: validDataRange.value.end};

    loading.value = false;
  } catch (e) {
    error.value = 'Failed to load exchange rates data';
    loading.value = false;
  }
});

</script>

<template>
  <div class="h-full min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <div class="flex items-center space-x-3">
        <LineChart className="w-8 h-8 text-indigo-600"/>
        <h1 class="text-3xl font-bold text-gray-900">Rial Exchange Rates Archive</h1>
      </div>

      <div v-if="loading" class="text-center py-8">
        Loading exchange rates data...
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <div v-else class="space-y-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-2">Select Date Range</h2>
          <DateRangeSelector v-model:dateRange="selectedDateRange" :valid-date-range="validDataRange" :selected-date-range="selectedDateRange" />
          <div class="mb-4"/>
          <h2 class="text-xl font-semibold mb-2">Select Currencies</h2>
          <CurrencySelector v-model:selectedCurrencies="selectedCurrencies"/>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <ExchangeRateChart
              :data="exchangeRates"
              :selected-currencies="selectedCurrencies"
              :date-range="selectedDateRange"
          />
        </div>
      </div>
    </div>
  </div>
</template>