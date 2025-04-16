# Kavach.AI

![1sk](https://github.com/user-attachments/assets/da055113-3c71-42c7-937d-64ba315b8eb7)
**Kavach.AI** is an advanced, AI-powered cybersecurity platform designed to detect, analyze, and mitigate malware threats with unparalleled precision and efficiency. This repository contains the backend logic for Kavach.AI, which serves as the core engine for static malware analysis, log processing, file classification, and integration with external threat intelligence services. Built with scalability, modularity, and performance in mind, the backend powers the platform's ability to handle diverse file types, analyze system logs, and provide actionable insights for security analysts.

This README provides a comprehensive guide to Kavach.AI, covering its features, architecture, setup instructions, usage, and contribution guidelines. Whether you're a developer, security researcher, or system administrator, this document will help you understand and leverage the full potential of Kavach.AI's backend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Supported File Types](#supported-file-types)
5. [Dependencies](#dependencies)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Usage](#usage)
   - [API Endpoints](#api-endpoints)
   - [Running the Backend](#running-the-backend)
   - [Analyzing Files](#analyzing-files)
   - [Classifying Malware](#classifying-malware)
   - [Log Analysis](#log-analysis)
   - [Generating Reports](#generating-reports)
9. [Integration with External Services](#integration-with-external-services)
10. [Performance Optimization](#performance-optimization)
11. [Security Considerations](#security-considerations)
12. [Troubleshooting](#troubleshooting)
13. [Contributing](#contributing)
14. [Testing](#testing)
15. [Roadmap](#roadmap)

---

## Project Overview

Kavach.AI's backend is the heart of the platform, implementing sophisticated static analysis, machine learning-based malware classification, and system log parsing to detect and classify potential threats. The backend is designed to handle a wide range of file formats, including executables, scripts, documents, and archives, while providing detailed insights into their structure, behavior, and potential malicious intent.

Key objectives of the Kavach.AI backend include:
- **Comprehensive Analysis**: Perform static analysis on various file types to identify malicious patterns, such as suspicious imports, high-entropy sections, and embedded scripts.
- **Machine Learning Integration**: Utilize XGBoost models to classify files based on byte-level features, achieving high accuracy in malware detection.
- **Log Analysis**: Process system call traces and logs to detect suspicious behaviors, such as unauthorized file access or network activity.
- **Threat Intelligence**: Integrate with external services like VirusTotal and MalwareBazaar for enriched threat intelligence.
- **Scalability**: Support high-throughput analysis for enterprise-grade deployments.
- **Extensibility**: Allow easy integration of new analysis modules and rules.

The backend is built using Python and Flask, with modular components for analysis, classification, and reporting. It leverages industry-standard libraries like `pefile`, `yara`, and `PyPDF2` for file parsing, and integrates with Groq's AI models for advanced log analysis.

---

## Features

The Kavach.AI backend offers a robust set of features tailored for cybersecurity professionals:

### Static Analysis
- **Multi-format Support**: Analyze PE executables, ELF binaries, Mach-O files, PDFs, Office documents, APKs, archives, and scripts.
- **Entropy Analysis**: Detect packed or encrypted sections in binaries using entropy calculations.
- **Import Analysis**: Identify suspicious imports (e.g., `VirtualAlloc`, `CreateRemoteThread`) that indicate malicious behavior.
- **String Extraction**: Extract and analyze strings for IOCs like URLs, IPs, and registry keys.
- **YARA Rule Matching**: Apply custom YARA rules to detect known malware signatures.

### Malware Classification
- **Byte-level Analysis**: Convert files to `.bytes` format for feature extraction and classification.
- **XGBoost Model**: Use a pre-trained XGBoost model to classify files into malware families (e.g., Ramnit, Kelihos, Vundo) or benign.
- **Confidence Scoring**: Provide probability distributions for classification results, enabling nuanced decision-making.

### Log Analysis
- **System Call Tracing**: Analyze `strace`-style logs to detect suspicious behaviors, such as unauthorized file access or network activity.
- **AI-powered Analysis**: Leverage Groq's LLaMA-based models for contextual log analysis, reducing false positives.
- **Weighted Scoring**: Assign weights to detected patterns to calculate a confidence score for suspicious activity.

### Threat Intelligence
- **VirusTotal Integration**: Query VirusTotal for file hash reputation and scan results.
- **MalwareBazaar Integration**: Retrieve threat intelligence based on hashes, tags, signatures, and YARA rules.
- **Extensible Framework**: Easily integrate additional threat intelligence feeds.

### Reporting
- **Detailed Reports**: Generate PDF reports summarizing analysis results, including file metadata, hashes, and flagged behaviors.
- **Customizable Output**: Support JSON and text formats for integration with other tools.
- **Stored Reports**: Archive reports for later retrieval and audit purposes.

### API-Driven Design
- **RESTful Endpoints**: Expose endpoints for file scanning, classification, log analysis, and report generation.
- **CORS Support**: Enable cross-origin requests for integration with web-based frontends.
- **Scalable Deployment**: Run as a Flask application with support for production-grade WSGI servers.

### Performance and Reliability
- **Chunk-based Processing**: Handle large files and logs efficiently using chunked reading.
- **Error Handling**: Gracefully manage file access errors, encoding issues, and API failures.
- **Retry Logic**: Implement retry mechanisms for external API calls to ensure reliability.

---

## Architecture
![2sk](https://github.com/user-attachments/assets/5e6a124f-cc7d-417e-9ebc-875c27cbaf91)

The Kavach.AI backend is structured as a modular Flask application, with distinct components for analysis, classification, and integration. The high-level architecture is as follows:

```
Kavach.AI Backend
├── API Layer (Flask)
│   ├── /api/scan/<type> (basic, enhanced, advanced, complete)
│   ├── /api/classify-malware
│   ├── /api/analyze-logs
│   ├── /api/chat
│   ├── /api/reports/<filename>
│   └── /api/download-report
├── Analysis Modules
│   ├── StaticAnalyzer (basic, enhanced, advanced, complete)
│   ├── MalwareClassifier (XGBoost-based)
│   ├── LogAnalyzer (Groq-powered)
│   └── ByteConverter
├── Integration Layer
│   ├── VirusTotal API
│   ├── MalwareBazaar API
│   └── Groq API
├── Reporting Module
│   └── ReportGenerator (PDF output)
├── Utilities
│   ├── File handling
│   ├── Hash calculation
│   └── Logging
└── Temporary Storage
    ├── temp_uploads
    ├── temp_bytes
    ├── temp_reports
    └── stored_reports
```

### Key Components
1. **StaticAnalyzer**: A family of classes (`BasicAnalyzer`, `EnhancedAnalyzer`, `AdvancedAnalyzer`, `CompleteAnalyzer`) that perform static analysis with increasing levels of sophistication. Features include file type detection, hash calculation, entropy analysis, and YARA scanning.
2. **MalwareClassifier**: Uses a pre-trained XGBoost model to classify `.bytes` files into malware families, with probability outputs for each class.
3. **LogAnalyzer**: Processes system call logs using heuristic rules and Groq's AI models to detect suspicious behaviors.
4. **ByteConverter**: Converts files to `.bytes` format for byte-level analysis and classification.
5. **ReportGenerator**: Creates detailed PDF reports summarizing analysis results.
6. **Integration Layer**: Handles communication with VirusTotal, MalwareBazaar, and Groq APIs for enriched analysis.

---

## Supported File Types

The backend supports a wide range of file formats for static analysis:

| File Type            | Extensions                       | Analysis Features                                  |
|----------------------|----------------------------------|---------------------------------------------------|
| Windows Executables  | `.exe`, `.dll`, `.sys`           | PE header analysis, imports, entropy, sections    |
| Linux Executables    | `.elf`                           | ELF header, sections, symbols                    |
| macOS Executables    | `.macho`, `.dylib`               | Mach-O header, commands                          |
| Android APKs         | `.apk`                           | Manifest analysis, permissions, activities        |
| Office Documents     | `.doc`, `.docx`, `.xls`, `.xlsx` | Macro detection, metadata, embedded objects      |
| PDFs                 | `.pdf`                           | JavaScript detection, embedded files, actions    |
| Archives             | `.zip`, `.rar`, `.7z`, `.jar`    | File listing, comments, compression analysis     |
| Scripts              | `.ps1`, `.sh`                    | Obfuscation detection, suspicious commands       |
| Raw Bytes            | `.bytes`                         | Byte frequency analysis, malware classification  |

---

## Dependencies

The backend relies on the following Python packages:

- **Core Dependencies**:
  - `flask`: Web framework for API endpoints
  - `flask-cors`: Cross-origin resource sharing
  - `numpy`: Numerical computations
  - `xgboost`: Machine learning model for classification
  - `groq`: AI-powered log analysis
  - `requests`: HTTP requests for external APIs
  - `pefile`: PE file parsing
  - `yara-python`: YARA rule matching
  - `python-magic`: File type detection
  - `olefile`: Office document analysis
  - `PyPDF2`: PDF parsing
  - `oletools`: Office macro analysis
  - `gradio`: Optional UI for development

- **Optional Dependencies**:
  - `lief`: ELF and Mach-O parsing
  - `androguard`: APK analysis
  - `rarfile`: RAR archive support
  - `py7zr`: 7z archive support
  - `retry`: API retry logic
  - `reportlab`: PDF report generation

See `requirements.txt` for a complete list.

---

## Installation

Follow these steps to set up the Kavach.AI backend on your system.

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Git (optional, for cloning the repository)
- Optional: VirusTotal and MalwareBazaar API keys for threat intelligence

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kavach-ai/kavach-backend.git
   cd kavach-backend
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Environment Variables**:
   Create a `.env` file in the project root and add the following:
   ```plaintext
   GROQ_API_KEY=your_groq_api_key
   VT_API_KEY=your_virustotal_api_key
   MB_API_KEY=your_malwarebazaar_api_key
   FLASK_ENV=production
   ```

5. **Verify Installation**:
   Run the Flask application to ensure dependencies are correctly installed:
   ```bash
   python app.py
   ```
   The server should start on `http://0.0.0.0:5000`.

---

## Configuration

The backend supports configuration through environment variables and a `.env` file. Key settings include:

- **GROQ_API_KEY**: Required for AI-powered log analysis.
- **VT_API_KEY**: Optional, for VirusTotal integration.
- **MB_API_KEY**: Optional, for MalwareBazaar integration.
- **FLASK_ENV**: Set to `production` or `development`.
- **UPLOAD_FOLDER**: Directory for temporary file uploads (default: `temp_uploads`).
- **REPORT_STORAGE**: Directory for stored reports (default: `stored_reports`).

To customize analysis behavior, modify the following files:
- `scripts/static*.py`: Adjust analyzer parameters (e.g., entropy thresholds, string length).
- `scripts/malware_classifier.py`: Update malware class mappings or thresholds.
- `scripts/sys_log_analysis.py`: Modify detection rules and weights.

---

## Usage

### Running the Backend
Start the Flask server in production mode using a WSGI server like Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

For development, use:
```bash
python app.py
```

The server will be available at `http://localhost:5000`.

### API Endpoints

The backend exposes the following RESTful endpoints:

| Endpoint                     | Method | Description                                     |
|------------------------------|--------|------------------------------------------------|
| `/api/scan/<type>`           | POST   | Analyze a file (types: basic, enhanced, advanced, complete) |
| `/api/classify-malware`      | POST   | Classify a file as malware using XGBoost        |
| `/api/analyze-logs`          | POST   | Analyze system call logs for suspicious behavior|
| `/api/chat`                  | POST   | Interact with Groq AI for custom queries        |
| `/api/reports/<filename>`    | GET    | Retrieve a stored PDF report                    |
| `/api/download-report`       | POST   | Generate and download a PDF report              |

#### Example: Scan a File
```bash
curl -X POST -F "file=@sample.exe" http://localhost:5000/api/scan/complete
```

#### Example: Classify Malware
```bash
curl -X POST -F "file=@sample.bytes" http://localhost:5000/api/classify-malware
```

#### Example: Analyze Logs
```bash
curl -X POST -F "file=@trace.log" http://localhost:5000/api/analyze-logs
```

### Analyzing Files
Upload a file to one of the `/api/scan/<type>` endpoints. The response includes:
- File metadata (name, size, type, hashes)
- Analysis results (e.g., PE sections, strings, YARA matches)
- Byte-level analysis (if applicable)
- Report filename for downloading

### Classifying Malware
The `/api/classify-malware` endpoint converts files to `.bytes` format and uses an XGBoost model to classify them. The response includes:
- Predicted malware type (e.g., Ramnit, Vundo, or Likely Normal)
- Confidence score
- Probability distribution across all classes

### Log Analysis
Upload a system call log to `/api/analyze-logs`. The response includes:
- Confidence score for suspicious activity
- Flagged behaviors (e.g., unauthorized file access, network activity)
- Recommendations for mitigation

### Generating Reports
Use `/api/download-report` to generate a PDF report from analysis results. Reports include:
- File metadata and hashes
- Analysis summary
- Suspicious findings
- Visualizations (if applicable)

---

## Integration with External Services

The backend integrates with the following services:

### VirusTotal
- **Purpose**: Retrieve file reputation and scan results.
- **Configuration**: Set `VT_API_KEY` in `.env`.
- **Usage**: Included in `EnhancedAnalyzer` and above.

### MalwareBazaar
- **Purpose**: Query threat intelligence by hash, tag, signature, or YARA rule.
- **Configuration**: Set `MB_API_KEY` in `.env`.
- **Usage**: Supported in `CompleteAnalyzer`.

### Groq
- **Purpose**: AI-powered log analysis using LLaMA models.
- **Configuration**: Set `GROQ_API_KEY` in `.env`.
- **Usage**: Used in `/api/analyze-logs` and `/api/chat`.

To add new integrations, extend the `StaticAnalyzer` classes in `scripts/static*.py`.

---

## Performance Optimization

The backend is optimized for high performance:
- **Chunk-based Processing**: Large files and logs are processed in chunks to reduce memory usage.
- **Caching**: File type detection and analysis results are cached where appropriate.
- **Parallel Processing**: Flask supports multi-threading for concurrent requests.
- **Efficient Hashing**: Uses buffered reading for MD5, SHA1, and SHA256 calculations.

For further optimization:
- Deploy with Gunicorn or uWSGI for better concurrency.
- Use a reverse proxy (e.g., Nginx) for load balancing.
- Enable caching with Redis for frequently accessed results.

---

## Security Considerations

- **File Uploads**: Temporary files are stored in `temp_uploads` and deleted after processing.
- **Input Validation**: All file inputs are validated for type and size.
- **API Security**: Use HTTPS in production and implement authentication (e.g., JWT).
- **Sandboxing**: Run the backend in a sandboxed environment to mitigate risks from malicious files.
- **Logging**: Sensitive information is not logged; logs are stored in `logs/log_analysis.log`.

---

## Troubleshooting

### Common Issues
- **"No file provided"**: Ensure the file is included in the POST request.
- **"Failed to convert to .bytes"**: Check file permissions and disk space.
- **"API key not found"**: Verify `GROQ_API_KEY`, `VT_API_KEY`, or `MB_API_KEY` in `.env`.
- **"Out of memory"**: Reduce `CHUNK_SIZE` in `sys_log_analysis.py`.

### Debugging
- Enable `FLASK_ENV=development` for verbose logging.
- Check `logs/log_analysis.log` for detailed errors.
- Use `python app.py` to run in debug mode.

### Support
If issues persist, open a GitHub issue with:
- Error message
- Steps to reproduce
- System details (OS, Python version)

---

## Contributing

We welcome contributions to Kavach.AI! To contribute:

1. **Fork the Repository**:
   ```bash
   git clone https://github.com/kavach-ai/kavach-backend.git
   ```

2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes**:
   Follow PEP 8 style guidelines and add tests for new features.

4. **Submit a Pull Request**:
   Include a detailed description of changes and reference any related issues.

### Contribution Ideas
- Add support for new file types (e.g., iOS IPA files).
- Implement dynamic analysis capabilities.
- Enhance YARA rules for better detection.
- Optimize performance for large-scale deployments.

---

## Testing

The backend includes unit tests and integration tests in the `tests/` directory (to be implemented). To run tests:

```bash
pytest tests/
```

### Test Coverage
- File parsing (PE, ELF, PDF, etc.)
- Malware classification
- Log analysis
- API endpoints
- Error handling

---

## Roadmap

Future enhancements for the Kavach.AI include:
- **Dynamic Analysis**: Integrate sandboxing for runtime behavior analysis.
- **Real-time Monitoring**: Add support for continuous log streaming.
- **Machine Learning Improvements**: Train models on larger datasets for better accuracy.
- **Cloud Deployment**: Support for AWS, Azure, and GCP.

---
