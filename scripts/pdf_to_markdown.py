#!/usr/bin/env python3
"""
PDF to Markdown Converter
Converts PDF files to markdown format using PyMuPDF (fitz) library.
"""

import fitz  # PyMuPDF
import os
import sys
import re
from pathlib import Path

def clean_text(text):
    """Clean and format extracted text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove extra line breaks
    text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
    # Clean up common PDF artifacts
    text = re.sub(r'[^\x00-\x7F]+', '', text)  # Remove non-ASCII characters
    return text.strip()

def format_as_markdown(text, page_num):
    """Format text as markdown with proper structure."""
    lines = text.split('\n')
    markdown_lines = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect headings (lines that are all caps or start with numbers)
        if len(line) > 3 and (line.isupper() or re.match(r'^\d+\.?\s+[A-Z]', line)):
            # Determine heading level based on length and content
            if len(line.split()) <= 5 and line.isupper():
                markdown_lines.append(f"## {line.title()}")
            else:
                markdown_lines.append(f"### {line}")
        # Detect bullet points
        elif line.startswith('•') or line.startswith('-') or re.match(r'^\d+\.', line):
            markdown_lines.append(f"- {line.lstrip('•-').strip()}")
        # Regular text
        else:
            markdown_lines.append(line)
    
    return '\n\n'.join(markdown_lines)

def convert_pdf_to_markdown(pdf_path, output_path):
    """Convert PDF to markdown format."""
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        markdown_content = []
        
        # Add document header
        pdf_filename = Path(pdf_path).stem
        markdown_content.append(f"# {pdf_filename.replace('-', ' ').title()}")
        markdown_content.append(f"\n*Converted from PDF: {Path(pdf_path).name}*")
        markdown_content.append(f"\n---\n")
        
        # Process each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Extract text
            text = page.get_text()
            
            if text.strip():  # Only process pages with text
                cleaned_text = clean_text(text)
                formatted_text = format_as_markdown(cleaned_text, page_num + 1)
                
                # Add page header
                if len(doc) > 1:
                    markdown_content.append(f"\n## Page {page_num + 1}\n")
                
                markdown_content.append(formatted_text)
                markdown_content.append("\n---\n")
        
        # Write to output file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(markdown_content))
        
        print(f"✅ Successfully converted {pdf_path} to {output_path}")
        print(f"📄 Processed {len(doc)} pages")
        
        doc.close()
        return True
        
    except Exception as e:
        print(f"❌ Error converting PDF: {str(e)}")
        return False

def install_dependencies():
    """Install required dependencies."""
    try:
        import fitz
        print("✅ PyMuPDF is already installed")
        return True
    except ImportError:
        print("📦 Installing PyMuPDF...")
        os.system("pip install PyMuPDF")
        try:
            import fitz
            print("✅ PyMuPDF installed successfully")
            return True
        except ImportError:
            print("❌ Failed to install PyMuPDF")
            return False

def main():
    """Main function to handle command line arguments and conversion."""
    # Check dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Define paths
    current_dir = Path(__file__).parent.parent  # Go up from scripts to project root
    pdf_path = current_dir / "specifications" / "DSO-BlueControl network strategy-110925-200446.pdf"
    output_path = current_dir / "specifications" / "DSO-BlueControl-network-strategy.md"
    
    # Check if PDF exists
    if not pdf_path.exists():
        print(f"❌ PDF file not found: {pdf_path}")
        sys.exit(1)
    
    print(f"🔄 Converting PDF to Markdown...")
    print(f"📁 Input: {pdf_path}")
    print(f"📁 Output: {output_path}")
    
    # Convert PDF to markdown
    success = convert_pdf_to_markdown(str(pdf_path), str(output_path))
    
    if success:
        print(f"\n🎉 Conversion completed successfully!")
        print(f"📖 Markdown file created: {output_path}")
    else:
        print(f"\n💥 Conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
