import { jsPDF } from "jspdf";
import { Project, Platform, PlatformConfig } from '@shared/types';
import { calculateTotalHPP, calculateEffectiveCost, calculatePricingStrategies, calculateOperationalBurnRate } from './utils';

/**
 * Hyper-Forensic Intelligence PDF Service v7.0 - ULTRA DETAIL EDITION
 * Authorized by PT KONEKSI JARINGAN INDONESIA
 */

const COLORS = {
  primary: [49, 46, 129] as [number, number, number],
  secondary: [15, 23, 42] as [number, number, number],
  accent: [5, 150, 105] as [number, number, number],
  gold: [161, 98, 7] as [number, number, number],
  danger: [190, 18, 60] as [number, number, number],
  slate: [100, 116, 139] as [number, number, number],
  light: [248, 250, 252] as [number, number, number],
  border: [203, 213, 225] as [number, number, number]
};

const cleanVal = (val: number, formatValue: (v: number) => string) => {
  return formatValue(val).replace('Rp', '').trim();
};

const drawHeader = (doc: jsPDF, pageNum: number, totalPages: number, title: string, activeProject: Project) => {
  doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MARGINS PRO", 15, 18);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("HYPER-FORENSIC PRICING AUDIT | ULTRA-DETAIL SYSTEM v7.0", 15, 24);

  // Corporate Credit for Page 1 Header as requested
  if (pageNum === 1) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 150, 150);
    doc.text("POWERED BY PT KONEKSI JARINGAN INDONESIA", 15, 30);
    doc.setTextColor(255, 255, 255);
  }

  doc.setFont("helvetica", "normal");
  doc.text(`AUDIT_ID: ${activeProject.id.toUpperCase()}`, 155, 15);
  doc.text(`STAMP: ${new Date().toLocaleString('id-ID')}`, 155, 20);
  doc.text(`STRATEGY: DUAL-PROTECTION`, 155, 25);
  doc.text(`PAGE: ${pageNum} / ${totalPages}`, 155, 30);

  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, 15, 54);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.8);
  doc.line(15, 57, 50, 57);
};

const drawFooter = (doc: jsPDF) => {
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.line(15, 270, 195, 270);
  doc.setTextColor(COLORS.slate[0], COLORS.slate[1], COLORS.slate[2]);
  doc.setFontSize(6);
  doc.text("Dokumen ini adalah aset intelektual hasil analisa Intelligence Engine. Penggunaan data untuk keputusan bisnis sepenuhnya tanggung jawab user.", 15, 275);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PT KONEKSI JARINGAN INDONESIA", 15, 283);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Digital Transformation for Indonesian UMKM | www.konxc.space", 15, 287);
};

