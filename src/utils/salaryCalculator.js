/**
 * Vietnamese Salary Calculator Utility
 * Supports Gross to Net and Net to Gross calculations based on Vietnamese Labor & Tax laws.
 */

export const REGIONS = {
  1: { name: 'Vùng I', minWage: 5310000 },
  2: { name: 'Vùng II', minWage: 4730000 },
  3: { name: 'Vùng III', minWage: 4140000 },
  4: { name: 'Vùng IV', minWage: 3700000 }
};

export const DEFAULT_PARAMS = {
  luongCoSo: 2340000,
  giamTruBanThan: 15500000,
  giamTruPhuThuoc: 6200000,
  rates: {
    employee: {
      bhxh: 0.08,
      bhyt: 0.015,
      bhtn: 0.01
    },
    employer: {
      bhxh: 0.17,
      tnld: 0.005,
      bhyt: 0.03,
      bhtn: 0.01
    }
  }
};

/**
 * Calculates Personal Income Tax (PIT) based on taxable income.
 * Returns tax amount and detailed breakdown of each bracket.
 * 
 * @param {number} taxableIncome 
 * @returns {Object} { tax, brackets }
 */
export function calculatePIT(taxableIncome) {
  if (taxableIncome <= 0) {
    return { tax: 0, brackets: [] };
  }

  // Brackets: [limit, rate, subtractor]
  const taxBrackets = [
    { limit: 5000000, rate: 0.05, subtractor: 0 },
    { limit: 10000000, rate: 0.10, subtractor: 250000 },
    { limit: 18000000, rate: 0.15, subtractor: 750000 },
    { limit: 32000000, rate: 0.20, subtractor: 1650000 },
    { limit: 52000000, rate: 0.25, subtractor: 3250000 },
    { limit: 80000000, rate: 0.30, subtractor: 5850000 },
    { limit: Infinity, rate: 0.35, subtractor: 9850000 }
  ];

  let tax = 0;
  const bracketsBreakdown = [];
  let previousLimit = 0;

  for (let i = 0; i < taxBrackets.length; i++) {
    const b = taxBrackets[i];
    const currentLimit = b.limit;
    const rate = b.rate;

    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableIncome - previousLimit, currentLimit - previousLimit);
      const taxInBracket = taxableInBracket * rate;
      tax += taxInBracket;

      bracketsBreakdown.push({
        bracket: i + 1,
        range: `${formatVnd(previousLimit)} - ${currentLimit === Infinity ? 'Trở lên' : formatVnd(currentLimit)}`,
        rate: rate * 100,
        taxable: taxableInBracket,
        tax: taxInBracket
      });

      previousLimit = currentLimit;
    } else {
      break;
    }
  }

  return {
    tax: Math.round(tax),
    brackets: bracketsBreakdown
  };
}

/**
 * Formats a number to VND string representation.
 */
export function formatVnd(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(num)
    .replace(/\s₫/, 'đ');
}

/**
 * Calculates Employee Insurances
 */
export function calculateEmployeeInsurance(insuranceSalary, regionWage, luongCoSo) {
  const capSiHi = 20 * luongCoSo;
  const capUi = 20 * regionWage;

  const bhxhBase = Math.min(insuranceSalary, capSiHi);
  const bhytBase = Math.min(insuranceSalary, capSiHi);
  const bhtnBase = Math.min(insuranceSalary, capUi);

  const bhxh = bhxhBase * DEFAULT_PARAMS.rates.employee.bhxh;
  const bhyt = bhytBase * DEFAULT_PARAMS.rates.employee.bhyt;
  const bhtn = bhtnBase * DEFAULT_PARAMS.rates.employee.bhtn;

  return {
    bhxhBase,
    bhytBase,
    bhtnBase,
    bhxh: Math.round(bhxh),
    bhyt: Math.round(bhyt),
    bhtn: Math.round(bhtn),
    total: Math.round(bhxh + bhyt + bhtn)
  };
}

/**
 * Calculates Employer Insurances
 */
export function calculateEmployerInsurance(insuranceSalary, regionWage, luongCoSo) {
  const capSiHi = 20 * luongCoSo;
  const capUi = 20 * regionWage;

  const bhxhBase = Math.min(insuranceSalary, capSiHi);
  const tnldBase = Math.min(insuranceSalary, capSiHi);
  const bhytBase = Math.min(insuranceSalary, capSiHi);
  const bhtnBase = Math.min(insuranceSalary, capUi);

  const bhxh = bhxhBase * DEFAULT_PARAMS.rates.employer.bhxh;
  const tnld = tnldBase * DEFAULT_PARAMS.rates.employer.tnld;
  const bhyt = bhytBase * DEFAULT_PARAMS.rates.employer.bhyt;
  const bhtn = bhtnBase * DEFAULT_PARAMS.rates.employer.bhtn;

  return {
    bhxhBase,
    tnldBase,
    bhytBase,
    bhtnBase,
    bhxh: Math.round(bhxh),
    tnld: Math.round(tnld),
    bhyt: Math.round(bhyt),
    bhtn: Math.round(bhtn),
    total: Math.round(bhxh + tnld + bhyt + bhtn)
  };
}

/**
 * Main Gross to Net Calculator
 */
