import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Card, CardContent, 
  Stack, LinearProgress, Alert, 
  TableContainer, Table, TableBody, TableCell, TableRow, TableHead,
  Chip
} from '@mui/material';
import { 
  CloudUpload, Warning, Error as ErrorIcon, Info, CloudDownload
} from '@mui/icons-material';

function LogAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (files) => {
    setAnalyzing(true);
    setError(null);
    
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('http://localhost:5000/api/upload-sample', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const dockerResponse = await fetch('http://localhost:5000/api/run-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name
        }),
      });

      if (!dockerResponse.ok) {
        throw new Error('Docker analysis failed');
      }

      const analysisResponse = await fetch('http://localhost:5000/api/analyze-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'trace.log'
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Log analysis failed');
      }

      const data = await analysisResponse.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to complete analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;

    try {
      const response = await fetch('http://localhost:5000/api/download-log-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `log_analysis_report_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download report');
    }
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadReport}
                startIcon={<CloudDownload />}
              >
                Download Report
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>File Information:</Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1 
              }}>
                <Chip 
                  label={results.file}
                  color="primary"
                  variant="outlined"
                  sx={{ maxWidth: '100%', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal' } }}
                />
                <Chip 
                  label={`${results.total_lines} lines`}
                  color="secondary"
                  variant="outlined"
                />
                <Chip 
                  label={`${results.flagged_percentage}% flagged`}
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </Box>

            {results.flag_summary && Object.keys(results.flag_summary).length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Detection Summary:</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '70%' }}>Pattern</TableCell>
                        <TableCell align="right">Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(results.flag_summary).map(([rule, count]) => (
                        <TableRow key={rule}>
                          <TableCell 
                            sx={{ 
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              maxWidth: '300px'
                            }}
                          >
                            {rule.replace(/_/g, ' ').toUpperCase()}
                          </TableCell>
                          <TableCell align="right">
                            <Chip size="small" label={count} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {results.recommendations && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
                <Stack spacing={1}>
                  {results.recommendations.map((rec, index) => (
                    <Alert 
                      key={index} 
                      severity={results.is_suspicious ? "warning" : "info"}
                      sx={{ 
                        '& .MuiAlert-message': { 
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word' 
                        } 
                      }}
                    >
                      {rec}
                    </Alert>
                  ))}
                </Stack>
              </Box>
            )}

            {results.flags && results.flags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Detected Issues:</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width="20%">Rule</TableCell>
                        <TableCell width="60%">Description</TableCell>
                        <TableCell width="20%" align="right">Line</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.flags.map((flag, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ 
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                          }}>
                            {flag.rule.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell sx={{ 
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            maxWidth: '400px'
                          }}>
                            {flag.description}
                          </TableCell>
                          <TableCell align="right">{flag.line}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Analysis Results:</Typography>
              <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={results.confidence}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: results.high_confidence ? 'error.main' : 'warning.main'
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ minWidth: 60 }}>
                      {results.confidence}%
                    </Typography>
                  </Stack>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      size="small"
                      icon={<Warning />}
                      label={`Suspicious Threshold: ${results.thresholds.suspicious}%`}
                      color="warning"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      icon={<ErrorIcon />}
                      label={`High Confidence Threshold: ${results.thresholds.high_confidence}%`}
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                </Stack>
              </Card>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #0B4F6C 0%, #00B4D8 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Log Analysis
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Upload system logs for security analysis and threat detection
        </Typography>
      </Paper>

      <Box
        component="label"
        sx={{
          width: '100%',
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px dashed',
          borderColor: 'rgba(11, 79, 108, 0.2)',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'rgba(11, 79, 108, 0.04)',
          },
        }}
      >
        <input
          type="file"
          hidden
          onChange={(e) => handleFileUpload(e.target.files)}
          accept=".exe,.dll"
        />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" color="primary.main" gutterBottom>
          Drop executable file here or click to browse
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Supports .exe and .dll files
        </Typography>
      </Box>

      {analyzing && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress />
          <Typography sx={{ mt: 1 }} color="text.secondary" align="center">
            Analyzing log file...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {renderResults()}
    </Box>
  );
}

export default LogAnalysis;
