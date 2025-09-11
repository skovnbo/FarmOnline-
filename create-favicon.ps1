# Favicon Generator Script for FarmOnline+
# This script creates basic favicon files from the SVG

Write-Host "Creating favicon files for FarmOnline+..."

# Create a simple 16x16 ICO file content (base64 encoded)
$favicon16 = @"
AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAGZswwBmbMP////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAGZsywBmbM/wZmzP8GZsw/////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8ABmbMsAZmzP8GZsz/BmbM/wZmzP////8A////AP///wD///8A////AP///wD///8A////AP///wAGZsywBmbM/wZmzP8GZsz/BmbM/wZmzP8GZsw/////wD///8A////AP///wD///8A////AP///wAGZswwBmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzDA////A////AP///wD///8A////AAZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AP///wD///8ABmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AP///wAGZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AAZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AAZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AAZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AAZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP////8A////AP///wAGZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/////wD///8A////AP///wD///8ABmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/////wD///8A////AP///wD///8A////AP///wAGZsz/BmbM/wZmzP8GZsz/BmbM/wZmzP8GZsz/////wD///8A////AP///wD///8A////AP///wD///8A////AAZmzP8GZsz/BmbM/wZmzP8GZsz/////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A
"@

# Convert base64 to bytes and save as favicon.ico
try {
    $bytes = [Convert]::FromBase64String($favicon16)
    [System.IO.File]::WriteAllBytes("$PWD\assets\favicon.ico", $bytes)
    Write-Host "✓ Created favicon.ico" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not create favicon.ico: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Favicon setup complete!" -ForegroundColor Green
Write-Host "Note: For production use, consider using a favicon generator tool for optimal results."