export const generateIntelligencePDF = (
  activeProject: Project,
  formatValue: (val: number) => string,
  platformData: Record<string, PlatformConfig>
) => {
  const doc = new jsPDF();
  const totalPages = 4;
  const prodConfig = activeProject.productionConfig || { period: 'weekly', daysActive: 5, targetUnits: 40 };
  const totalHPP = calculateTotalHPP(activeProject.costs, prodConfig);
  const marketPrice = activeProject.competitorPrice || 0;
  const targetProfitNet = activeProject.targetNet || 0;
  const impliedMarketProfit = Math.max(0, marketPrice - totalHPP);
  const marketMargin = marketPrice > 0 ? ((impliedMarketProfit / marketPrice) * 100).toFixed(1) : "0";

  const platformScenarios = calculatePricingStrategies(
    activeProject,
    Object.values(Platform).reduce((acc, p) => ({
      ...acc,
      [p]: {
        commission: (platformData[p]?.defaultCommission || 0) * 100,
        fixedFee: platformData[p]?.defaultFixedFee || 0,
        withdrawal: platformData[p]?.withdrawalFee || 0
      }
    }), {} as Record<Platform, { commission: number; fixedFee: number; withdrawal: number }>),
    0, 0.11
  );

  // ==========================================
  // PAGE 1: EXECUTIVE ULTRA-DETAIL SUMMARY
  // ==========================================
  drawHeader(doc, 1, totalPages, "RINGKASAN EKSEKUTIF & STRATEGI PERLINDUNGAN", activeProject);

  // Core Info Container
  doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.roundedRect(15, 65, 180, 28, 2, 2, 'F');
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(activeProject.name.toUpperCase(), 20, 75);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Identitas: ${activeProject.label} | Siklus Prod: ${prodConfig.period.toUpperCase()} (${prodConfig.targetUnits} Unit)`, 20, 81);
  doc.text(`Benchmark Pasar: ${formatValue(marketPrice)} (Margin Murni: ${marketMargin}%)`, 20, 86);

  // Intelligence Score Widgets
  const widgets = [
    { l: "PRODUCTION HPP", v: formatValue(totalHPP), d: "Modal Fix Per Unit", c: COLORS.secondary },
    { l: "TARGET PROFIT", v: formatValue(targetProfitNet), d: "Laba Aman (Kiri)", c: COLORS.accent },
    { l: "BASE PROFIT", v: formatValue(impliedMarketProfit), d: "Laba Pasar (Kanan)", c: COLORS.primary },
    { l: "ESTIMASI OMSET", v: formatValue(marketPrice * prodConfig.targetUnits), d: "Satu Siklus Jual", c: COLORS.gold }
  ];

  widgets.forEach((w, i) => {
    const x = 15 + (i * 45);
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, 98, 43, 30, 2, 2, 'FD');
    doc.setFontSize(6);
    doc.setTextColor(COLORS.slate[0], COLORS.slate[1], COLORS.slate[2]);
    doc.text(w.l, x + 5, 106);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(w.c[0], w.c[1], w.c[2]);
    doc.text(w.v, x + 5, 115);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text(w.d, x + 5, 121);
  });

  // THE MASTER MATRIX TABLE (DUAL PROTECTION FOCUS)
  let matrixY = 138;
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FORENSIC DUAL-STRATEGY PRICING MATRIX", 15, matrixY);

  matrixY += 5;
  doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.rect(15, matrixY, 180, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.text("CHANNEL / PLATFORM", 18, matrixY + 6.5);
  doc.text("RECOMMENDED PRICE (KIRI / KANAN)", 65, matrixY + 6.5);
  doc.text("APP DEDUCTIONS", 120, matrixY + 6.5);
  doc.text("SECURED PROFIT (KIRI / KANAN)", 155, matrixY + 6.5);

  matrixY += 16;
  platformScenarios.forEach(res => {
    const kiri = res.recommended;
    const kanan = res.competitorProtection || res.recommended;

    doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(res.platform, 18, matrixY);

    doc.setFont("helvetica", "normal");
    // Column 2: Price Matrix
    doc.text(`${cleanVal(kiri.price, formatValue)} / ${cleanVal(kanan.price, formatValue)}`, 65, matrixY);

    doc.setTextColor(COLORS.danger[0], COLORS.danger[1], COLORS.danger[2]);
    // Column 3: Total Deductions based on Safe Price
    doc.text("-" + cleanVal(kiri.totalDeductions, formatValue), 120, matrixY);

    doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.setFont("helvetica", "bold");
    // Column 4: Secured Profit Matrix
    doc.text(`${cleanVal(kiri.netProfit, formatValue)} / ${cleanVal(kanan.netProfit, formatValue)}`, 155, matrixY);

    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setLineWidth(0.1);
    doc.line(15, matrixY + 3, 195, matrixY + 3);
    matrixY += 10;
  });

  // ULTRA DETAIL LOGIC BOX
  matrixY += 5;
  doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.roundedRect(15, matrixY, 180, 50, 3, 3, 'F');
  doc.setDrawColor(COLORS.gold[0], COLORS.gold[1], COLORS.gold[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, matrixY, 180, 50, 3, 3, 'D');

  doc.setTextColor(COLORS.gold[0], COLORS.gold[1], COLORS.gold[2]);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("LOGIKA PROTEKSI & AUDIT STRATEGIS (CARA BACA):", 20, matrixY + 10);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.text(`- ANGKA KIRI: Rekomendasi harga agar PROFIT BERSIH per unit tetap ${formatValue(targetProfitNet)} (Target Manual Anda).`, 20, matrixY + 18);
  doc.text(`- ANGKA KANAN: Rekomendasi harga agar PROFIT BERSIH per unit tetap ${formatValue(impliedMarketProfit)} (Sesuai Margin Dasar Pasar).`, 20, matrixY + 24);
  doc.text(`- PERINGATAN: Harga kolom kanan biasanya lebih tinggi karena sistem memaksakan margin pasar tetap utuh setelah dipotong komisi.`, 20, matrixY + 30);
  doc.text(`- STATUS OPERASIONAL: Jika Anda menggunakan harga pasar (${formatValue(marketPrice)}) langsung di aplikasi,`, 20, matrixY + 36);
  doc.setFont("helvetica", "bold");
  const gap = platformScenarios[0]?.market?.netProfit || 0;
  doc.setTextColor(gap < 0 ? COLORS.danger[0] : COLORS.accent[0]);
  doc.text(`  MAKA PROFIT AKAN TERGERUS MENJADI ${formatValue(gap)} per unit. Sistem kami mencegah hal ini terjadi.`, 20, matrixY + 42);

  // NO FOOTER ON PAGE 1 AS REQUESTED

  // ==========================================
  // PAGE 2: HYPER-FORENSIC COGS AUDIT
  // ==========================================
  doc.addPage();
  drawHeader(doc, 2, totalPages, "AUDIT FORENSIK STRUKTUR BIAYA (COGS)", activeProject);

  let yPos = 65;
  doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.rect(15, yPos, 180, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text("NAMA BAHAN / ITEM BIAYA", 18, yPos + 6.5);
  doc.text("ALOKASI", 85, yPos + 6.5);
  doc.text("YIELD / KAPASITAS", 125, yPos + 6.5);
  doc.text("HARGA BELI", 155, yPos + 6.5);
  doc.text("BEBAN / UNIT", 180, yPos + 6.5);

  yPos += 16;
  activeProject.costs.forEach(cost => {
    if (yPos > 230) { doc.addPage(); yPos = 65; }
    const effective = calculateEffectiveCost(cost, prodConfig);
    doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(cost.name.toUpperCase(), 18, yPos);
    doc.text(cost.allocation === 'bulk' ? `BULK (${cost.bulkUnit === 'days' ? 'Harian' : 'Unit'})` : 'LANGSUNG', 85, yPos);
    doc.text(cost.allocation === 'bulk' ? `${cost.batchYield}` : '1 Porsi', 125, yPos);
    doc.text(cleanVal(cost.amount, formatValue), 155, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(cleanVal(effective, formatValue), 180, yPos);

    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.line(15, yPos + 3, 195, yPos + 3);
    yPos += 10;
  });

  // LOGISTICS REPLENISHMENT RESERVE
  const bulkCosts = activeProject.costs.filter(c => c.allocation === 'bulk');
  if (bulkCosts.length > 0) {
    const burn = calculateOperationalBurnRate(bulkCosts, prodConfig);
    yPos += 10;
    doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.roundedRect(15, yPos, 180, 42, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("CASHFLOW & REPLENISHMENT RESERVE FORECAST", 20, yPos + 10);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(`- Modal Belanja Stok Awal: ${formatValue(burn.totalPurchase)}`, 20, yPos + 18);
    doc.text(`- Burn Rate Operasional: ${formatValue(burn.dailyBurnRate)} / Hari (Kecepatan Uang Keluar)`, 20, yPos + 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.text(`RESERVE DANA ${prodConfig.period.toUpperCase()}: ${formatValue(burn.cycleBurnRate)} (Wajib Tersedia)`, 20, yPos + 34);
  }

  drawFooter(doc);

  // ==========================================
  // PAGE 3: DEEP-DIVE DEDUCTION & TAXATION
  // ==========================================
  doc.addPage();
  drawHeader(doc, 3, totalPages, "AUDIT RINCIAN LAYANAN & PAJAK DIGITAL", activeProject);

  let yAudit = 65;
  const sample = platformScenarios[0];
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`SIMULASI STRUKTUR BIAYA APLIKASI (${sample.platform})`, 15, yAudit);

  yAudit += 10;
  const auditRows = [
    { l: "MODAL DASAR PRODUKSI (COGS UNIT)", v: formatValue(sample.breakdown.totalProductionCost), p: ((sample.breakdown.totalProductionCost / sample.recommended.price) * 100).toFixed(1) + "%", c: COLORS.slate },
    { l: "KOMISI LAYANAN MERCHANT (BASE)", v: formatValue(sample.breakdown.commissionAmount), p: "Variable %", c: COLORS.danger },
    { l: "PAJAK PERTAMBAHAN NILAI (VAT 11%)", v: formatValue(sample.breakdown.taxOnServiceFee), p: "Tax Law", c: COLORS.danger },
    { l: "BIAYA TRANSAKSI / FIXED ORDER FEE", v: formatValue(sample.breakdown.fixedFeeAmount), p: "Per Order", c: COLORS.danger },
    { l: "ESTIMASI BIAYA TARIK SALDO (WD)", v: formatValue(sample.breakdown.withdrawalFeeAmount), p: "Admin WD", c: COLORS.danger },
    { l: "SECURED NET PROFIT (UANG BERSIH ANDA)", v: formatValue(sample.recommended.netProfit), p: sample.recommended.marginPercent.toFixed(1) + "%", c: COLORS.accent }
  ];

  auditRows.forEach(row => {
    doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
    doc.rect(15, yAudit, 180, 12, 'F');
    doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(row.l, 20, yAudit + 7.5);
    doc.text(row.p, 105, yAudit + 7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(row.c[0], row.c[1], row.c[2]);
    doc.text(row.v, 160, yAudit + 7.5);
    yAudit += 13;
  });

  // Strategy Visualization Bars
  yAudit += 15;
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("KOMPOSISI VISUAL HARGA JUAL PER CHANNEL", 15, yAudit);
  yAudit += 10;

  platformScenarios.slice(0, 4).forEach(res => {
    doc.setFontSize(7);
    doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`${res.platform} (Gross: ${formatValue(res.recommended.price)})`, 15, yAudit);
    yAudit += 4;
    const fullW = 175;
    const hppW = (res.breakdown.totalProductionCost / res.recommended.price) * fullW;
    const dedW = (res.recommended.totalDeductions / res.recommended.price) * fullW;
    const netW = (res.recommended.netProfit / res.recommended.price) * fullW;

    doc.setFillColor(200, 200, 200); doc.rect(15, yAudit, hppW, 6, 'F');
    doc.setFillColor(COLORS.danger[0], COLORS.danger[1], COLORS.danger[2]); doc.rect(15 + hppW, yAudit, dedW, 6, 'F');
    doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]); doc.rect(15 + hppW + dedW, yAudit, netW, 6, 'F');
    yAudit += 15;
  });

  drawFooter(doc);

  // ==========================================
  // PAGE 4: HEALTH CHECK & ACTION PLAN
  // ==========================================
  doc.addPage();
  drawHeader(doc, 4, totalPages, "VERIFIKASI SISTEM & REKOMENDASI TAKTIS", activeProject);

  let yFinal = 65;
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("AUDIT KESEHATAN STRUKTUR BISNIS", 15, yFinal);

  const referencePrice = marketPrice > 0 ? marketPrice : (platformScenarios[0]?.recommended.price || 1);
  const hppRatio = (totalHPP / referencePrice) * 100;

  const checks = [
    { t: "RASIO MODAL DASAR (HPP UNIT)", v: hppRatio < 40 ? "OPTIMAL" : "BERISIKO", d: `HPP Anda berada di angka ${hppRatio.toFixed(1)}% dari harga pasar. UMKM ideal harus di bawah 40%.` },
    { t: "STABILITAS LABA VS MODAL", v: targetProfitNet > (totalHPP * 0.2) ? "SANGAT KUAT" : "RENTAN", d: "Ambilan laba per porsi sudah di atas 20% modal dasar. Aman untuk fluktuasi bahan baku." },
    { t: "KAPASITAS SERAPAN PASAR", v: impliedMarketProfit > (totalHPP * 0.1) ? "AMAN" : "TIPIS", d: `Harga kompetitor saat ini memberikan laba murni ${formatValue(impliedMarketProfit)} per unit sebelum dipotong fee.` }
  ];

  yFinal += 10;
  checks.forEach(check => {
    doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
    doc.roundedRect(15, yFinal, 180, 24, 2, 2, 'F');
    doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(check.t, 20, yFinal + 9);

    const isGood = check.v === "OPTIMAL" || check.v === "SANGAT KUAT" || check.v === "AMAN";
    doc.setTextColor(isGood ? COLORS.accent[0] : COLORS.danger[0], isGood ? COLORS.accent[1] : COLORS.danger[1], isGood ? COLORS.accent[2] : COLORS.danger[2]);
    doc.text(check.v, 160, yFinal + 9);

    doc.setTextColor(COLORS.slate[0], COLORS.slate[1], COLORS.slate[2]);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(check.d, 20, yFinal + 17);
    yFinal += 28;
  });

  // FINAL ACTION PLAN
  yFinal += 5;
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(15, yFinal, 180, 45, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("KESIMPULAN & REKOMENDASI TAKTIS:", 22, yFinal + 12);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("1. Gunakan 'Rekomendasi Harga Jual' kolom KIRI untuk menjaga keberlangsungan cashflow.", 22, yFinal + 22);
  doc.text("2. Perbarui data COGS segera jika ada kenaikan harga bahan baku bulk di atas 5%.", 22, yFinal + 28);
  doc.text("3. Pastikan dana 'Replenishment Reserve' dipisahkan untuk belanja operasional berikutnya.", 22, yFinal + 34);
  doc.text("4. Strategi harga ini dirancang untuk meminimalkan resiko 'Bisnis Berdarah' di aplikasi delivery.", 22, yFinal + 40);

  drawFooter(doc);

  doc.save(`ULTRA-AUDIT-${activeProject.name.replace(/\s+/g, '-')}.pdf`);
};

export const downloadProjectJSON = (activeProject: Project) => {
  const json = JSON.stringify(activeProject, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `margins-pro-data-${activeProject.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyProjectToClipboard = async (activeProject: Project): Promise<boolean> => {
  try {
    const json = JSON.stringify(activeProject, null, 2);
    await navigator.clipboard.writeText(json);
    return true;
  } catch {
    return false;
  }
};