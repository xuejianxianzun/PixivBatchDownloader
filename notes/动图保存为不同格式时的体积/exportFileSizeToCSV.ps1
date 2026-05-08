# 这个脚本用于扫描指定目录下的文件，统计以数字命名的文件（如 12345.gif、12345.zip 等）的大小，并将结果导出为 CSV 文件。CSV 文件的第一列是 ID（即文件名中的数字部分），后续列是不同扩展名对应的文件大小（单位为 MiB）。如果某个 ID 没有对应的扩展名，则该单元格留空。
# pwsh .\exportFileSizeToCSV.ps1 -InputPath ".\test" -OutputCsv ".\fileSizeResult.csv"

param(
    [string]$InputPath = ".",
    [string]$OutputCsv = ".\fileSizeResult.csv"
)

$Extensions = @(
    # "zip"
    "ugoira"
    "webm"
    "webpLossy"
    "webpLossless"
    "apng"
    "gif"
)

$fileMap = @{}

Get-ChildItem -Path $InputPath -File | ForEach-Object {
    if ($_.BaseName -match '^\d+$' -and $Extensions -contains $_.Extension.TrimStart('.')) {
        $id = $_.BaseName
        $ext = $_.Extension.TrimStart('.')

        if (-not $fileMap.ContainsKey($id)) {
            $fileMap[$id] = @{}
        }

        $sizeMiB = [math]::Round($_.Length / 1MB, 2)
        $fileMap[$id][$ext] = $sizeMiB
    }
}

$result = foreach ($id in ($fileMap.Keys | Sort-Object {[int64]$_})) {
    $row = [ordered]@{
        ID = $id
    }

    foreach ($ext in $Extensions) {
        if ($fileMap[$id].ContainsKey($ext)) {
            $row[$ext] = $fileMap[$id][$ext]
        }
        else {
            $row[$ext] = ""
        }
    }

    [pscustomobject]$row
}

$result | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding utf8

Write-Host "Export: $OutputCsv"
