import { test as base } from '@playwright/test';
import { allure } from 'allure-playwright';

// Este helper garante que os labels do Allure sejam aplicados corretamente
// para que a seção Suites seja populada na pipeline

export function applyAllureSuiteLabel(testInfo: any, suiteName: string) {
  try {
    // Força o label de suite para o valor desejado
    allure.label('suite', suiteName);
  } catch (error) {
    console.log(`Could not apply suite label: ${error}`);
  }
}

