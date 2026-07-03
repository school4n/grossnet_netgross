import React, { useState, useEffect } from 'react';
import { REGIONS, DEFAULT_PARAMS, formatVnd } from '../utils/salaryCalculator';

export default function SalaryForm({ onCalculate }) {
  const [direction, setDirection] = useState('grossToNet');
  const [salaryStr, setSalaryStr] = useState('20,000,000');
  const [region, setRegion] = useState(1);
  const [dependents, setDependents] = useState(0);
  const [insuranceType, setInsuranceType] = useState('actual');
  const [customInsuranceSalaryStr, setCustomInsuranceSalaryStr] = useState('4,680,000');
  const [allowancesStr, setAllowancesStr] = useState('0');
  const [luongCoSoStr, setLuongCoSoStr] = useState('2,340,000');

  const fmt = (val) => {
    const raw = val.replace(/\D/g, '');
    return raw ? Number(raw).toLocaleString('en-US') : '';
  };

  const parse = (str) => Number(str.replace(/,/g, '')) || 0;

  useEffect(() => {
    onCalculate({
      direction,
      salary: parse(salaryStr),
      region: Number(region),
      dependents: Number(dependents),
      insuranceType,
      customInsuranceSalary: parse(customInsuranceSalaryStr),
      taxFreeAllowances: parse(allowancesStr),
      luongCoSo: parse(luongCoSoStr) || DEFAULT_PARAMS.luongCoSo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, salaryStr, region, dependents, insuranceType, customInsuranceSalaryStr, allowancesStr, luongCoSoStr]);

  return (
    <div className="card">
      <div className="tab-group">
        <button className={direction === 'grossToNet' ? 'tab active' : 'tab'} onClick={() => setDirection('grossToNet')}>
          Gross → Net
        </button>
        <button className={direction === 'netToGross' ? 'tab active' : 'tab'} onClick={() => setDirection('netToGross')}>
          Net → Gross
        </button>
      </div>

      <label>
        {direction === 'grossToNet' ? 'Lương Gross' : 'Lương Net'}
        <div className="input-wrap">
          <input type="text" value={salaryStr} onChange={e => setSalaryStr(fmt(e.target.value))} placeholder="Nhập số tiền..." />
          <span>VNĐ</span>
        </div>
      </label>

      <label>
        Vùng đóng bảo hiểm
        <select value={region} onChange={e => setRegion(e.target.value)}>
          {Object.keys(REGIONS).map(k => (
            <option key={k} value={k}>{REGIONS[k].name} — LTT: {formatVnd(REGIONS[k].minWage)}</option>
          ))}
        </select>
      </label>

      <label>
        Số người phụ thuộc (giảm trừ {formatVnd(DEFAULT_PARAMS.giamTruPhuThuoc)}/người)
        <div className="counter">
          <button type="button" onClick={() => setDependents(v => Math.max(0, v - 1))}>−</button>
          <input type="number" value={dependents} onChange={e => setDependents(Math.max(0, parseInt(e.target.value) || 0))} />
          <button type="button" onClick={() => setDependents(v => v + 1)}>+</button>
        </div>
      </label>

      <fieldset>
        <legend>Đóng bảo hiểm dựa trên</legend>
        <label><input type="radio" name="ins" checked={insuranceType === 'actual'} onChange={() => setInsuranceType('actual')} /> Lương thực tế</label>
        <label><input type="radio" name="ins" checked={insuranceType === 'custom'} onChange={() => setInsuranceType('custom')} /> Mức lương khác</label>
      </fieldset>

      {insuranceType === 'custom' && (
        <label>
          Lương đóng bảo hiểm
          <div className="input-wrap">
            <input type="text" value={customInsuranceSalaryStr} onChange={e => setCustomInsuranceSalaryStr(fmt(e.target.value))} />
            <span>VNĐ</span>
          </div>
        </label>
      )}

      <label>
        Phụ cấp / thu nhập miễn thuế
        <div className="input-wrap">
          <input type="text" value={allowancesStr} onChange={e => setAllowancesStr(fmt(e.target.value))} />
          <span>VNĐ</span>
        </div>
      </label>

      <details>
        <summary>Cấu hình nâng cao</summary>
        <label>
          Mức lương cơ sở
          <div className="input-wrap">
            <input type="text" value={luongCoSoStr} onChange={e => setLuongCoSoStr(fmt(e.target.value))} placeholder="2,340,000" />
            <span>VNĐ</span>
          </div>
        </label>
      </details>
    </div>
  );
}