export function grossToNet(gross, config = {}) {
  const regionKey = config.region || 1;
  const dependents = config.dependents || 0;
  const insuranceType = config.insuranceType || 'actual'; // 'actual' or 'custom'
  const customInsuranceSalary = config.customInsuranceSalary || 0;
  const taxFreeAllowances = config.taxFreeAllowances || 0;
  const luongCoSo = config.luongCoSo || DEFAULT_PARAMS.luongCoSo;

  const regionWage = REGIONS[regionKey].minWage;
  const insuranceSalary = insuranceType === 'actual' ? gross : customInsuranceSalary;

  // 1. Calculate insurances
  const insEmployee = calculateEmployeeInsurance(insuranceSalary, regionWage, luongCoSo);

  // 2. Calculate deductions
  const personalDeduction = DEFAULT_PARAMS.giamTruBanThan;
  const dependentDeduction = dependents * DEFAULT_PARAMS.giamTruPhuThuoc;
  const totalDeduction = personalDeduction + dependentDeduction;

  // 3. Taxable Income
  const taxableIncome = Math.max(0, gross - taxFreeAllowances - insEmployee.total - totalDeduction);

  // 4. PIT Tax
  const pitResult = calculatePIT(taxableIncome);

  // 5. Net Salary
  const net = Math.max(0, gross - insEmployee.total - pitResult.tax);

  // 6. Employer Cost
  const insEmployer = calculateEmployerInsurance(insuranceSalary, regionWage, luongCoSo);
  const totalEmployerCost = gross + insEmployer.total;

  return {
    gross,
    net,
    insEmployee,
    insEmployer,
    deductions: {
      personal: personalDeduction,
      dependents: dependentDeduction,
      total: totalDeduction
    },
    taxableIncome,
    pit: pitResult,
    taxFreeAllowances,
    totalEmployerCost
  };
}

/**
 * Main Net to Gross Calculator
 * Converts Net back to Gross according to Circular 111/2013/TT-BTC
 */
export function netToGross(net, config = {}) {
  const regionKey = config.region || 1;
  const dependents = config.dependents || 0;
  const insuranceType = config.insuranceType || 'actual'; // 'actual' or 'custom'
  const customInsuranceSalary = config.customInsuranceSalary || 0;
  const taxFreeAllowances = config.taxFreeAllowances || 0;
  const luongCoSo = config.luongCoSo || DEFAULT_PARAMS.luongCoSo;

  const regionWage = REGIONS[regionKey].minWage;
  const personalDeduction = DEFAULT_PARAMS.giamTruBanThan;
  const dependentDeduction = dependents * DEFAULT_PARAMS.giamTruPhuThuoc;
  const totalDeduction = personalDeduction + dependentDeduction;

  // TNQD = Net - Giảm trừ gia cảnh (theo TT111/2013, bước quy đổi không trừ phụ cấp miễn thuế)
  const tnqd = Math.max(0, net - totalDeduction);

  // Convert TNQD to Taxable Income (TNTT)
  let tntt = 0;
  if (tnqd > 0) {
    if (tnqd <= 4750000) {
      tntt = tnqd / 0.95;
    } else if (tnqd <= 9250000) {
      tntt = (tnqd - 250000) / 0.9;
    } else if (tnqd <= 16050000) {
      tntt = (tnqd - 750000) / 0.85;
    } else if (tnqd <= 27250000) {
      tntt = (tnqd - 1650000) / 0.8;
    } else if (tnqd <= 42250000) {
      tntt = (tnqd - 3250000) / 0.75;
    } else if (tnqd <= 61850000) {
      tntt = (tnqd - 5850000) / 0.7;
    } else {
      tntt = (tnqd - 9850000) / 0.65;
    }
  }

  // Once we have TNTT, we can calculate PIT
  const pitResult = calculatePIT(tntt);

  // Gross_Minus_Insurance = Net + PIT
  const gI = net + pitResult.tax;

  let gross = 0;
  if (insuranceType === 'custom') {
    const insSalary = customInsuranceSalary;
    const insEmployee = calculateEmployeeInsurance(insSalary, regionWage, luongCoSo);
    gross = gI + insEmployee.total;
  } else {
    const capSiHi = 20 * luongCoSo;
    const capUi = 20 * regionWage;

    // Tổng BH NLĐ = BHXH(8%) + BHYT(1.5%) + BHTN(1%) = 10.5%
    // BHXH+BHYT = 9.5% tính theo capSiHi; BHTN = 1% tính theo capUi
    const bhxhBhytCap = capSiHi * 0.095;
    const bhtnCap = capUi * 0.01;

    // limit1: gross × 0.895 = gI khi cả 3 khoản chưa chạm trần (bhxh+bhyt trần = capSiHi)
    const limit1 = capSiHi * 0.895;
    // limit2: gross × 0.99 - bhxhBhytCap = gI khi bhxh/bhyt đã cap, bhtn chưa cap
    const limit2 = capUi * 0.99 - bhxhBhytCap;

    if (gI <= limit1) {
      gross = Math.round(gI / 0.895);
    } else if (gI <= limit2) {
      gross = Math.round((gI + bhxhBhytCap) / 0.99);
    } else {
      gross = Math.round(gI + bhxhBhytCap + bhtnCap);
    }
  }

  return grossToNet(gross, config);
}
