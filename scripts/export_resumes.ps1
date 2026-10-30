$ErrorActionPreference = 'Stop'

$sourceRoot = Join-Path $PSScriptRoot '..\tmp\resume-build'
$targetRoot = Join-Path $PSScriptRoot '..\public\cv'
$pairs = @(
    @('Sebastian_Astroza_Software_Engineer_General_2026.docx', 'Sebastian_Astroza_Software_Engineer_General_2026.pdf'),
    @('Sebastian_Astroza_CV_General_2026_ES.docx', 'Sebastian_Astroza_CV_General_2026_ES.pdf')
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    foreach ($pair in $pairs) {
        $source = (Resolve-Path -LiteralPath (Join-Path $sourceRoot $pair[0])).Path
        $target = Join-Path (Resolve-Path -LiteralPath $targetRoot).Path $pair[1]
        $document = $word.Documents.Open($source, $false, $true)
        try {
            $document.ExportAsFixedFormat($target, 17, $false, 0, 0, 1, 999, 0, $true, $true, 1, $true, $true, $false)
        }
        finally {
            $document.Close($false)
        }
        Write-Output $target
    }
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($word) | Out-Null
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
