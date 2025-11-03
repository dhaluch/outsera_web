import { test as base } from '@playwright/test';

// Global setup para configurar metadados do Allure
export default async function globalSetup() {
  console.log('Global setup completed');
}

