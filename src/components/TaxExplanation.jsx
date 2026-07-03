import React from 'react';
import { REGIONS, DEFAULT_PARAMS, formatVnd } from '../utils/salaryCalculator';

export default function TaxExplanation() {
  return (
    <div id="explanation" className="glass-card" style={{ padding: '2.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          📖 Hướng dẫn & Cơ sở pháp lý tính lương tại Việt Nam
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Các thông số dưới đây được cập nhật theo quy định pháp luật hiện hành áp dụng tại Việt Nam.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

        {/* Insurance rates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            1. Tỷ lệ đóng bảo hiểm bắt buộc
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mức đóng bảo hiểm bắt buộc được tính trên mức lương đóng bảo hiểm (tối đa bằng 20 lần lương cơ sở đối với BHXH, BHYT và 20 lần lương tối thiểu vùng đối với BHTN):
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>Người lao động (Tổng cộng 10.5%):</strong>
              <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem', listStyleType: 'circle' }}>
                <li>Bảo hiểm xã hội (BHXH): 8%</li>
                <li>Bảo hiểm y tế (BHYT): 1.5%</li>
                <li>Bảo hiểm thất nghiệp (BHTN): 1%</li>
              </ul>
            </li>
            <li>
              <strong>Người sử dụng lao động (Tổng cộng 21.5% - 23.5%):</strong>
              <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem', listStyleType: 'circle' }}>
                <li>Bảo hiểm xã hội (BHXH): 17.5% (gồm 17% chế độ ốm đau thai sản hưu trí + 0.5% tai nạn lao động bệnh nghề nghiệp)</li>
                <li>Bảo hiểm y tế (BHYT): 3%</li>
                <li>Bảo hiểm thất nghiệp (BHTN): 1%</li>
                <li>Kinh phí công đoàn (KPCĐ): 2% (do doanh nghiệp đóng, tính trên quỹ lương)</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Region & Base Wage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            2. Lương cơ sở & Lương tối thiểu vùng
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Lương cơ sở hiện hành:</strong> <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{formatVnd(DEFAULT_PARAMS.luongCoSo)}/tháng</span>.
              <br />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Dùng để tính mức trần đóng BHXH & BHYT (Tối đa = 20 × Lương cơ sở = {formatVnd(20 * DEFAULT_PARAMS.luongCoSo)}).
              </span>
            </li>
            <li>
              <strong>Mức lương tối thiểu vùng (Áp dụng trần BHTN):</strong>
              <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                {Object.keys(REGIONS).map((key) => (
                  <div key={key} style={{ background: 'var(--bg-tertiary)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                    <strong>{REGIONS[key].name}:</strong> <span style={{ display: 'block', color: 'var(--text-secondary)' }}>{formatVnd(REGIONS[key].minWage)}</span>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem' }}>
                Mức trần đóng BHTN tối đa bằng 20 lần lương tối thiểu vùng (Ví dụ Vùng I tối đa = {formatVnd(20 * REGIONS[1].minWage)}).
              </span>
            </li>
          </ul>
        </div>

        {/* Deductions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            3. Các khoản giảm trừ gia cảnh
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Theo Nghị quyết số 954/2020/UBTVQH14 về giảm trừ gia cảnh thuế TNCN:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>Giảm trừ bản thân người nộp thuế:</strong>
              <br />
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{formatVnd(DEFAULT_PARAMS.giamTruBanThan)}/tháng</span> ({formatVnd(DEFAULT_PARAMS.giamTruBanThan * 12)}/năm).
            </li>
            <li>
              <strong>Giảm trừ mỗi người phụ thuộc:</strong>
              <br />
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{formatVnd(DEFAULT_PARAMS.giamTruPhuThuoc)}/tháng/người</span>.
              <br />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Người phụ thuộc bao gồm con dưới 18 tuổi, con trên 18 tuổi đi học không có thu nhập hoặc thu nhập dưới 1 triệu đồng/tháng, bố mẹ ngoài độ tuổi lao động...
              </span>
            </li>
          </ul>
        </div>
      </div>


      {/* Mathematical Conversion formula summary */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
          4. Quy trình tính lương hai chiều
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Chiều Gross ➜ Net:</strong>
            <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>Tính các khoản bảo hiểm bắt buộc của NLĐ trừ trực tiếp vào lương Gross.</li>
              <li>Tính giảm trừ gia cảnh (bản thân + người phụ thuộc).</li>
              <li>Xác định thu nhập tính thuế = Gross - Bảo hiểm - Giảm trừ - Phụ cấp miễn thuế.</li>
              <li>Áp dụng biểu lũy tiến tính Thuế TNCN.</li>
              <li>Lương Net = Gross - Bảo hiểm - Thuế TNCN.</li>
            </ol>
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Chiều Net ➜ Gross:</strong>
            <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>Quy đổi lương Net thành Thu nhập chịu thuế tương ứng (theo quy định của TT 111/2013/TT-BTC).</li>
              <li>Tính Thuế TNCN từ Thu nhập chịu thuế vừa quy đổi.</li>
              <li>Tính mức lương trước bảo hiểm (gọi tắt là lương chưa bảo hiểm) = Net + Thuế TNCN.</li>
              <li>Giải phương trình tìm Gross dựa trên tỷ lệ % bảo hiểm và mức đóng trần của bảo hiểm.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
