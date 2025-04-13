from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from datetime import datetime
from textwrap import wrap

def generate_report(data, output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#1976d2')
    ))
    
    elements = []
    
    # Header
    elements.append(Paragraph("Security Analysis Report", styles['CustomTitle']))
    elements.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Process each file
    for filename, file_results in data.get('files', {}).items():
        elements.append(Paragraph(f"File: {filename}", styles['Heading2']))
        
        # Malware Classification Summary
        if 'malwareClassification' in file_results:
            classification = file_results['malwareClassification']
            
            # Create a summary table
            summary_data = [
                ['Malware Classification Summary', ''],
                ['Predicted Type', classification['predicted_malware']],
                ['Confidence', f"{(classification['max_probability'] * 100):.2f}%"]
            ]
            
            summary_table = Table(summary_data, colWidths=[8*cm, 8*cm])
            summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1976d2')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('SPAN', (0, 0), (1, 0)),  # Merge cells for header
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ]))
            elements.append(summary_table)
            elements.append(Spacer(1, 12))
            
            # Detailed probability table
            prob_data = [['Classification Type', 'Probability']]
            sorted_probs = sorted(
                classification['probabilities'].items(),
                key=lambda x: x[1],
                reverse=True
            )
            prob_data.extend(
                [[k, f"{(v * 100):.2f}%"] for k, v in sorted_probs]
            )
            
            prob_table = Table(prob_data, colWidths=[12*cm, 4*cm])
            prob_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f5f5f5')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ]))
            elements.append(prob_table)
            elements.append(Spacer(1, 20))

        # File Analysis Results
        for scan_type, scan_results in file_results.items():
            if scan_type != 'malwareClassification':
                elements.append(Paragraph(f"{scan_type.upper()} Analysis", styles['Heading3']))
                
                # Basic file info table
                info_data = [['Property', 'Value']]
                info_data.extend([
                    ['File Size', f"{scan_results.get('file_size', 'N/A')} bytes"],
                    ['File Type', scan_results.get('file_type', 'N/A')]
                ])
                
                if 'hashes' in scan_results:
                    for hash_type, hash_value in scan_results['hashes'].items():
                        info_data.append([
                            hash_type.upper(),
                            hash_value
                        ])
                
                table = Table(info_data, colWidths=[4*cm, 12*cm])
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1976d2')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ]))
                elements.append(table)
                elements.append(Spacer(1, 12))
        
        elements.append(PageBreak())
    
    doc.build(elements)

def format_dict_content(data: dict, indent=0) -> str:
    """Format dictionary content with proper indentation and line breaks"""
    result = []
    for key, value in data.items():
        key_str = key.replace('_', ' ').title()
        if isinstance(value, dict):
            result.append(f"{'  ' * indent}{key_str}:")
            result.append(format_dict_content(value, indent + 1))
        elif isinstance(value, list):
            result.append(f"{'  ' * indent}{key_str}:")
            result.append(format_list_content(value, indent + 1))
        else:
            result.append(f"{'  ' * indent}{key_str}: {value}")
    return '\n'.join(result)

def format_list_content(data: list, indent=0) -> str:
    """Format list content with proper indentation and line breaks"""
    return '\n'.join(f"{'  ' * indent}- {item}" for item in data)

