<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { CURRENCIES } from '../constants/currencies';
import Multiselect from 'vue-multiselect';

const emit = defineEmits(['update:selectedCurrencies']);

const selectedCurrencies = ref<any[]>([]);
const currencies = Object.entries(CURRENCIES).map(([code, details]) => ({
  code: code,
  label: `${details.flag || ''} ${details.name} (${code.toUpperCase()})`,
}));

function updateSelection(values: any[]) {
  selectedCurrencies.value = values;
  emit('update:selectedCurrencies', values.map(v => v.code));
}
</script>

<template>
  <div class="w-full">
    <Multiselect
      v-model="selectedCurrencies"
      :options="currencies"
      :multiple="true"
      :close-on-select="false"
      :clear-on-select="false"
      placeholder="Select currencies"
      label="label"
      track-by="code"
      @update:modelValue="updateSelection"
    />
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>