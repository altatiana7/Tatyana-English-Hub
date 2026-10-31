# Локальный сервер планнера. Слушает только этот компьютер: 127.0.0.1:8765.
# Запускается из start-hub.bat, отдельно открывать не нужно.
#
# Зачем сервер вообще нужен: браузер хранит данные страницы, привязав их к адресу.
# Пока адрес тот же (http://127.0.0.1:8765), старые записи остаются на месте.

$ErrorActionPreference = 'Stop'
$port = 8765
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$page = Join-Path $root 'planner.html'

if (-not (Test-Path -LiteralPath $page)) {
  Write-Host 'Не найден planner.html рядом с server.ps1. Проверьте папку.'
  Start-Sleep -Seconds 8
  exit 1
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
  $listener.Start()
} catch {
  Write-Host "Порт $port занят — скорее всего, планнер уже открыт в другом окне."
  Write-Host 'Закройте старое чёрное окно и запустите снова.'
  Start-Sleep -Seconds 8
  exit 1
}

Write-Host "Планнер открыт: http://127.0.0.1:$port/"
Write-Host 'Это окно закрывать нельзя, пока работаете. Закончили — закройте его.'

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $response.Headers.Add('Cache-Control', 'no-store, no-cache, must-revalidate')
    $relative = [Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'planner.html' }

    $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
    $inside = $candidate.StartsWith([System.IO.Path]::GetFullPath($root), [StringComparison]::OrdinalIgnoreCase)

    if ($inside -and (Test-Path -LiteralPath $candidate -PathType Leaf)) {
      $bytes = [System.IO.File]::ReadAllBytes($candidate)
      $response.ContentType = 'text/html; charset=utf-8'
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not found')
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }

    $response.OutputStream.Close()
  }
} catch {
  Write-Host 'Сервер остановлен.'
} finally {
  $listener.Stop()
  $listener.Close()
}
