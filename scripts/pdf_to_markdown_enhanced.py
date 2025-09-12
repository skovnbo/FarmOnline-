#!/usr/bin/env python3
"""
Enhanced PDF to Markdown Converter
Converts PDF files to markdown format with better text processing and structure detection.
"""

import fitz  # PyMuPDF
import os
import sys
import re
from pathlib import Path

def extract_text_with_layout(page):
    """Extract text while preserving layout information."""
    blocks = page.get_text("dict")
    
    # Group text by approximate y-coordinate (rows)
    rows = {}
    for block in blocks["blocks"]:
        if "lines" in block:
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    if text:
                        y = round(span["bbox"][1])  # Use top y-coordinate
                        if y not in rows:
                            rows[y] = []
                        rows[y].append({
                            'text': text,
                            'x': span["bbox"][0],
                            'font_size': span["size"],
                            'font_flags': span["flags"]
                        })
    
    # Sort rows by y-coordinate and combine text in each row
    combined_text = []
    for y in sorted(rows.keys()):
        # Sort text in each row by x-coordinate (left to right)
        row_items = sorted(rows[y], key=lambda x: x['x'])
        row_text = ' '.join([item['text'] for item in row_items])
        if row_text.strip():
            combined_text.append(row_text.strip())
    
    return '\n'.join(combined_text)

def detect_structure(text_lines):
    """Detect document structure and apply markdown formatting."""
    markdown_lines = []
    current_section = None
    
    for line in text_lines:
        line = line.strip()
        if not line:
            continue
        
        # Skip very short lines that might be page numbers or artifacts
        if len(line) < 3:
            continue
            
        # Detect headings (various patterns)
        is_heading = False
        
        # Pattern 1: All caps lines that are likely titles
        if line.isupper() and len(line.split()) <= 6:
            markdown_lines.append(f"\n## {line.title()}\n")
            current_section = line.lower()
            is_heading = True
            
        # Pattern 2: Lines ending with a colon (section headers)
        elif line.endswith(':') and len(line.split()) <= 8:
            markdown_lines.append(f"\n### {line}\n")
            is_heading = True
            
        # Pattern 3: Lines that start with capital and are short (likely headings)
        elif (line[0].isupper() and len(line.split()) <= 5 and 
              not line.endswith('.') and not line.endswith(',')):
            # Check if it contains common heading words
            heading_words = ['strategy', 'description', 'features', 'configuration', 
                           'applications', 'support', 'access', 'update', 'network']
            if any(word in line.lower() for word in heading_words):
                markdown_lines.append(f"\n### {line}\n")
                is_heading = True
        
        if not is_heading:
            # Handle different content types
            if 'bluecontrol' in line.lower():
                # This might be a key term, make it bold
                line = line.replace('BlueControl', '**BlueControl**')
                line = line.replace('bluecontrol', '**BlueControl**')
            
            if 'farmonline' in line.lower():
                line = line.replace('FarmOnline+', '**FarmOnline+**')
                line = line.replace('farmonline', '**FarmOnline+**')
            
            # Detect lists or bullet points
            if (line.startswith('-') or line.startswith('•') or 
                re.match(r'^\d+\.', line) or 
                line.lower().startswith(('via ', 'lvl ', 'remote ', 'latest ', 'over '))):
                markdown_lines.append(f"- {line}")
            else:
                markdown_lines.append(line)
    
    return markdown_lines

def convert_pdf_to_markdown_enhanced(pdf_path, output_path):
    """Convert PDF to markdown with enhanced structure detection."""
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        markdown_content = []
        
        # Add document header
        pdf_filename = Path(pdf_path).stem
        title = pdf_filename.replace('-', ' ').replace('_', ' ').title()
        markdown_content.append(f"# {title}")
        markdown_content.append(f"\n*Converted from PDF: {Path(pdf_path).name}*")
        markdown_content.append(f"*Date: {pdf_filename.split('-')[-2] if '-' in pdf_filename else 'Unknown'}*")
        markdown_content.append(f"\n---\n")
        
        all_text_lines = []
        
        # Process each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Extract text with layout preservation
            text = extract_text_with_layout(page)
            
            if text.strip():
                lines = text.split('\n')
                
                if len(doc) > 1:
                    all_text_lines.append(f"PAGE_BREAK_{page_num + 1}")
                
                all_text_lines.extend(lines)
        
        # Process all text together for better structure detection
        structured_content = detect_structure(all_text_lines)
        
        # Process the structured content
        current_page = 1
        for item in structured_content:
            if item.startswith("PAGE_BREAK_"):
                page_num = item.split("_")[-1]
                if int(page_num) > 1:
                    markdown_content.append(f"\n---\n\n## Page {page_num}\n")
                continue
            
            markdown_content.append(item)
        
        # Write to output file
        final_content = '\n\n'.join(markdown_content)
        # Clean up excessive line breaks
        final_content = re.sub(r'\n{3,}', '\n\n', final_content)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        print(f"✅ Successfully converted {pdf_path} to {output_path}")
        print(f"📄 Processed {len(doc)} pages")
        
        doc.close()
        return True
        
    except Exception as e:
        print(f"❌ Error converting PDF: {str(e)}")
        return False

def main():
    """Main function to handle the enhanced conversion."""
    # Check dependencies
    try:
        import fitz
        print("✅ PyMuPDF is available")
    except ImportError:
        print("📦 Installing PyMuPDF...")
        os.system("pip install PyMuPDF")
        try:
            import fitz
            print("✅ PyMuPDF installed successfully")
        except ImportError:
            print("❌ Failed to install PyMuPDF")
            sys.exit(1)
    
    # Define paths
    current_dir = Path(__file__).parent.parent
    pdf_path = current_dir / "specifications" / "DSO-BlueControl network strategy-110925-200446.pdf"
    output_path = current_dir / "specifications" / "DSO-BlueControl-network-strategy.md"
    
    # Check if PDF exists
    if not pdf_path.exists():
        print(f"❌ PDF file not found: {pdf_path}")
        sys.exit(1)
    
    print(f"🔄 Converting PDF to Markdown with enhanced processing...")
    print(f"📁 Input: {pdf_path}")
    print(f"📁 Output: {output_path}")
    
    # Convert PDF to markdown
    success = convert_pdf_to_markdown_enhanced(str(pdf_path), str(output_path))
    
    if success:
        print(f"\n🎉 Enhanced conversion completed successfully!")
        print(f"📖 Markdown file created: {output_path}")
    else:
        print(f"\n💥 Conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
