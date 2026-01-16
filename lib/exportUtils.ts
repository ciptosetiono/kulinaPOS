
/**
 * KulinaPOS Export Utilities
 */

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Map data to rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName];
        // Handle null/undefined and escape commas
        const escapedValue = ('' + (value ?? '')).replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
