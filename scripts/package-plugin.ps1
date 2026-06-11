# Packages EaseAccess Lite into easeaccess-lite.zip for WordPress.org upload.
# Includes BOTH the compiled /build and the uncompiled /src source, plus the
# build tooling, so the zip itself satisfies the "human-readable source" rule.
# Excludes node_modules, VCS, source maps and dev-only files.

$ErrorActionPreference = 'Stop'
$root    = Split-Path -Parent $PSScriptRoot
$slug    = 'easeaccess-lite'
$zipPath = Join-Path $root "$slug.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$bs = [char]92   # backslash
$fs = [char]47   # forward slash

$excludeDirs  = @('node_modules', '.git', '.github', '.vscode', '.idea', 'scripts')
$excludeNames = @('.distignore', '.gitignore', '.gitattributes', 'package-lock.json', '.eslintcache')

$all   = Get-ChildItem -Path $root -Recurse -File
$files = foreach ($f in $all) {
    $rel   = $f.FullName.Substring($root.Length + 1)
    $parts = $rel.Split($bs)
    $skip  = $false
    foreach ($p in $parts) { if ($excludeDirs -contains $p) { $skip = $true } }
    if ($skip) { continue }
    if ($f.Extension -eq '.map') { continue }
    if ($f.Extension -eq '.zip') { continue }
    if ($excludeNames -contains $f.Name) { continue }
    if ($f.Name.StartsWith('.')) { continue }   # WordPress.org forbids hidden files
    $f
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
    foreach ($f in $files) {
        $rel   = $f.FullName.Substring($root.Length + 1).Replace($bs, $fs)
        $entry = "$slug/$rel"
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $entry, 'Optimal') | Out-Null
    }
} finally {
    $zip.Dispose()
}

$srcCount   = ($files | Where-Object { $_.FullName.Replace($bs,$fs) -match "/src/" }).Count
$buildCount = ($files | Where-Object { $_.FullName.Replace($bs,$fs) -match "/build/" }).Count
Write-Host ("Created {0}" -f $zipPath)
Write-Host ("  total files : {0}" -f $files.Count)
Write-Host ("  src files   : {0}" -f $srcCount)
Write-Host ("  build files : {0}" -f $buildCount)
