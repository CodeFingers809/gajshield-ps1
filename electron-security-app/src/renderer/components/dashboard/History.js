import React from 'react';
import { Box, Typography, Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack } from '@mui/material';
import { ErrorOutline, CheckCircleOutline, WarningAmber, Download, DeleteOutline } from '@mui/icons-material';

function History() {
  const [scanHistory, setScanHistory] = React.useState([]);

  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setScanHistory(history);
  }, []);

  const handleDownloadReport = async (scan) => {
    try {
      if (scan.reportPath) {
        // Download stored report using the stored path
        const response = await fetch(`http://localhost:5000/api/reports/${scan.reportPath}`);
        if (!response.ok) throw new Error('Failed to download report');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = scan.reportPath;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Generate new report if no stored path exists
        const response = await fetch('http://localhost:5000/api/download-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scan.results)
        });

        if (!response.ok) throw new Error('Failed to generate report');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security_report_${scan.timestamp}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Update stored path in history
        const scanHistory = JSON.parse(localStorage.getItem('scanHistory'));
        const scanIndex = scanHistory.findIndex(s => s.timestamp === scan.timestamp);
        if (scanIndex !== -1) {
          scanHistory[scanIndex].reportPath = `security_report_${scan.timestamp}.pdf`;
          localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
        }
      }
    } catch (error) {
      console.error('Download error:', error);  // Log error but don't show to user
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('scanHistory');
    setScanHistory([]);
  };

  const getThreatLevelChip = (level) => {
    const colors = {
      clean: { color: 'success', icon: <CheckCircleOutline fontSize="small" /> },
      low: { color: 'info', icon: <WarningAmber fontSize="small" /> },
      medium: { color: 'warning', icon: <WarningAmber fontSize="small" /> },
      high: { color: 'error', icon: <ErrorOutline fontSize="small" /> },
      critical: { color: 'error', icon: <ErrorOutline fontSize="small" /> },
    };

    return (
      <Chip
        icon={colors[level].icon}
        label={level.toUpperCase()}
        color={colors[level].color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Scan History
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutline />}
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Scan Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Threat Level</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scanHistory.map((scan, index) => (
              <TableRow key={index}>
                <TableCell>{scan.fileName}</TableCell>
                <TableCell>{new Date(scan.timestamp).toLocaleString()}</TableCell>
                <TableCell>{scan.status}</TableCell>
                <TableCell>{getThreatLevelChip(scan.threatLevel)}</TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<Download />}
                    onClick={() => handleDownloadReport(scan)}
                    size="small"
                  >
                    Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default History;
