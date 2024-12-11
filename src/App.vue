<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {fetchExchangeRates, getDateRange, fetchExchangeRatesHijri, getDateRangeHijri} from './services/exchange-rates.ts';
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
const roiEnabled = ref(false);
const calendarType = ref('gregorian');

onMounted(async () => {
  try {
    let data;
    if (calendarType.value === 'gregorian') {
      data = await fetchExchangeRates();
      validDataRange.value = getDateRange(data);
    } else {
      data = await fetchExchangeRatesHijri();
      validDataRange.value = getDateRangeHijri(data);
    }
    exchangeRates.value = data;

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
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <CurrencySelector v-model:selectedCurrencies="selectedCurrencies"/>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="roiEnabled" class="sr-only peer">
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium">ROI Mode</span>
            </label>
          </div>
          <div class="flex items-center space-x-4 mt-4">
            <label for="calendarType" class="text-sm font-medium">Calendar Type:</label>
            <select id="calendarType" v-model="calendarType" class="rounded border-gray-300">
              <option value="gregorian">Gregorian</option>
              <option value="hijri">Solar Hijri</option>
            </select>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <ExchangeRateChart
              :data="exchangeRates"
              :selected-currencies="selectedCurrencies"
              :date-range="selectedDateRange"
              :roi-enabled="roiEnabled"
          />
        </div>
      </div>
    </div>
  </div>
</template>
