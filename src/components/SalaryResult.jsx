import React from 'react';
import { formatVnd } from '../utils/salaryCalculator';

export default function SalaryResult({ data }) {
  if (!data) return null;

  const { gross, net, insEmployee, insEmployer, deductions, taxableIncome, pit, taxFreeAllowances, totalEmployerCost } = data;

  return (
    <div className="card">
      <h2>Kết quả</h2>

      <div className="result-highlights">
        <div className="highlight highlight--net">
          <small>LƯƠNG THỰC NHẬN (NET)</small>
          <strong>{formatVnd(net)}</strong>
        </div>
        <div className="highlight highlight--employer">
          <small>CHI PHÍ DOANH NGHIỆP</small>
          <strong>{formatVnd(totalEmployerCost)}</strong>
        </div>
      </div>

      <h3>Chi tiết người lao động</h3>
      <table>
        <tbody>
          <tr><td>Lương Gross</td><td></td><td className="amt">{formatVnd(gross)}</td></tr>
          <tr><td>— BHXH (8%)</td><td className="base">{formatVnd(insEmployee.bhxhBase)}</td><td className="amt neg">{formatVnd(insEmployee.bhxh)}</td></tr>
          <tr><td>— BHYT (1.5%)</td><td className="base">{formatVnd(insEmployee.bhytBase)}</td><td className="amt neg">{formatVnd(insEmployee.bhyt)}</td></tr>
          <tr><td>— BHTN (1%)</td><td className="base">{formatVnd(insEmployee.bhtnBase)}</td><td className="amt neg">{formatVnd(insEmployee.bhtn)}</td></tr>
          {taxFreeAllowances > 0 && <tr><td>Thu nhập miễn thuế</td><td></td><td className="amt pos">{formatVnd(taxFreeAllowances)}</td></tr>}
          <tr><td>Giảm trừ bản thân</td><td></td><td className="amt">{formatVnd(deductions.personal)}</td></tr>
          {deductions.dependents > 0 && <tr><td>Giảm trừ phụ thuộc</td><td></td><td className="amt">{formatVnd(deductions.dependents)}</td></tr>}
          <tr className="subtotal"><td>Thu nhập tính thuế</td><td></td><td className="amt">{formatVnd(taxableIncome)}</td></tr>
          <tr><td>Thuế TNCN</td><td></td><td className="amt neg">{formatVnd(pit.tax)}</td></tr>
          <tr className="total"><td>Lương Net</td><td></td><td className="amt">{formatVnd(net)}</td></tr>
        </tbody>
      </table>

      <h3>Chi tiết doanh nghiệp</h3>
      <table>
        <tbody>
          <tr><td>Lương Gross</td><td></td><td className="amt">{formatVnd(gross)}</td></tr>
          <tr><td>— BHXH (17%)</td><td className="base">{formatVnd(insEmployer.bhxhBase)}</td><td className="amt pos">{formatVnd(insEmployer.bhxh)}</td></tr>
          <tr><td>— TN lao động - Bệnh nghề nghiệp (0.5%)</td><td className="base">{formatVnd(insEmployer.tnldBase)}</td><td className="amt pos">{formatVnd(insEmployer.tnld)}</td></tr>
          <tr><td>— BHYT (3%)</td><td className="base">{formatVnd(insEmployer.bhytBase)}</td><td className="amt pos">{formatVnd(insEmployer.bhyt)}</td></tr>
          <tr><td>— BHTN (1%)</td><td className="base">{formatVnd(insEmployer.bhtnBase)}</td><td className="amt pos">{formatVnd(insEmployer.bhtn)}</td></tr>
          <tr className="total"><td>Tổng chi phí DN</td><td></td><td className="amt">{formatVnd(totalEmployerCost)}</td></tr>
        </tbody>
      </table>




      <button className="print-btn no-print" onClick={() => window.print()}>In kết quả</button>
    </div>
  );
}
