Add-Type -AssemblyName System.Drawing

$imgDir = "images"
$fullImgDir = Join-Path (Get-Location).Path $imgDir
if (-not (Test-Path $fullImgDir)) {
    New-Item -ItemType Directory -Force -Path $fullImgDir | Out-Null
}

$rand = New-Object Random

for ($i=1; $i -le 31; $i++) {
    $width = 1200
    $height = 800
    
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # 極めて淡い白ベース
    $r = $rand.Next(245, 256)
    $g = $rand.Next(245, 256)
    $b = $rand.Next(245, 256)
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($r, $g, $b))
    $graphics.FillRectangle($bgBrush, 0, 0, $width, $height)
    
    # さらに淡い図形をいくつか描画
    $shapesCount = $rand.Next(2, 5)
    for ($j=0; $j -lt $shapesCount; $j++) {
        $x = $rand.Next(-400, $width)
        $y = $rand.Next(-400, $height)
        $w = $rand.Next(400, 1000)
        $h = $rand.Next(400, 1000)
        
        $sr = $rand.Next(235, 250)
        $sg = $rand.Next(235, 250)
        $sb = $rand.Next(235, 250)
        $alpha = $rand.Next(20, 80) # 透明度
        $shapeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alpha, $sr, $sg, $sb))
        
        if ($rand.Next(0, 2) -eq 0) {
            $graphics.FillEllipse($shapeBrush, $x, $y, $w, $h)
        } else {
            $graphics.FillRectangle($shapeBrush, $x, $y, $w, $h)
        }
    }
    
    # 輪郭を曖昧にするためのスムージング
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    $filename = "abstract-{0:D2}.png" -f $i
    $path = Join-Path $fullImgDir $filename
    
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

Write-Output "Generated 31 images."
