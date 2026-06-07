import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

/**
 * Exports historical exchange rate data to an .xlsx file.
 * @param {Object} params
 * @param {string} params.base
 * @param {string} params.target
 * @param {string} params.startDate  YYYY-MM-DD
 * @param {string} params.endDate    YYYY-MM-DD
 * @param {Array}  params.ratesArray  [{ date, base, quote, rate }, ...]  (v2 format)
 */
export function exportToExcel({ base, target, startDate, endDate, ratesArray }) {
  try {
    const decimals = ['JPY', 'KRW', 'IDR'].includes(target) ? 2 : 4

    // Build rows from the v2 flat array
    const rows = [...ratesArray]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(({ date, rate }) => ({
        Date: date,
        'Exchange Rate': parseFloat(rate.toFixed(decimals)),
        'Base Currency': base,
        'Target Currency': target,
      }))

    // Create workbook & worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)

    // Column widths
    ws['!cols'] = [
      { wch: 14 },  // Date
      { wch: 18 },  // Exchange Rate
      { wch: 18 },  // Base Currency
      { wch: 18 },  // Target Currency
    ]

    // Style header row
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFFFF' } },
      fill: { fgColor: { rgb: 'FF0A0F1D' } },
      border: {
        top: { style: 'thin', color: { rgb: 'FF06B6D4' } },
        bottom: { style: 'thin', color: { rgb: 'FF06B6D4' } },
        left: { style: 'thin', color: { rgb: 'FF06B6D4' } },
        right: { style: 'thin', color: { rgb: 'FF06B6D4' } },
      },
      alignment: { horizontal: 'center', vertical: 'center' },
    }

    const cellStyle = {
      border: {
        top: { style: 'thin', color: { rgb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { rgb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { rgb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { rgb: 'FFE2E8F0' } },
      },
      alignment: { horizontal: 'center', vertical: 'center' },
    }

    const cols = ['A', 'B', 'C', 'D']
    cols.forEach(col => {
      const cell = ws[`${col}1`]
      if (cell) cell.s = headerStyle
    })

    const totalRows = rows.length + 1
    for (let row = 2; row <= totalRows; row++) {
      cols.forEach(col => {
        const ref = `${col}${row}`
        if (ws[ref]) ws[ref].s = cellStyle
      })
      // Number format for Exchange Rate column
      if (ws[`B${row}`]) ws[`B${row}`].z = decimals === 2 ? '0.00' : '0.0000'
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Exchange Rates')

    // Summary sheet
    const rateValues = rows.map(r => r['Exchange Rate'])
    const summaryData = [
      { Field: 'Base Currency',   Value: base },
      { Field: 'Target Currency', Value: target },
      { Field: 'Start Date',      Value: startDate },
      { Field: 'End Date',        Value: endDate },
      { Field: 'Total Records',   Value: rows.length },
      { Field: 'Min Rate',        Value: Math.min(...rateValues).toFixed(decimals) },
      { Field: 'Max Rate',        Value: Math.max(...rateValues).toFixed(decimals) },
      { Field: 'Avg Rate',        Value: (rateValues.reduce((s, v) => s + v, 0) / rateValues.length).toFixed(decimals) },
      { Field: 'Exported At',     Value: new Date().toISOString() },
    ]
    const wsSummary = XLSX.utils.json_to_sheet(summaryData)
    wsSummary['!cols'] = [{ wch: 20 }, { wch: 24 }]
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')

    const fileName = `exchange_rates_${base}_${target}_${startDate}_to_${endDate}.xlsx`
    XLSX.writeFile(wb, fileName)

    toast.success(`Exported ${rows.length} records to ${fileName}`, {
      duration: 4000,
      style: {
        background: 'rgba(13,26,58,0.95)',
        color: '#10b981',
        border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '12px',
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    toast.error('Export failed. Please try again.', {
      style: {
        background: 'rgba(13,26,58,0.95)',
        color: '#f87171',
        border: '1px solid rgba(248,113,113,0.3)',
        borderRadius: '12px',
      },
    })
  }
}
