#!/usr/bin/env python3
"""
PDF to Markdown Automation Script
Complete workflow for converting PDFs to markdown with cleanup options.
"""

import fitz
import os
import sys
import shutil
from pathlib import Path
from datetime import datetime

def convert_and_cleanup_pdf(pdf_path, output_dir):
    """Complete PDF to markdown conversion workflow."""
    
    print(f"🚀 Starting PDF to Markdown conversion workflow...")
    print(f"📁 Input PDF: {pdf_path}")
    print(f"📁 Output Directory: {output_dir}")
    
    try:
        # Open and process PDF
        doc = fitz.open(pdf_path)
        
        # Create base filename
        base_name = Path(pdf_path).stem
        clean_name = base_name.replace(' ', '-').replace('_', '-').lower()
        
        # Generate markdown content
        markdown_lines = []
        
        # Header
        title = base_name.replace('-', ' ').replace('_', ' ').title()
        markdown_lines.append(f"# {title}")
        markdown_lines.append(f"\n*Converted from PDF: {Path(pdf_path).name}*")
        
        # Extract creation date if possible
        try:
            metadata = doc.metadata
            if metadata.get('creationDate'):
                creation_date = metadata['creationDate']
                markdown_lines.append(f"*Created: {creation_date}*")
        except:
            pass
            
        markdown_lines.append(f"*Conversion Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*")
        markdown_lines.append("\n---\n")
        
        # Process pages
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text()
            
            if text.strip():
                if len(doc) > 1:
                    markdown_lines.append(f"\n## Page {page_num + 1}\n")
                
                # Basic text cleanup
                lines = text.split('\n')
                processed_lines = []
                
                for line in lines:
                    line = line.strip()
                    if line and len(line) > 2:
                        # Enhance key terms
                        line = line.replace('BlueControl', '**BlueControl**')
                        line = line.replace('FarmOnline+', '**FarmOnline+**')
                        line = line.replace('DSO', '**DSO**')
                        
                        processed_lines.append(line)
                
                markdown_lines.extend(processed_lines)
                
                if page_num < len(doc) - 1:
                    markdown_lines.append("\n---\n")
        
        # Write output file
        output_path = Path(output_dir) / f"{clean_name}.md"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(markdown_lines))
        
        doc.close()
        
        print(f"✅ Raw conversion completed: {output_path}")
        
        # Create a note for manual review
        review_note = f"""
# Review Notes for {title}

## Conversion Status
- ✅ PDF successfully converted to markdown
- 📄 {len(doc)} pages processed
- 📝 Manual review recommended for structure optimization

## Next Steps
1. Review the generated markdown for structure and formatting
2. Enhance headings and section organization as needed
3. Add any missing context or explanations
4. Consider creating a cleaned/polished version

## Files Generated
- Raw conversion: `{output_path.name}`
- Original PDF: `{Path(pdf_path).name}`

*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        review_path = Path(output_dir) / f"{clean_name}-review-notes.md"
        with open(review_path, 'w', encoding='utf-8') as f:
            f.write(review_note)
        
        print(f"📋 Review notes created: {review_path}")
        print(f"\n🎉 Conversion workflow completed!")
        print(f"📖 Files created in: {output_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in conversion workflow: {str(e)}")
        return False

def main():
    """Main function for the automation script."""
    
    # Default paths
    project_root = Path(__file__).parent.parent
    specs_dir = project_root / "specifications"
    
    # Find PDF files in specifications directory
    pdf_files = list(specs_dir.glob("*.pdf"))
    
    if not pdf_files:
        print("❌ No PDF files found in specifications directory")
        sys.exit(1)
    
    print(f"📁 Found {len(pdf_files)} PDF file(s) in specifications directory:")
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"  {i}. {pdf_file.name}")
    
    # Process each PDF
    for pdf_file in pdf_files:
        print(f"\n🔄 Processing: {pdf_file.name}")
        success = convert_and_cleanup_pdf(str(pdf_file), str(specs_dir))
        
        if success:
            print(f"✅ Successfully processed: {pdf_file.name}")
        else:
            print(f"❌ Failed to process: {pdf_file.name}")

if __name__ == "__main__":
    main()
