<script setup lang="ts">
import {defineEmits, onMounted, ref} from 'vue';
import {subDays, subMonths, subYears} from 'date-fns';
import {DateRange} from "../types/exchange.ts";
import VueDatePicker from '@vuepic/vue-datepicker';

const emit = defineEmits(['update:dateRange']);
const props = defineProps({
  validDateRange: {
    type: Object as () => DateRange,
    required: true,
  },
  selectedDateRange: {
    type: Object as () => DateRange,
    default: null,
  },
});

const presets = [
  {
    label: 'Last 7 days',
    range: () => ({start: subDays(props.validDateRange.end, 7), end: props.validDateRange.end}),
  },
  {
    label: 'Last 30 days',
    range: () => ({start: subDays(props.validDateRange.end, 30), end: props.validDateRange.end}),
  },
  {
    label: 'Last 3 months',
    range: () => ({start: subMonths(props.validDateRange.end, 3), end: props.validDateRange.end}),
  },
  {
    label: 'Last year',
    range: () => ({start: subYears(props.validDateRange.end, 1), end: props.validDateRange.end}),
  },
];

const dateRange = ref<[Date, Date]>([new Date(), new Date()]);

function formatDateOutput(date: Date[]) {
  return date.map(d => d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate()).join(' - ');
}

function applyDateRange() {
  if (dateRange.value[0] && dateRange.value[1]) {
    emit('update:dateRange', {
      start: dateRange.value[0],
      end: dateRange.value[1],
    });
  }
}

function applyPreset(preset: typeof presets[0]) {
  const range = preset.range();
  dateRange.value = [range.start, range.end];
  applyDateRange();
}

onMounted(() => {
  if (props.selectedDateRange) {
    dateRange.value = [props.selectedDateRange.start, props.selectedDateRange.end];
  }
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex space-x-4">
      <VueDatePicker
          v-model="dateRange"
          :min-date="props.validDateRange.start"
          :max-date="props.validDateRange.end"
          :enable-time-picker="false"
          :format="formatDateOutput"
          :auto-apply="true"
          range multi-calendars
          class="rounded"
          @change="applyDateRange"
      />

      <div v-for="preset in presets" :key="preset.label">
        <button
            @click="applyPreset(preset)"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>
  </div>
</template>