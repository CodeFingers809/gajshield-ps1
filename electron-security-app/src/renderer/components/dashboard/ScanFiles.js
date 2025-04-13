import React from 'react';
import { 
  Box, Typography, Paper, Button, Grid, LinearProgress, Alert, 
  Tabs, Tab, Card, CardContent, CardHeader, 
  Table, TableBody, TableCell, TableContainer, TableRow, TableHead,
  Chip, Stack, CircularProgress, IconButton, Tooltip, Divider, List, ListItem, ListItemText
} from '@mui/material';
import { 
  CloudUpload, Security, Download, Refresh, CheckCircle,
  Warning, Error as ErrorIcon, Info 
} from '@mui/icons-material';

function JsonDataView({ title, data = {}, type, compareTo }) {
  // Filter out duplicate data if compareTo is provided
  const getUniqueData = () => {
    if (!compareTo || !data) return data;
    
    const uniqueData = {};
    Object.entries(data).forEach(([key, value]) => {
      // Skip if the value is identical in compareTo
      if (JSON.stringify(compareTo[key]) !== JSON.stringify(value)) {
        uniqueData[key] = value;
      }
    });
    return uniqueData;
  };

  const uniqueData = getUniqueData();
  
  // Don't render if no unique data
  if (Object.keys(uniqueData).length === 0) {
    return (
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Typography color="text.secondary" align="center">
            No unique analysis data available for this scan type.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const renderValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Chip icon={<CheckCircle />} label="Yes" color="success" size="small" />
      ) : (
        <Chip icon={<Warning />} label="No" color="error" size="small" />
      );
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return "None";
      return (
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {value.slice(0, 5).map((item, i) => (
            <ListItem key={i}>
              <ListItemText 
                primary={typeof item === 'object' ? JSON.stringify(item) : String(item)}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }
                }}
              />
            </ListItem>
          ))}
          {value.length > 5 && (
            <ListItem>
              <ListItemText 
                secondary={`...and ${value.length - 5} more items`}
                sx={{ color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <TableContainer sx={{ ml: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
          <Table size="small">
            <TableBody>
              {Object.entries(value).map(([k, v]) => (
                <TableRow key={k} hover>
                  <TableCell 
                    component="th" 
                    sx={{ 
                      width: '30%',
                      color: 'primary.main',
                      fontWeight: 500,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {k.replace(/_/g, ' ').toUpperCase()}
                  </TableCell>
                  <TableCell>{renderValue(v)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    
    return (
      <Typography 
        variant="body2" 
        sx={{ 
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}
      >
        {String(value)}
      </Typography>
    );
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      {title && (
        <CardHeader
          title={
            <Typography variant="h6" color="primary">
              {title}
            </Typography>
          }
          sx={{ pb: 0 }}
        />
      )}
      <CardContent>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {Object.entries(uniqueData).map(([key, value]) => (
                <TableRow 
                  key={key} 
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    borderLeft: (theme) => 
                      key === 'suspicious' || key === 'error' 
                        ? `4px solid ${theme.palette.warning.main}` 
                        : 'none',
                    verticalAlign: 'top'
                  }}
                >
                  <TableCell 
                    component="th" 
                    sx={{ 
                      width: '200px',
                      fontWeight: 600,
                      color: key === 'suspicious' || key === 'error' ? 'warning.main' : 'text.primary',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </TableCell>
                  <TableCell>{renderValue(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function FileUploadZone({ onDrop, disabled }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragCount, setDragCount] = React.useState(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragCount(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragCount(prev => prev - 1);
    if (dragCount <= 1) setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCount(0);
    const files = e.dataTransfer.files;
    onDrop(files);
  };

  return (
    <Box
      component="label"
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: isDragging ? 'rgba(11, 79, 108, 0.04)' : 'transparent',
        border: '3px dashed',
        borderColor: theme => isDragging ? 'primary.main' : 'rgba(11, 79, 108, 0.2)',
        borderRadius: 4,
        transition: 'all 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        '&:hover': {
          borderColor: '#0B4F6C',
          backgroundColor: 'rgba(11, 79, 108, 0.04)',
          '& .upload-icon': {
            transform: 'translateY(-8px)',
          }
        },
        '&::before': isDragging ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(11, 79, 108, 0.08) 0%, transparent 70%)',
          animation: 'pulse 2s infinite',
          pointerEvents: 'none',
        } : {},
        '@keyframes pulse': {
          '0%': { opacity: 0.6 },
          '50%': { opacity: 0.9 },
          '100%': { opacity: 6 }
        }
      }}
    >
      <input
        type="file"
        hidden
        multiple
        onChange={(e) => onDrop(e.target.files)}
        disabled={disabled}
        accept="*/*"
      />
      
      <Box className="upload-icon" sx={{ 
        transition: 'transform 0.3s ease',
        textAlign: 'center'
      }}>
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(11, 79, 108, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 2
        }}>
          <CloudUpload sx={{ 
            fontSize: 40,
            color: '#0B4F6C',
            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }} />
        </Box>
        <Typography variant="h6" color="#0B4F6C" sx={{ 
          fontWeight: 600,
          textShadow: isDragging ? '0 0 20px rgba(11, 79, 108, 0.3)' : 'none'
        }}>
          {isDragging ? 'Release to Upload Files' : 'Drop Files Here'}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          or click to browse
        </Typography>
      </Box>

      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          mt: 2,
          opacity: 0.7
        }}
      >
        <Chip
          size="small"
          label="Documents"
          variant="outlined"
          sx={{ borderColor: 'rgba(11, 79, 108, 0.3)' }}
        />
        <Chip
          size="small"
          label="Executables"
          variant="outlined"
          sx={{ borderColor: 'rgba(11, 79, 108, 0.3)' }}
        />
        <Chip
          size="small"
          label="Archives"
          variant="outlined"
          sx={{ borderColor: 'rgba(11, 79, 108, 0.3)' }}
        />
      </Stack>
    </Box>
  );
}

function MalwareClassificationTab({ classification }) {
  if (!classification || !classification.probabilities) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Malware Classification"
          subheader="No classification data available"
          sx={{ bgcolor: 'primary.main', color: 'white' }}
        />
        <CardContent>
          <Typography color="text.secondary">
            Classification analysis could not be performed on this file.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { predicted_malware = 'Unknown', max_probability = 0, probabilities = {} } = classification;

  return (
    <>
      <Card sx={{ mb: 3, backgroundColor: 'primary.main' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {(max_probability * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Confidence
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Predicted Classification
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {predicted_malware}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Detailed Analysis"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="70%" sx={{ verticalAlign: 'top' }}>Classification</TableCell>
                <TableCell width="15%" sx={{ verticalAlign: 'top' }}>Probability</TableCell>
                <TableCell width="15%" sx={{ verticalAlign: 'top' }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(probabilities || {})
                .sort(([,a], [,b]) => b - a) // Sort by probability descending
                .map(([malware, probability]) => (
                  <TableRow 
                    key={malware}
                    sx={{
                      bgcolor: predicted_malware === malware ? 'action.hover' : 'inherit'
                    }}
                  >
                    <TableCell sx={{ 
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      verticalAlign: 'top',
                      maxWidth: '400px'
                    }}>
                      {malware}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <LinearProgress
                        variant="determinate"
                        value={probability * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: predicted_malware === malware ? 'primary.main' : 'grey.500'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      {(probability * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

function ScanFiles() {
  const [scanning, setScanning] = React.useState(false);
  const [results, setResults] = React.useState({});
  const [error, setError] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [files, setFiles] = React.useState([]);
  const [currentFileIndex, setCurrentFileIndex] = React.useState(0);

  const scanTypes = ['basic', 'enhanced', 'advanced', 'complete'];

  const handleFileSelect = async (event) => {
    if (!event?.target?.files?.length) return;  
    
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setScanning(true);
    setError(null);
    setResults({});

    try {
      const allResults = {};
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i);
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        // Ensure results object exists for this file
        allResults[file.name] = {};

        for (const [index, scanType] of scanTypes.entries()) {
          setProgress((index / scanTypes.length) * 100);
          
          try {
            const response = await fetch(`http://localhost:5000/api/scan/${scanType}`, {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              // Store all results, including those from basic and enhanced scans
              allResults[file.name][scanType] = data;
            }
          } catch (err) {
            console.error(`Error in ${scanType} scan:`, err);
          }
        }

        // Perform malware classification
        try {
          const malwareResponse = await fetch('http://localhost:5000/api/classify-malware', {
            method: 'POST',
            body: formData,
          });

          if (malwareResponse.ok) {
            const malwareData = await malwareResponse.json();
            allResults[file.name].malwareClassification = malwareData;
          }
        } catch (err) {
          console.error('Malware classification error:', err);
        }
      }

      // Store scan results in history
      const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      if (Object.keys(allResults).length > 0) {
        const newScan = {
          timestamp: new Date().toISOString(),
          fileName: selectedFiles[0].name,
          status: 'Completed',
          threatLevel: calculateThreatLevel(allResults),
          results: allResults,
          reportPath: allResults[selectedFiles[0].name]?.basic?.report_file || null
        };
        
        scanHistory.unshift(newScan);
        localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
      }
      
      setResults(allResults);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
      setProgress(100);
    }
  };

  const calculateThreatLevel = (results) => {
    // Calculate threat level based on analysis results
    let threatLevel = 'clean';
    for (const fileResult of Object.values(results)) {
      for (const scanResult of Object.values(fileResult)) {
        if (scanResult.error) continue;
        if (scanResult.analysis?.suspicious?.length > 0) threatLevel = 'high';
        else if (scanResult.bytes_analysis?.suspicious) threatLevel = 'medium';
        else if (Object.keys(scanResult.analysis || {}).length > 0) threatLevel = 'low';
      }
    }
    return threatLevel;
  };

  const renderAnalysisCard = (title, data, type) => {
    if (!data) return null;

    const getSeverityIcon = () => {
      // if (data.error) return <ErrorIcon color="error" />;
      if (type !== 'enhanced' && data.suspicious) return <Warning color="warning" />;
      return <CheckCircle color="success" />;
    };

    return (
      <Card elevation={3} sx={{ mb: 2 }}>
        <CardHeader
          avatar={getSeverityIcon()}
          title={
            <Typography variant="h6" color="primary">
              {title}
            </Typography>
          }
          subheader={
            <Stack direction="row" spacing={1} mt={1}>
              <Chip 
                label={`Size: ${formatFileSize(data.file_size)}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
              <Chip 
                label={data.file_type || 'Unknown'}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          }
        />
        <Divider />
        <CardContent>
          <Box sx={{ 
            maxHeight: '60vh', 
            overflow: 'auto',
            '&::-webkit-scrollbar': { width: 8 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4 }
          }}>
            <JsonDisplay data={data} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadReport = async () => {
    if (!results) return;

    try {
      // Format data for report generation
      const reportData = {
        timestamp: new Date().toISOString(),
        total_files: Object.keys(results).length,
        files: results
      };

      const response = await fetch('http://localhost:5000/api/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'security_analysis_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
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
          Security Analysis
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Upload files for comprehensive security analysis and threat detection
        </Typography>
      </Paper>

      <FileUploadZone 
        onDrop={(files) => handleFileSelect({ target: { files } })}
        disabled={scanning}
      />

      {scanning && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} sx={{ color: '#0B4F6C' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0B4F6C' }}>
                  Processing {files[currentFileIndex]?.name}
                </Typography>
              </Stack>
              <Typography color="text.secondary">
                {currentFileIndex + 1} of {files.length}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(11, 79, 108, 0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#0B4F6C',
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" align="right">
              {Math.round(progress)}%
            </Typography>
          </Stack>
        </Paper>
      )}

      {error && (
        // <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        <></>
      )}

      {Object.keys(results || {}).length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            mt: 4, 
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <Box sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(11, 79, 108, 0.04) 0%, rgba(0, 180, 216, 0.04) 100%)',
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems="center" 
              spacing={2}
            >
              <Box>
                <Typography variant="h6">Analysis Results</Typography>
                <Typography variant="body2" color="text.secondary">
                  {Object.keys(results).length} files analyzed
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleDownloadReport}
                startIcon={<Download />}
                size="large"
              >
                Download Report
              </Button>
            </Stack>
          </Box>

          {Object.entries(results || {}).map(([filename, fileResults = {}]) => (
            <Box key={filename} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {filename}
              </Typography>
              <Tabs 
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
              >
                {scanTypes.map((type, index) => (
                  <Tab 
                    key={type}
                    label={type.toUpperCase()}
                    icon={fileResults[type]?.error ? <Warning color="error" /> : null}
                    iconPosition="end"
                  />
                ))}
                <Tab label="Malware Classification" />
              </Tabs>

              {scanTypes.map((type, index) => (
                <Box key={type} hidden={activeTab !== index}>
                  <JsonDataView
                    title={`${type.toUpperCase()} Analysis`}
                    data={fileResults[type] || {}}
                    type={type}
                    // Pass basic scan data for comparison if this is enhanced scan
                    compareTo={type === 'enhanced' ? fileResults['basic'] : null}
                  />
                </Box>
              ))}
              {activeTab === scanTypes.length && fileResults?.malwareClassification && (
                <MalwareClassificationTab 
                  classification={fileResults.malwareClassification} 
                />
              )}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

export default ScanFiles;
